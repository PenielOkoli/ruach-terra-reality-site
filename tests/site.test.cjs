const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { createLoader } = require('../scripts/ts-test-loader.cjs');
const load = createLoader();
const { estimateHydraulicFill } = load('lib/fleet/estimate.ts');
const { validateQuote } = load('lib/quote/validation.ts');
const { deliverQuote, QuoteDeliveryError } = load('lib/quote/delivery.ts');
const { sendQuote } = load('lib/quote/client.ts');

function quoteForm() {
  const form = new FormData();
  Object.entries({ name: ' Test Client ', email: 'test@example.com', phone: '08000000000', location: 'Epe', projectType: 'Hydraulic dredging and reclamation', consent: 'on' }).forEach(([key, value]) => form.set(key, value));
  return form;
}

test('fleet estimates use the profile planning rates without an invented distance penalty', () => {
  const base = estimateHydraulicFill({ volume: '25000', distance: '0.3', hours: '12' });
  assert.equal(base.low, 25000 / 4200);
  assert.equal(base.high, 25000 / 1920);
  const long = estimateHydraulicFill({ volume: 25000, distance: 4, hours: 12 });
  assert.equal(long.low, base.low);
  assert.equal(long.high, base.high);
  assert.equal(base.requiresAssessment, false);
  assert.equal(long.requiresAssessment, true);
  for (const distance of ['0.14', '0.4']) assert.equal(estimateHydraulicFill({ volume: 25000, distance, hours: 8 }).requiresAssessment, false);
  for (const distance of ['', 'bad', '-1', '0.139', '0.401', '1.2']) assert.equal(estimateHydraulicFill({ volume: 25000, distance, hours: 8 }).requiresAssessment, true);
  assert.equal(estimateHydraulicFill({ volume: 350, distance: '', hours: '0' }).low, 1);
  assert.equal(estimateHydraulicFill({ volume: 'bad', distance: '', hours: '' }).high, 0);
});

test('core systems reproduce all four columns from profile slide 14', () => {
  const { coreSystems } = load('content/profile-details.ts');
  assert.deepEqual(JSON.parse(JSON.stringify(coreSystems)), [
    { name: 'TOYO DP-200-12A', discharge: '12 in', power: '160 kW', role: 'Primary heavy-duty sand / hydraulic fill production' },
    { name: 'TOYO DP-50BL', discharge: '10 in', power: 'Medium duty', role: 'Secondary production / fill / stockpile support' },
    { name: 'TOYO DP-75B', discharge: '8 in', power: 'Medium duty', role: 'Supplementary / confined dredging operations' },
    { name: 'Hydra-Tech HT006X8', discharge: '8 in hydraulic', power: 'Hydraulic drive', role: 'Dewatering / dirty-water / support pumping; not primary abrasive sand dredging' },
  ]);
  const html = renderToStaticMarkup(React.createElement(load('components/core-systems-table.tsx').CoreSystemsTable));
  assert.match(html, /Primary project role/);
  assert.doesNotMatch(html, /Not listed/);
  assert.equal((html.match(/Medium duty/g) || []).length, 3); // two rows plus explanatory note
});

test('certificate identity is used consistently after the user confirmed slide 9', () => {
  const { company } = load('content/site.ts');
  assert.equal(company.name, 'RUACH DREDGING NIG LTD');
  assert.equal(company.rc, 'RC 9001841');
  assert.equal(load('app/manifest.ts').default().name, company.name);
});

test('company and profile data load as native ES modules without circular imports', async () => {
  const fs = require('node:fs');
  const path = require('node:path');
  const ts = require('typescript');
  const cache = new Map();
  function moduleUrl(file, ancestors = []) {
    const absolute = path.resolve(__dirname, '..', file);
    assert.ok(!ancestors.includes(absolute), 'Circular content import: ' + [...ancestors, absolute].join(' -> '));
    if (cache.has(absolute)) return cache.get(absolute);
    const code = ts.transpileModule(fs.readFileSync(absolute, 'utf8'), {
      compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext },
    }).outputText.replace(/(from\s+)(['"])(\.[^'"]+)\2/g, (_, prefix, quote, dependency) => {
      const resolved = path.resolve(path.dirname(absolute), dependency + '.ts');
      return prefix + quote + moduleUrl(resolved, [...ancestors, absolute]) + quote;
    });
    const url = 'data:text/javascript;base64,' + Buffer.from(code).toString('base64');
    cache.set(absolute, url);
    return url;
  }
  const site = await import(moduleUrl('content/site.ts'));
  const profile = await import(moduleUrl('content/profile-details.ts'));
  assert.equal(site.company.operatingBase, 'Lagos, Nigeria');
  assert.equal(profile.industrialPumping.base, 'Mobilisation from Lagos, Nigeria.');
  assert.equal(site.systems, profile.coreSystems);
});

test('Vercel builds Next.js routes instead of publishing only public assets', () => {
  const config = require('../vercel.json');
  assert.equal(config.framework, 'nextjs');
  assert.equal(config.buildCommand, 'npm run build');
  assert.equal(config.outputDirectory, '.next');
  assert.equal(config.headers[0].headers.find(header => header.key === 'X-Content-Type-Options').value, 'nosniff');
});

test('confirmed operating base is consistent without changing the office or project locations', () => {
  const { company, projects } = load('content/site.ts');
  assert.equal(company.operatingBase, 'Lagos, Nigeria');
  assert.equal(company.address, '32 Vover Close, Adiva Plainfield Estate, KM 69 Lekki-Epe Expressway, Lagos, Nigeria.');
  assert.equal(load('content/profile-details.ts').industrialPumping.base, 'Mobilisation from Lagos, Nigeria.');
  assert.equal(projects[0].location, 'Igbolomi, Lekki–Epe Axis');
  assert.equal(projects[2].location, 'Epe Lagoon Waterfront');
  const Link = ({ children, ...props }) => React.createElement('a', props, children);
  const renderLoad = createLoader({ 'next/image': { default: () => null }, 'next/link': { default: Link } });
  const hero = renderToStaticMarkup(React.createElement(renderLoad('components/home/hero.tsx').Hero));
  assert.match(hero, /Operating base<\/p><strong>Lagos, Nigeria<\/strong>/);
  const about = renderToStaticMarkup(React.createElement(renderLoad('app/about/page.tsx').default));
  assert.match(about, /Based in Lagos, Nigeria\./);
  assert.doesNotMatch(about, /Our operating focus is Ibeju-Lekki and Epe/);
});

test('missing project information is source-specific rather than a substituted client or location', () => {
  const { projects } = load('content/site.ts');
  assert.equal(projects.length, 7);
  assert.equal(projects[1].scale, '600–800 m pipeline');
  assert.match(projects[1].client, /Hitech.*subcontracting chain/);
  assert.equal(projects[4].location, 'Lekki Lagoon');
  assert.equal(projects[4].client, 'Craneburg Construction Company Ltd.');
  assert.match(projects[2].scale, /12–16 in HDPE/);
  assert.match(projects[3].scale, /12–14 in pump system/);
  for (const project of projects) assert.ok(project.scopeDetails.length && [7, 8].includes(project.sourceSlide));
});

test('company-confirmed pipeline range is consistent without changing pump discharges', () => {
  const { company, fleet, systems } = load('content/site.ts');
  assert.equal(company.submersibleDredgerCount, 4);
  assert.equal(fleet.filter(item => item.group === 'Dredgers').length, company.submersibleDredgerCount);
  assert.equal(company.pipelineDiameter, '8–16″');
  assert.equal(fleet.find(item => item.name === 'HDPE pipeline').note, '2 km · 8–16″');
  const Link = ({ children, ...props }) => React.createElement('a', props, children);
  const renderLoad = createLoader({ 'next/image': { default: () => null }, 'next/link': { default: Link } });
  const hero = renderToStaticMarkup(React.createElement(renderLoad('components/home/hero.tsx').Hero));
  assert.match(hero, /Fleet<\/p><strong>4 submersible dredgers<\/strong>/);
  assert.match(hero, /Pipeline<\/p><strong>8–16″ HDPE line<\/strong>/);
  assert.equal(systems[0].discharge, '12 in');
  assert.equal(systems[1].discharge, '10 in');
  assert.equal(systems[2].discharge, '8 in');
});

test('industrial-pumping recommendations and limitations remain explicit', () => {
  const profile = load('content/profile-details.ts');
  assert.match(profile.industrialPumping.restriction, /Non-flammable.*OEM confirmation.*refinery HSE approval/);
  assert.match(profile.industrialPumping.restriction, /Not a primary abrasive sand-slurry/);
  assert.equal(profile.powerUnitRecommendation[0][1], '150–180 HP mechanical diesel');
  const Link = ({ children, ...props }) => React.createElement('a', props, children);
  const renderLoad = createLoader({ 'next/link': { default: Link } });
  const html = renderToStaticMarkup(React.createElement(renderLoad('components/profile-sections.tsx').FleetProfileDetails));
  assert.match(html, /not an installed-unit specification/);
  assert.match(html, /<details/);
  assert.ok(load('content/quote.ts').quoteProjectTypes.includes('Industrial pumping and emergency dewatering'));
});

test('quote requires four core fields and consent, with optional valid email', () => {
  assert.equal(validateQuote(new FormData()).ok, false);
  const form = quoteForm();
  form.set('email', 'invalid');
  assert.equal(validateQuote(form).error, 'Please enter a valid email address.');
  form.set('email', 'test@example.com');
  assert.equal(validateQuote(form).ok, true);
  form.delete('email');
  form.set('projectType', 'Not sure yet');
  assert.equal(validateQuote(form).ok, true);
  form.delete('consent');
  assert.equal(validateQuote(form).ok, false);
});

test('quote validation trims copy and limits field length', () => {
  const form = quoteForm();
  form.set('message', 'x'.repeat(2500));
  const result = validateQuote(form);
  assert.equal(result.submission.data.name, 'Test Client');
  assert.equal(result.submission.data.message.length, 2000);
});

test('quote attachment handling preserves actual file bytes and the 5 MB limit', async () => {
  const form = quoteForm();
  form.set('attachment', new File(['%PDF-brief'], 'brief.pdf', { type: 'application/pdf' }));
  const result = validateQuote(form);
  assert.equal(result.submission.attachment.name, 'brief.pdf');
  assert.equal(await result.submission.attachment.text(), '%PDF-brief');
  assert.equal(result.submission.data.attachment, undefined);
  form.set('attachment', new File([new Uint8Array(5_000_001)], 'large.pdf'));
  assert.equal(validateQuote(form).error, 'Attachments must be 5 MB or smaller.');
  form.set('attachment', new File(['unsafe'], 'script.exe', { type: 'application/octet-stream' }));
  assert.equal(validateQuote(form).ok, false);
  form.set('attachment', new File(['unsafe'], 'script.pdf', { type: 'text/html' }));
  assert.equal(validateQuote(form).ok, false);
});

test('webhook delivery fails closed and sends multipart payload plus actual file', async () => {
  const form = quoteForm();
  form.set('attachment', new File(['%PDF-file-bytes'], 'brief.pdf', { type: 'application/pdf' }));
  const submission = validateQuote(form).submission;
  const calls = [];
  const fetchRequest = async (...args) => { calls.push(args); return Response.json({ ok: true }); };
  await assert.rejects(deliverQuote(submission, {}, fetchRequest), error => error.status === 503);
  await assert.rejects(deliverQuote(submission, { url: 'http://example.com' }, fetchRequest), error => error.status === 503);
  assert.equal(calls.length, 0);
  await deliverQuote(submission, { url: 'https://example.com', secret: 'test-secret' }, fetchRequest);
  assert.equal(calls[0][1].headers.Authorization, 'Bearer test-secret');
  const payload = JSON.parse(calls[0][1].body.get('payload'));
  assert.equal(payload.type, 'ruach_quote_request');
  assert.equal(payload.data.location, 'Epe');
  assert.deepEqual(payload.units, { volume: 'm³', pipelineDistance: 'm' });
  assert.equal(await calls[0][1].body.get('attachment').text(), '%PDF-file-bytes');
  assert.equal(calls[0][1].headers['Content-Type'], undefined);
  assert.equal(calls[0][1].redirect, 'error');
  assert.ok(calls[0][1].signal);
  await assert.rejects(deliverQuote(submission, { url: 'https://example.com' }, async () => new Response('rejected', { status: 500 })), error => error.status === 502);
  await assert.rejects(deliverQuote(submission, { url: 'https://example.com' }, async () => { throw new Error('offline'); }), error => error.status === 502);
});

test('browser quote transport reports server errors', async () => {
  await sendQuote(quoteForm(), async () => Response.json({ ok: true }));
  await assert.rejects(sendQuote(quoteForm(), async () => Response.json({ error: 'Invalid details' }, { status: 400 })), /Invalid details/);
  await assert.rejects(sendQuote(quoteForm(), async () => Response.json({})), /could not be confirmed/);
  await assert.rejects(sendQuote(quoteForm(), async () => new Response('bad gateway', { status: 502 })), /could not be sent/);
});

test('quote validation rejects invalid parameters, unknown types and honeypot submissions', () => {
  for (const value of ['-1', '0', 'Infinity', 'bad']) {
    const form = quoteForm(); form.set('volume', value);
    assert.equal(validateQuote(form).ok, false);
  }
  const form = quoteForm();
  form.set('volume', 'Not sure yet'); form.set('pipelineDistance', '250.5');
  assert.equal(validateQuote(form).ok, true);
  form.set('secretUnexpectedField', 'ignored');
  assert.equal(validateQuote(form).submission.data.secretUnexpectedField, undefined);
  form.set('projectType', 'unknown'); assert.equal(validateQuote(form).ok, false);
  form.set('projectType', 'Not sure yet'); form.set('website', 'spam'); assert.equal(validateQuote(form).ok, false);
});

test('bounded request reader rejects oversized bodies without relying on Content-Length', async () => {
  const { readQuoteForm } = load('lib/quote/request.ts');
  const { MAX_QUOTE_REQUEST_BYTES } = load('content/quote.ts');
  const request = new Request('http://localhost/api/quote', { method: 'POST', headers: { 'Content-Type': 'multipart/form-data; boundary=test' }, body: new Uint8Array(MAX_QUOTE_REQUEST_BYTES + 1) });
  await assert.rejects(readQuoteForm(request), /size/);
  await assert.rejects(readQuoteForm(new Request('http://localhost', { method: 'POST', body: 'not multipart' })), /format/);
});

test('quote route exposes safe configuration/delivery errors and blocks cross-origin browser requests', async () => {
  let status = 503;
  const routeLoad = createLoader({ '@/lib/quote/delivery': { QuoteDeliveryError, deliverQuote: async () => { throw new QuoteDeliveryError(status); } } });
  const { POST } = routeLoad('app/api/quote/route.ts');
  for (status of [503, 502, 504]) {
    const response = await POST(new Request('http://localhost/api/quote', { method: 'POST', body: quoteForm() }));
    assert.equal(response.status, status);
    assert.match((await response.json()).error, /call or WhatsApp/);
  }
  assert.equal((await POST(new Request('http://localhost/api/quote', { method: 'POST', headers: { Origin: 'https://other.example' }, body: quoteForm() }))).status, 403);
  assert.equal((await POST(new Request('http://localhost/api/quote', { method: 'POST', headers: { 'Content-Type': 'multipart/form-data; boundary=test', 'Content-Length': '9999999' }, body: 'tiny' }))).status, 413);
});

test('delivery times out rather than reporting acceptance', async () => {
  const submission = validateQuote(quoteForm()).submission;
  await assert.rejects(deliverQuote(submission, { url: 'https://example.com' }, async (_url, options) => new Promise((_resolve, reject) => options.signal.addEventListener('abort', () => reject(new Error('aborted')), { once: true }))), error => error.status === 504);
});

test('all internal pages have distinct metadata and self-referencing canonicals', () => {
  for (const route of ['about', 'services', 'fleet', 'projects', 'quality-hse', 'contact', 'privacy', 'terms']) {
    const { metadata } = load(`app/${route}/page.tsx`);
    assert.equal(metadata.alternates.canonical, '/' + route);
    assert.equal(metadata.openGraph.url, '/' + route);
    assert.ok(metadata.title && metadata.description);
    assert.equal(metadata.twitter.description, metadata.description);
  }
});

test('case-study evidence preserves unknown quantities and withholds unapproved client names', () => {
  const { publicProjects } = load('content/project-evidence.ts');
  assert.equal(publicProjects.length, 7);
  assert.match(publicProjects[0].evidence.quantity, /Total not stated/);
  assert.match(publicProjects[1].evidence.quantity, /not stated/);
  assert.match(publicProjects[2].evidence.quantity, /25,000 m³/);
  for (const project of publicProjects) assert.equal(project.client, 'Client name not published');
  assert.doesNotMatch(JSON.stringify(publicProjects), /Hitech|Craneburg/);
});

test('responsive photo derivatives never upscale and supply smaller mobile candidates', async () => {
  const fs = require('node:fs'); const path = require('node:path'); const sharp = require('sharp');
  const manifest = require('../content/responsive-images.json');
  for (const [src, image] of Object.entries(manifest)) {
    assert.ok(image.variants.length >= 2, src);
    for (const variant of image.variants) {
      const file = path.join(__dirname, '../public', variant.src);
      assert.ok(variant.width <= image.width, variant.src);
      assert.equal((await sharp(file).metadata()).width, variant.width);
      assert.equal(fs.statSync(file).size, variant.bytes);
    }
  }
  const pipeline = manifest['/media/enhanced/pipeline-installation-v2.webp'];
  assert.ok(pipeline.variants.find(v => v.width === 480).bytes < fs.statSync(path.join(__dirname, '../public/media/enhanced/pipeline-installation-v2.webp')).size / 2);
});

test('quote HTTP boundary returns 400, 200 and 500 without live delivery', async () => {
  let fail = false;
  let deliveries = 0;
  const routeLoad = createLoader({ '@/lib/quote/delivery': { QuoteDeliveryError, deliverQuote: async () => { deliveries++; if (fail) throw new Error('offline'); } } });
  const { POST } = routeLoad('app/api/quote/route.ts');
  const request = form => new Request('http://localhost/api/quote', { method: 'POST', body: form });
  assert.equal((await POST(request(new FormData()))).status, 400);
  assert.equal(deliveries, 0);
  assert.equal((await POST(request(quoteForm()))).status, 200);
  fail = true;
  assert.equal((await POST(request(quoteForm()))).status, 500);
});

test('homepage composition preserves the approved markup and copy', () => {
  const Link = ({ children, ...props }) => React.createElement('a', props, children);
  const renderLoad = createLoader({ 'next/image': { default: () => null }, 'next/link': { default: Link } });
  const html = renderToStaticMarkup(React.createElement(renderLoad('app/page.tsx').default));
  assert.match(html, /Fleet<\/p><strong>4 submersible dredgers<\/strong>/);
  assert.match(html, /Pipeline<\/p><strong>8–16″ HDPE line<\/strong>/);
  // Update deliberately if homepage copy or markup is intentionally changed later.
  // Responsive derivatives deliberately change image markup, but not homepage copy.
  assert.equal(crypto.createHash('sha256').update(html).digest('hex'), 'd38a7ea6f0626e2fab32a04229596b5167f266803073b9e4825f7601a1111722');
});

test('marketing pages and footer contain no photo credits or FIG captions', () => {
  const Link = ({ children, ...props }) => React.createElement('a', props, children);
  const renderLoad = createLoader({ 'next/image': { default: () => null }, 'next/link': { default: Link } });
  for (const route of ['', 'about/', 'services/', 'fleet/', 'projects/', 'quality-hse/', 'contact/']) {
    const html = renderToStaticMarkup(React.createElement(renderLoad('app/' + route + 'page.tsx').default));
    assert.doesNotMatch(html, /<figcaption\b|\bFIG\.|Photo credit|Image credits|href="\/photography"/, route || 'homepage');
  }
  const footer = renderToStaticMarkup(React.createElement(renderLoad('components/chrome/footer.tsx').Footer));
  assert.doesNotMatch(footer, /Image credits|href="\/photography"/);
});

test('project photographs follow the profile slide associations', () => {
  const { profilePhotos, projectPhotos } = load('content/photography.ts');
  const { projects } = load('content/home.ts');
  assert.equal(projectPhotos['Igbolomi–Lekki Coastal Sand Reclamation'].original, 'image16.png');
  assert.equal(projectPhotos['Coastal Road Subbase Sand Supply'].original, 'image19.png');
  assert.equal(projectPhotos['Epe Lagoon Shoreline Stabilization & Stockpiling'].original, 'image17.png');
  assert.equal(profilePhotos.pump.original, 'image30.png');
  assert.deepEqual(Array.from(projects, p => p.image), [profilePhotos.excavator.src, profilePhotos.coastalRoad.src, profilePhotos.epeJoint.src]);
  assert.equal(projectPhotos['Lagoon Bathymetry Verification'], undefined);
  assert.equal(projectPhotos['Orchid Road Waterfront Plot Filling'], undefined);
});

test('Projects heading uses the company-requested wording without changing project locations', () => {
  const Link = ({ children, ...props }) => React.createElement('a', props, children);
  const renderLoad = createLoader({ 'next/image': { default: () => null }, 'next/link': { default: Link } });
  const html = renderToStaticMarkup(React.createElement(renderLoad('app/projects/page.tsx').default));
  assert.match(html, /<h1[^>]*>Project records from across our sites\.<\/h1>/);
  assert.doesNotMatch(html, /Project records from Lagos sites\./);
  assert.equal(load('content/site.ts').projects[2].location, 'Epe Lagoon Waterfront');
});

test('all restored and native profile photographs exist with usable dimensions', async () => {
  const fs = require('node:fs');
  const sharp = require('sharp');
  const { profilePhotos } = load('content/photography.ts');
  for (const photo of Object.values(profilePhotos)) {
    const file = require('node:path').join(__dirname, '../public', photo.src);
    assert.equal(fs.existsSync(file), true, photo.src);
    const { width, height } = await sharp(file).metadata();
    if (photo.src.includes('/enhanced/')) {
      assert.ok(Math.max(width, height) >= 1300, photo.src);
      assert.ok(Math.min(width, height) >= 850, photo.src);
      assert.match(photo.alt, /AI-enhanced/);
    }
  }
});

test('technical partners preserve the four names and original artwork from slide 11', async () => {
  const fs = require('node:fs');
  const path = require('node:path');
  const sharp = require('sharp');
  const { partnerArtwork, technicalPartners } = load('content/partners.ts');
  assert.equal(partnerArtwork.sourceSlide, 11);
  assert.equal(partnerArtwork.sourceAsset, 'image26.png');
  assert.deepEqual(Array.from(technicalPartners, partner => partner.name), ['IPR', 'Atlas Copco', 'Slurry Sucker', 'Toyo']);
  const artwork = path.join(__dirname, '../public', partnerArtwork.src);
  const metadata = await sharp(artwork).metadata();
  assert.equal(metadata.width, partnerArtwork.width);
  assert.equal(metadata.height, partnerArtwork.height);
  for (const { crop } of technicalPartners) {
    assert.ok(crop.x >= 0 && crop.y >= 0);
    assert.ok(crop.x + crop.width <= metadata.width);
    assert.ok(crop.y + crop.height <= metadata.height);
  }
  const original = path.join(__dirname, '../artifacts/profile-review/originals/image26.png');
  if (fs.existsSync(original)) assert.deepEqual(fs.readFileSync(artwork), fs.readFileSync(original));
});

test('partner section is on About with a footer anchor, without extra relationship claims', () => {
  const Link = ({ children, ...props }) => React.createElement('a', props, children);
  const renderLoad = createLoader({ 'next/image': { default: () => null }, 'next/link': { default: Link } });
  const html = renderToStaticMarkup(React.createElement(renderLoad('components/technical-partners.tsx').TechnicalPartners));
  assert.match(html, /id="technical-partners"/);
  assert.match(html, /Partners and equipment brands listed in our company profile/);
  assert.doesNotMatch(html, /\+27|87759|exclusive|certified|endorsed|Hitech|Craneburg/);
  const about = renderToStaticMarkup(React.createElement(renderLoad('app/about/page.tsx').default));
  assert.match(about, /id="technical-partners"/);
  const footer = renderToStaticMarkup(React.createElement(renderLoad('components/chrome/footer.tsx').Footer));
  assert.match(footer, /href="\/about#technical-partners"/);
});

test('additional dredging assets retain their slide sources and illustration distinction', () => {
  const { profilePhotos, projectPhotos } = load('content/photography.ts');
  assert.equal(profilePhotos.dredgingAction.original, 'image31.png');
  assert.equal(profilePhotos.dredgingAction.kind, 'illustration');
  assert.match(profilePhotos.dredgingAction.alt, /not a verified Ruach/);
  assert.equal(profilePhotos.stockpileDischarge.original, 'image28.png');
  assert.equal(profilePhotos.stockpileDischarge.slide, 12);
  assert.equal(profilePhotos.shoreDischarge.original, 'image5.png');
  assert.equal(profilePhotos.shoreDischarge.slide, 4);
  for (const photo of Object.values(projectPhotos)) assert.notEqual(photo.original, 'image31.png');
  const fs = require('node:fs');
  const hero = fs.readFileSync(require('node:path').join(__dirname, '../components/home/hero.tsx'), 'utf8');
  assert.match(hero, /src=\{companyPhotos\.deck\.src\}/);
  assert.doesNotMatch(hero, /river-dredging\.jpg|dredgingAction/);
  assert.doesNotMatch(hero, /profilePhotos\.crew\.src/);
});

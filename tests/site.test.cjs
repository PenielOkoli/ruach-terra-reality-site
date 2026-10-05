const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { createLoader } = require('../scripts/ts-test-loader.cjs');
const load = createLoader();
const { estimateHydraulicFill } = load('lib/fleet/estimate.ts');
const { validateQuote } = load('lib/quote/validation.ts');
const { deliverQuote } = load('lib/quote/delivery.ts');
const { sendQuote } = load('lib/quote/client.ts');

function quoteForm() {
  const form = new FormData();
  Object.entries({ name: ' Test Client ', email: 'test@example.com', phone: '08000000000', location: 'Epe', projectType: 'Hydraulic dredging and reclamation' }).forEach(([key, value]) => form.set(key, value));
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

test('quote validation retains required fields and email checks', () => {
  assert.equal(validateQuote(new FormData()).ok, false);
  const form = quoteForm();
  form.set('email', 'invalid');
  assert.equal(validateQuote(form).error, 'Please enter a valid email address.');
  form.set('email', 'test@example.com');
  assert.equal(validateQuote(form).ok, true);
});

test('quote validation trims copy and limits field length', () => {
  const form = quoteForm();
  form.set('message', 'x'.repeat(2500));
  const result = validateQuote(form);
  assert.equal(result.submission.data.name, 'Test Client');
  assert.equal(result.submission.data.message.length, 2000);
});

test('quote attachment handling keeps metadata and the 5 MB limit', () => {
  const form = quoteForm();
  form.set('attachment', new File(['brief'], 'brief.txt', { type: 'text/plain' }));
  const result = validateQuote(form);
  assert.deepEqual(JSON.parse(JSON.stringify(result.submission.attachment)), { name: 'brief.txt', size: 5, type: 'text/plain' });
  assert.equal(result.submission.data.attachment, undefined);
  form.set('attachment', new File([new Uint8Array(5_000_001)], 'large.pdf'));
  assert.equal(validateQuote(form).error, 'Attachments must be 5 MB or smaller.');
});

test('webhook delivery keeps preview mode and request format', async () => {
  const submission = validateQuote(quoteForm()).submission;
  const calls = [];
  const fetchRequest = async (...args) => { calls.push(args); return Response.json({ ok: true }); };
  await deliverQuote(submission, {}, fetchRequest);
  await deliverQuote(submission, { url: 'http://example.com' }, fetchRequest);
  assert.equal(calls.length, 0);
  await deliverQuote(submission, { url: 'https://example.com', secret: 'test-secret' }, fetchRequest);
  assert.equal(calls[0][1].headers.Authorization, 'Bearer test-secret');
  assert.equal(JSON.parse(calls[0][1].body).type, 'ruach_quote_request');
  assert.equal(JSON.parse(calls[0][1].body).data.location, 'Epe');
});

test('browser quote transport reports server errors', async () => {
  await sendQuote(quoteForm(), async () => Response.json({ ok: true }));
  await assert.rejects(sendQuote(quoteForm(), async () => Response.json({ error: 'Invalid details' }, { status: 400 })), /Invalid details/);
});

test('quote HTTP boundary returns 400, 200 and 500 without live delivery', async () => {
  let fail = false;
  let deliveries = 0;
  const routeLoad = createLoader({ '@/lib/quote/delivery': { deliverQuote: async () => { deliveries++; if (fail) throw new Error('offline'); } } });
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
  // Update deliberately if homepage copy or markup is intentionally changed later.
  // Only the certificate RC changed in this data-audit pass; homepage sections/copy are unchanged.
  assert.equal(crypto.createHash('sha256').update(html).digest('hex'), '72198f951c18e790771838805b603a63c462e6f850ea9042accfea34817b1f15');
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
  assert.match(hero, /src="\/media\/industry\/river-dredging\.jpg"/);
  assert.doesNotMatch(hero, /profilePhotos\.crew\.src/);
});

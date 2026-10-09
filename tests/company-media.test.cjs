const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { createLoader } = require('../scripts/ts-test-loader.cjs');
const load = createLoader();

test('the original batch of supplied company files has duplicate-aware provenance', () => {
  const inventory = require('../docs/company-media-inventory.json');
  assert.equal(inventory.length, 27);
  assert.equal(inventory.filter(file => file.duplicateOf).length, 4);
  for (const file of inventory) assert.match(file.sha256, /^[a-f0-9]{64}$/);
});

test('the company-selected vessel replacement has responsive assets and replaces the joint without changing project facts', async () => {
  const { companyVessel } = load('content/company-media.ts');
  const manifest = require('../content/responsive-images.json');
  const metadata = await require('sharp')(path.join(__dirname, '../public', companyVessel.src)).metadata();
  assert.ok(metadata.width >= 1600 && metadata.height >= 900);
  assert.ok(Math.abs(metadata.width / metadata.height - 16 / 9) < .002);
  assert.match(companyVessel.alt, /AI-edited company-supplied.*deck person removed/);
  for (const width of [320, 480, 768, 1024]) assert.ok(manifest[companyVessel.src].variants.some(image => image.width === width));
  const Link = ({ children, ...props }) => React.createElement('a', props, children);
  const renderLoad = createLoader({ 'next/image': { default: () => null }, 'next/link': { default: Link } });
  for (const route of ['', 'projects/']) {
    const html = renderToStaticMarkup(React.createElement(renderLoad('app/' + route + 'page.tsx').default));
    assert.match(html, /company-lagoon-vessel-v2-/);
    assert.doesNotMatch(html, /epe-pipeline-joint-v2/);
    assert.match(html, /25,000 m³\+/);
  }
});

test('Epe Lagoon card uses the same fixed-height frame as the other homepage project images', () => {
  const css = fs.readFileSync(path.join(__dirname, '../app/globals.css'), 'utf8');
  assert.match(css, /\.project-photo \{ height: 340px; \}/);
  assert.match(css, /\.home-projects \.project-photo \{ height: 260px; \}/);
  assert.doesNotMatch(css, /\.home-projects \.project-photo-vessel\s*\{/);
  const component = fs.readFileSync(path.join(__dirname, '../components/home/projects.tsx'), 'utf8');
  assert.match(component, /\(max-width: 503px\) 463px, \(max-width: 767px\) calc\(100vw - 40px\), 605px/);
});

test('Epe Lagoon case-note image fills its column without changing the other full-view photographs', () => {
  const Link = ({ children, ...props }) => React.createElement('a', props, children);
  const renderLoad = createLoader({ 'next/image': { default: () => null }, 'next/link': { default: Link } });
  const html = renderToStaticMarkup(React.createElement(renderLoad('app/projects/page.tsx').default));
  const filledPhoto = html.match(/<figure class="photo project-case-photo-fill[\s\S]*?<\/figure>/)?.[0];
  assert.ok(filledPhoto);
  assert.match(filledPhoto, /company-lagoon-vessel-v2-/);
  assert.match(filledPhoto, /object-fit:cover/);
  assert.match(filledPhoto, /lg:\[&amp;_\.photo-frame\]:h-full/);
  assert.doesNotMatch(filledPhoto, /photo-full-frame|aspect-ratio/);
  assert.equal((html.match(/photo-full-frame/g) || []).length, 2);
});

test('seven equipment-family photos and two enhanced posters have responsive delivery assets', async () => {
  const sharp = require('sharp');
  const { companyPhotos, fieldClips } = load('content/company-media.ts');
  const inventory = require('../docs/company-media-inventory.json');
  const manifest = require('../content/responsive-images.json');
  assert.equal(Object.keys(companyPhotos).length, 7);
  const originalFor = { aerial: '9.36.32 AM.jpeg', deck: '9.36.25 AM.jpeg', pontoon: '9.37.50 AM.jpeg', intake: '10.00.32 AM.jpeg', pump: '9.37.52 AM.jpeg', field: '9.51.40 AM.jpeg', mobilisation: '9.37.47 AM.jpeg' };
  for (const [key, photo] of Object.entries(companyPhotos)) {
    const source = inventory.find(file => file.file.endsWith(originalFor[key]));
    const output = await sharp(path.join(__dirname, '../public', photo.src)).metadata();
    assert.ok(output.width > source.width && output.height > source.height, key);
    assert.match(photo.alt, /AI-enhanced company-supplied/);
    assert.doesNotMatch(photo.alt, /DP-\d|HT006|\b\d+\s*(?:in|kW|m³)\b/);
    assert.ok(manifest[photo.src].variants.some(variant => variant.width === 480));
  }
  for (const clip of Object.values(fieldClips)) {
    assert.ok(manifest[clip.poster.src]);
    const bytes = fs.readFileSync(path.join(__dirname, '../public', clip.src));
    assert.equal(bytes.toString('ascii', 4, 8), 'ftyp');
    assert.ok(bytes.length < 5 * 1024 * 1024);
  }
});

test('server-rendered field films defer video sources until viewport entry or manual play', () => {
  const { CompanyFieldFilms } = load('components/company-field-films.tsx');
  const html = renderToStaticMarkup(React.createElement(CompanyFieldFilms));
  assert.doesNotMatch(html, /<video\b|<source\b|<iframe\b|autoplay/);
  assert.equal((html.match(/aria-label="Play film:/g) || []).length, 2);
  assert.match(html, /Read visual description/);
  assert.match(html, /<noscript>/);
});

test('repaired pontoon and hero photos use new versions while retaining originals', () => {
  const { companyPhotos } = load('content/company-media.ts');
  for (const key of ['field', 'deck']) {
    assert.match(companyPhotos[key].src, /-v2\.webp$/);
    assert.ok(fs.existsSync(path.join(__dirname, '../public', companyPhotos[key].src.replace('-v2.webp', '-v1.webp'))));
  }
});

test('full-view photos expand into native-proportion frames without changing fixed video posters', () => {
  const { SitePhoto } = load('components/site-photo.tsx');
  const { companyPhotos } = load('content/company-media.ts');
  const manifest = require('../content/responsive-images.json');
  const photo = companyPhotos.mobilisation;
  const record = manifest[photo.src];
  const html = renderToStaticMarkup(React.createElement(SitePhoto, { ...photo, fit: 'contain' }));
  assert.match(html, /class="photo-frame photo-full-frame"/);
  assert.ok(html.includes(`aspect-ratio:${record.width} / ${record.height}`));
  assert.match(html, /height:auto;width:100%;max-width:/);
  assert.ok(html.includes(`max-width:${820 * record.width / record.height}px`));
  assert.match(html, /object-fit:contain/);
  for (const props of [{ fit: 'cover' }, { fit: 'contain', frame: 'fixed' }]) {
    const fixed = renderToStaticMarkup(React.createElement(SitePhoto, { ...photo, ...props }));
    assert.doesNotMatch(fixed, /photo-full-frame|aspect-ratio:/);
    assert.match(fixed, /<div class="photo-frame"><img/);
  }
});

test('the two selected manufacturer photos are enhanced, responsive and labelled separately from the fleet', async () => {
  const sharp = require('sharp');
  const { manufacturerEquipment } = load('content/manufacturer-media.ts');
  const inventory = require('../docs/company-media-inventory.json');
  const manifest = require('../content/responsive-images.json');
  const photos = manufacturerEquipment.flatMap(group => group.photos);
  assert.equal(manufacturerEquipment.length, 2);
  assert.equal(new Set(photos.map(photo => photo.src)).size, 2);
  for (const group of manufacturerEquipment) assert.equal(group.photos.length, 1);
  assert.ok(photos.some(photo => photo.src.includes('manufacturer-submersible-angle')));
  assert.ok(photos.some(photo => photo.src.includes('manufacturer-diesel-side')));
  for (const photo of photos) {
    const original = inventory.find(file => file.file === photo.sourceFile);
    assert.ok(original);
    const metadata = await sharp(path.join(__dirname, '../public', photo.src)).metadata();
    assert.ok(metadata.width > original.width && metadata.height > original.height);
    assert.ok(Math.abs(metadata.width / metadata.height - original.width / original.height) < .01);
    assert.ok(manifest[photo.src].variants.some(variant => variant.width === 480));
    assert.match(photo.alt, /AI-enhanced manufacturer reference/);
    assert.doesNotMatch(photo.alt, /TOYO|DP-\d|\b\d+\s*(?:in|kW|m³)\b/);
  }
  const { ManufacturerEquipment } = load('components/manufacturer-equipment.tsx');
  const html = renderToStaticMarkup(React.createElement(ManufacturerEquipment));
  assert.match(html, /not identified Ruach-owned units or models/);
  assert.equal((html.match(/<img /g) || []).length, 2);
  assert.equal((html.match(/object-fit:cover/g) || []).length, 2);
  assert.doesNotMatch(html, /manufacturer-submersible-front|manufacturer-centrifugal-front/);
  assert.match(html, /500px/);
  assert.match(fs.readFileSync(path.join(__dirname, '../app/globals.css'), 'utf8'), /\.manufacturer-groups\s*\{[^}]*max-width: 1040px/);
  assert.doesNotMatch(html, /<figcaption|Photo credit|FIG\./);
  assert.ok(fs.readFileSync(path.join(__dirname, '../app/fleet/page.tsx'), 'utf8').includes('<ManufacturerEquipment />'));
  assert.ok(!fs.readFileSync(path.join(__dirname, '../app/page.tsx'), 'utf8').includes('ManufacturerEquipment'));
});

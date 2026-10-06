const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { createLoader } = require('../scripts/ts-test-loader.cjs');
const load = createLoader();

test('all supplied company files have duplicate-aware provenance', () => {
  const inventory = require('../docs/company-media-inventory.json');
  assert.equal(inventory.length, 27);
  assert.equal(inventory.filter(file => file.duplicateOf).length, 4);
  for (const file of inventory) assert.match(file.sha256, /^[a-f0-9]{64}$/);
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

test('server-rendered field films have no video source, autoplay or embed', () => {
  const { CompanyFieldFilms } = load('components/company-field-films.tsx');
  const html = renderToStaticMarkup(React.createElement(CompanyFieldFilms));
  assert.doesNotMatch(html, /<video\b|<source\b|<iframe\b|autoplay/);
  assert.equal((html.match(/aria-label="Open film:/g) || []).length, 2);
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

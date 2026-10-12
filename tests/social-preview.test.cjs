const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');
const { createLoader } = require('../scripts/ts-test-loader.cjs');
const load = createLoader();
const { socialPreview } = load('lib/social-preview.ts');

test('sharing card is a compact 1200 by 630 JPEG', async () => {
  const bytes = await fs.readFile(path.join(__dirname, '../public', socialPreview.image));
  const image = await sharp(bytes).metadata();
  assert.equal(image.format, 'jpeg');
  assert.equal(image.width, socialPreview.width);
  assert.equal(image.height, socialPreview.height);
  assert.ok(bytes.length < 300_000);
});

test('existing Open Graph endpoint serves the new photo card with the correct MIME type', async () => {
  const { default: image, contentType, alt } = load('app/opengraph-image.tsx');
  const response = await image();
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'image/jpeg');
  assert.equal(contentType, 'image/jpeg');
  assert.equal(alt, socialPreview.alt);
  assert.deepEqual(Buffer.from(await response.arrayBuffer()),
    await fs.readFile(path.join(__dirname, '../public', socialPreview.image)));
});

test('inner pages retain their descriptions and share the photo card', () => {
  const { pageMetadata } = load('lib/metadata.ts');
  const metadata = pageMetadata('Our Fleet', 'Explore our dredging equipment.', '/fleet');
  assert.equal(metadata.openGraph.description, 'Explore our dredging equipment.');
  assert.equal(metadata.openGraph.images[0].url, socialPreview.image);
  assert.equal(metadata.openGraph.images[0].type, 'image/jpeg');
  assert.equal(metadata.twitter.images[0], socialPreview.image);
  assert.ok(socialPreview.description.length <= 160);
});

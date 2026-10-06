const { chromium } = require('playwright-core');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = process.env.MEDIA_CHECK_BASE || 'http://localhost:3001';
let browser;
(async () => {
  browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
  fs.mkdirSync('artifacts/full-photo-check', { recursive: true });
  const results = [];
  for (const width of [360, 768, 1280, 1920]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const route of ['/services', '/fleet', '/projects', '/about']) {
      assert.equal((await page.goto(base + route, { waitUntil: 'domcontentloaded', timeout: 60000 })).status(), 200);
      const frames = page.locator('.photo-full-frame');
      assert.ok(await frames.count());
      for (const frame of await frames.all()) {
        await frame.scrollIntoViewIfNeeded();
        await frame.locator('img').evaluate(node => new Promise((resolve, reject) => {
          if (node.complete) return node.naturalWidth ? resolve() : reject(new Error('Broken photo'));
          node.addEventListener('load', resolve, { once: true });
          node.addEventListener('error', () => reject(new Error('Photo failed to load')), { once: true });
        }));
        const state = await frame.evaluate(node => {
          const image = node.querySelector('img');
          const box = node.getBoundingClientRect();
          return { width: box.width, height: box.height, ratio: Number(image.getAttribute('width')) / Number(image.getAttribute('height')), fit: getComputedStyle(image).objectFit, src: image.currentSrc };
        });
        assert.equal(state.fit, 'contain');
        // Use intrinsic attributes, not rounded responsive-derivative dimensions.
        assert.ok(Math.abs(state.width / state.height - state.ratio) < .001, `${route}: photo has empty borders: ${JSON.stringify(state)}`);
        assert.ok(state.height > 0 && state.width > 0);
        if (state.ratio < 1) assert.ok(state.height <= 820.1, 'Portrait is excessively tall');
      }
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      if (route === '/services') {
        const mobilisation = page.locator('#service-6 .photo-full-frame');
        const box = await mobilisation.boundingBox();
        assert.ok(box.width > (width === 360 ? 300 : 350), 'Mobilisation photo remains too narrow');
        await page.locator('#service-6').screenshot({ path: `artifacts/full-photo-check/mobilisation-${width}.png`, style: 'header, .service-index { visibility: hidden !important; }' });
        assert.equal(await page.locator('.field-film-poster .photo-full-frame').count(), 0);
      }
      results.push({ width, route, fullPhotos: await frames.count(), noLetterboxing: true, noOverflow: true });
    }
    assert.deepEqual(errors, []);
    await context.close();
  }
  fs.writeFileSync('artifacts/full-photo-check/results.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})().catch(async error => { console.error(error); if (browser) await browser.close(); process.exitCode = 1; });

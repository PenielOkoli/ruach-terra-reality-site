const { chromium } = require('playwright-core');
const AxeBuilder = require('@axe-core/playwright').default;
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = process.env.MEDIA_CHECK_BASE || 'http://localhost:3001';
let browser;
(async () => {
  browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
  fs.mkdirSync('artifacts/manufacturer-media-check', { recursive: true });
  const results = [];
  for (const width of [360, 768, 1280, 1920]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto(base + '/fleet', { waitUntil: 'domcontentloaded', timeout: 60000 });
    assert.equal(response.status(), 200);
    const section = page.locator('.manufacturer-equipment');
    assert.equal(await section.locator('img').count(), 2);
    assert.equal(await section.locator('img[src*="manufacturer-submersible-front"], img[src*="manufacturer-centrifugal-front"]').count(), 0);
    assert.match(await section.innerText(), /not identified Ruach-owned units or models/);
    for (const image of await section.locator('img').all()) {
      await image.scrollIntoViewIfNeeded();
      await image.evaluate(node => new Promise((resolve, reject) => {
        if (node.complete) return node.naturalWidth ? resolve() : reject(new Error('Broken reference image'));
        node.addEventListener('load', resolve, { once: true });
        node.addEventListener('error', () => reject(new Error('Reference image failed to load')), { once: true });
      }));
      const state = await image.evaluate(node => ({ fit: getComputedStyle(node).objectFit, src: node.currentSrc, loading: node.loading }));
      assert.equal(state.fit, 'cover');
      assert.equal(state.loading, 'lazy');
      assert.match(state.src, /manufacturer-.*-v2-\d+\.webp$/);
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    const groups = await section.locator('.manufacturer-groups article').all();
    const boxes = await Promise.all(groups.map(group => group.boundingBox()));
    if (width >= 768) {
      assert.ok(Math.abs(boxes[0].y - boxes[1].y) < 1, 'Equipment groups must sit side by side');
      assert.ok(boxes[1].x >= boxes[0].x + boxes[0].width, 'Equipment groups overlap');
      for (const selector of ['h3', 'p', '.photo-frame']) {
        const aligned = await Promise.all(groups.map(group => group.locator(selector).boundingBox()));
        assert.ok(Math.abs(aligned[0].y - aligned[1].y) < 1, `${selector} must align across both columns`);
        if (selector === '.photo-frame') {
          assert.ok(Math.abs(aligned[0].height - aligned[1].height) < 1, 'Both images must fill equal-height frames');
        }
      }
    } else {
      assert.ok(boxes[1].y >= boxes[0].y + boxes[0].height, 'Equipment groups must stack on mobile');
    }
    for (const group of groups) {
      assert.equal(await group.locator('.manufacturer-photo').count(), 1);
      const state = await group.evaluate(node => {
        const grid = node.querySelector('.manufacturer-photo-grid').getBoundingClientRect();
        const photo = node.querySelector('.photo-frame').getBoundingClientRect();
        return { gridWidth: grid.width, width: photo.width, height: photo.height };
      });
      assert.ok(Math.abs(state.gridWidth - state.width) < 1, 'Remaining photo does not fill the available width');
      assert.ok(state.width <= 500.1 && state.height <= 500.1, 'Reference photo is too large');
      assert.ok(Math.abs(state.width / state.height - 1277 / 1232) < .001, 'Reference frame proportions must match');
    }
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    assert.deepEqual(axe.violations.map(item => item.id), []);
    assert.deepEqual(errors, []);
    await section.screenshot({ path: `artifacts/manufacturer-media-check/fleet-${width}.png`, style: 'header { visibility: hidden !important; }' });
    results.push({ width, images: 2, maximumPhotoWidth: 500, layout: width >= 768 ? 'side-by-side' : 'stacked', equalHeightFrames: true, runtimeErrors: 0, aaViolations: 0 });
    await context.close();
  }
  fs.writeFileSync('artifacts/manufacturer-media-check/results.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})().catch(async error => { console.error(error); if (browser) await browser.close(); process.exitCode = 1; });

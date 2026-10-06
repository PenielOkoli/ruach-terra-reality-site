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
      assert.equal(state.fit, 'contain');
      assert.equal(state.loading, 'lazy');
      assert.match(state.src, /manufacturer-.*-v2-\d+\.webp$/);
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    const groups = await section.locator('.manufacturer-groups article').all();
    for (const group of groups) {
      assert.equal(await group.locator('.manufacturer-photo').count(), 1);
      const state = await group.evaluate(node => {
        const grid = node.querySelector('.manufacturer-photo-grid').getBoundingClientRect();
        const photo = node.querySelector('.photo-frame').getBoundingClientRect();
        const image = node.querySelector('img');
        return { gridWidth: grid.width, width: photo.width, height: photo.height, ratio: Number(image.getAttribute('width')) / Number(image.getAttribute('height')) };
      });
      assert.ok(Math.abs(state.gridWidth - state.width) < 1, 'Remaining photo does not fill the available width');
      assert.ok(state.width <= 720.1 && state.height <= 720.1, 'Reference photo is too large');
      assert.ok(Math.abs(state.width / state.height - state.ratio) < .001, 'Equipment is cropped or stretched');
    }
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    assert.deepEqual(axe.violations.map(item => item.id), []);
    assert.deepEqual(errors, []);
    await section.screenshot({ path: `artifacts/manufacturer-media-check/fleet-${width}.png`, style: 'header { visibility: hidden !important; }' });
    results.push({ width, images: 2, maximumPhotoWidth: 720, fullEquipmentFraming: true, runtimeErrors: 0, aaViolations: 0 });
    await context.close();
  }
  fs.writeFileSync('artifacts/manufacturer-media-check/results.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})().catch(async error => { console.error(error); if (browser) await browser.close(); process.exitCode = 1; });

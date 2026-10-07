const { chromium } = require('playwright-core');
const AxeBuilder = require('@axe-core/playwright').default;
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = process.env.MEDIA_CHECK_BASE || 'http://localhost:3001';
let browser;
(async () => {
  browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
  fs.mkdirSync('artifacts/vessel-photo-review', { recursive: true });
  const results = [];
  for (const width of [360, 768, 1280, 1920]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    for (const route of ['/', '/projects']) {
      assert.equal((await page.goto(base + route, { waitUntil: 'domcontentloaded', timeout: 60000 })).status(), 200);
      const image = page.locator('img[src*="company-lagoon-vessel-v2-"]');
      assert.equal(await image.count(), 1);
      assert.equal(await page.locator('main img[src*="epe-pipeline-joint"]').count(), 0);
      await image.scrollIntoViewIfNeeded();
      await image.evaluate(node => new Promise((resolve, reject) => {
        if (node.complete) return node.naturalWidth ? resolve() : reject(new Error('Broken vessel photo'));
        node.addEventListener('load', resolve, { once: true });
        node.addEventListener('error', () => reject(new Error('Vessel photo failed to load')), { once: true });
      }));
      const framing = await image.evaluate(node => {
        const box = node.getBoundingClientRect();
        const style = getComputedStyle(node);
        return { width: box.width, height: box.height, ratio: Number(node.getAttribute('width')) / Number(node.getAttribute('height')), fit: style.objectFit, src: node.currentSrc };
      });
      if (route === '/') {
        assert.equal(framing.fit, 'cover');
        assert.equal(framing.height, width < 768 ? 260 : width <= 1100 ? 280 : 340);
        const cards = await page.locator('.project-card').evaluateAll(nodes => nodes.map(node => ({
          photoHeight: node.querySelector('.project-photo').getBoundingClientRect().height,
          photoBottom: node.querySelector('.project-photo').getBoundingClientRect().bottom,
          captionTop: node.querySelector('.project-copy').getBoundingClientRect().top,
        })));
        assert.equal(cards.length, 3);
        assert.ok(cards.every(card => Math.abs(card.photoHeight - framing.height) < 1), 'Project image heights differ');
        if (width >= 768) {
          assert.ok(cards.every(card => Math.abs(card.photoBottom - cards[0].photoBottom) < 1), 'Image bottoms do not line up');
          assert.ok(cards.every(card => Math.abs(card.captionTop - cards[0].captionTop) < 1), 'Project captions do not line up');
        }
        const deliveredWidth = Number(framing.src.match(/-(\d+)\.webp$/)[1]);
        assert.ok(deliveredWidth >= Math.max(framing.width, framing.height * framing.ratio), 'Crop is using an undersized delivery asset');
        await page.locator('.project-card').last().screenshot({ path: `artifacts/vessel-photo-review/home-card-${width}.png`, style: 'header { visibility: hidden !important; }' });
        await page.locator('.home-projects').screenshot({ path: `artifacts/vessel-photo-review/home-projects-${width}.png`, style: 'header { visibility: hidden !important; }' });
      } else {
        assert.equal(framing.fit, 'contain');
        assert.ok(Math.abs(framing.width / framing.height - framing.ratio) < .002);
        await image.screenshot({ path: `artifacts/vessel-photo-review/projects-photo-${width}.png`, style: 'header { visibility: hidden !important; }' });
      }
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      assert.deepEqual(axe.violations.map(item => item.id), []);
      results.push({ width, route, replacementLoaded: true, ...(route === '/' ? { imageHeight: framing.height, projectImagesAligned: true } : { fullVesselVisible: true }), aaViolations: 0, source: framing.src });
    }
    assert.deepEqual(errors, []);
    await context.close();
  }
  fs.writeFileSync('artifacts/vessel-photo-review/browser-results.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})().catch(async error => { console.error(error); if (browser) await browser.close(); process.exitCode = 1; });

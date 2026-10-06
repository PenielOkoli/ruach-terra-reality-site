const { chromium } = require('playwright-core');
const AxeBuilder = require('@axe-core/playwright').default;
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = process.env.MEDIA_CHECK_BASE || 'http://localhost:3001';
let browser;
(async () => {
  browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
  fs.mkdirSync('artifacts/company-media-check', { recursive: true });
  const results = [];
  for (const width of [360, 768, 1280, 1920]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    const failures = [];
    page.on('pageerror', error => failures.push(error.message));
    const videos = [];
    page.on('request', request => { if (/\.mp4(?:\?|$)/.test(request.url())) videos.push(request.url()); });
    for (const route of ['/', '/fleet', '/services', '/about']) {
      await page.goto(base + route, { waitUntil: 'networkidle' });
      if (route === '/services') assert.equal(await page.locator('video').count(), 0, 'Off-screen films must not mount before viewport entry');
      for (let y = 0; y < await page.evaluate(() => document.body.scrollHeight); y += 650) {
        await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), y);
        await page.waitForTimeout(30);
      }
      await page.waitForFunction(() => [...document.querySelectorAll('main img')].every(image => image.complete && image.naturalWidth));
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${route} ${width}`);
      if (route === '/services') {
        // At the document end sticky navigation leaves with its main-content parent.
        // Check the active sticky state, not that intentionally off-screen state.
        await page.evaluate(() => window.scrollTo({ top: 1000, behavior: 'instant' }));
        await page.waitForTimeout(50);
        const header = await page.locator('header').boundingBox();
        const index = await page.locator('.service-index').boundingBox();
        assert.ok(index.y >= header.y + header.height - 0.5, 'Service index must not overlap the sticky header');
      }
      const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      assert.deepEqual(axe.violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) })), [], `${route} ${width}`);
      if (route === '/') {
        assert.equal(await page.locator('main img[srcset*="/media/responsive/"]').count(), 7);
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.locator('.home-hero').screenshot({ path: `artifacts/company-media-check/hero-${width}.png` });
        results.push({ width, homepageScreens: +(await page.locator('main').evaluate(node => node.offsetHeight / 900)).toFixed(2), homepageWords: (await page.locator('main').innerText()).trim().split(/\s+/).length });
      }
      if (route === '/fleet') await page.locator('.equipment-gallery').screenshot({ path: `artifacts/company-media-check/equipment-${width}.png`, style: 'header { visibility: hidden !important; }' });
      if (route === '/services') await page.locator('.field-films-grid').screenshot({ path: `artifacts/company-media-check/films-${width}.png`, style: 'header { visibility: hidden !important; }' });
    }
    videos.length = 0;
    await page.goto(base + '/services', { waitUntil: 'networkidle' });
    assert.equal(await page.locator('video').count(), 0);
    assert.equal(videos.length, 0);
    for (const [index, title] of ['Slurry discharge', 'Suction-hose handling'].entries()) {
      await page.locator('.field-clip-player').nth(index).scrollIntoViewIfNeeded();
      // HTML video has no implicit ARIA role; select by accessible label instead.
      const player = page.locator(`video[aria-label="${title}"]`);
      await player.waitFor();
      await player.evaluate(node => new Promise((resolve, reject) => {
        if (node.readyState >= 1) return resolve();
        node.addEventListener('loadedmetadata', resolve, { once: true });
        node.addEventListener('error', () => reject(new Error('Video failed to decode')), { once: true });
      }));
      const attributes = await player.evaluate(node => ({ paused: node.paused, controls: node.controls, inline: node.playsInline, autoplay: node.autoplay, width: node.videoWidth, height: node.videoHeight, duration: node.duration }));
      assert.equal(attributes.autoplay, false);
      assert.equal(attributes.controls, true);
      assert.equal(attributes.inline, true);
      assert.ok(Math.abs(attributes.duration - (index ? 14 : 18)) < 0.2);
      assert.equal(attributes.width, index ? 352 : 540);
      await page.waitForFunction(title => {
        const node = document.querySelector(`video[aria-label="${title}"]`);
        return node && !node.paused && node.currentTime > 0;
      }, title);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.waitForTimeout(250);
      assert.equal(await player.evaluate(node => node.paused), true, 'Off-screen video must pause');
    }
    await page.locator('.field-films-grid').scrollIntoViewIfNeeded();
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    assert.deepEqual(axe.violations.map(v => v.id), []);
    assert.deepEqual(failures, []);
    await context.close();
  }
  fs.writeFileSync('artifacts/company-media-check/results.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ layouts: results, noInitialVideoDownloads: true, playsInView: true, decodeAndPlayback: true, pausesOffscreen: true, aaViolations: 0 }, null, 2));
  await browser.close();
})().catch(async error => { console.error(error); if (browser) await browser.close(); process.exitCode = 1; });

const { chromium } = require('playwright-core');
const AxeBuilder = require('@axe-core/playwright').default;
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = process.env.MEDIA_CHECK_BASE || 'http://localhost:3001';
let browser;
const playing = player => player.evaluate(node => new Promise((resolve, reject) => {
  const timeout = setTimeout(() => { clearInterval(poll); reject(new Error('Video did not start playing')); }, 15000);
  const poll = setInterval(() => {
    if (!node.paused && node.currentTime > 0) { clearTimeout(timeout); clearInterval(poll); resolve(); }
  }, 50);
}));
(async () => {
  browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
  fs.mkdirSync('artifacts/scroll-video-check', { recursive: true });
  const results = [];
  for (const width of [360, 768, 1280, 1920]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'no-preference' });
    const page = await context.newPage();
    const errors = [], mediaRequests = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => { if (/\.mp4(?:\?|$)/.test(request.url())) mediaRequests.push(request.url()); });
    await page.goto(base + '/services', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(300);
    assert.equal(await page.locator('video').count(), 0);
    assert.equal(mediaRequests.length, 0, 'Off-screen video must not download on initial load');
    for (const [index, title] of ['Slurry discharge', 'Suction-hose handling'].entries()) {
      const frame = page.locator('.field-clip-player').nth(index);
      await frame.scrollIntoViewIfNeeded();
      const player = page.locator(`video[aria-label="${title}"]`);
      await player.waitFor();
      await playing(player);
      const state = await player.evaluate(node => ({ muted: node.muted, inline: node.playsInline, loop: node.loop, controls: node.controls }));
      assert.deepEqual(state, { muted: true, inline: true, loop: true, controls: true });
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.waitForFunction(title => document.querySelector(`video[aria-label="${title}"]`).paused, title);
      await frame.scrollIntoViewIfNeeded();
      await playing(player);
      await player.evaluate(node => node.pause());
      await page.waitForTimeout(200);
      assert.equal(await player.evaluate(node => node.paused), true, 'Native pause must remain usable');
    }
    const frames = await page.locator('.field-clip-player').evaluateAll(nodes => nodes.map(node => {
      const box = node.getBoundingClientRect(); return { y: box.y, height: box.height };
    }));
    assert.ok(Math.abs(frames[0].height - frames[1].height) < 1);
    if (width >= 768) assert.ok(Math.abs(frames[0].y - frames[1].y) < 1, 'Desktop video panels must line up');
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    assert.ok(await page.locator('video').evaluateAll(nodes => nodes.every(node => node.paused)));
    await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event('visibilitychange')); });
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    assert.deepEqual(axe.violations.map(item => item.id), []);
    assert.deepEqual(errors, []);
    await page.locator('.field-films-grid').screenshot({ path: `artifacts/scroll-video-check/videos-${width}.png`, style: 'header { visibility: hidden !important; }' });
    results.push({ width, playsInView: true, pausesOffscreen: true, pausesWhenHidden: true, aligned: true, initialVideoRequests: 0, aaViolations: 0 });
    await context.close();
  }
  for (const preference of ['reduced-motion', 'save-data', 'blocked-autoplay']) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: preference === 'reduced-motion' ? 'reduce' : 'no-preference' });
    if (preference === 'save-data') await context.addInitScript(() => Object.defineProperty(navigator, 'connection', { value: { saveData: true } }));
    if (preference === 'blocked-autoplay') await context.addInitScript(() => {
      const play = HTMLMediaElement.prototype.play;
      window.allowTestVideoPlay = false;
      HTMLMediaElement.prototype.play = function () {
        return window.allowTestVideoPlay ? play.call(this) : Promise.reject(new DOMException('Autoplay blocked', 'NotAllowedError'));
      };
    });
    const page = await context.newPage();
    await page.goto(base + '/services', { waitUntil: 'networkidle', timeout: 60000 });
    await page.locator('.field-clip-player').first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const button = page.getByRole('button', { name: 'Play film: Slurry discharge' });
    await button.waitFor();
    if (preference !== 'blocked-autoplay') assert.equal(await page.locator('video').count(), 0);
    if (preference === 'blocked-autoplay') await page.evaluate(() => { window.allowTestVideoPlay = true; });
    await button.click();
    const player = page.locator('video[aria-label="Slurry discharge"]');
    await player.waitFor();
    await playing(player);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForFunction(() => document.querySelector('video[aria-label="Slurry discharge"]').paused);
    results.push({ preference, manualFallbackWorks: true });
    console.log(`${preference}: manual fallback passed`);
    await context.close();
  }
  fs.writeFileSync('artifacts/scroll-video-check/results.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})().catch(async error => { console.error(error); if (browser) await browser.close(); process.exitCode = 1; });

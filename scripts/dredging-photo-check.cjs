const { chromium } = require('playwright-core');
const fs = require('node:fs');
let browser;

(async () => {
  browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  fs.mkdirSync('artifacts/dredging-photo-review', { recursive: true });
  const results = [];
  for (const width of [360, 768, 1280, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    for (const [route, src, selector, label] of [
      ['/', '/media/enhanced/dredging-action-v3.webp', '.home-fleet', 'fleet-teaser'],
      ['/services', '/media/enhanced/stockpile-discharge-v3.webp', '#service-1', 'hydraulic-service'],
      ['/fleet', '/media/enhanced/shore-discharge-v3.webp', 'main > section:last-child', 'placement'],
    ]) {
      await page.goto('http://localhost:3001' + route, { waitUntil: 'domcontentloaded' });
      const img = page.locator(`img[src="${src}"]`);
      await img.scrollIntoViewIfNeeded();
      await img.evaluate(el => el.decode());
      const meta = await img.evaluate(el => ({ loaded: el.complete && el.naturalWidth > 0, imageWidth: el.naturalWidth, imageHeight: el.naturalHeight }));
      if (route === '/') {
        const heroSrc = await page.locator('.hero-landscape img').getAttribute('src');
        if (!decodeURIComponent(heroSrc).includes('/media/industry/river-dredging.jpg')) throw new Error('Hero does not use the restored previous background.');
      }
      const section = route === '/fleet' ? img.locator('xpath=ancestor::section[1]') : page.locator(selector);
      await section.screenshot({ path: `artifacts/dredging-photo-review/${label}-${width}.png`, style: 'header { visibility: hidden !important; }' });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      results.push({ route, viewportWidth: width, src, ...meta, overflow });
      if (!meta.loaded || overflow) throw new Error('Image or responsive check failed.');
    }
  }
  fs.writeFileSync('artifacts/dredging-photo-review/checks.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => { await browser?.close(); });

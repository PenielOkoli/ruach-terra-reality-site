const { chromium } = require('playwright-core');
const AxeBuilder = require('@axe-core/playwright').default;
const fs = require('node:fs');
let browser;

(async () => {
  browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  fs.mkdirSync('artifacts/partner-review', { recursive: true });
  const results = [];
  for (const width of [360, 768, 1280, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('http://localhost:3001/about', { waitUntil: 'domcontentloaded' });
    const section = page.locator('#technical-partners');
    await section.scrollIntoViewIfNeeded();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => [...document.querySelectorAll('#technical-partners img')].every(img => img.complete && img.naturalWidth));
    await section.screenshot({ path: `artifacts/partner-review/partners-${width}.png` });
    const layout = await section.evaluate(el => ({
      names: [...el.querySelectorAll('li p')].map(p => p.textContent),
      overflow: document.documentElement.scrollWidth > innerWidth,
      clippedText: [...el.querySelectorAll('p, h2')].filter(p => { const r = p.getBoundingClientRect(); return r.left < 0 || r.right > innerWidth; }).map(p => p.textContent),
      loadedLogos: [...el.querySelectorAll('img')].filter(img => img.complete && img.naturalWidth === 1338).length,
    }));
    const axe = await new AxeBuilder({ page }).include('#technical-partners').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    results.push({ width, ...layout, violations: axe.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })) });
  }
  await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded' });
  await page.locator('footer').getByRole('link', { name: 'Technical partners', exact: true }).click();
  await page.waitForURL('**/about#technical-partners');
  await page.waitForFunction(() => {
    const r = document.querySelector('#technical-partners')?.getBoundingClientRect();
    return r && r.top >= 70 && r.top < 200;
  });
  results.push({ footerDestination: page.url(), anchorVisibleBelowHeader: true });
  fs.writeFileSync('artifacts/partner-review/checks.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
  if (results.some(r => r.overflow || r.clippedText?.length || r.violations?.length || (r.loadedLogos !== undefined && r.loadedLogos !== 4))) throw new Error('Partner checks failed.');
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => { await browser?.close(); });

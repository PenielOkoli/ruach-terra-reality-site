const { chromium } = require('playwright-core');
const fs = require('node:fs');
const AxeBuilder = require('@axe-core/playwright').default;
let browser;

(async () => {
  browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  fs.mkdirSync('artifacts/design-review', { recursive: true });
  const results = [];
  for (const width of [360, 768, 1280, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.locator('#hero-title').waitFor();
    await page.evaluate(() => document.fonts.ready);
    for (let y = 0; y < await page.evaluate(() => document.body.scrollHeight); y += 700) {
      await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), y);
      await page.waitForTimeout(80);
    }
    await page.waitForFunction(() => [...document.images].every(img => img.complete), null, { timeout: 60000 });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.screenshot({ path: `artifacts/design-review/home-${width}.png`, fullPage: true });
    await page.screenshot({ path: `artifacts/design-review/hero-${width}.png` });
    const layout = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      height: document.body.scrollHeight,
      words: document.body.innerText.trim().split(/\s+/).length,
      mainWords: document.querySelector('main').innerText.trim().split(/\s+/).length,
      clippedText: [...document.querySelectorAll('main h1, main h2, main h3, main p, main a')].filter(el => { const r = el.getBoundingClientRect(); return r.left < -1 || r.right > innerWidth + 1; }).map(el => el.textContent),
      failedImages: [...document.images].filter(img => !img.complete || !img.naturalWidth).map(img => img.src),
    }));
    if (await page.locator('figcaption, .hero-credit, .photo-caption, a[href="/photography"]').count()) throw new Error('Photo labels remain on the homepage.');
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    results.push({ width, ...layout, violations: axe.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })) });
  }
  await page.setViewportSize({ width: 360, height: 900 });
  await page.getByRole('button', { name: 'Toggle navigation' }).click();
  results.push({ mobileMenu: await page.getByRole('navigation', { name: 'Mobile navigation' }).isVisible() });
  await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Fleet', exact: true }).click();
  await page.waitForURL('**/fleet');
  results.push({ mobileMenuCloses: await page.getByRole('button', { name: 'Toggle navigation' }).getAttribute('aria-expanded') === 'false', menuDestination: new URL(page.url()).pathname });
  for (const width of [360, 768, 1280, 1920]) {
  await page.setViewportSize({ width, height: 900 });
  for (const route of ['/about', '/services', '/fleet', '/projects', '/quality-hse', '/contact']) {
    await page.goto(`http://localhost:3001${route}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    if (await page.locator('figcaption, .photo-caption, a[href="/photography"]').count()) throw new Error('Photo labels remain on ' + route);
    for (let y = 0; y < await page.evaluate(() => document.body.scrollHeight); y += 700) {
      await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), y);
      await page.waitForTimeout(80);
    }
    await page.waitForFunction(() => [...document.images].every(img => img.complete), null, { timeout: 60000 });
    const failedImages = await page.evaluate(() => [...document.images].filter(img => !img.naturalWidth).map(img => img.src));
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.screenshot({ path: `artifacts/design-review/${route.slice(1)}-${width}.png`, fullPage: true });
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    results.push({ route, width, failedImages, overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), violations: result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })) });
  }
  }
  await browser.close();
  fs.writeFileSync('artifacts/design-review/checks.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
  if (results.some(r => r.overflow || r.failedImages?.length || r.clippedText?.length || r.violations?.length)) throw new Error('Responsive, image or accessibility checks failed; see checks.json.');
})().catch(async error => { console.error(error); await browser?.close(); process.exitCode = 1; });

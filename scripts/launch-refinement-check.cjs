const { chromium } = require('playwright-core');
const AxeBuilder = require('@axe-core/playwright').default;
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const manifest = require('../content/responsive-images.json');
const base = 'http://localhost:3001';
let browser;
async function loadImages(page) {
  for (let y = 0; y < await page.evaluate(() => document.body.scrollHeight); y += 700) {
    await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), y);
    await page.waitForTimeout(40);
  }
  await page.waitForFunction(() => [...document.images].every(img => img.complete));
}
(async () => {
  browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
  fs.mkdirSync('artifacts/launch-refinement', { recursive: true });
  const results = [];
  for (const width of [360, 768, 1280, 1920]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    await page.goto(base, { waitUntil: 'domcontentloaded' });
    await loadImages(page);
    const photos = await page.locator('main img[srcset*="/media/responsive/"]').evaluateAll(images => images.map(image => ({ src: new URL(image.currentSrc).pathname, slot: Math.round(image.getBoundingClientRect().width), fit: getComputedStyle(image).objectFit })));
    assert.equal(photos.length, 7);
    const downloads = photos.map(photo => {
      const entry = Object.entries(manifest).find(([, image]) => image.variants.some(v => v.src === photo.src));
      assert.ok(entry, photo.src);
      const originalBytes = fs.statSync(path.join(__dirname, '../public', entry[0])).size;
      const variant = entry[1].variants.find(v => v.src === photo.src);
      return { ...photo, width: variant.width, bytes: variant.bytes, originalBytes };
    });
    if (width === 360) assert.ok(downloads.every(image => image.width <= 480));
    await page.locator('.home-fleet').screenshot({ path: `artifacts/launch-refinement/fleet-${width}.png`, style: 'header { visibility: hidden !important; }' });
    await page.locator('.home-projects').screenshot({ path: `artifacts/launch-refinement/projects-${width}.png`, style: 'header { visibility: hidden !important; }' });
    results.push({ width, responsivePhotos: downloads, projectPhotoHeight: await page.locator('.project-photo').first().evaluate(el => el.getBoundingClientRect().height) });

    await page.goto(base + '/contact');
    await page.locator('main details summary').click();
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    assert.equal(axe.violations.length, 0, JSON.stringify(axe.violations.map(v => v.id)));
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.locator('form').screenshot({ path: `artifacts/launch-refinement/form-${width}.png`, style: 'header { visibility: hidden !important; }' });
    await context.close();
  }
  const retinaContext = await browser.newContext({ viewport: { width: 360, height: 900 }, deviceScaleFactor: 2 });
  const retinaPage = await retinaContext.newPage();
  await retinaPage.goto(base);
  await loadImages(retinaPage);
  const retinaSources = await retinaPage.locator('main img[srcset*="/media/responsive/"]').evaluateAll(images => images.map(image => new URL(image.currentSrc).pathname));
  assert.equal(retinaSources.length, 7);
  assert.ok(retinaSources.every(src => Object.values(manifest).some(image => image.variants.some(v => v.src === src && v.width <= 768))));
  await retinaContext.close();
  const context = await browser.newContext();
  const page = await context.newPage();
  const metadata = [];
  for (const route of ['/', '/about', '/services', '/fleet', '/projects', '/quality-hse', '/contact', '/privacy', '/terms']) {
    await page.goto(base + route);
    const data = await page.evaluate(() => ({ title: document.title, canonical: document.querySelector('link[rel="canonical"]')?.href, description: document.querySelector('meta[name="description"]')?.content, ogUrl: document.querySelector('meta[property="og:url"]')?.content }));
    assert.equal(data.canonical, 'https://ruachdredging.com' + (route === '/' ? '/' : route));
    if (route !== '/') assert.equal(data.ogUrl, data.canonical);
    assert.ok(data.description);
    metadata.push({ route, ...data });
  }
  await page.goto(base + '/projects');
  assert.doesNotMatch(await page.locator('main').innerText(), /Hitech|Craneburg/);
  await page.goto(base + '/contact');
  await page.locator('[name="name"]').fill('QA Test');
  await page.locator('[name="phone"]').fill('08000000000');
  await page.locator('[name="location"]').fill('Epe');
  await page.locator('[name="projectType"]').selectOption('Not sure yet');
  await page.locator('[name="consent"]').check();
  // Only browser requests are intercepted. No enquiry reaches a live recipient.
  await page.route('**/api/quote', route => route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ error: 'Quote delivery is not configured. Please call or WhatsApp Ruach.' }) }));
  await page.getByRole('button', { name: 'Send project request' }).click();
  await page.locator('form [role="alert"]').waitFor();
  assert.equal(await page.locator('[name="name"]').inputValue(), 'QA Test');
  assert.equal(await page.getByText('Request accepted', { exact: true }).count(), 0);
  assert.ok(await page.locator('form [role="alert"]').getByRole('link', { name: /WhatsApp/ }).isVisible());
  await page.unroute('**/api/quote');
  await page.locator('main details summary').click();
  await page.getByRole('checkbox', { name: 'Not sure yet', exact: true }).first().check();
  await page.locator('[name="pipelineDistance"]').fill('250');
  const fileBytes = Buffer.from('%PDF-1.4\nQA attachment bytes\n');
  await page.locator('[name="attachment"]').setInputFiles({ name: 'qa-brief.pdf', mimeType: 'application/pdf', buffer: fileBytes });
  let received;
  await page.route('**/api/quote', async route => {
    const request = route.request();
    const form = await new Request(base + '/api/quote', { method: 'POST', headers: { 'Content-Type': request.headers()['content-type'] }, body: request.postDataBuffer() }).formData();
    received = { volume: form.get('volume'), distance: form.get('pipelineDistance'), email: form.get('email'), file: await form.get('attachment').text() };
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) });
  });
  await page.getByRole('button', { name: 'Send project request' }).click();
  await page.getByText('Request accepted', { exact: true }).waitFor();
  assert.equal(received.volume, 'Not sure yet');
  assert.equal(received.distance, '250');
  assert.equal(received.email, '');
  assert.equal(received.file, fileBytes.toString());
  fs.writeFileSync('artifacts/launch-refinement/checks.json', JSON.stringify({ layouts: results, retinaSources, metadata, quoteUI: { failureRetainsValues: true, noFalseSuccess: true, optionalEmail: true, unknownVolume: true, attachmentBytes: true } }, null, 2));
  console.log(JSON.stringify({ widths: results.map(r => r.width), metadataPages: metadata.length, quoteUI: 'passed', mobilePhotos: results[0].responsivePhotos }, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => { await browser?.close(); });

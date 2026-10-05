const { chromium } = require('playwright-core');
const AxeBuilder = require('@axe-core/playwright').default;
const fs = require('node:fs');
const assert = require('node:assert/strict');
let browser;

(async () => {
  browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  fs.mkdirSync('artifacts/profile-data-review', { recursive: true });
  const results = [];
  for (const width of [360, 768, 1280, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['/fleet', '/projects', '/about', '/services', '/quality-hse']) {
      await page.goto('http://localhost:3001' + route, { waitUntil: 'domcontentloaded' });
      if (route === '/fleet') {
        const table = page.locator('#core-systems table');
        assert.equal(await table.locator('thead th').count(), 4);
        assert.equal(await table.locator('tbody tr').count(), 4);
        assert.equal(await table.getByText('Medium duty', { exact: true }).count(), 2);
        assert.match(await table.innerText(), /not primary abrasive sand dredging/);
        assert.doesNotMatch(await table.innerText(), /Not listed/);
        await table.scrollIntoViewIfNeeded();
        await page.locator('#core-systems').screenshot({ path: `artifacts/profile-data-review/core-systems-${width}.png`, style: 'header { visibility: hidden !important; }' });
        await page.getByRole('spinbutton', { name: 'Pipeline distance km' }).fill('1.2');
        await page.getByRole('status').filter({ hasText: 'Site assessment required' }).waitFor();
        await page.getByRole('spinbutton', { name: 'Pipeline distance km' }).fill('0.3');
        assert.equal(await page.getByRole('status').filter({ hasText: 'Site assessment required' }).count(), 0);
      }
      if (route === '/about') {
        assert.match(await page.locator('main').innerText(), /RUACH DREDGING NIG LTD/);
        assert.match(await page.locator('main').innerText(), /RC 9001841/);
        assert.doesNotMatch(await page.locator('main').innerText(), /8996272/);
      }
      const details = page.locator('main details');
      const count = await details.count();
      assert.ok(count > 0);
      // Keyboard activation verifies the native disclosure interaction.
      const firstSummary = details.first().locator('summary');
      await firstSummary.focus();
      await page.keyboard.press('Enter');
      assert.equal(await details.first().getAttribute('open'), '');
      await page.evaluate(() => document.querySelectorAll('main details').forEach(el => { el.open = true; }));
      for (let y = 0; y < await page.evaluate(() => document.body.scrollHeight); y += 850) {
        await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), y);
        await page.waitForTimeout(30);
      }
      await page.waitForFunction(() => [...document.images].every(img => img.complete), null, { timeout: 60000 });
      const layout = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        failedImages: [...document.images].filter(img => !img.naturalWidth).map(img => img.src),
        clippedCopy: [...document.querySelectorAll('main details p, main details li, main summary')].filter(el => { const r = el.getBoundingClientRect(); return r.left < -1 || r.right > innerWidth + 1; }).map(el => el.textContent),
      }));
      const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      results.push({ route, width, disclosureCount: count, ...layout, violations: axe.violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) })) });
      await page.evaluate(() => document.querySelectorAll('main details').forEach(el => { el.open = false; }));
    }
  }
  fs.writeFileSync('artifacts/profile-data-review/checks.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
  if (results.some(r => r.overflow || r.failedImages.length || r.clippedCopy.length || r.violations.length)) throw new Error('Profile data review failed.');
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => { await browser?.close(); });

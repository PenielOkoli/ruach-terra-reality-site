// Isolated regression check: all HTTP traffic is intercepted, never sent live.
const { chromium } = require('playwright-core');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
let browser;

(async () => {
  browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();
  const pageErrors = [];
  const syncs = [];
  let shared = { inventory: [], sales: [] };
  let pulls = 0;
  let rejectPull = false;
  let delayedPull;
  let releasePull;
  let signedIn = false;
  page.on('pageerror', error => pageErrors.push(error.message));
  await context.route('**/*', async route => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.hostname !== 'admin.test') return route.fulfill({ status: 200, body: '' });
    if (url.pathname.startsWith('/api/')) {
      let status = 200;
      let body = { ok: true };
      if (url.pathname === '/api/auth/session' && !signedIn) { status = 401; body = { error: 'Sign in required' }; }
      if (url.pathname === '/api/auth/login') signedIn = true;
      if (url.pathname === '/api/auth/logout') signedIn = false;
      if (url.pathname === '/api/admin/sync') {
        assert.equal(signedIn, true);
        if (request.method() === 'GET') {
          pulls++;
          if (rejectPull) { status = 502; body = { error: 'Test refresh unavailable' }; }
          else if (delayedPull) { body = structuredClone(shared); await delayedPull; delayedPull = null; }
          else body = { ok: true, ...structuredClone(shared) };
        } else {
          const data = request.postDataJSON();
          syncs.push(data);
          shared = structuredClone(data);
        }
      }
      return route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
    }
    const file = path.resolve(root, '.' + decodeURIComponent(url.pathname));
    if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) return route.fulfill({ status: 404, body: '' });
    const mime = { '.html': 'text/html', '.js': 'application/javascript', '.mjs': 'application/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' }[path.extname(file)] || 'application/octet-stream';
    return route.fulfill({ status: 200, contentType: mime, body: fs.readFileSync(file) });
  });

  await page.goto('http://admin.test/admin.html', { waitUntil: 'domcontentloaded' });
  await page.locator('#ownerGate').waitFor({ state: 'visible' });
  assert.equal(await page.locator('#adminPortal').isVisible(), false);
  await page.locator('#ownerEmail').fill('test@example.com');
  await page.locator('#ownerPassword').fill('test-only-password');
  await page.locator('#ownerLoginForm button[type=submit]').click();
  await page.locator('#adminPortal').waitFor({ state: 'visible' });
  await page.waitForFunction(() => JSON.parse(localStorage.getItem('rt-business-desk-v1')) !== null);
  assert.equal(await page.locator('#addSaleLine').evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(231, 241, 235)');

  await page.locator('[data-admin-tab=inventory]').click();
  const inventory = page.locator('#inventoryForm');
  await inventory.locator('[name=name]').fill('Test <pipe>');
  await inventory.locator('[name=sku]').fill('QA-1');
  await inventory.locator('[name=quantity]').fill('20');
  await inventory.locator('[name=cost]').fill('400');
  await inventory.locator('[name=price]').fill('1000');
  await inventory.locator('button[type=submit]').click();
  await page.waitForFunction(() => document.querySelector('#inventoryMessage').textContent.includes('saved and synced'));
  assert.match(await page.locator('#inventoryBody').innerText(), /Test <pipe>/);
  const readStore = () => page.evaluate(() => JSON.parse(localStorage.getItem('rt-business-desk-v1')));
  const productId = (await readStore()).inventory[0].id;

  // Reload proves persistence survives new module instances and owner session check.
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.locator('#adminPortal').waitFor({ state: 'visible' });
  await page.locator('[data-admin-tab=sales]').click();
  await page.locator('#saleForm [name=customer]').fill('Test customer');
  await page.locator('.sale-product').selectOption(productId);
  await page.locator('.sale-quantity').fill('3');
  await page.locator('.sale-discount').fill('10');
  assert.match(await page.locator('#saleGrandTotal').innerText(), /2,700/);
  await page.locator('#saleForm button[type=submit]').click();
  await page.locator('#invoiceSheet').waitFor({ state: 'visible' });
  await page.waitForFunction(() => document.querySelector('#saleMessage').textContent.includes('saved and synced'));
  const sold = await readStore();
  assert.equal(sold.inventory[0].quantity, 17);
  assert.equal(sold.sales[0].subtotal, 3000);
  assert.equal(sold.sales[0].discountTotal, 300);
  assert.equal(sold.sales[0].total, 2700);
  assert.equal(sold.sales[0].items[0].discountPercent, 10);
  assert.match(await page.locator('#invoicePaper').innerText(), /Test <pipe>/);
  assert.match(await page.locator('#invoicePaper').innerText(), /Test customer/);
  assert.match(await page.locator('#invoicePaper').innerText(), /10%/);
  assert.equal(await page.locator('#invoicePaper thead th').count(), 5);
  assert.equal(await page.locator('#invoicePaper script').count(), 0);
  assert.equal(await page.locator('#invoicePaper th.invoice-quantity').evaluate(el => getComputedStyle(el).textAlign), 'center');
  assert.equal(await page.locator('#invoicePaper th.invoice-amount').first().evaluate(el => getComputedStyle(el).textAlign), 'right');
  await page.locator('#closeInvoice').click();

  await page.locator('[data-admin-tab=inventory]').click();
  page.once('dialog', dialog => dialog.accept('5'));
  await page.locator('[data-restock]').click();
  await page.waitForFunction(() => document.querySelector('#inventoryMessage').textContent.includes('Stock updated and synced'));
  assert.equal((await readStore()).inventory[0].quantity, 22);

  const inventoryDownload = page.waitForEvent('download');
  await page.locator('#exportInventory').click();
  const inventoryCsv = await inventoryDownload;
  assert.equal(inventoryCsv.suggestedFilename(), 'ruach-terra-inventory.csv');
  assert.match(fs.readFileSync(await inventoryCsv.path(), 'utf8'), /"Test <pipe>","QA-1"/);
  const salesDownload = page.waitForEvent('download');
  await page.locator('#exportSales').click();
  const salesCsv = await salesDownload;
  assert.equal(salesCsv.suggestedFilename(), 'ruach-terra-sales.csv');
  assert.match(fs.readFileSync(await salesCsv.path(), 'utf8'), /"Test customer"/);
  assert.match(fs.readFileSync(await salesCsv.path(), 'utf8'), /"Test <pipe> x3 \(10% off\)","300","2700"/);

  // New main-branch feature: pull shared records, then retain them on failure.
  await page.locator('[data-admin-tab=settings]').click();
  shared.inventory[0].quantity = 27;
  await page.locator('#refreshFromSheets').click();
  await page.waitForFunction(() => document.querySelector('#settingsMessage').textContent.includes('Refreshed with'));
  assert.equal((await readStore()).inventory[0].quantity, 27);
  rejectPull = true;
  await page.locator('#refreshFromSheets').click();
  await page.waitForFunction(() => document.querySelector('#settingsMessage').textContent.includes('Could not refresh'));
  assert.equal((await readStore()).inventory[0].quantity, 27);
  rejectPull = false;

  // A refresh in flight must not erase a newly saved local record.
  delayedPull = new Promise(resolve => { releasePull = resolve; });
  const startedPull = page.waitForRequest(request => request.url().endsWith('/api/admin/sync') && request.method() === 'GET');
  await page.locator('#refreshFromSheets').click();
  await startedPull;
  await page.locator('[data-admin-tab=inventory]').click();
  page.once('dialog', dialog => dialog.accept('1'));
  await page.locator('[data-restock]').click();
  await page.waitForFunction(() => document.querySelector('#inventoryMessage').textContent.includes('Stock updated and synced'));
  releasePull();
  await page.waitForFunction(() => document.querySelector('#settingsMessage').textContent.includes('Local records changed'));
  assert.equal((await readStore()).inventory[0].quantity, 28);

  // Portrait mobile layout includes the discount control without page overflow.
  await page.locator('[data-admin-tab=sales]').click();
  for (const width of [360, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  }

  await page.locator('[data-admin-tab=invoices]').click();
  await page.locator('#invoiceBody [data-invoice]').click();
  await page.locator('#invoiceSheet').waitFor({ state: 'visible' });
  await page.locator('#closeInvoice').click();
  await page.locator('#ownerLogout').click();
  await page.waitForURL('**/index.html');
  assert.equal(signedIn, false);
  assert.equal(syncs.length, 4);
  assert.ok(pulls >= 5);
  assert.equal(pageErrors.length, 0, pageErrors.join('\n'));
  await browser.close();
  console.log('PASS: owner login, inventory, reload, discounts, invoice, restock, CSV, shared refresh, failed refresh, in-flight data protection, mobile layout and logout; no live API requests.');
})().catch(async error => { console.error(error); await browser?.close(); process.exitCode = 1; });

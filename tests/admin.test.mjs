import test from 'node:test';
import assert from 'node:assert/strict';
import { createStore, STORE_KEY } from '../admin/storage.mjs';
import { createInventoryItem, selectSaleItems, recordSale, restockItem, getOverview, invoiceNumber, saleLineAmounts } from '../admin/domain.mjs';
import { serializeCsv, inventoryRows, salesRows } from '../admin/exports.mjs';
import { escapeHtml } from '../admin/format.mjs';
import { createAdminApi } from '../admin/api.mjs';

const product = () => createInventoryItem({ name: ' Pipe ', sku: ' A1 ', quantity: '20', reorderAt: '10', cost: '400', price: '1000', stockedDate: '2026-10-04' }, 'item-1');

test('storage preserves the existing key and record schema', () => {
  const records = { inventory: [product()], sales: [] };
  let saved;
  const store = createStore({ getItem: key => { assert.equal(key, 'rt-business-desk-v1'); return JSON.stringify(records); }, setItem: (key, value) => { saved = { key, value }; } });
  assert.deepEqual(store.state, records);
  store.state.inventory[0].quantity = 18;
  store.save();
  assert.equal(saved.key, STORE_KEY);
  assert.equal(JSON.parse(saved.value).inventory[0].quantity, 18);
});

test('missing or corrupt storage still starts with empty registers', () => {
  for (const raw of [null, 'invalid JSON']) {
    assert.deepEqual(createStore({ getItem: () => raw }).state, { inventory: [], sales: [] });
  }
});

test('inventory creation normalizes names and numeric fields', () => {
  assert.deepEqual(product(), { id: 'item-1', name: 'Pipe', sku: 'A1', quantity: 20, reorderAt: 10, cost: 400, price: 1000, stockedDate: '2026-10-04' });
  assert.equal(invoiceNumber(8, 2026), 'RT-2026-0009');
});

test('sale selection validates stock without changing it', () => {
  const inventory = [product()];
  assert.equal(selectSaleItems(inventory, []).error, 'Add at least one item to the sale.');
  assert.match(selectSaleItems(inventory, [{ productId: 'missing', quantity: 1 }]).error, /Select a product/);
  assert.match(selectSaleItems(inventory, [{ productId: 'item-1', quantity: 21 }]).error, /only 20 units/);
  assert.match(selectSaleItems(inventory, [{ productId: 'item-1', quantity: 0 }]).error, /Check stock levels/);
  assert.equal(inventory[0].quantity, 20);
});

test('recording a valid sale retains totals, invoices and stock deduction', () => {
  const db = { inventory: [product()], sales: [] };
  const selection = selectSaleItems(db.inventory, [{ productId: 'item-1', quantity: '3' }]);
  assert.equal(selection.error, '');
  const details = { customer: 'Client', phone: '08000000000', payment: 'Cash', date: '2026-10-04' };
  const sale = recordSale(db, details, selection.items, 'sale-1', '2026-10-04T10:00:00.000Z');
  assert.equal(sale.total, 3000);
  assert.equal(sale.items[0].total, 3000);
  assert.equal(db.inventory[0].quantity, 17);
  assert.equal(db.sales[0], sale);
  assert.match(sale.invoice, /^RT-\d{4}-0001$/);
});

test('restock only accepts finite positive quantities', () => {
  const item = product();
  for (const amount of [0, -1, NaN, Infinity]) assert.equal(restockItem(item, amount), false);
  assert.equal(item.quantity, 20);
  assert.equal(restockItem(item, 5, '2026-10-05'), true);
  assert.equal(item.quantity, 25);
  assert.equal(item.stockedDate, '2026-10-05');
});

test('overview aggregates dates and reorder thresholds consistently', () => {
  const db = { inventory: [{ ...product(), quantity: 10 }], sales: [{ date: '2026-10-04', total: 3000 }, { date: '2026-10-01', total: 1000 }, { date: '2026-09-01', total: 9000 }] };
  const overview = getOverview(db, new Date('2026-10-04T12:00:00Z'));
  assert.equal(overview.todayTotal, 3000);
  assert.equal(overview.monthTotal, 4000);
  assert.equal(overview.units, 10);
  assert.equal(overview.low.length, 1);
});

test('CSV keeps headers, Unicode, quotes and line breaks', () => {
  assert.equal(serializeCsv([['a,b', '"quoted"', null], ['₦', 2, 'x']]), '"a,b","""quoted""",""\r\n"₦","2","x"');
  assert.equal(inventoryRows([product()])[1][2], '2026-10-04');
  assert.equal(salesRows([{ invoice: 'RT-1', items: [{ name: 'Pipe', quantity: 3 }], total: 3000 }])[1][5], 'Pipe x3');
  assert.equal(escapeHtml('<script>"&'), '&lt;script&gt;&quot;&amp;');
});

test('admin API uses same-origin credentials and the original endpoints', async () => {
  const requests = [];
  const api = createAdminApi(async (path, options) => { requests.push({ path, options }); return Response.json({ ok: true }); });
  await api.session();
  await api.login({ email: 'test@example.com', password: 'test-only' });
  await api.sync({ inventory: [], sales: [] });
  await api.pull();
  await api.logout();
  assert.deepEqual(requests.map(r => r.path), ['/api/auth/session', '/api/auth/login', '/api/admin/sync', '/api/admin/sync', '/api/auth/logout']);
  assert.ok(requests.every(r => r.options.credentials === 'same-origin'));
  assert.equal(requests[0].options.body, undefined);
  assert.equal(JSON.parse(requests[1].options.body).email, 'test@example.com');
  assert.equal(requests[3].options.method, 'GET');
  assert.equal(requests[3].options.body, undefined);
});

test('admin API preserves HTTP error messages and status', async () => {
  const api = createAdminApi(async () => Response.json({ error: 'Session expired' }, { status: 401 }));
  await assert.rejects(api.session(), error => error.status === 401 && error.message === 'Session expired');
});

test('merged sale discounts retain the main-branch schema and net totals', () => {
  const db = { inventory: [product()], sales: [] };
  const { items, error } = selectSaleItems(db.inventory, [{ productId: 'item-1', quantity: 3, discountPercent: '10' }]);
  assert.equal(error, '');
  assert.equal(items[0].discountPercent, 10);
  assert.equal(items[0].discountAmount, 300);
  assert.equal(items[0].total, 2700);
  const sale = recordSale(db, { customer: 'Client' }, items);
  assert.equal(sale.subtotal, 3000);
  assert.equal(sale.discountTotal, 300);
  assert.equal(sale.total, 2700);
  assert.equal(db.inventory[0].quantity, 17);
  const rows = salesRows([sale]);
  assert.equal(rows[0][6], 'Discount');
  assert.equal(rows[1][5], 'Pipe x3 (10% off)');
  assert.equal(rows[1][6], 300);
  assert.equal(rows[1][7], 2700);
});

test('discounts default to zero and stay within the original 0–100 percent range', () => {
  assert.equal(saleLineAmounts(3, 1000).total, 3000);
  assert.equal(saleLineAmounts(3, 1000, -10).discountPercent, 0);
  assert.equal(saleLineAmounts(3, 1000, 120).total, 0);
  assert.equal(saleLineAmounts(3, 1000, 2.5).total, 2925);
  assert.equal(salesRows([{ invoice: 'old', items: [{ name: 'Pipe', quantity: 1 }], total: 1000 }])[1][6], 0);
});

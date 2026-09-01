const { readBody, requireOwner, sendJson } = require('../_admin-auth');

function text(value, maxLength) {
  return String(value == null ? '' : value).trim().slice(0, maxLength);
}

function numeric(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function inventory(items) {
  return (Array.isArray(items) ? items : []).slice(0, 500).map((item) => ({
    id: text(item.id, 64), name: text(item.name, 120), sku: text(item.sku, 64), stockedDate: text(item.stockedDate, 10),
    quantity: numeric(item.quantity), reorderAt: numeric(item.reorderAt), cost: numeric(item.cost), price: numeric(item.price),
  }));
}

function sales(records) {
  return (Array.isArray(records) ? records : []).slice(0, 1000).map((sale) => ({
    id: text(sale.id, 64), invoice: text(sale.invoice, 64), customer: text(sale.customer, 160), phone: text(sale.phone, 48),
    payment: text(sale.payment, 48), date: text(sale.date, 10), createdAt: text(sale.createdAt, 40), total: numeric(sale.total),
    items: (Array.isArray(sale.items) ? sale.items : []).slice(0, 100).map((item) => ({ name: text(item.name, 120), quantity: numeric(item.quantity), price: numeric(item.price), total: numeric(item.total) })),
  }));
}

module.exports = async function sync(req, res) {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed.' });
  if (!requireOwner(req, res)) return;
  const endpoint = process.env.SHEETS_WEB_APP_URL;
  const secret = process.env.SHEETS_SYNC_SECRET;
  if (!endpoint || !secret || !/^https:\/\/script\.google\.com\//.test(endpoint)) return sendJson(res, 503, { error: 'Protected spreadsheet sync is not configured.' });
  try {
    const body = readBody(req);
    const response = await fetch(endpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, inventory: inventory(body.inventory), sales: sales(body.sales), syncedAt: new Date().toISOString() }),
    });
    if (!response.ok) return sendJson(res, 502, { error: 'Google Sheets rejected the sync request.' });
    return sendJson(res, 200, { ok: true });
  } catch (_) {
    return sendJson(res, 502, { error: 'Could not reach the spreadsheet sync service.' });
  }
};

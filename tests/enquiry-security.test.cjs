const test = require('node:test');
const assert = require('node:assert/strict');
const { createLoader } = require('../scripts/ts-test-loader.cjs');

test('SMTP uses TLS, a fixed recipient, plain text and in-memory attachments', async () => {
  let options, message, closed = false;
  const load = createLoader({ nodemailer: { createTransport: config => {
    options = config;
    return { sendMail: async mail => { message = mail; return { accepted: ['info@ruachdredging.com'], rejected: [] }; }, close: () => { closed = true; } };
  } } });
  const { deliverQuote } = load('lib/quote/delivery.ts');
  await deliverQuote({ data: { name: '<img src=x onerror=alert(1)>', email: 'client@example.com', projectType: 'Not sure yet', recipient: 'attacker@example.com' }, attachment: new File(['%PDF-content'], 'brief.pdf', { type: 'application/pdf' }) }, {
    smtp: { host: 'smtp.example.com', port: '587', user: 'info@ruachdredging.com', password: 'test-not-a-real-secret' },
  });
  assert.equal(message.to, 'info@ruachdredging.com');
  assert.equal(message.from.address, 'info@ruachdredging.com');
  assert.equal(message.replyTo, 'client@example.com');
  assert.equal(message.html, undefined);
  assert.equal(message.attachments[0].content.toString(), '%PDF-content');
  assert.equal(options.requireTLS, true);
  assert.equal(options.tls.rejectUnauthorized, true);
  assert.equal(options.disableFileAccess, true);
  assert.equal(options.disableUrlAccess, true);
  assert.equal(closed, true);
});

test('SMTP never reports acceptance when unconfigured, rejected or unavailable', async () => {
  const load = createLoader({ nodemailer: { createTransport: () => ({ sendMail: async () => ({ accepted: [], rejected: ['info@ruachdredging.com'] }), close() {} }) } });
  const { deliverQuote } = load('lib/quote/delivery.ts');
  const submission = { data: { projectType: 'Not sure yet' }, attachment: null };
  await assert.rejects(deliverQuote(submission, { smtp: {} }), error => error.status === 503);
  const smtp = { host: 'smtp.example.com', port: '465', user: 'user', password: 'test' };
  await assert.rejects(deliverQuote(submission, { smtp: { ...smtp, port: '25' } }), error => error.status === 503);
  await assert.rejects(deliverQuote(submission, { smtp }), error => error.status === 502);
});

test('submission limiter expires client limits and enforces a global backstop', () => {
  const { createQuoteLimiter } = createLoader()('lib/quote/rate-limit.ts');
  const limit = createQuoteLimiter();
  for (let i = 0; i < 5; i++) assert.equal(limit('one-client', 1000), 0);
  assert.equal(limit('one-client', 1000), 900);
  assert.equal(limit('one-client', 901001), 0);
  const global = createQuoteLimiter();
  for (let i = 0; i < 60; i++) assert.equal(global('client-' + i, 1000), 0);
  assert.equal(global('another-client', 1000), 60);
});

test('file signatures reject executable content renamed as allowed documents', async () => {
  const { verifyQuoteAttachment } = createLoader()('lib/quote/attachment.ts');
  assert.equal(await verifyQuoteAttachment(new File(['%PDF-1.7'], 'brief.pdf')), true);
  assert.equal(await verifyQuoteAttachment(new File(['MZ executable'], 'brief.pdf')), false);
  assert.equal(await verifyQuoteAttachment(new File(['<html>'], 'site.png')), false);
  assert.equal(await verifyQuoteAttachment(new File([new Uint8Array([0xff, 0xd8, 0xff])], 'site.jpg')), true);
});

test('quote route rejects cross-site requests without an Origin header', async () => {
  const { POST } = createLoader()('app/api/quote/route.ts');
  const result = await POST(new Request('https://www.ruachdredging.com/api/quote', { method: 'POST', headers: { 'Sec-Fetch-Site': 'cross-site' } }));
  assert.equal(result.status, 403);
});

test('public indexing URLs use the live canonical host', () => {
  const load = createLoader();
  const { company } = load('content/company.ts');
  assert.deepEqual(Array.from(company.phones), ['+2348069817999']);
  assert.equal(company.email, 'info@ruachdredging.com');
  assert.equal(load('app/robots.ts').default().sitemap, 'https://www.ruachdredging.com/sitemap.xml');
  for (const entry of load('app/sitemap.ts').default()) {
    assert.ok(entry.url.startsWith('https://www.ruachdredging.com'));
    assert.equal(entry.lastModified, undefined);
  }
});

import type { QuoteSubmission } from './validation';
import { createTransport } from 'nodemailer';
import { Buffer } from 'node:buffer';
import { company } from '@/content/company';

export interface QuoteDeliveryConfig {
  url?: string;
  secret?: string;
  smtp?: { host?: string; port?: string; user?: string; password?: string; from?: string };
}
export class QuoteDeliveryError extends Error {
  constructor(public readonly status: 502 | 503 | 504) {
    super(status === 503 ? `Enquiry delivery is currently unavailable. Please email ${company.email}, call or WhatsApp Ruach.` : `Delivery could not be confirmed. Please email ${company.email}, call or WhatsApp Ruach before retrying.`);
  }
}

// A 2xx acknowledgement means the configured service accepted the enquiry,
// not that an email reached an inbox. Never simulate success in preview mode.
export async function deliverQuote(submission: QuoteSubmission, config: QuoteDeliveryConfig, fetchRequest: typeof fetch = fetch) {
  if (config.smtp) {
    const { host, port, user, password } = config.smtp;
    const from = config.smtp.from || company.email;
    if (!host || !user || !password || !['465', '587'].includes(port || '') || !/^[^\s@<>]+@ruachdredging\.com$/i.test(from)) throw new QuoteDeliveryError(503);
    const transport = createTransport({
      host, port: Number(port), secure: port === '465', requireTLS: true,
      auth: { user, pass: password }, tls: { minVersion: 'TLSv1.2', rejectUnauthorized: true },
      connectionTimeout: 10_000, greetingTimeout: 10_000, socketTimeout: 20_000,
      disableFileAccess: true, disableUrlAccess: true,
    });
    try {
      const info = await transport.sendMail({
        from: { name: 'Ruach Dredging Website', address: from },
        to: company.email,
        replyTo: submission.data.email || undefined,
        subject: `Website enquiry: ${submission.data.projectType}`,
        text: ['A new project enquiry was submitted through www.ruachdredging.com.', '',
          ...Object.entries(submission.data).filter(([key]) => key !== 'consent').map(([key, value]) => `${key}: ${value}`),
          '', 'Volume is in m³; pipeline distance is in metres.', 'Treat attachments as untrusted. Scan before opening.',
        ].join('\n'),
        attachments: submission.attachment ? [{
          filename: submission.attachment.name.replace(/[\\/\x00-\x1f\x7f]/g, '_'),
          content: Buffer.from(await submission.attachment.arrayBuffer()),
          contentType: submission.attachment.type || 'application/octet-stream',
          contentDisposition: 'attachment',
        }] : [],
        disableFileAccess: true, disableUrlAccess: true,
      });
      if (!info.accepted.some(address => String(address).toLowerCase() === company.email) || info.rejected.length) throw new QuoteDeliveryError(502);
      return;
    } catch (error) {
      if (error instanceof QuoteDeliveryError) throw error;
      throw new QuoteDeliveryError(502);
    } finally { transport.close(); }
  }
  let url: URL;
  try {
    url = new URL(config.url || '');
    if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Invalid destination');
  } catch { throw new QuoteDeliveryError(503); }
  const body = new FormData();
  body.set('payload', JSON.stringify({ type: 'ruach_quote_request', version: 1, recipient: company.email, data: submission.data, units: { volume: 'm³', pipelineDistance: 'm' }, attachment: submission.attachment ? { name: submission.attachment.name, size: submission.attachment.size, type: submission.attachment.type } : null }));
  if (submission.attachment) body.set('attachment', submission.attachment, submission.attachment.name.replace(/[\\/\r\n]/g, '_'));
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    const response = await fetchRequest(url.href, { method: 'POST', headers: config.secret ? { Authorization: `Bearer ${config.secret}` } : {}, body, signal: controller.signal, redirect: 'error', cache: 'no-store' });
    if (!response.ok) throw new QuoteDeliveryError(502);
  } catch (error) {
    if (error instanceof QuoteDeliveryError) throw error;
    throw new QuoteDeliveryError(controller.signal.aborted ? 504 : 502);
  } finally { clearTimeout(timeout); }
}

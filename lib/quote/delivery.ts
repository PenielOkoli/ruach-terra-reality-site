import type { QuoteSubmission } from './validation';

export interface QuoteDeliveryConfig { url?: string; secret?: string }
export class QuoteDeliveryError extends Error {
  constructor(public readonly status: 502 | 503 | 504) {
    super(status === 503 ? 'Quote delivery is not configured. Please call or WhatsApp Ruach.' : 'Delivery could not be confirmed. Please call or WhatsApp Ruach before retrying.');
  }
}

// A 2xx acknowledgement means the configured service accepted the enquiry,
// not that an email reached an inbox. Never simulate success in preview mode.
export async function deliverQuote(submission: QuoteSubmission, config: QuoteDeliveryConfig, fetchRequest: typeof fetch = fetch) {
  let url: URL;
  try {
    url = new URL(config.url || '');
    if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Invalid destination');
  } catch { throw new QuoteDeliveryError(503); }
  const body = new FormData();
  body.set('payload', JSON.stringify({ type: 'ruach_quote_request', version: 1, data: submission.data, units: { volume: 'm³', pipelineDistance: 'm' }, attachment: submission.attachment ? { name: submission.attachment.name, size: submission.attachment.size, type: submission.attachment.type } : null }));
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

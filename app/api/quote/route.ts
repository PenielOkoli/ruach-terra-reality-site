import { NextResponse } from "next/server";
import { validateQuote } from "@/lib/quote/validation";
import { deliverQuote, QuoteDeliveryError } from "@/lib/quote/delivery";
import { readQuoteForm } from '@/lib/quote/request';
import { quoteLimiter, quoteIngressLimiter, quoteClientKey } from '@/lib/quote/rate-limit';
import { verifyQuoteAttachment } from '@/lib/quote/attachment';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const origin = request.headers.get('origin');
    if (request.headers.get('sec-fetch-site') === 'cross-site' || (origin && origin !== new URL(request.url).origin)) return NextResponse.json({ error: 'Please submit using the Ruach website.' }, { status: 403 });
    const clientKey = quoteClientKey(request);
    const ingressRetry = quoteIngressLimiter(clientKey);
    if (ingressRetry) return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429, headers: { 'Retry-After': String(ingressRetry), 'Cache-Control': 'no-store' } });
    let form: FormData;
    try { form = await readQuoteForm(request); }
    catch (error) { return NextResponse.json({ error: error instanceof Error && error.message === 'size' ? 'The upload is too large. Attach a file of 4 MB or smaller.' : 'Please submit a valid enquiry form.' }, { status: error instanceof Error && error.message === 'size' ? 413 : 400 }); }
    const result = validateQuote(form);
    if (!result.ok)
      return NextResponse.json({ error: result.error }, { status: 400 });
    if (result.submission.attachment && !await verifyQuoteAttachment(result.submission.attachment)) return NextResponse.json({ error: 'The attachment does not match its file type. Please use a valid PDF, Word document, PNG or JPEG.' }, { status: 400 });
    const retryAfter = quoteLimiter(clientKey);
    if (retryAfter) return NextResponse.json({ error: 'Too many enquiries. Please wait before trying again, or email info@ruachdredging.com.' }, { status: 429, headers: { 'Retry-After': String(retryAfter), 'Cache-Control': 'no-store' } });
    await deliverQuote(result.submission, process.env.QUOTE_DELIVERY_MODE === 'webhook' ? {
      url: process.env.QUOTE_WEBHOOK_URL,
      secret: process.env.QUOTE_WEBHOOK_SECRET,
    } : {
      smtp: { host: process.env.SMTP_HOST, port: process.env.SMTP_PORT, user: process.env.SMTP_USER, password: process.env.SMTP_PASSWORD, from: process.env.SMTP_FROM },
    });
    return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof QuoteDeliveryError ? error.message : "Unable to process the request right now. Please call or WhatsApp Ruach." },
      { status: error instanceof QuoteDeliveryError ? error.status : 500 },
    );
  }
}

import { NextResponse } from "next/server";
import { validateQuote } from "@/lib/quote/validation";
import { deliverQuote, QuoteDeliveryError } from "@/lib/quote/delivery";
import { readQuoteForm } from '@/lib/quote/request';

export async function POST(request: Request) {
  try {
    const origin = request.headers.get('origin');
    if (origin && origin !== new URL(request.url).origin) return NextResponse.json({ error: 'Please submit using the Ruach website.' }, { status: 403 });
    let form: FormData;
    try { form = await readQuoteForm(request); }
    catch (error) { return NextResponse.json({ error: error instanceof Error && error.message === 'size' ? 'The upload is too large. Attach a file of 5 MB or smaller.' : 'Please submit a valid enquiry form.' }, { status: error instanceof Error && error.message === 'size' ? 413 : 400 }); }
    const result = validateQuote(form);
    if (!result.ok)
      return NextResponse.json({ error: result.error }, { status: 400 });
    await deliverQuote(result.submission, {
      url: process.env.QUOTE_WEBHOOK_URL,
      secret: process.env.QUOTE_WEBHOOK_SECRET,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof QuoteDeliveryError ? error.message : "Unable to process the request right now. Please call or WhatsApp Ruach." },
      { status: error instanceof QuoteDeliveryError ? error.status : 500 },
    );
  }
}

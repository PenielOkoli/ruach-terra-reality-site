import { NextResponse } from "next/server";
import { validateQuote } from "@/lib/quote/validation";
import { deliverQuote } from "@/lib/quote/delivery";

export async function POST(request: Request) {
  try {
    const result = validateQuote(await request.formData());
    if (!result.ok)
      return NextResponse.json({ error: result.error }, { status: 400 });
    await deliverQuote(result.submission, {
      url: process.env.QUOTE_WEBHOOK_URL,
      secret: process.env.QUOTE_WEBHOOK_SECRET,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to process the request right now." },
      { status: 500 },
    );
  }
}

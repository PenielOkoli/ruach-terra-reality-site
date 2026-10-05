import {
  MAX_QUOTE_ATTACHMENT_BYTES,
  quoteRequiredFields,
} from "@/content/quote";

export interface QuoteSubmission {
  data: Record<string, string>;
  attachment: { name: string; size: number; type: string } | null;
}

export type QuoteValidation =
  | { ok: true; submission: QuoteSubmission }
  | { ok: false; error: string };

export function validateQuote(form: FormData): QuoteValidation {
  const data = Object.fromEntries(
    [...form.entries()]
      .filter(
        ([key, value]) => key !== "attachment" && typeof value === "string",
      )
      .map(([key, value]) => [
        key,
        typeof value === "string" ? value.trim().slice(0, 2000) : "",
      ]),
  );
  if (quoteRequiredFields.some((field) => !data[field])) {
    return {
      ok: false,
      error: "Please complete the required project details.",
    };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  const attachment = form.get("attachment");
  if (
    attachment instanceof File &&
    attachment.size > MAX_QUOTE_ATTACHMENT_BYTES
  ) {
    return { ok: false, error: "Attachments must be 5 MB or smaller." };
  }
  return {
    ok: true,
    submission: {
      data,
      attachment:
        attachment instanceof File && attachment.size
          ? {
              name: attachment.name,
              size: attachment.size,
              type: attachment.type,
            }
          : null,
    },
  };
}

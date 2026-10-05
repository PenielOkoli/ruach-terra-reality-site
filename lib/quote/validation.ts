import {
  MAX_QUOTE_ATTACHMENT_BYTES,
  quoteRequiredFields,
  quoteProjectTypes,
} from "@/content/quote";

export interface QuoteSubmission {
  data: Record<string, string>;
  attachment: File | null;
}

export type QuoteValidation =
  | { ok: true; submission: QuoteSubmission }
  | { ok: false; error: string };

export function validateQuote(form: FormData): QuoteValidation {
  const allowedFields = new Set(['name', 'phone', 'location', 'projectType', 'email', 'company', 'volume', 'pipelineDistance', 'timeline', 'message', 'consent']);
  if (form.get('website')) return { ok: false, error: 'Unable to process this request.' };
  const data = Object.fromEntries(
    [...form.entries()]
      .filter(
        ([key, value]) => allowedFields.has(key) && typeof value === "string",
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
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (!/^[+\d\s().-]+$/.test(data.phone) || data.phone.replace(/\D/g, '').length < 7 || data.phone.replace(/\D/g, '').length > 15) {
    return { ok: false, error: 'Please enter a valid phone or WhatsApp number.' };
  }
  if (!(quoteProjectTypes as readonly string[]).includes(data.projectType)) return { ok: false, error: 'Please select a project type.' };
  if (data.consent !== 'on') return { ok: false, error: 'Please agree to being contacted about this enquiry.' };
  for (const field of ['volume', 'pipelineDistance']) {
    if (data[field] && data[field] !== 'Not sure yet' && (!Number.isFinite(Number(data[field])) || Number(data[field]) <= 0)) {
      return { ok: false, error: 'Engineering values must be positive numbers, or choose Not sure yet.' };
    }
  }
  const attachment = form.get("attachment");
  if (
    attachment instanceof File &&
    attachment.size > MAX_QUOTE_ATTACHMENT_BYTES
  ) {
    return { ok: false, error: "Attachments must be 5 MB or smaller." };
  }
  if (attachment instanceof File && attachment.size) {
    const types: Record<string, string> = { pdf: 'application/pdf', doc: 'application/msword', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg' };
    const extension = attachment.name.split('.').pop()?.toLowerCase() || '';
    if (!types[extension] || (attachment.type && attachment.type !== types[extension])) {
      return { ok: false, error: 'Attach a PDF, Word document, PNG or JPEG file.' };
    }
  }
  return {
    ok: true,
    submission: {
      data,
      attachment:
        attachment instanceof File && attachment.size
          ? attachment
          : null,
    },
  };
}

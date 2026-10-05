import { MAX_QUOTE_REQUEST_BYTES } from '@/content/quote';

// Enforce the limit while reading, including requests without Content-Length.
export async function readQuoteForm(request: Request): Promise<FormData> {
  if (!request.headers.get('content-type')?.startsWith('multipart/form-data;')) throw new Error('format');
  if (Number(request.headers.get('content-length')) > MAX_QUOTE_REQUEST_BYTES) throw new Error('size');
  const reader = request.body?.getReader();
  if (!reader) throw new Error('format');
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_QUOTE_REQUEST_BYTES) { await reader.cancel(); throw new Error('size'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return new Response(bytes, { headers: { 'Content-Type': request.headers.get('content-type')! } }).formData();
}

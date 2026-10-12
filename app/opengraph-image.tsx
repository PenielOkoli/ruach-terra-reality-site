import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { socialPreview } from '@/lib/social-preview';

export const alt = socialPreview.alt;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/jpeg';

// Preserve the existing image URL using a build-time, lightweight JPEG.
export default async function OpenGraphImage() {
  const bytes = await readFile(join(process.cwd(), 'public', socialPreview.image));
  return new Response(new Uint8Array(bytes), {
    headers: { 'Content-Type': contentType },
  });
}

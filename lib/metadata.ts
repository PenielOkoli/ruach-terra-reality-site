import type { Metadata } from 'next';
import { company } from '@/content/site';
import { socialPreview } from '@/lib/social-preview';

export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title, description, alternates: { canonical: path },
    openGraph: { type: 'website', locale: 'en_NG', siteName: company.name, title: `${title} | Ruach Dredging`, description, url: path, images: [{ url: socialPreview.image, width: socialPreview.width, height: socialPreview.height, alt: socialPreview.alt, type: 'image/jpeg' }] },
    twitter: { card: 'summary_large_image', title: `${title} | Ruach Dredging`, description, images: [socialPreview.image] },
  };
}

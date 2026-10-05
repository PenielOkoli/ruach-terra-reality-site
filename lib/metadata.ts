import type { Metadata } from 'next';
import { company } from '@/content/site';

export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title, description, alternates: { canonical: path },
    openGraph: { type: 'website', locale: 'en_NG', siteName: company.name, title: `${title} | Ruach Dredging`, description, url: path, images: [{ url: '/logo.png', width: 640, height: 640, alt: 'Ruach Dredging' }] },
    twitter: { card: 'summary_large_image', title: `${title} | Ruach Dredging`, description, images: ['/logo.png'] },
  };
}

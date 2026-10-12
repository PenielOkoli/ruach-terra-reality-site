import type { Metadata } from 'next';
import { company } from '@/content/site';

export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title, description, alternates: { canonical: path },
    openGraph: { type: 'website', locale: 'en_NG', siteName: company.name, title: `${title} | Ruach Dredging`, description, url: path, images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Ruach Dredging — Dredging, Hydraulic Fill and Reclamation in Lagos, Nigeria' }] },
    twitter: { card: 'summary_large_image', title: `${title} | Ruach Dredging`, description, images: ['/opengraph-image'] },
  };
}

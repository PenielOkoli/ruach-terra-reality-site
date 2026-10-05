import type { Metadata } from 'next';
import { Inter, Roboto_Slab } from 'next/font/google';
import './globals.css';
import { Footer, Header, WhatsApp } from '@/components/chrome';
import { company } from '@/content/site';

const body = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const display = Roboto_Slab({ subsets: ['latin'], variable: '--font-display', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://ruachdredging.com'),
  title: { default: 'Ruach Dredging | Dredging, Hydraulic Fill & Reclamation', template: '%s | Ruach Dredging' },
  description: 'Dredging, hydraulic fill and land reclamation for Lagos and Nigeria. Operating focus: Ibeju-Lekki and Epe.',
  keywords: ['dredging company Lagos', 'sand filling Lekki', 'hydraulic fill Nigeria', 'land reclamation Lagos', 'sand dredging Epe', 'Ibeju-Lekki'],
  openGraph: { type: 'website', locale: 'en_NG', siteName: company.name, title: 'Water Moves Possibilities', description: 'Dredging | Hydraulic Fill | Reclamation', images: [{ url: '/logo.png', width: 640, height: 640, alt: 'Ruach Dredging' }] },
  twitter: { card: 'summary_large_image', title: 'Water Moves Possibilities', description: 'Dredging | Hydraulic Fill | Reclamation', images: ['/logo.png'] },
  alternates: { canonical: '/' },
};

const localBusiness = {
  '@context': 'https://schema.org', '@type': ['LocalBusiness', 'Organization'], name: company.name,
  description: 'Dredging, hydraulic fill and land reclamation company in Lagos, Nigeria.', url: 'https://ruachdredging.com', logo: 'https://ruachdredging.com/logo.png',
  address: { '@type': 'PostalAddress', streetAddress: '32 Vover Close, Adiva Plainfield Estate, KM 69 Lekki-Epe Expressway', addressLocality: 'Lagos', addressCountry: 'NG' },
  telephone: company.phones[0], areaServed: 'Nigeria',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${body.variable} ${display.variable}`}><body><Header /><main className="page-shell">{children}</main><Footer /><WhatsApp /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }} /></body></html>;
}

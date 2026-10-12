import type { Metadata } from 'next';
import { Inter, Roboto_Slab } from 'next/font/google';
import './globals.css';
import { Footer, Header, WhatsApp } from '@/components/chrome';
import { company, capabilities } from '@/content/site';

const body = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const display = Roboto_Slab({ subsets: ['latin'], variable: '--font-display', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(company.website),
  title: { default: 'Dredging Company in Lagos, Nigeria | Ruach Dredging', template: '%s | Ruach Dredging' },
  description: 'Ruach Dredging provides hydraulic dredging, sand supply, land reclamation, bathymetric surveys and marine support from Lagos, Nigeria. Contact our team.',
  keywords: ['dredging company Lagos', 'sand filling Lekki', 'hydraulic fill Nigeria', 'land reclamation Lagos', 'sand dredging Epe', 'Ibeju-Lekki'],
  openGraph: { type: 'website', locale: 'en_NG', siteName: company.name, url: '/', title: 'Dredging Company in Lagos, Nigeria | Ruach Dredging', description: 'Hydraulic dredging, sand supply, land reclamation and marine support from Lagos, Nigeria.', images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Ruach Dredging — Water Moves Possibilities' }] },
  twitter: { card: 'summary_large_image', title: 'Ruach Dredging | Lagos, Nigeria', description: 'Dredging, hydraulic fill, sand supply and land reclamation.', images: ['/opengraph-image'] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
  alternates: { canonical: '/' },
};

const localBusiness = {
  '@context': 'https://schema.org', '@type': 'LocalBusiness', '@id': `${company.website}/#company`, name: company.name,
  description: 'Dredging, hydraulic fill and land reclamation company in Lagos, Nigeria.', url: company.website, logo: `${company.website}/logo.png`, image: `${company.website}/opengraph-image`,
  address: { '@type': 'PostalAddress', streetAddress: '32 Vover Close, Adiva Plainfield Estate, KM 69 Lekki-Epe Expressway', addressLocality: 'Lagos', addressRegion: 'Lagos', addressCountry: 'NG' },
  telephone: company.phones[0], email: company.email, areaServed: { '@type': 'Country', name: 'Nigeria' },
  contactPoint: { '@type': 'ContactPoint', telephone: company.phones[0], email: company.email, contactType: 'customer service', availableLanguage: 'English' },
  hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Dredging and marine services', itemListElement: capabilities.map(([, name, description]) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name, description, provider: { '@id': `${company.website}/#company` }, areaServed: 'Nigeria' } })) },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${body.variable} ${display.variable}`}><body><Header /><main className="page-shell">{children}</main><Footer /><WhatsApp /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness).replace(/</g, '\\u003c') }} /></body></html>;
}

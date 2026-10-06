import { pageMetadata } from '@/lib/metadata';
import Link from 'next/link';
import { capabilities } from '@/content/site';
import { PageHero } from '@/components/page-hero';
import { SitePhoto } from '@/components/site-photo';
import { profilePhotos } from '@/content/photography';
import { DetailList, ProfileDetails } from '@/components/profile-details';
import { IndustrialPumpingSection } from '@/components/profile-sections';
import { serviceDetails } from '@/content/profile-details';
import { companyPhotos } from '@/content/company-media';
import { CompanyFieldFilms } from '@/components/company-field-films';

const photos = [
  companyPhotos.aerial,
  profilePhotos.pipeline,
  profilePhotos.coastalProtection,
  profilePhotos.routeReference,
  profilePhotos.excavator,
  companyPhotos.mobilisation,
] as const;

export default function Services() { return <><PageHero eyebrow="Services" title="Dredging, hydraulic fill and land reclamation." copy="Source development, marine works and hydraulic placement, with industrial pumping and dewatering support." />
  <nav className="service-index sticky z-30 border-b border-line bg-white"><div className="container flex gap-5 overflow-x-auto py-4 text-xs font-bold whitespace-nowrap">{capabilities.map(([, title], index) => <a key={title} href={`#service-${index + 1}`} className="hover:text-rust">{title}</a>)}</div></nav>
  <section className="section-white">{capabilities.map(([number, title, copy], index) => { const photo = photos[index]; return <article id={`service-${index + 1}`} key={title} className={`${index % 2 ? 'section-paper' : 'section-white'} scroll-mt-40`}><div className="container grid gap-8 py-16 lg:grid-cols-[.75fr_1.25fr] lg:gap-16 lg:py-24"><SitePhoto src={photo.src} alt={photo.alt} fit={index === 3 || index === 5 ? 'contain' : 'cover'} className={`${index % 2 ? 'lg:order-2' : ''} [&_.photo-frame]:h-[310px] lg:[&_.photo-frame]:h-[430px] ${index === 3 ? 'photo-map' : ''} `} /><div className="lg:self-center"><p className="section-label">Service {number}</p><h2 className="section-title !text-[clamp(2rem,4vw,3.8rem)]">{title}</h2><p className="section-intro">{copy}</p><div className="mt-5"><ProfileDetails title="View service details"><DetailList items={serviceDetails[index]} /></ProfileDetails></div><Link href="/contact" className="btn btn-outline mt-7">Discuss this service</Link></div></div></article>; })}</section>
  <CompanyFieldFilms />
  <IndustrialPumpingSection />
  <section className="section section-dark"><div className="container grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end"><div><p className="section-label">Project enquiry</p><h2 className="section-title">Send the site location and approximate volume.</h2></div><Link href="/contact" className="btn btn-light">Request a quote</Link></div></section></>; }
export const metadata = pageMetadata("Dredging & Sand Supply Services", "Hydraulic dredging, reclamation, sand supply, surveys and marine support in Lagos, Nigeria.", '/services');

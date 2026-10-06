import { pageMetadata } from '@/lib/metadata';
import { FleetExplorer } from '@/components/fleet-explorer';
import { PageHero } from '@/components/page-hero';
import { SitePhoto } from '@/components/site-photo';
import { profilePhotos } from '@/content/photography';
import { FleetProfileDetails } from '@/components/profile-sections';
import { companyPhotos } from '@/content/company-media';
import { EquipmentGallery } from '@/components/equipment-gallery';
import { ManufacturerEquipment } from '@/components/manufacturer-equipment';

export default function Fleet() { return <><PageHero eyebrow="Fleet and production" title="Dredging, pumping and pipeline equipment." copy="A working register of the principal units used in dredging, hydraulic fill and reclamation planning." />
  <section className="section section-white"><div className="container"><div className="grid gap-10 border-b border-line pb-10 lg:grid-cols-[1fr_.85fr] lg:items-end"><div><p className="section-label">Equipment register</p><h2 className="section-title">The main system is in the field.</h2></div><p className="text-base leading-7 text-clay">Submersible dredgers, hopper fleet, booster pumping, HDPE pipeline and support plant are coordinated around the project requirement.</p></div><div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_.9fr]"><SitePhoto src={companyPhotos.field.src} alt={companyPhotos.field.alt} fit="contain" className="[&_.photo-frame]:h-[510px]" /><div className="self-end"><SitePhoto src={profilePhotos.pipeStock.src} alt={profilePhotos.pipeStock.alt} className="[&_.photo-frame]:h-[245px]" /><SitePhoto src={profilePhotos.barge.src} alt={profilePhotos.barge.alt} className="mt-8 [&_.photo-frame]:h-[245px]" /></div></div><div className="mt-16"><FleetExplorer /></div></div></section>
  <section className="section section-paper"><div className="container grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-center"><div><p className="section-label">Supporting fleet</p><h2 className="section-title !text-4xl">Marine and earthworks support.</h2><p className="section-intro">Tugboats, workboats, welding and anchor barges, 20–25 t excavators, D6–D8 bulldozers and vibro-compactors support the dredging and placement system.</p></div><SitePhoto src={profilePhotos.excavator.src} alt={profilePhotos.excavator.alt} className="[&_.photo-frame]:h-[390px]" /></div></section>
  <section className="section section-white"><div className="container grid gap-12 lg:grid-cols-[1.1fr_.9fr] lg:items-center"><SitePhoto src={profilePhotos.shoreDischarge.src} alt={profilePhotos.shoreDischarge.alt} fit="contain" className="[&_.photo-frame]:h-[460px] lg:[&_.photo-frame]:h-[580px]" /><div><p className="section-label">Hydraulic placement</p><h2 className="section-title">From pipeline to placement.</h2><p className="section-intro">Discharge arrangements follow the source material, pipeline route and placement area.</p></div></div></section>
  <EquipmentGallery />
  <ManufacturerEquipment />
  <section className="section section-white"><div className="container grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-center"><div><p className="section-label">Dredger deck</p><h2 className="section-title">Suction pipe and lifting assembly.</h2><p className="section-intro">Deck-mounted pipework and handling gear.</p></div><SitePhoto src={companyPhotos.deck.src} alt={companyPhotos.deck.alt} fit="contain" className="equipment-deck-photo" /></div></section>
  <FleetProfileDetails /></>; }
export const metadata = pageMetadata("Fleet & Equipment Register", "Explore Ruach’s dredgers, HDPE pipeline, core pumping systems and fleet register.", '/fleet');

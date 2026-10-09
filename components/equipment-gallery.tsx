import { SitePhoto } from '@/components/site-photo';
import { equipmentGallery } from '@/content/company-media';

export function EquipmentGallery() {
  return <section className="section section-paper"><div className="container">
    <p className="section-label">Equipment in view</p><h2 className="section-title">From pump intake to working pontoon.</h2>
    <div className="equipment-gallery">{equipmentGallery.map(item => <article key={item.src}>
      <SitePhoto src={item.src} alt={item.alt} fit="cover" frame="fixed" sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1416px) 30vw, 420px" className="equipment-photo" />
      <h3>{item.title}</h3><p>{item.description}</p>
    </article>)}</div>
  </div></section>;
}

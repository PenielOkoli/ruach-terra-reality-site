import { SitePhoto } from '@/components/site-photo';
import { manufacturerEquipment } from '@/content/manufacturer-media';

export function ManufacturerEquipment() {
  return (
    <section className="section section-paper manufacturer-equipment" aria-labelledby="manufacturer-heading">
      <div className="container">
        <p className="section-label">Manufacturer references</p>
        <h2 id="manufacturer-heading" className="section-title">Pump systems, in detail.</h2>
        <p className="section-intro">Equipment-type examples, not identified Ruach-owned units or models in the register.</p>
        <div className="manufacturer-groups">
          {manufacturerEquipment.map(group => (
            <article key={group.id} aria-labelledby={group.id}>
              <h3 id={group.id}>{group.title}</h3>
              <p>{group.description}</p>
              <div className="manufacturer-photo-grid">
                {group.photos.map(photo => (
                  <SitePhoto key={photo.src} src={photo.src} alt={photo.alt} fit="cover" frame="fixed"
                    sizes="(max-width: 540px) calc(100vw - 40px), (max-width: 767px) 500px, (max-width: 1136px) calc((100vw - 136px) / 2), 500px"
                    className="manufacturer-photo" />
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

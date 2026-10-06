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
                  <SitePhoto key={photo.src} src={photo.src} alt={photo.alt} fit="contain"
                    sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1416px) calc((100vw - 128px) / 2), 644px"
                    className={`manufacturer-photo ${group.id === 'submersible-assemblies' ? 'manufacturer-photo-portrait' : 'manufacturer-photo-landscape'}`} />
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

import { FieldClip } from '@/components/field-clip';
import { SitePhoto } from '@/components/site-photo';
import { fieldClips } from '@/content/company-media';

export function CompanyFieldFilms() {
  return <section className="section section-paper"><div className="container">
    <p className="section-label">On site</p><h2 className="section-title">See the work in motion.</h2>
    <div className="field-films-grid">
      {Object.values(fieldClips).map(clip => <FieldClip key={clip.id} clip={clip}>
        <SitePhoto src={clip.poster.src} alt={clip.poster.alt} fit="contain" frame="fixed" sizes="(max-width: 479px) calc(100vw - 40px), 352px" className="field-film-poster" />
      </FieldClip>)}
    </div>
  </div></section>;
}

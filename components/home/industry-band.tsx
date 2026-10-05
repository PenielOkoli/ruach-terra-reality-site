import { ResponsivePhoto } from '../responsive-photo';
import { profilePhotos } from '@/content/photography';

export function IndustryBand() {
  return (
    <>
      <section
        className="industry-band"
        aria-label="Company-profile pipeline installation photograph"
      >
        <ResponsivePhoto
          src={profilePhotos.pipeline.src}
          alt={profilePhotos.pipeline.alt}
          sizes="100vw"
          className="object-cover"
        />
      </section>
    </>
  );
}

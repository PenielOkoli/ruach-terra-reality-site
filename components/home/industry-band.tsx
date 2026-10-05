import Image from "next/image";
import { profilePhotos } from '@/content/photography';

export function IndustryBand() {
  return (
    <>
      <section
        className="industry-band"
        aria-label="Company-profile pipeline installation photograph"
      >
        <Image
          src={profilePhotos.pipeline.src}
          alt={profilePhotos.pipeline.alt}
          fill
          unoptimized
          sizes="100vw"
          className="object-cover"
        />
      </section>
    </>
  );
}

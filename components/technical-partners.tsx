import Image from 'next/image';
import { partnerArtwork, technicalPartners } from '@/content/partners';

export function TechnicalPartners() {
  return (
    <section id="technical-partners" aria-labelledby="partners-title" className="section section-paper scroll-mt-24">
      <div className="container">
        <p className="section-label">Technical partners</p>
        <h2 id="partners-title" className="section-title">Our technical network.</h2>
        <p className="section-intro">Partners and equipment brands listed in our company profile.</p>
        <ul className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4" aria-label="Profile-listed technical partners and equipment brands">
          {technicalPartners.map(({ name, crop }) => (
            <li key={name} className="min-w-0">
              <div aria-hidden="true" className="flex h-[150px] items-center justify-center bg-white px-5">
                <div className="relative overflow-hidden" style={{ width: 'min(100%, 190px)', aspectRatio: `${crop.width} / ${crop.height}` }}>
                  <Image
                    src={partnerArtwork.src}
                    alt=""
                    width={partnerArtwork.width}
                    height={partnerArtwork.height}
                    unoptimized
                    style={{
                      position: 'absolute',
                      maxWidth: 'none',
                      width: `${partnerArtwork.width / crop.width * 100}%`,
                      height: 'auto',
                      left: `${-crop.x / crop.width * 100}%`,
                      top: `${-crop.y / crop.height * 100}%`,
                    }}
                  />
                </div>
              </div>
              <p className="mt-5 text-base font-semibold text-ink">{name}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

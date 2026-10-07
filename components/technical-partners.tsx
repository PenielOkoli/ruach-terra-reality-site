import Image from 'next/image';
import { technicalPartners } from '@/content/partners';

export function TechnicalPartners() {
  return (
    <section id="technical-partners" aria-labelledby="partners-title" className="section section-paper scroll-mt-24">
      <div className="container">
        <p className="section-label">Technical partners</p>
        <h2 id="partners-title" className="section-title">Our technical network.</h2>
        <p className="section-intro">Partners and equipment brands identified by the company.</p>
        <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4" aria-label="Technical partners and equipment brands">
          {technicalPartners.map(({ name, src, width, height }) => (
            <li key={name} className="min-w-0">
              <div aria-hidden="true" data-partner-logo className="flex h-[120px] items-center justify-center px-2">
                <div className="flex h-[110px] w-full max-w-[190px] items-center justify-center">
                  <Image
                    src={src}
                    alt=""
                    width={width}
                    height={height}
                    unoptimized
                    style={{
                      width: 'auto',
                      height: 'auto',
                      maxWidth: '100%',
                      maxHeight: '110px',
                      objectFit: 'contain',
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

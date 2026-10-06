import { ResponsivePhoto } from '@/components/responsive-photo';
import { companyPhotos } from '@/content/company-media';
import Link from "next/link";
import { company } from "@/content/site";
import { Fact, Arrow } from "./primitives";

export function Hero() {
  return (
    <>
      <section className="home-hero" aria-labelledby="hero-title">
        <div className="hero-landscape">
          <ResponsivePhoto
            src={companyPhotos.deck.src}
            alt={companyPhotos.deck.alt}
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="section-label">Ruach Dredging · Nigeria</p>
            <h1 id="hero-title" className="display">
              Moving water.
              <br />
              Making land.
            </h1>
            <p>
              Dredging, sand supply and hydraulic fill for coastal development
              in Lagos, Nigeria.
            </p>
            <div className="hero-actions">
              <Link href="/contact" className="btn btn-primary">
                Request a quote <Arrow />
              </Link>
              <Link href="/projects" className="hero-secondary">
                Explore our work <Arrow />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="home-facts" aria-label="Company at a glance">
        <div className="container facts-grid">
          <Fact label="Fleet" value="2 submersible dredgers" />
          <Fact label="Pipeline" value="12–16″ HDPE line" />
          <Fact label="Operating base" value={company.operatingBase} />
          <Fact label="Registration" value={company.rc} />
        </div>
      </section>
    </>
  );
}

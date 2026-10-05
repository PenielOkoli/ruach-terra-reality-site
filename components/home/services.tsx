import Link from "next/link";
import { services } from "@/content/home";
import { profilePhotos } from '@/content/photography';
import { Photo, Arrow, TextLink } from "./primitives";

export function ServicesSection() {
  return (
    <>
      <section className="section section-white home-services">
        <div className="container engineering-grid">
          <div className="service-visual">
            <p className="section-label">01 / Our capabilities</p>
            <h2 className="section-title">
              Built for
              <br />
              the waterfront.
            </h2>
            <Photo
              src={profilePhotos.preparation.src}
              alt={profilePhotos.preparation.alt}
              className="service-photo"
            />
          </div>
          <div className="service-list">
            {services.map(([name, description], index) => (
              <Link href="/services" key={name} className="service-row">
                <span className="service-index">0{index + 1}</span>
                <div>
                  <h3>{name}</h3>
                  <p>{description}</p>
                </div>
                <Arrow />
              </Link>
            ))}
            <TextLink href="/services">All services</TextLink>
          </div>
        </div>
      </section>
    </>
  );
}

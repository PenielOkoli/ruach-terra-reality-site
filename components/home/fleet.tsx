import { Metric, Photo, TextLink } from "./primitives";
import { companyPhotos } from '@/content/company-media';

export function FleetSection() {
  return (
    <>
      <section className="section section-dark home-fleet">
        <div className="container engineering-grid">
          <div className="fleet-copy">
            <p className="section-label">02 / Fleet & equipment</p>
            <h2 className="section-title">
              The right equipment.
              <br />
              One operating team.
            </h2>
            <div className="fleet-metrics">
              <Metric value="10" label="hopper dredgers" />
              <Metric value="14″ / 16″" label="submersible dredgers" />
              <Metric value="2 km" label="HDPE pipeline" />
            </div>
            <TextLink href="/fleet">See the full fleet</TextLink>
          </div>
          <figure className="fleet-visual">
            <Photo
              src={companyPhotos.pontoon.src}
              alt={companyPhotos.pontoon.alt}
              className="fleet-photo photo-contain"
            />
          </figure>
        </div>
      </section>
    </>
  );
}

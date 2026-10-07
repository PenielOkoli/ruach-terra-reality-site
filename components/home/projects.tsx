import Link from "next/link";
import { projects } from "@/content/home";
import { Photo, Arrow, TextLink } from "./primitives";

export function ProjectsSection() {
  return (
    <>
      <section className="section section-paper home-projects">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="section-label">03 / Selected projects</p>
              <h2 className="section-title">Work along the coast.</h2>
            </div>
            <TextLink href="/projects">All projects</TextLink>
          </div>
          <div className="project-grid">
            {projects.map((project) => (
              <Link
                href="/projects"
                key={project.location}
                className="project-card"
              >
                <Photo
                  src={project.image}
                  alt={project.alt}
                  className={`project-photo${'landscape' in project && project.landscape ? ' project-photo-vessel' : ''}`}
                  sizes={'landscape' in project && project.landscape ? '(max-width: 503px) 463px, (max-width: 767px) calc(100vw - 40px), 605px' : undefined}
                />
                <div className="project-copy">
                  <p className="project-location">{project.location}</p>
                  <h3>{project.name}</h3>
                  <div className="project-bottom">
                    <p>
                      <strong>{project.figure}</strong>
                      <span>{project.unit}</span>
                    </p>
                    <Arrow />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

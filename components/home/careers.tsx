import Link from "next/link";
import { careerRoles } from "@/content/careers";
import { Arrow, TextLink } from "./primitives";

export function CareersSection() {
  return (
    <section id="careers" className="section section-white" aria-labelledby="careers-title">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="section-label">06 / Careers</p>
            <h2 id="careers-title" className="section-title">Build your career with Ruach.</h2>
            <p className="section-intro">
              Explore opportunities in site supervision, marine operations,
              administration and equipment maintenance.
            </p>
          </div>
          <TextLink href="/careers">Explore careers</TextLink>
        </div>
        <ul className="career-role-list mt-10 grid gap-x-10 md:grid-cols-2">
          {careerRoles.map((role) => (
            <li key={role.id} className="border-b border-line">
              <Link
                href={`/careers#${role.id}`}
                className="flex items-center justify-between gap-6 py-5 text-navy hover:text-rust"
              >
                <span className="font-display text-lg">{role.title}</span>
                <span className="shrink-0"><Arrow /></span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

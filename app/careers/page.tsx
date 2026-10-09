import { PageHero } from "@/components/page-hero";
import { Arrow } from "@/components/home/primitives";
import { careerRoles } from "@/content/careers";
import { company } from "@/content/company";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Careers",
  "Explore careers at Ruach Dredging in site supervision, administration, marine operations, sand field operations and equipment maintenance.",
  "/careers",
);

export default function Careers() {
  return (
    <>
      <PageHero
        eyebrow="Careers at Ruach"
        title="Good work starts with good people."
        copy="Explore opportunities across our site, marine and support teams. Find the role that matches your experience."
      />
      <section className="section section-white" aria-labelledby="roles-title">
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:gap-16">
            <aside>
              <p className="section-label">Join the team</p>
              <h2 id="roles-title" className="section-title !text-4xl">Career opportunities.</h2>
              <p className="mt-5 text-sm leading-7 text-clay">
                We welcome interest in the following roles at {company.name}.
              </p>
              <div className="mt-8 border-t-2 border-navy pt-6">
                <h3 className="font-display text-2xl text-navy">How to apply</h3>
                <p className="mt-4 text-sm leading-7 text-clay">
                  Select a role to start an application enquiry on WhatsApp.
                  Include your name, relevant experience and CV, and our team
                  can advise on the next steps.
                </p>
                <p className="mt-4 text-sm leading-7 text-clay">
                  Please specify whether you are applying for level I or II
                  when choosing a Dredge Master or Deckhand role.
                </p>
              </div>
            </aside>
            <ul className="border-t border-line">
              {careerRoles.map((role, index) => (
                <li
                  key={role.id}
                  id={role.id}
                  className="scroll-mt-28 border-b border-line py-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                    <div className="flex items-baseline gap-4">
                      <span aria-hidden="true" className="text-xs text-rust">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-display text-xl text-navy">{role.title}</h3>
                    </div>
                    <a
                      href={`https://wa.me/${company.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello Ruach Dredging, I would like to apply for the ${role.title} role.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Apply for ${role.title} on WhatsApp (opens in a new tab)`}
                      className="text-link !mt-0 shrink-0 self-start sm:self-auto"
                    >
                      Apply on WhatsApp <Arrow />
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

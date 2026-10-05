import Link from "next/link";
import { company } from "@/content/site";
import { Arrow } from "./primitives";

export function ContactSection() {
  return (
    <>
      <section className="section section-paper home-contact">
        <div className="container">
          <p className="section-label">Let’s talk about your site</p>
          <div className="contact-grid">
            <h2 className="section-title">
              Your next project
              <br />
              starts here.
            </h2>
            <div>
              <Link href="/contact" className="btn btn-primary">
                Request a quote <Arrow />
              </Link>
              <div className="contact-numbers">
                <a href={`tel:${company.phones[0]}`}>
                  Call {company.phones[0]}
                </a>
                <a
                  href={`https://wa.me/234${company.whatsapp.slice(1)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp {company.whatsapp} <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

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
                {company.phones.map(number => (
                  <a key={number} href={`tel:${number}`}>Call {number}</a>
                ))}
                <a
                  href={`https://wa.me/${company.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp {company.whatsapp} <span aria-hidden="true">↗</span>
                </a>
                <a href={`tel:${company.directLine}`}>DL {company.directLine}</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

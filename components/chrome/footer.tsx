import Image from "next/image";
import Link from "next/link";
import { company } from "@/content/site";
import { navigationLinks as links } from "@/content/navigation";

export function Footer() {
  return (
    <footer className="bg-[#10233b] pt-16 text-[#f4f1ea]">
      <div className="container grid gap-12 pb-14 md:grid-cols-2 xl:grid-cols-[1.1fr_.7fr_1.2fr]">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              width={54}
              height={54}
              alt="Ruach Dredging logo"
            />
            <p className="font-display text-xl font-bold">RUACH DREDGING</p>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-7 text-slate-300">
            Dredging, hydraulic fill and land reclamation for Lagos and Nigeria.
          </p>
          <a
            href="/ruach-dredging-company-profile.pdf?v=2026-10-09"
            className="mt-6 inline-flex border-b border-[#f4f1ea] pb-1 text-sm font-bold"
          >
            Company profile PDF
          </a>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[.12em] text-[#cdbb9d]">
            Site links
          </p>
          <div className="mt-4 grid gap-3 text-sm text-slate-200">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/about#technical-partners" className="hover:text-white">
              Technical partners
            </Link>
          </div>
        </div>
        <div className="md:col-span-2 xl:col-span-1">
          <p className="text-xs font-bold uppercase tracking-[.12em] text-[#cdbb9d]">
            Office
          </p>
          <div className="mt-4 grid gap-3 text-sm leading-6 text-slate-200">
            <p>{company.address}</p>
            <div className="footer-contact-columns grid grid-cols-[max-content_minmax(0,1fr)] gap-x-4 text-xs sm:text-sm">
              <div className="grid content-start gap-3">
                {company.phones.map(number => (
                  <a className="whitespace-nowrap" key={number} href={`tel:${number}`}>{number}</a>
                ))}
              </div>
              <div className="grid content-start gap-3">
                <a
                  className="whitespace-nowrap"
                  href={`https://wa.me/${company.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp {company.whatsapp}
                </a>
                <a className="whitespace-nowrap" href={`tel:${company.directLine}`}>DL {company.directLine}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="container flex flex-col gap-3 py-5 text-xs text-slate-300 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {company.name}</p>
          <div className="flex flex-wrap gap-5">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

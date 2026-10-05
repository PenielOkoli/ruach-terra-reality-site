"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { navigationLinks as links } from "@/content/navigation";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  return (
    <header className="sticky top-0 z-50 border-b border-[#b9b3a9] bg-[#f4f1ea] text-ink">
      <div className="container site-header-row">
        <Link href="/" className="brand-lockup" onClick={() => setOpen(false)}>
          <Image
            src="/ruach-logo-original.jpg"
            width={64}
            height={64}
            className="brand-logo"
            alt="Ruach Dredging logo"
            preload
          />
          <span>
            RUACH<small>DREDGING LTD.</small>
          </span>
        </Link>
        <nav aria-label="Main navigation" className="desktop-navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link className="btn btn-primary header-quote" href="/contact">
            Request a quote
          </Link>
          <button
            className="mobile-toggle"
            aria-label="Toggle navigation"
            aria-controls="mobile-navigation"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              {open ? (
                <path
                  d="m6 6 12 12M6 18 18 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              ) : (
                <path
                  d="M4 8h16M4 16h16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              )}
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="container mobile-navigation"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="btn btn-primary mt-3"
          >
            Request a quote
          </Link>
        </nav>
      )}
    </header>
  );
}

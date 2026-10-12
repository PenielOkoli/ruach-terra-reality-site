# SEO and security handoff — 12 October 2026

## Code changes

- Canonical host, sitemap and robots now use `https://www.ruachdredging.com`, matching the observed production redirect from the bare domain.
- Location-focused homepage metadata, 1200 × 630 branded sharing image, business/service structured data and optional Search Console verification.
- Sitemap lists public pages without invented per-request modification timestamps. APIs and legacy admin paths are excluded from crawling; the brochure is marked noindex to favour the main website.
- Only `+2348069817999` remains in the marketing pages and updated brochure; contact/application email is `info@ruachdredging.com`.
- SMTP uses TLS with certificate verification, a fixed company recipient, plain-text messages, bounded timeouts and in-memory attachment bytes. No arbitrary file or URL attachment loading; no visitor autoresponder/open relay.
- Form origin/fetch-metadata checks, honeypot, bounded upload reader with timeout, file-extension/MIME/signature checks, consent validation, no-store responses and per-process rate-limit backstop.
- Uploads capped at 4 MB plus 100 KB multipart overhead, below Vercel's 4.5 MB function request limit.
- CSP no longer permits arbitrary HTTPS image, connection or font sources; inline event attributes, frames, objects and base-URL overrides are blocked. COOP and permission restrictions are added; X-Powered-By disabled. The same security headers run on Next.js and Vercel.

## Explicit limitations and remaining production work

1. SMTP credentials must be entered securely in Vercel Environment Variables. No real email was sent during local tests. Do not deploy this change until the provider settings and intended sender are ready. The previous webhook runs only when explicitly selected with `QUOTE_DELIVERY_MODE=webhook`; switching a working production integration without configuration would interrupt form delivery.
2. Per-process request limits do not span serverless instances. Configure a Vercel WAF rate-limit rule for POST `/api/quote` (for example, 5 requests/IP/15 minutes, adjusted for legitimate shared networks) and bot protection. Never expose the development server publicly. On non-Vercel hosts the local backstop deliberately groups untrusted proxy traffic; configure a trusted ingress before scaling.
3. CSP retains script `unsafe-inline` for Next.js static hydration. A fully strict script policy needs a separately tested nonce/dynamic-rendering or build-time hash design. This is layered hardening, not a penetration-test certification or a claim of complete XSS prevention.
4. File signatures are not malware scanning. Scan/quarantine attachments at the mailbox. DOCX ZIP signatures do not prove a safe Word document. Do not open files in a privileged environment.
5. Production dependencies passed `npm audit --omit=dev`. The full toolchain audit reports nine affected dependency entries from two build-time denial-of-service issues (braces and postcss-selector-parser). The braces advisory has no published patch. Do not run untrusted builds or feed visitor content into CSS/glob tooling. Track upstream fixes; no forced Tailwind major migration or Next.js downgrade was performed.
6. Add the domain to Google Search Console, enter a verification token if needed, and submit `https://www.ruachdredging.com/sitemap.xml`. Indexing and ranking are not guaranteed. Configure/verify Google Business Profile separately using approved company information.
7. After release: confirm canonical URLs, social image, robots/sitemap, headers, all contact links and a real form submission with an attachment. Confirm the message is received in the intended inbox, not merely accepted by SMTP. Check spam filtering and provider SPF/DKIM/DMARC configuration without creating conflicting DNS records.
8. Existing Privacy/Terms copy still requires company/legal approval. No unverified retention periods or compliance guarantees were added.

## Verification completed locally

- Reinstalled the committed lockfile with `npm ci`; production build uses Next.js 16.3.8, not a floating newer local version.
- 59 automated tests, TypeScript checking, ESLint and production build passed.
- Production browser checks passed on all ten public pages: unique titles, descriptions, canonical host, contact links, business schema and security headers; no CSP or runtime errors.
- Mobile homepage/contact views had no horizontal overflow. Shared social image and both edited PDF pages were visually inspected.
- Confirmed 403 for cross-origin form submission, 400 for invalid data, 503 for unconfigured SMTP and 429 with Retry-After for throttling. No emails sent and no production submissions made.
- Verified the downloaded PDF matches the updated local asset byte-for-byte. Original brochure is backed up in ignored `artifacts/company-profile-before-2026-10-12.pdf`.
- These changes remain local; no deployment, DNS change, Search Console submission or hosting firewall change was made.

## Reference links

- https://nodemailer.com/smtp
- https://nodemailer.com/message
- https://nextjs.org/docs/app/guides/content-security-policy
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- https://github.com/advisories/GHSA-vfj7-8cjw-p6xm
- https://github.com/advisories/GHSA-rj75-hqrm-r3gf

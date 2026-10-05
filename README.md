# Ruach Dredging website

Photography-led marketing site for RUACH DREDGING NIG LTD. Built with Next.js App Router, TypeScript and Tailwind CSS. Nigerian-industry reference research and image sourcing are recorded in `docs/design-research.md`.

## Run locally

```bash
npm install
npm run dev
```

Open the local address printed by Next.js. Production verification commands:

```bash
npm run lint
npm run typecheck
npm run build
```

## Deploy

Use the standard Next.js build settings on Vercel. Configure and test quote delivery before launch; marketing pages are static by design and Contact needs the server endpoint. Fully static export is not supported by the current quote form.

## Environment variables

Copy `.env.example` to `.env.local` when configuring notifications.

- `QUOTE_WEBHOOK_URL` - required HTTPS endpoint for an email-provider workflow or CRM automation, accepting multipart uploads.
- `QUOTE_WEBHOOK_SECRET` - optional bearer token sent to that endpoint.

Without a valid endpoint, the API returns HTTP 503 and the form offers phone/WhatsApp contact. It never simulates delivery. See [quote delivery setup](docs/quote-delivery.md) for the payload contract, limitations and launch checks.

## Content editing

Primary copy, people, fleet and project data live in `content/site.ts`. Pages and reusable pieces are in `app/` and `components/`. All figures and project details are restricted to the supplied brief.

## Photography and remaining photo needs

The image catalogue is `content/photography.ts`. Native profile assets are in `public/media/profile/`; AI-assisted restorations are in `public/media/enhanced/`. Profile photos use pre-generated WebP derivatives with width-described `srcset` and layout-specific `sizes`; other images use Next's optimizer. Regenerate derivatives with `node scripts/build-responsive-images.cjs` after changing a source. Masters remain unchanged. Restored detail is not unedited photographic evidence. Source associations and limitations are recorded in `docs/profile-photography.md`.

The following still need approved original photography or documents:

- Individual leadership portraits for the management register.
- A verified office pin/map; Contact links to a search for the supplied address, not the unrelated project route map.
- Certificate identity confirmed by the user: RUACH DREDGING NIG LTD, RC 9001841. The profile cover uses a different RC; the site follows the certificate. The extracted certificate is archived locally, not published.
- Independently confirmed project-photo provenance. Slide 7 associates images with Igbolomi, Coastal Road and Epe; those are now matched on the site. No clear matching field photograph was supplied for Bathymetry or Orchid Road. The Lekki–Eleko route map's labels need geographical confirmation. The haulage illustration is not treated as an actual job photo.
- Original high-resolution horizontal Ruach/Nigerian photography. The photo band now uses an enhanced company-profile pipeline scene. The hero retains its free public-domain USACE industry photograph, identified as such in alt text. Visible credits, captions and FIG labels remain removed at the user's request. Source links, authors and usage records remain in `docs/design-research.md`. The existing non-endorsement disclaimer remains on `/terms`; this external image must not be presented as Ruach equipment or a Nigerian project.

The supplied logo is at `public/logo.png`, with its high-resolution company-profile original at `public/ruach-logo-original.jpg`. The supplied company profile is available as `public/ruach-dredging-company-profile.pdf` and is linked throughout the site.

## Content to confirm before launch

- Production domain (replace `https://ruachdredging.com` in metadata, sitemap and schema if different).
- Operational email or CRM/webhook for quote notification.
- Approved leadership portraits, legal registration confirmation, office pin and project-photo provenance.
- Legal review of the Privacy and Terms placeholder pages.


## Code organization

The marketing app and the older owner workspace remain separate applications. This is a structural refactor, not a redesign or a deployment migration.

- `app/`: Next.js route composition, metadata, and HTTP boundaries.
- `content/`: company registers, homepage copy, navigation, quote-field definitions and the shared photography catalogue.
- `components/home/`: one server-rendered component per homepage section.
- `components/chrome/`: interactive client header; server-rendered footer and WhatsApp link.
- `lib/fleet/`: pure production-planning calculation.
- `lib/quote/`: shared validation, browser transport, and server webhook delivery. Only the API route reads webhook environment variables.
- `admin.html`: legacy owner workspace markup; `app.js` only starts it.
- `admin/controller.mjs`: event wiring and workflow orchestration.
- `admin/domain.mjs`: inventory, sales, and overview rules without DOM or network dependencies.
- `admin/storage.mjs`: local-storage adapter, retaining `rt-business-desk-v1` and its record schema.
- `admin/api.mjs`: authenticated requests to the existing legacy `api/` endpoints.
- `admin/view.mjs`, `dom.mjs`, `format.mjs`, `exports.mjs`: rendering, selectors, formatting, and CSV serialization/download.
- `admin/admin.css`: admin presentation overrides, replacing inline styles in markup and invoice templates.
- `tests/`: dependency-free Node test runner; TypeScript uses the already-installed compiler.

Keep data and rules out of views. Keep DOM and HTTP calls out of domain modules. Controllers/routes connect those layers; importing a module must not start a workflow.

The legacy admin requires an HTTP static host that serves ES modules (`.mjs` as JavaScript) and its existing protected Vercel endpoints. Opening `admin.html` using `file://` is not supported. It is not a Next.js route, and the refactor does not change its authentication or hosting model.

## Regression checks

```bash
npm run test
npm run lint
npm run typecheck
npm run build
```

Optional browser smoke tests use `playwright-core` and `@axe-core/playwright` (install locally with `npm install --no-save --package-lock=false playwright-core @axe-core/playwright`). On Windows they use the installed Microsoft Edge. With the Next dev server running on port 3001, run `node scripts/browser-check.cjs` for responsive/accessibility checks. Run `npm run test:admin` for login, inventory, sales, invoice, CSV, restock, and logout checks. The admin test intercepts every request, uses an isolated browser profile, and sends no records or credentials to a live service.

# Launch refinement

## Implemented

- Quote delivery is fail-closed: missing/invalid configuration returns 503, unsuccessful HTTP delivery 502, timeout 504. Multipart forwarding includes the actual uploaded file, with a bounded request body, allowed file extensions/MIME types, server-side consent and required-field checks. Secrets remain server-only. Draft values stay on screen after failure; no automatic retries.
- Name, phone/WhatsApp, location and project type come first. Email, company, engineering values, timeline, brief and attachment are optional in a disclosure. Volume uses m³, pipeline distance metres; project type and numeric engineering fields offer `Not sure yet`.
- Homepage fleet photo grows from five to seven grid columns with its complete composition retained. Tablet layout stacks it. Mobile project-photo height falls from 380px to 260px; section whitespace and motion remain unchanged. Internal case-study photos use contain fit, preserving their full source frame.
- Seven compact case records include location, scope, equipment, quantity and profile-recorded outcome. Three matching photo associations remain on Projects; unmatched records do not receive unrelated images. Source: supplied PowerPoint slides 7–8, reviewed using the Presentations skill. Daily output and pipeline length are not substituted for total deliveries. No client testimonial is fabricated; client names are withheld from register/case-study props pending permission. Original source values remain in `content/site.ts`. The existing downloadable profile is unchanged and still contains its source names.
- Sixteen raster assets have pre-generated WebP derivatives and width-described srcset/sizes. Only delivery resizing/compression was performed; no upscaling, generative changes or original-asset overwrites. The generator and generated manifest are separate from presentation components.
- All eight internal routes have unique title/description, self-referencing canonical, Open Graph URL and share metadata. The domain remains the existing assumed `https://ruachdredging.com`, which the owner must confirm before launch.

## Verification

- 35 unit tests pass, including actual attachment bytes, missing service, HTTP failure, timeout, consent, optional email, invalid parameters, upload bounds, per-route metadata and derivative dimensions.
- TypeScript, ESLint and production build pass.
- Home plus six marketing routes checked at 360, 768, 1280 and 1920px: no overflow, failed images or automated WCAG AA violations. Expanded internal disclosures also pass all four widths. Expanded form passes automated AA checks.
- Browser form tests intercept requests locally: missing-service failure retains values and exposes direct contact links; accepted submission includes actual file bytes and explicit unknown volume. No external enquiry was sent.
- Homepage copy remains 239 words before and after (main visible text, excluding header/footer). Height at 1280px is 5,736px; at 1920px 6,033px, around 6.4–6.7 screens using a 900px viewport.
- Six profile-based homepage images at 360px/1× total 188,900 bytes, versus their previous 1,997,806 bytes: roughly 90.5% less image data for those assets. This excludes hero/logo, scripts/fonts and caching effects; higher-density devices choose larger candidates.
- UI screenshots and machine-readable results are in ignored `artifacts/design-review`, `artifacts/profile-data-review` and `artifacts/launch-refinement`.

## Outstanding owner/provider work

Original camera files have not been supplied. The hero remains the previous public-domain U.S. industry photo with explicit alt-text provenance, rather than relabelling enhanced imagery as original Ruach photography. Upload approved original Ruach files to replace it.

Live delivery requires a provisioned multipart-capable service and destination, end-to-end delivery verification, edge/provider abuse controls, receiver-side attachment scanning/access controls and reviewed privacy/legal notices. See [delivery setup](quote-delivery.md). These are not claims of completed production provisioning.

Project dates, handover evidence, photo provenance and named-client publication permission still require confirmation. Current statuses remain those in the supplied profile.

## Guidance

Image delivery follows [web.dev responsive-image guidance](https://web.dev/articles/serve-responsive-images). Canonical metadata follows [Google Search Central guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), with matching page-specific addresses rather than a shared homepage canonical.

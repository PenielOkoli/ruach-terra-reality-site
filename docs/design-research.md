# Nigerian dredging-site research and redesign

Reviewed 4 October 2026. These are design-reference sites, not sources for Ruach's company claims or photographs. “Stronger” is a design assessment, not a ranking of contractors.

## References

- [B&Q Dredging / Nestoil](https://nestoilgroup.com/b-q-dredging/): separate business, equipment and project pages. Useful equipment specificity and named project evidence; some pages block automated access.
- [Milverton Dredging](https://milvertondredging.com/): prominent dredging/reclamation positioning and downloadable brochure, followed by company overview and services.
- [DammyLand](https://dammyland.com/): direct service-led introduction, project gallery, services and contact information.
- [Surge Forte](https://surgeforte.com/): clear capabilities, fleet/equipment and project navigation; large imagery and location-led engineering identity. Its carousel, many homepage sections and company statistics were not adopted.
- [Harris Dredging](https://harrisdredging.com/): hydraulic reclamation and sand stockpiling identified directly; illustrates the need to edit mission/about copy down.

## Decisions implemented

Retain navy, off-white paper, rust, supplied logo, Inter/Roboto Slab and internal register tables. Replace the dense documentary layout with a landscape-photo hero, restrained large headings, spacious twelve-column composition, numbered service list, distinct navy fleet section, three photographic project links and a short enquiry close. Keep detailed company, fleet, project, process and HSE information on internal routes. No competitor copy, statistics or photography were reused.

## Downloaded external photographs

| Local asset | Photographer | Original | Served source | Rights |
| --- | --- | --- | --- | --- |
| `public/media/industry/river-dredging.jpg` | Janet Meredith, USACE | 4251 × 3010 | 2000 × 1416 DVIDS derivative | [DVIDS public-domain listing](https://www.dvidshub.net/image/8490101/dredge-potter-st-louis-district) |
| `public/media/industry/channel-dredging.jpg` | Patrick Bloodgood, USACE | 5377 × 3542 | 2000-pixel-wide DVIDS derivative | [DVIDS public-domain listing](https://www.dvidshub.net/image/7443818/dredge-under-ravenel) |

At the user's request, visible photo credits, FIG labels and caption text have been removed, along with the public `/photography` credits page and its links. The source/author register above and [DVIDS restrictions](https://www.dvidshub.net/about/copyright) remain in these internal records. Alt text still identifies external images as U.S. industry photographs, not Ruach equipment. The existing non-endorsement disclaimer is retained on `/terms`. Photographs are not retouched; only responsive resizing/cropping occurs.

Wikimedia offered 4K cutter-suction/coastal photographs under CC BY-SA, but image downloads returned HTTP 429. Other official gallery downloads returned access-denied responses. They were not used. Nigerian contractor/editorial galleries lacked a clear reusable licence. A modern, high-resolution Nigerian/Ruach shoot is still the best replacement for illustrative foreign industry imagery; the user requested free assets only, so no stock licence was purchased.

## QA

The 5 October PowerPoint review supersedes the original photo placements below: nine company-profile photographs were restored, three project associations corrected, the industry band replaced with the profile's pipeline scene, and the incorrect Contact map removed. See `profile-photography.md` for the full-deck audit, source files, exact editing prompts and limitations. The external hero photo is unchanged. Historical QA/counts below describe the earlier redesign, not this restoration pass.

`scripts/browser-check.cjs` checks 360, 768, 1280 and 1920 px, screenshot output, failed images, horizontal overflow, homepage words, WCAG A/AA issues and mobile navigation. Requires temporary `playwright-core` and `@axe-core/playwright` and local Edge. Actual results are recorded in `artifacts/design-review/checks.json` when the script completes; do not assume passing results if that file is absent.

Final run completed: all four homepage widths have zero clipped text, horizontal overflow, failed images or automated A/AA violations. About, Services, Fleet, Projects, Quality/HSE, Contact and Photography also passed mobile overflow and automated A/AA checks. Mobile navigation opened, closed and navigated to `/fleet`. Wide register regions are keyboard-focusable and labelled. Screenshots were inspected, including mobile, tablet and desktop hero composition; automated checks are not a substitute for a complete manual accessibility audit.

Lint, TypeScript and production build passed. At a 900-pixel viewport height, desktop document height is 5849 px at 1280 wide and 6103 px at 1920 wide: approximately 6.5–6.8 screens including header/footer.

For this redesign, the reproducible static-text count is **205 before / 268 after** for homepage main content only, excluding shared header/footer. The additional words mainly provide section navigation and transparent photograph context/credits; this is not a further word-count reduction. Browser `innerText` counts 270 main-content tokens, or 335 including desktop navigation/footer, because inline text boundaries differ from the static-count method. The saved before-snapshot and `scripts/count-home.cjs` document the comparison.

# Technical partners

Source: slide 11 (“Technical Partners”) of the supplied `RUACH_DREDGING_Company_Profile_Enhanced_Hydraulic_Fill_REVISED.pptx`. Original embedded asset: `ppt/media/image26.png`, 1338 × 1536 pixels.

The slide shows IPR, Atlas Copco, Slurry Sucker and Toyo. On 7 October 2026, the user additionally identified Cummins, Weichai, Bosch and ABB. All eight appear on About under “Technical partners”, described as partners and equipment brands identified by the company. No independent endorsement, certification, exclusivity or current agreement status is claimed.

The source screenshot contains logos, a third-party phone number, social icons and device chrome. The unchanged original remains at `public/media/partners/profile-technical-partners.png`. The UI now uses individual transparent assets rather than CSS windows into that screenshot. Device chrome, third-party contact details and social icons are not displayed.

`content/partners.ts` owns the eight names and final asset dimensions, and retains original source metadata and crop coordinates for provenance. The server component displays two columns on mobile and four on desktop, with proportional logos contained within a maximum 190 × 110-pixel area. There are no white cards or blend-mode tricks. A footer anchor links directly to the section. The homepage section composition remains unchanged.

Hitech and Craneburg remain project clients rather than partners. Circle pumps remains the technical consultant's affiliation in the team register; the deck does not separately list it on the partner slide. No new client or consultant logos are inferred.

## Verification

Unit tests check all eight names, local asset dimensions, alpha transparency, transparent corners and safe SVG markup, as well as the unchanged original profile artwork. `scripts/partners-browser-check.cjs` checks 360, 768, 1280 and 1920-pixel layouts, loaded logos, non-stretched proportions, transparent frames, console errors, overflow, the footer anchor and automated WCAG A/AA results. Screenshots and results are saved to `artifacts/partner-review/`.

Verification on 7 October 2026: all 50 tests pass, TypeScript and ESLint pass, and all four browser widths show eight loaded logos with no overflow, stretched logos, opaque frames, console errors or automated accessibility violations. The footer anchor remains functional.

## Delivered assets and sources

All paths below are relative to the project root.

| Brand | Final file | Source / treatment |
| --- | --- | --- |
| IPR | `public/media/partners/ipr-transparent-v1.png` | Supplied profile crop; built-in background-removal edit; 640 × 391 PNG with alpha. |
| Atlas Copco | `public/media/partners/atlas-copco-transparent-v1.png` | Supplied profile crop; built-in background-removal edit; 640 × 297 PNG with alpha. |
| Slurry Sucker | `public/media/partners/slurry-sucker-transparent-v1.png` | Supplied profile crop; built-in background-removal edit; 648 × 238 PNG with alpha, including a 4-pixel transparent safety border. |
| Toyo | `public/media/partners/toyo-transparent-v1.png` | Supplied profile crop; built-in background-removal edit; 648 × 298 PNG with alpha, including a 4-pixel transparent safety border. |
| Cummins | `public/media/partners/cummins.svg` | Existing vector artwork from [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Cummins_logo.svg); transparent by construction, no AI recreation. |
| Weichai | `public/media/partners/weichai.png` | Unchanged transparent 500 × 168 PNG from the [current official website header](https://en.weichai.com/uiFramework/commonResource/image/2026052421324423669.png). |
| Bosch | `public/media/partners/bosch.svg` | Exact inline SVG extracted from the [official website header](https://www.bosch.com/); transparent by construction, no AI recreation. |
| ABB | `public/media/partners/abb.svg` | Existing vector artwork from [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:ABB_logo.svg); transparent by construction, no AI recreation. |

The four existing raster logos were edited using **built-in image generation/editing**, not the CLI. Generated output alpha was retained; transparent exterior padding was trimmed and deliverables resized to 640 pixels wide. Slurry Sucker and Toyo also have 4-pixel transparent safety borders so their edges do not meet the canvas corners. Original inputs and full-size edited outputs remain in `artifacts/partner-review/` (local review files, not deployed). White text and graphic details inside dark logos were intentionally retained; removing those would damage the artwork.

### Final prompt used for each of the four raster edits

```text
Use case: background-extraction. Asset type: existing partner logo for a company website. Input image is the edit target. Remove ONLY the white rectangular background and white negative space outside/through the logo, making it genuinely transparent. Preserve the exact existing logo geometry, colours, wording, lettering and proportions. Keep white lettering and white graphic details which are part of a dark-filled logo intact, especially Slurry Sucker lettering and impeller details. No redesign, replacement, new text, extra marks, shadows or mockup. Tight clean edges without white halos. Output the single original logo with alpha transparency.
```

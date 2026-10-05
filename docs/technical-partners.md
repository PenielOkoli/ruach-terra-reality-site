# Technical partners

Source: slide 11 (“Technical Partners”) of the supplied `RUACH_DREDGING_Company_Profile_Enhanced_Hydraulic_Fill_REVISED.pptx`. Original embedded asset: `ppt/media/image26.png`, 1338 × 1536 pixels.

The slide shows IPR, Atlas Copco, Slurry Sucker and Toyo. They appear on About under “Technical partners”, with a short statement that the company profile lists these partners and equipment brands. No additional relationships, endorsement, certification, exclusivity, services or current agreement status are claimed.

The source image is a screenshot containing all four logos, a third-party phone number, social icons and device chrome. `components/technical-partners.tsx` renders four CSS viewports into an unchanged local copy at `public/media/partners/profile-technical-partners.png`. This preserves the original logo proportions and colors without AI reconstruction or pixel edits; only the logo regions are visible. The third-party number is not inserted into Ruach's contact information. One shared URL avoids downloading four separate copies.

`content/partners.ts` owns the names, source metadata and viewport coordinates. The server component owns presentation. A footer anchor links directly to the section. The homepage section composition remains unchanged.

Hitech and Craneburg remain project clients rather than partners. Circle pumps remains the technical consultant's affiliation in the team register; the deck does not separately list it on the partner slide. No new client or consultant logos are inferred.

## Verification

All 23 unit tests, ESLint and the production build (including TypeScript) pass. `scripts/partners-browser-check.cjs` checks the section at 360, 768, 1280 and 1920 pixels: all four logos load, no horizontal overflow or off-screen text, and no automated WCAG A/AA violations in the new section. The footer link reaches the correct anchor below the sticky header. Screenshots and results are under `artifacts/partner-review/`. The original artwork is byte-identical to the extracted asset; the homepage composition regression test still passes.

# Company-profile data audit

Source: supplied `RUACH_DREDGING_Company_Profile_Enhanced_Hydraulic_Fill_REVISED.pptx`, 21 slides. All slide text was reviewed against the website catalogue; the relevant native slide renders were inspected. The source PowerPoint, certificate artwork and profile PDF were not modified. No external/OEM verification was performed. Facts below describe the supplied profile, not independently verified current equipment availability, project status or manufacturer approval.

## Corrections and additional information

| Source | Site destination | Change |
| --- | --- | --- |
| Slide 9 certificate; user confirmation | Company catalogue, About, homepage facts, footer, metadata and manifests | Use registered name **RUACH DREDGING NIG LTD** and **RC 9001841**. The cover's RC 8996272 is superseded on the site, not erased from the supplied document. |
| Slide 14 | Fleet / Core systems | All four columns retained. DP-200-12A: 12 in, 160 kW, primary sand/hydraulic fill. DP-50BL: 10 in, Medium duty, secondary fill/stockpiles. DP-75B: 8 in, Medium duty, supplementary/confined dredging. HT006X8: 8 in hydraulic, hydraulic drive, dewatering/dirty-water/support only, not primary abrasive sand dredging. |
| Slide 14 | Fleet / Production planning | Combined DP-200 + DP-50BL + DP-75: 160–350 m³/h; 1,280–2,800 m³ per 8 hours; typical 140–400 m discharge envelope. Source/pipeline trial governs final output. |
| Slides 12, 14 | Fleet / Collapsed configuration notes | Separate the 2 km pipeline inventory from a guaranteed discharge range. Longer booster-assisted reaches require hydraulic modelling. Do not infer a one-to-one mapping between slide 12's 14/16-inch fleet descriptions and slide 14's named systems. |
| Slides 18–21 | Services, Fleet, Quality/HSE, Contact quote types | Add industrial pumping and emergency dewatering, application categories, mobilisation base and package contents. State non-flammable-service restriction and OEM/refinery-HSE conditions; do not imply executed refinery contracts. |
| Slide 19 | Fleet / Collapsed recommended power-unit table | 150–180 HP diesel; variable axial-piston pump; 70 GPM / 265 L/min; 170–190 bar / 2,500–2,800 psi; 350–400 L AW46 reservoir; 10 micron filtration; oil cooler; 1.5-inch pressure/return plus case drain; 8-inch discharge. Engine examples and clean-water commissioning notes retained as profile recommendations, not installed-unit/OEM specifications. |
| Slides 7–8 | Projects register and collapsed records | Add client fields and full scope details. Restore Coastal Road 600–800 m pipeline, Epe 12–16-inch HDPE, Lekki–Eleko 12–14-inch pump system. Correct survey location to Lekki Lagoon and Orchid Road location to Chevron Axis. Keep unnamed clients explicitly unnamed. Status labels are profile-recorded, not current updates. |
| Slides 2–3, 13 | Services / Collapsed details | Source types, deep-borrow descriptions, containment, geotextile/rip-rap, survey deliverables, earthworks and pipeline/marine support tasks. |
| Slides 4, 10, 15 | Quality/HSE / Collapsed controls | Boundary and reserve investigations, applicable laboratory tests, sample custody/ITP, quantity reconciliation, specified PPE, toolbox/SIMOPS controls, turbidity/siltation and spill controls. |
| Slides 4, 6, 16–17 | About / Collapsed delivery arrangements | Execution/handover stages, organisation, leadership qualifications, contracting models and reporting fields. |

## Estimator accuracy

The old calculator imposed an unsupported 6% duration increase per additional kilometre beyond 2 km. No such formula is stated in the PowerPoint. It was removed. Duration arithmetic uses volume divided by the combined 160–350 m³/h planning range and selected shift hours. The default distance is 0.3 km. The UI suppresses numeric duration outside the profile's typical 0.14–0.4 km envelope and requests site assessment instead. Even in-envelope figures are indicative, not a hydraulic design or output commitment.

“Medium duty” is a duty description, not a kW/HP rating. No numeric power was invented for DP-50BL or DP-75B. The older slide 12 fleet entries listing 50HP and 75HP remain as separate entries; model numbers are not silently interpreted as motor ratings.

## Presentation and scope

Navy, off-white paper, rust accents and register-table styling are unchanged. New detailed material sits on internal pages in native collapsed `details` panels. The homepage remains seven sections plus its existing photo band; only the user-confirmed RC changed in its main content. The requested previous hero background and enhanced photos remain intact. Image credits/FIG labels were not reintroduced.

Content and presentation are separated into `content/profile-details.ts`, reusable disclosure/list/table components, and route composition. Commercial capability descriptions are sourced from the deck; no invented certification, client affiliation, equipment ownership or legal verification is added. The original downloadable profile may still contain the old cover RC, so it needs separate correction if the user wants a revised document.

## Verification

All 28 unit tests, ESLint and the production build including TypeScript pass. The homepage regression hash changed only for the certificate RC. Main-content browser word count is unchanged at 239 words.

`scripts/profile-data-check.cjs` checks Fleet, Projects, About, Services and Quality/HSE at 360, 768, 1280 and 1920 pixels, with all new disclosures expanded for accessibility testing: 20 combinations, no failed images, horizontal page overflow, clipped disclosure copy or automated WCAG A/AA violations. Native disclosure keyboard activation works. The core register has four rows/four columns, two Medium-duty entries and the support-pump limitation. The estimator suppresses duration at 1.2 km and restores it at 0.3 km. The certificate name/RC appear on About with no old RC. Results and table screenshots: `artifacts/profile-data-review/`. Automated checks do not replace a complete manual accessibility audit.

The four-column table uses contained horizontal scrolling on narrow screens, with an explicit mobile scroll hint and focusable region. Desktop table layout and a representative mobile capture were visually reviewed.

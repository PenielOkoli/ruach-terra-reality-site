# Manufacturer equipment imagery — 6 October 2026

The user explicitly requested all four supplied factory photographs on the site, with improved quality, then requested removal of the logos. They are included only as equipment-type examples in a separate Manufacturer references section on Fleet. They do not establish Ruach ownership, exact models, capacity, a supplier partnership or completed project evidence. No fleet register or project specifications were changed. Homepage content and photography are unchanged.

## Placement and saved assets

| Supplied JPEG (5 October) | Saved WebP in `public/media/company/` | Placement |
| --- | --- | --- |
| 10.00.31 AM (1) | `manufacturer-submersible-angle-v2.webp` | Submersible pump assemblies |
| 10.00.31 AM (2) | `manufacturer-centrifugal-front-v2.webp` | Diesel-driven dredge pump packages |
| 10.00.31 AM (3) | `manufacturer-diesel-side-v2.webp` | Diesel-driven dredge pump packages |
| 10.00.30 AM | `manufacturer-submersible-front-v2.webp` | Submersible pump assemblies |

Primary manufacturer documentation was checked for equipment-family identification: [submersible pumps with agitators](https://cnslurrypump.com/product/nsq-submersible-sand-slurry-pump-with-stirs/) and [diesel-driven sand pump packages](https://cnslurrypump.com/category/news/). These support the broad labels, not an exact photographed model or a Ruach inventory match. Brand origin is recorded here even though the user requested removal of visible branding. External images were not downloaded; these are the user's supplied files. Publication permission is not independently documented; the company's asset owner should confirm it before wider reuse.

## Image editing

Each file was processed separately with the built-in image-generation tool in edit mode: first a clarity/exposure/resolution enhancement, then the user-requested branding removal. Originals remain untouched in `Downloads/Dredger Photos` and their SHA-256 hashes are in `company-media-inventory.json`. The unused branded enhancement masters are retained in ignored `artifacts/manufacturer-masters/`; only cleaned v2 images are published. AI enhancement cannot recover authentic missing detail. These are presentation references, not engineering inspection evidence.

Final enhancement prompt:

> Use case: precise-object-edit. Asset type: enhanced manufacturer reference photograph for a dredging website. Input image is the edit target, NOT a style reference. Improve this exact compressed photo with restrained noise and compression reduction, clearer edges, balanced exposure and natural colour, increasing resolution to approximately 2K on the long edge. Keep original complete framing and aspect ratio. Preserve equipment geometry, all bolts, flanges, hoses, intake holes, cutter/agitator assemblies, engine parts, crane and suspension cables, all people's identity, position, clothing, warehouse surroundings and markings. MOST IMPORTANT: preserve existing Zidong / ZD Pump branding and the central semi-transparent manufacturer watermark exactly, including its opacity and unclear lettering. Do not remove, replace, redraw or add logos/text. Do not invent model numbers or specifications. Do not add equipment or people. Faithful photographic restoration, not redesign or a new scene.

Asset-specific suffixes:

- `manufacturer-submersible-angle`: Preserve the oblique view of the grey multi-agitator pump assembly, protective intake screen and lifting cables.
- `manufacturer-centrifugal-front`: Preserve the front view of both blue centrifugal pump casings, their circular inlet flanges, engines and orange coupling guards; reduce blown highlights gently without inventing detail.
- `manufacturer-diesel-side`: Preserve the two blue skid-mounted diesel pump packages, engines, orange coupling guards and centrifugal casings in side view.
- `manufacturer-submersible-front`: Preserve the near-frontal view of the grey submersible assembly, circular perforated intake, four surrounding agitator heads and red transport frame.

Final branding-removal prompt, applied to each enhanced image separately:

> Use case: precise-object-edit. Asset type: cleaned manufacturer reference photograph. Input image is the edit target. Remove the entire central manufacturer watermark: the orange/red ZD logo, the pale spiral/rings behind it, and the words ZD PUMP / ZIDONG PUMP. Also remove every small manufacturer logo or brand-name stamp on the pump equipment, and any ZIDONG PUMP lettering on orange coupling guards. Restore the underlying grey metal, perforated intake holes, blue pump/engine surfaces, floor and orange paint naturally, with matching light and texture. Remove manufacturer logos in the background, but leave ordinary room/sign text and safety markings unchanged. Keep the exact original complete framing, aspect ratio, camera perspective, equipment arrangement and photographic detail. Preserve bolts, flanges, holes, cutters, hoses, cables, crane gear, machinery, people, clothing and surroundings. No cropping, no redesigned equipment, no invented labels or new logo. This is only a precise branding/watermark removal; do not change colour grading or reduce resolution. Output only the repaired photograph.

Delivery: `prepare-company-photos.cjs --version=2` converts generated PNGs to WebP without further scene edits; `build-responsive-images.cjs` creates 320/480/768/1024 and native-width candidates without enlargement. All four photographs use contain framing, lazy loading and responsive candidates, with two equipment-group headings and no photo credits or FIG captions. The component and its data are separate modules.

Verification: all 46 unit tests, TypeScript and ESLint pass. The Fleet page was tested in headless Edge at 360, 768, 1280 and 1920px: all four cleaned responsive photos loaded with contain framing, no overlapping photo panels, no horizontal overflow, no browser runtime errors and no automated WCAG AA violations. The desktop section screenshot was visually reviewed. The originals and branded intermediate masters remain available off the published site.

## Subsequent company selection — 6 October 2026

The company marked the submersible front view and centrifugal pump front view for removal from the page. Only `manufacturer-submersible-angle-v2.webp` and `manufacturer-diesel-side-v2.webp` remain in the published gallery, one per equipment group. Each now fills its group's full width with its original proportions and complete equipment framing; responsive `sizes` reflects the wider layout. Removed selections and their responsive files remain in the repository for recoverability but are no longer rendered. No new image generation or equipment changes were made.

After reviewing the full-width result, the company requested smaller images. The equipment groups are now centered and capped at 720px wide, with reduced vertical spacing. Both photos retain their native proportions and shrink to the mobile container; responsive delivery sizes now match the smaller display area.


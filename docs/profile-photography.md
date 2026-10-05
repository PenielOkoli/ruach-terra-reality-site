# PowerPoint photography review

Reviewed all 21 slides of `RUACH_DREDGING_Company_Profile_Enhanced_Hydraulic_Fill_REVISED.pptx`. Extracted all 41 embedded media files (35 raster images, one EMF certificate and five videos) without modifying the presentation. Read-only PowerPoint exports were used to inspect slide layout, including objects outside the visible slide. Originals, slide renders, the XML inventory and video frames remain in `artifacts/profile-review/` locally; that directory is excluded from version control and the public site.

Named source copies are also grouped under `artifacts/profile-review/project-associations/`. Unconfirmed maps, non-survey equipment and unverified illustrations are explicitly named as such; Orchid Road has no separate photograph to extract.

## Project associations

These are associations made by the supplied deck's layout, not independently verified job locations. The website's alt text preserves that distinction.

| Project | Slide / asset | Decision |
| --- | --- | --- |
| Igbolomi–Lekki coastal reclamation | 7 / image16.png | Excavator photo; restored; homepage and project case note |
| Coastal Road subbase supply | 7 / image19.png, media2.mp4 | Barge crew; restored; homepage and project case note. The 600–800 m pipeline figure comes from slide 7. |
| Epe Lagoon stockpiling | 7 / image17.png | Pipeline joint; restored; homepage and project case note |
| Lekki–Eleko perimeter filling | 7 / image18.jpeg | Route reference only. Labels include Third Mainland Bridge/UNILAG; location needs confirmation before presenting it as this project's map. Kept unaltered as a generic route-planning reference on Services, not Contact or a named case study. |
| Lagoon bathymetry | 8 / image21.png, media3.mp4 | Adjacent image depicts pipe-fusion equipment, not a survey. Do not present it as bathymetry photography. No verified survey image supplied. |
| Orchid Road filling | 8 | No separate matching photograph supplied; retain project register entry without inventing one. |
| Lagoon haulage / barge loading | 8 / image20.png | Polished illustrative barge image; provenance as an actual job photo is unconfirmed. Archived, not published as project evidence. |

All seven project records remain available on Projects. The three photographic case notes now use the same central associations as the homepage (`content/photography.ts`), replacing the previously unrelated discharge and HSE images.

## Site assets

Built-in image editing was used for nine AI-assisted restorations. These enhance presentation resolution, but cannot recover authentic missing detail. Fine textures, faces and mechanical details may be reconstructed; never use the outputs for technical inspection or as unedited evidence. Untouched originals are retained. No visible photo credits or FIG labels were reintroduced.

| Original | Source dimensions | Saved asset in `public/media/enhanced/` | Output dimensions | Use |
| --- | --- | --- | --- | --- |
| image16.png | 168 × 299 | igbolomi-excavator-v2.png | 940 × 1672 | Igbolomi, earthworks |
| image19.png | 368 × 656 | coastal-road-barge-v2.png | 939 × 1675 | Coastal Road |
| image17.png | 164 × 138 | epe-pipeline-joint-v2.png | 1367 × 1150 | Epe |
| image30.png | 379 × 614 | submersible-pump-v2.png | 986 × 1596 | Fleet teaser; replaces incorrectly labelled pipe-fusion machine |
| image29.png | 419 × 687 | field-pump-preparation-v2.png | 979 × 1606 | Services teaser, Fleet. Embedded off-canvas on slide 12; generic equipment scene, not project evidence. |
| image32.png | 383 × 510 | lagoon-dredger-v2.png | 1087 × 1447 | About, marine support, Fleet |
| image4.png | 320 × 425 | dredger-crew-v2.png | 1088 × 1445 | Quality/HSE field scene |
| image12.png | 368 × 672 | hydraulic-discharge-v2.png | 928 × 1695 | Hydraulic services, field quality context |
| image11.png | 325 × 162 | pipeline-installation-v2.png | 1777 × 885 | Full-width photo band, sand supply |

Native-resolution assets in `public/media/profile/`: image13.jpg (HDPE pipe stock, 780 × 1040), image24.png (coastal protection, 809 × 1080), image18.jpeg (unaltered route reference, 469 × 264), and image6.png (workshop pump, 1152 × 1536; retained for future equipment use). The map is displayed contained within its native width, never cropped or generatively redrawn. Contact now links to an address search instead of showing a project map as an office map.

## Entire-deck review

- Slides 1–2: logo and polished pumping illustrations; no new verified project photography. Prefer the existing 1536-pixel logo over smaller duplicate thumbnails.
- Slide 3: working dredger and crew; suitable general company/field image.
- Slide 4: discharge, blue workshop pump, pipe-fusion machine, fittings; equipment illustrations only. image8 is off-canvas. image7 is a fusion machine, not a dredge head.
- Slide 5: support boat, pipeline installation, hydraulic discharge; generic operations. A trial enhancement of image10 introduced extra visible people and was rejected; the site uses the existing barge scene for marine support instead.
- Slide 6: HDPE stock, pump casing, flange; not leadership portraits. Use HDPE stock on Fleet; retain the other originals for an equipment gallery if needed.
- Slides 7–8: project layout associations above; do not assume every adjacent photo proves a named job.
- Slide 9: incorporation certificate (EMF), showing RUACH DREDGING NIG LTD, RC 9001841. The cover differs (RC 8996272). The user subsequently confirmed the certificate is authoritative; the site now uses the certificate identity. The original certificate remains archived, not published.
- Slide 10: lagoon-site video and coastal protection stock; protection stock is the sharper relevant Coastal Engineering photo.
- Slide 11: partner graphic plus off-canvas maps/illustrations/photos. Do not use third-party contact details as Ruach's contacts, or an unverified map as an office map.
- Slide 12: large grey pump and green barge are suitable equipment assets. image28/outfall video and image29/preparation photo are off-canvas; no named-project association is inferred.
- Slides 13–16: process/testing layouts, no new standalone photography beyond repeated logos/illustrations.
- Slide 17: green barge, repeats image32; suitable About/marine-support photograph.
- Slides 18–21: pumping promotional composites, technical illustrations and small reference-photo panels embedded inside graphics. Do not use promotional refinery scenes as proof of an executed refinery contract, or treat diagrams as field photographs.

All five embedded videos are only 368 pixels wide (656/672 high). Extracted frames do not provide higher-resolution originals. No paid stock or competitor images were used.

During local QA, generated image-optimizer requests intermittently stalled despite healthy originals and successful standalone encoding. Restored PNG masters were therefore also encoded as same-resolution, quality-90 WebP delivery siblings (213–492 KB each), without sharpening, resizing or scene edits. The catalogue serves those `.webp` siblings directly through Next.js Image with `unoptimized` (already optimized), preserving lazy loading and layout stability. Native profile assets are served directly too; other assets retain Next.js WebP optimization. The PNG masters are untouched. Each filename in the table above has a matching `.webp` delivery file beside it.

## Restoration prompt set

Tool mode: **built-in image editing**, one call per image. Each local source was viewed first. Final selected outputs are saved in the workspace, not referenced from the tool's generated-image directory.

Base prompt (all nine outputs):

> Use case: precise-object-edit. Asset type: restored company-profile documentary photograph for a Nigerian dredging website. Input image 1 is the edit target, not inspiration. Primary request: conservatively restore and upscale this exact photo to a high-resolution image, retain the original aspect ratio and framing. Reduce compression artifacts and noise; improve natural edge clarity and tonal legibility without oversharpening. Preserve EXACTLY the same people, faces, clothing, equipment geometry, pipes, bolts, ropes, site layout, background and weather. Do not add, remove, replace, reposition or beautify any object. Do not invent markings, readable text or fine technical details absent from the original. No new scene, no advertising treatment, no new watermark. Keep uncertain details soft rather than hallucinate them. Output only the restored photograph, approximately 2048 pixels on its long edge.

image16 used the base prompt. image17, image30, image32, image4 and image29 appended:

> Additional invariant: retain the source image colors and original exposure; do not improve the weather or change the sky. Preserve all equipment fasteners and all original annotations exactly.

image19, image12 and image11 appended:

> Retain the original subdued colors, overcast sky or dusk lighting; no cinematic regrading. Preserve existing text as unreadable if it is unreadable in the source.

The requested long-edge size was approximate; actual dimensions are reported above. Invariants guide restoration but are not a guarantee of forensic fidelity.

## Final verification

All 28 page/viewport combinations (Home plus six internal pages, each at 360, 768, 1280 and 1920 pixels) passed: no failed images, horizontal overflow or automated WCAG A/AA violations. Homepage headings/body/links also had no horizontal clipping. Screenshots were inspected for composition, crops and hierarchy; this is not a full manual accessibility certification. Mobile navigation opens, closes and reaches Fleet. Test results: `artifacts/design-review/checks.json`; captures: `artifacts/design-review/`.

All 21 unit tests, lint, TypeScript checking and the production build passed. The desktop homepage is 5733 px high at 1280 and 5981 px at 1920, or 6.4–6.6 screens at a 900 px viewport height. Homepage static main-content word count for this image-association pass: **235 before / 237 after**, excluding shared navigation/footer; browser `innerText` counts 239 because inline boundaries differ. The additional two tokens come from the corrected project selection, not additional descriptive copy.

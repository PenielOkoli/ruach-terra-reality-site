# Additional dredging images

The existing 21-slide inventory and source renders were reviewed. The supplied PowerPoint is unchanged. Three previously unused assets were enhanced using the built-in image-editing tool, then saved as PNG masters and same-resolution quality-90 WebP delivery files under `public/media/enhanced/`. Original extracted files remain untouched under `artifacts/profile-review/originals/`.

| Source | Original size | Saved filename stem | Output size | Placement |
| --- | --- | --- | --- | --- |
| image31.png, slides 1 and 12 | 725 × 484 | dredging-action-v3 | 1535 × 1025 | Homepage fleet teaser |
| image28.png, off-canvas on slide 12 | 368 × 656 | stockpile-discharge-v3 | 939 × 1676 | Hydraulic dredging on Services |
| image5.png, slide 4 | 496 × 666 | shore-discharge-v3 | 1082 × 1454 | Hydraulic placement on Fleet |

The image pass initially replaced the homepage hero with `dredger-crew-v2.webp` (slide 3 / image4.png). At the user's subsequent request, the previous `/media/industry/river-dredging.jpg` background and original crop were restored. The other enhanced dredging images remain in place. No homepage sections or copy were added. The named project associations, partner section, brand colors, registers and absence of visible credits/FIG labels are preserved.

The source of image31 is a polished promotional illustration with unconfirmed photographic provenance. It remains explicitly classified as an illustration in the catalogue and alternative text, not asserted to be Ruach equipment or a completed project. Restoration makes it brighter than the source; it is not an exact documentary reproduction. The two discharge scenes are general operations images, not assigned to named projects. The shoreline worker's original clothing was retained rather than inventing PPE, and the scene is not used to illustrate HSE compliance.

AI-assisted enhancement improves legibility and output resolution but may reconstruct textures, faces, equipment details and weather. These outputs are presentation assets, not technical inspection evidence or substitutes for original high-resolution photography. No paid or competitor photography was sourced.

## Prompt set

Tool mode: built-in image editing, one separate call per asset. All source images were visually inspected before editing.

Base prompt:

> Use case: precise-object-edit. Asset type: enhanced company-profile website image. Input image 1 is the edit target, not inspiration. Conservatively restore and upscale this EXACT image, retaining original aspect ratio, framing and colors. Improve resolution, reduce compression/noise and clarify natural edges. Preserve all existing people, clothing, faces, equipment geometry, pipes, gantry, ropes, vessels, sand piles, background and weather. Do not add, remove, reposition or replace objects. Do not invent text or fine mechanical details. Keep uncertain details soft, no cinematic regrading, no new watermark. Output only the restored image, around 2048 pixels on the long edge.

image31 appendix:

> Preserve precisely TWO workers, the blue gantry, central vertical pump, curved black discharge pipe, rightward sand arc and barge edges. This source is a promotional illustration of unconfirmed photographic provenance; preserve it rather than create a different scene.

image28 appendix:

> Preserve the portrait crop with NO added people. Keep the right-edge pipe, down-left slurry arc, concrete channel, pale sand stockpile, cranes and original cloudy sky exactly positioned.

image5 appendix:

> Preserve exactly ONE worker in a yellow-orange shirt, seen from behind, standing at left-center. Keep the source pose, dark trousers, pipe entering from upper-left, sand discharge arc to the right, palms and muddy water. Do not add PPE or change clothing. Preserve subdued overcast lighting.

The requested size was approximate; actual dimensions are above. Invariants guide the edit but do not guarantee forensic fidelity.

## Verification

All 24 unit tests, ESLint and the production build (including TypeScript) pass. The homepage copy/composition regression is unchanged. Full browser checks cover Home and six internal routes at 360, 768, 1280 and 1920 pixels: no failed images, horizontal overflow or automated WCAG A/AA violations. Mobile navigation also passes. These automated checks are not a complete accessibility certification. Homepage browser main-content count stays at 239 words.

`scripts/dredging-photo-check.cjs` additionally checks that each new image actually renders at all four viewport sizes, the hero uses the requested previous background, and the three updated sections have no horizontal overflow. Targeted screenshots are under `artifacts/dredging-photo-review/`; full-route results are under `artifacts/design-review/`. The new image outputs and representative desktop/mobile crops were visually inspected.

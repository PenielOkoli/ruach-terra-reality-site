# Company media review — 6 October 2026

Originals remain untouched in the user-supplied `Downloads/Dredger Photos` folder. All 27 supplied files were inventoried and hashed. Photos were visually reviewed; each unique video was probed and sampled at three time positions. This is equipment-family research, **not** a verified reverse-image match or a serial-number inspection. No photo establishes a pump model, discharge bore, ownership of a manufacturer product, project location or delivery quantity by itself. The existing verified project associations and register data remain unchanged.

## Photo decisions

| Filename time (5 October; `.jpeg`) | Visible subject / decision | Website placement |
| --- | --- | --- |
| 10.00.32 AM | Perforated intake screen and central agitator; equipment-family identification only | Fleet / intake detail |
| 10.00.32 AM (1) | Byte-identical intake duplicate | Not repeated |
| 10.00.31 AM | Deck walkway, electrical cables, finger obscuring corner | Omitted: weak composition; no need for another deck image |
| 10.00.31 AM (4) | Byte-identical walkway duplicate | Not repeated |
| 10.00.30 AM | Zidong-watermarked multi-cutter submersible pump, factory scene | Omitted: not evidence of a Ruach-owned TOYO model; use/ownership unconfirmed |
| 10.00.31 AM (1) | Second factory view of multi-cutter submersible pump | Omitted for the same reason |
| 10.00.31 AM (2) | Zidong-watermarked horizontal centrifugal dredge pumps | Omitted: manufacturer reference, not an identified Ruach unit |
| 10.00.31 AM (3) | Zidong diesel-driven centrifugal pump package on skid | Omitted: manufacturer reference, not an identified Ruach booster |
| 9.51.40 AM | Field pontoon, twin lifting gantries and hoses | Homepage Services; Fleet overview |
| 9.37.53 AM | Dredger with twin wheel assemblies, yellow rails, workshop/yard | Omitted pending origin and exact dredger-type confirmation |
| 9.37.52 AM | Vertical submersible slurry pump, motor guards and flanged discharge | Fleet / pump family; **not** attached to a named TOYO register row |
| 9.37.50 AM | A-frame pontoon, suspended submersible pump and discharge hose | Homepage Fleet teaser |
| 9.37.47 AM | Small pontoon, upright frames, cabin and crew at mobilisation area; exact positioning/lifting function unconfirmed | Fleet gallery; Services / marine support |
| 9.36.32 AM | Aerial sand stockpiles, loader, access tracks and buildings | Services / dredging and sand handling; About overview |
| 9.36.25 AM | Dredger deck, suction-pipe and lifting assembly | Homepage hero; Fleet / deck assembly |
| 9.23.48 AM | Dark, tilted SHOTO-labelled cabinet; cannot establish its function | Omitted: poor clarity and unconfirmed equipment function |

## Video decisions

| Filename time (`.mp4`) | Source / visual review | Decision |
| --- | --- | --- |
| 9.23.51 AM | 656×368, 67.98s; heavily compressed view around equipment/water | Omit: unclear action |
| 9.36.31 AM | 656×368, 132.30s; slurry outlet with pronounced compression | Omit: better discharge footage exists |
| 9.37.46 AM | 640×360, 66.09s; bank-side discharge | Omit: duplicates the selected higher-resolution action |
| 9.37.47 AM | 368×656, 11.48s; crew on mobilisation pontoon | Omit: still photograph communicates this better |
| 9.37.48 AM | 478×850, 10.61s; waterway transit with little equipment detail | Omit: little additional explanation |
| 9.37.49 AM | Encoded 1280×720 with rotation; displayed 720×1280, 44.72s; slurry discharge | Select 8–26s; 540×960 silent excerpt; Services field film |
| 9.51.40 AM | 368×496, 10.66s; crew and blue structure during mobilisation | Omit: low resolution / photograph is stronger |
| 9.51.40 AM (1) | Byte-identical duplicate | Not repeated |
| 9.51.49 AM | 352×640, 52.59s; crane handling a curved suction hose beside vessel | Select 3–17s; native-resolution silent excerpt; compact Services player, not a background |
| 9.52.10 AM | 352×640, 62.74s; pipe coupling with intermittent ground/vegetation view | Omit: shaky composition and limited equipment view |
| 9.52.10 AM (1) | Byte-identical duplicate | Not repeated |

## Identification sources

Primary manufacturer documentation was used to check visible equipment families; similarities do not verify the model or manufacturer of a photographed machine.

- [TOYO product catalogue](https://www.toyopump.co.jp/english/products/index.php) and [agitator FAQ](https://www.toyopump.co.jp/english/products/faq.php): submersible sand/slurry pumps and bottom agitator function.
- [TOYO DP/DPE/DPH](https://www.toyopumpseurope.com/submersible-pumps/dp-dpe-dph/): submersible slurry pump family. No specification from this catalogue was assigned to an unidentified photograph.
- [Zidong manufacturer catalogue](https://www.cnslurrypump.com/): centrifugal dredge pumps, submersible sand pumps and diesel-driven packages; consistent with the visible factory branding, not proof of Ruach ownership or permission.
- [Damen trailing suction pipe systems](https://www.damen.com/equipment/dredging/trailing-suction-pipes?view=models): deck-side suction-pipe handling family; no Damen model or vessel identity claimed.

## Enhancement and delivery

Seven selected photos and two video-poster frames were restored with the **built-in image-generation tool in edit mode**, using separate calls per asset and one poster retry. Originals were not overwritten. Generated photos live in `public/media/company/*-v1.webp`; delivery-only WebP conversion and responsive derivatives use Sharp. These are AI-enhanced presentation images, not technical inspection evidence. AI cannot recover genuinely missing camera detail; exact equipment identity still requires nameplates/company confirmation.

Final shared prompt (each edit used its own source image as the edit target):

> Use case: precise-object-edit. Asset type: enhanced documentary photo for Ruach's dredging website. Input image is the edit target, not a style reference. Primary request: restore this exact compressed photograph with restrained noise/compression reduction, clearer edges, balanced exposure and natural colour, and increase image resolution to roughly 2K on the long edge. Keep the original camera framing and aspect ratio. Invariants: preserve exactly the equipment geometry, hoses, bolts, holes, gantries, rails, wear, rust, ground, water, buildings, vegetation and every person's position, identity, clothing and PPE as visible. Do not beautify equipment into a different/new machine; do not invent readable model names, logos, extra structures, workers, PPE or scenery. Preserve any existing watermark/text. This is faithful photo restoration, not an illustration or a new scene.

Asset-specific prompt suffixes:

- `stockyard-aerial`: Preserve the exact two stockpile outlines, loader, buildings and river/canoes; no invented site expansion.
- `suction-deck`: Preserve the red lifting gantry, white frame, long suction pipe, green deck and vessels in the background; retain the shaded upper-left corner.
- `pump-pontoon`: Preserve the blue A-frame, hanging cream-coloured submersible pump and black discharge hose. Keep the complete lifting structure and pontoon; retain the existing narrow black strip at top.
- `pump-intake`: Keep the complete circular perforated intake screen, its visible hole pattern and central agitator, rust and supporting metal hoops exactly unchanged.
- `submersible-pump`: Preserve the grey vertical motor, side guards, volute, discharge flange, intake holes and original surroundings. Do not assign or invent a model.
- `field-pontoon`: Preserve both red gantries, green pontoon, pipes, cables, cabin and the Infinix phone watermark. No new crew or PPE.
- `mobilisation`: Preserve the narrow vertical framing, complete pontoon/spud posts, yellow rails, cabin, existing workers and excavator. Do not alter clothing or add PPE.
- `discharge-poster`: Preserve the exact dark slurry stream from the black pipe, water, sand banks and landscape; do not expand the stream or invent additional equipment.
- `handling-poster` (final retry): Preserve the precise suspended curved suction hose, crane cable, blue vessel and ground pipe sections. Most important: preserve the original blurred boat-name marks pixel-faithfully as unclear text. DO NOT invent or re-letter a readable vessel name; leave the lettering indistinct exactly as in the source. Restore gently, without reconstructing fine structural detail or adding equipment. No new people or lifting gear. The first draft was rejected because it re-lettered the vessel name.

Videos use mild temporal denoising, small exposure/contrast adjustment and mild sharpening; no synthetic frames or enlargement. Rotation is honoured, audio is omitted in the silent excerpts, and H.264 MP4s use fast-start metadata. Review at native size remains important: the hose clip is lower resolution and deliberately limited to a 352px player. Neither video is an HSE demonstration or a claim of compliance. A written visual description accompanies each silent film. Video elements and sources are mounted only after a user opens a film; no autoplay, external embed, tracking, or initial video download. Playback pauses off-screen or when the tab is hidden.

Reproduction: `scripts/review-company-media.cjs` writes ignored review artifacts and SHA-256 inventory; `scripts/prepare-company-photos.cjs` converts selected generated PNGs; `scripts/build-company-videos.cjs` produces the two excerpts; `scripts/build-responsive-images.cjs` creates mobile image variants. Pass the external source folder and an installed FFmpeg binary explicitly to the review/video scripts.

## Verification

- Production build, TypeScript, ESLint and 43 unit tests pass.
- Headless Edge: 360, 768, 1280 and 1920px. Homepage, Fleet, Services and About have no horizontal overflow or browser runtime errors; automated WCAG AA checks report zero violations. Screenshots were visually reviewed for framing and equipment visibility.
- Both MP4s decode and play with native controls and inline playback. No MP4 request occurs before opening a film; no autoplay occurs after opening. Playback pauses when the player leaves the viewport.
- Homepage body copy is unchanged: **238 words before → 238 after** (main content only; navigation/footer excluded). Desktop main-content height is approximately **5.9 screens at 1280px and 6.2 screens at 1920px**, using a 900px viewport height.
- At 360px, the seven homepage images total approximately **208 KB**; the three new homepage photos total **89 KB**, versus **821 KB** for their full enhanced files. Videos add zero initial download bytes.
- Existing quote UI, responsive/retina image tests and nine pages' metadata checks also pass. Sticky Services navigation is offset beneath the actual desktop/mobile header height.

# Company-selected vessel replacement — 7 October 2026

## Source and placement

The company explicitly selected the new vessel photo to replace the old HDPE-joint photo. The replacement is used in the Epe Lagoon homepage card and its Projects-page case note, without changing the recorded project location, scope, volume or outcomes. This placement is company-selected, not independently verified geolocation or a model identification. The profile's original image17/photo record and its files remain unchanged, but are no longer rendered in these two slots.

- Source: `C:/Users/DELL/Downloads/Dredger Photos/WhatsApp Image 2026-10-07 at 6.40.05 AM.jpeg`, 2048×1152.
- Original SHA-256: `1c393b9751c37d5ef20a3e2c711d070841f1cbe2ceb4895a034cfeed36c30cda`.
- Final project asset: `public/media/company/lagoon-vessel-v2.webp`.
- Generated PNG and original copy: ignored `artifacts/vessel-photo-review/`. Original supplied JPEG remains untouched.
- Method: built-in image-generation tool in edit mode, followed by delivery-only WebP conversion and responsive resizing. The first pass was archived off the published site after the reflection correction.

## Edits and sizing

The deck person was removed and the water reflection corrected to agree with the empty deck. Clarity, exposure and colour were enhanced without repainting the hull or modernising the equipment. These are AI-edited presentation assets, not unaltered engineering inspection records. No claim is made that authentic detail was recovered from the compressed source.

At the user's subsequent request, the Epe Lagoon homepage card now uses the same fixed-height frame as the other project cards: 340 pixels on desktop, 280 pixels on tablet and 260 pixels on mobile. A centred `object-fit: cover` crop fills that frame without distorting the vessel; the narrower card may crop the ends of the landscape photograph. All three desktop image bottoms and caption starts line up. The Projects page still shows the full native landscape frame. Responsive width variants are 320, 480, 768, 1024, 1536 and native width, without upscaling.

The final web master is 1672×941. The homepage `sizes` accounts for its fixed-height crop so the browser selects enough source pixels: at least 605 pixels wide on desktop and 463 pixels on small mobile screens. `scripts/vessel-photo-browser-check.cjs` checks both pages at 360, 768, 1280 and 1920 pixels, including homepage image/caption alignment, sufficient delivered resolution and the full native frame on Projects, plus overflow, console errors and WCAG AA violations. The existing Projects heading from commit 3102843 is preserved.

## Final prompts

### Person removal and enhancement

Use case: precise-object-edit. Asset type: edited company-supplied vessel photograph for a dredging website. Input image is the edit target, not a style reference. Remove the single standing person on the right-hand deck completely, including their feet and any visible reflection or shadow, reconstructing the existing deck, green machinery enclosure, railings, red pipe and sky naturally. Improve this exact photograph with restrained compression/noise reduction, clearer edges, balanced exposure and natural colour. Preserve the full blue weathered hull, rust and paint condition, cabin, lifting boom and cables, suspended pipe, ladder, red deck pipe, equipment, bags, distant shoreline, cloudy sky and water reflections. Do not repaint or modernise the vessel, add people, equipment, labels or logos, or invent technical details. Keep original camera perspective, complete vessel framing and 16:9 landscape aspect ratio. Produce an approximately 2560-pixel-wide high-resolution photographic edit; do not crop off either end of the vessel. Output only the edited photograph.

### Reflection correction

Use case: precise-object-edit. Input image is the edit target: the already enhanced photograph of the blue dredging vessel with its deck person removed. Primary request: correct ONLY the water reflection to match this exact edited vessel. Remove any remaining human-shaped reflection directly below the empty right-hand deck. Accurately mirror the visible blue weathered hull, cabin, railings, ladder, crane/boom cables, green deck enclosures, red pipe and bags at their corresponding horizontal positions, with the same natural gentle ripples, soft contrast and water colour as the existing photograph. The reflection should agree with the empty deck: no person in the vessel or water. Preserve every above-water pixel as closely as possible: do not change vessel geometry, hull weathering, equipment, bags, shoreline, sky, lighting, camera angle, framing or colours. Keep the full 16:9 landscape composition and resolution. No added objects, people, labels or logos. Output only the repaired photograph.


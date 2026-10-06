# Scroll-controlled field films — 6 October 2026

Requested by the user: line up the Services video panels, play when scrolled into view and stop when scrolled away.

- Both portrait players use the same width and 9:16 frame. They line up in one row from 768px upwards and stack on smaller screens; the 352px cap avoids enlarging the lower-resolution hose clip.
- An IntersectionObserver starts muted inline looping playback when at least 35% of a player is visible. A 90px top exclusion keeps the sticky header from counting as visible space, with a 24px bottom exclusion.
- Leaving that visible range pauses playback. Returning resumes at the saved position. Hiding the document also pauses it; returning to the visible tab resumes only a player still in view.
- Video sources are not mounted on the initial off-screen render. They mount on viewport entry or manual play; `preload="none"` avoids background downloads before playback.
- Native controls remain available, including pause. Automatic playback does not move keyboard focus. The poster remains visible until the first decoded video frame.
- Reduced-motion and Save-Data preferences disable automatic starts. The user can choose Play film. Browser autoplay rejection exposes the same manual button, and loading errors offer a download link.
- Silent films retain their written visual descriptions and no-JavaScript download links.

The browser check `node scripts/scroll-video-browser-check.cjs` exercises visible playback, off-screen pause, re-entry, native pause, tab visibility, row alignment, no initial MP4 requests, reduced-motion/Save-Data behaviour and blocked-autoplay fallback. The existing company-media browser check now expects viewport playback rather than click-only playback.

Verification: 46 unit tests, TypeScript and ESLint pass. Headless Edge checks pass at 360, 768, 1280 and 1920px: in-view playback, off-screen pause, re-entry, native controls and matched frame dimensions. The document visibility handler was exercised with hidden/visible events. Initial off-screen MP4 requests and automated WCAG AA violations were both zero. Reduced-motion, Save-Data and simulated autoplay rejection each passed manual playback and off-screen pause checks. The desktop video row screenshot was visually reviewed.

// Slide 11: “Technical Partners”. Preserve the supplied raster artwork.
// These are profile-listed partners/brands, not verified endorsements or certifications.
export const partnerArtwork = {
  src: '/media/partners/profile-technical-partners.png',
  width: 1338,
  height: 1536,
  sourceSlide: 11,
  sourceAsset: 'image26.png',
} as const;

// Viewport coordinates show each original logo without the screenshot chrome,
// third-party phone number, social icons or other logos. No image pixels are edited.
export const technicalPartners = [
  { name: 'IPR', crop: { x: 500, y: 450, width: 360, height: 235 } },
  { name: 'Atlas Copco', crop: { x: 105, y: 895, width: 340, height: 180 } },
  { name: 'Slurry Sucker', crop: { x: 500, y: 900, width: 340, height: 175 } },
  { name: 'Toyo', crop: { x: 895, y: 900, width: 340, height: 175 } },
] as const;

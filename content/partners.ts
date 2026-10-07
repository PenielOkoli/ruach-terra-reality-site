// Keep the supplied slide-11 artwork unchanged as a source record.
// Relationships are supplied by the company, not independent endorsement claims.
export const partnerArtwork = {
  src: '/media/partners/profile-technical-partners.png',
  width: 1338,
  height: 1536,
  sourceSlide: 11,
  sourceAsset: 'image26.png',
} as const;

// The first four logos are transparent derivatives of these source crops.
// The additional four brands were identified by the company separately.
export const technicalPartners = [
  { name: 'IPR', src: '/media/partners/ipr-transparent-v1.png', width: 640, height: 391, crop: { x: 500, y: 450, width: 360, height: 235 } },
  { name: 'Atlas Copco', src: '/media/partners/atlas-copco-transparent-v1.png', width: 640, height: 297, crop: { x: 105, y: 895, width: 340, height: 180 } },
  { name: 'Slurry Sucker', src: '/media/partners/slurry-sucker-transparent-v1.png', width: 648, height: 238, crop: { x: 500, y: 900, width: 340, height: 175 } },
  { name: 'Toyo', src: '/media/partners/toyo-transparent-v1.png', width: 648, height: 298, crop: { x: 895, y: 900, width: 340, height: 175 } },
  { name: 'Cummins', src: '/media/partners/cummins.svg', width: 950, height: 960 },
  { name: 'Weichai', src: '/media/partners/weichai.png', width: 500, height: 168 },
  { name: 'Bosch', src: '/media/partners/bosch.svg', width: 433, height: 97 },
  { name: 'ABB', src: '/media/partners/abb.svg', width: 88, height: 35 },
] as const;

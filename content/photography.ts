// Association is based on slide layout, not independently verified geolocation.
// AI-restored photographs are presentation assets, not technical inspection records.
export const profilePhotos = {
  dredgingAction: { src: '/media/enhanced/dredging-action-v3.webp', alt: 'AI-enhanced dredging illustration from the supplied profile; not a verified Ruach equipment or project photograph', slide: 12, original: 'image31.png', kind: 'illustration' },
  stockpileDischarge: { src: '/media/enhanced/stockpile-discharge-v3.webp', alt: 'AI-enhanced photograph of hydraulic sand discharge into a stockpile channel, from the profile equipment material', slide: 12, original: 'image28.png', kind: 'photo' },
  shoreDischarge: { src: '/media/enhanced/shore-discharge-v3.webp', alt: 'AI-enhanced photograph of a worker beside a sand-discharge pipe at a palm-lined shoreline', slide: 4, original: 'image5.png', kind: 'photo' },
  excavator: { src: '/media/enhanced/igbolomi-excavator-v2.webp', alt: 'AI-enhanced excavator photograph paired with the Igbolomi–Lekki project in the supplied profile', slide: 7, original: 'image16.png' },
  coastalRoad: { src: '/media/enhanced/coastal-road-barge-v2.webp', alt: 'AI-enhanced barge crew photograph paired with Coastal Road sand supply in the supplied profile', slide: 7, original: 'image19.png' },
  epeJoint: { src: '/media/enhanced/epe-pipeline-joint-v2.webp', alt: 'AI-enhanced HDPE joint photograph paired with the Epe Lagoon project in the supplied profile', slide: 7, original: 'image17.png' },
  pump: { src: '/media/enhanced/submersible-pump-v2.webp', alt: 'AI-enhanced grey submersible dredging pump from the equipment slide', slide: 12, original: 'image30.png' },
  preparation: { src: '/media/enhanced/field-pump-preparation-v2.webp', alt: 'AI-enhanced photograph of crew preparing a dredging pump and HDPE pipes', slide: 12, original: 'image29.png' },
  barge: { src: '/media/enhanced/lagoon-dredger-v2.webp', alt: 'AI-enhanced green dredger barge and generator on a lagoon', slide: 17, original: 'image32.png' },
  crew: { src: '/media/enhanced/dredger-crew-v2.webp', alt: 'AI-enhanced photograph of crew operating a green dredger with a red gantry', slide: 3, original: 'image4.png' },
  discharge: { src: '/media/enhanced/hydraulic-discharge-v2.webp', alt: 'AI-enhanced hydraulic sand discharge photograph from the general track-record slide', slide: 5, original: 'image12.png' },
  pipeline: { src: '/media/enhanced/pipeline-installation-v2.webp', alt: 'AI-enhanced photograph of crew installing HDPE pipeline at a housing development', slide: 5, original: 'image11.png' },
  pipeStock: { src: '/media/profile/hdpe-pipe-stock.jpg', alt: 'HDPE pipes with blue stripes and yellow flanges from the supplied profile', slide: 6, original: 'image13.jpg' },
  coastalProtection: { src: '/media/profile/coastal-protection.png', alt: 'Stacked concrete coastal protection elements beside a waterfront', slide: 10, original: 'image24.png' },
  routeReference: { src: '/media/profile/project-route-map.jpeg', alt: 'Unaltered route-planning reference with original Google Earth labels; not an office map or verified project location', slide: 7, original: 'image18.jpeg' },
} as const;

export const projectPhotos = {
  'Igbolomi–Lekki Coastal Sand Reclamation': profilePhotos.excavator,
  'Coastal Road Subbase Sand Supply': profilePhotos.coastalRoad,
  'Epe Lagoon Shoreline Stabilization & Stockpiling': profilePhotos.epeJoint,
} as const;

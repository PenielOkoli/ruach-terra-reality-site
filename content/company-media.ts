// Equipment-family labels only: these photos do not establish model, capacity or project identity.
const photo = (name: string, alt: string, version = 1) => ({ src: `/media/company/${name}-v${version}.webp`, alt: `AI-enhanced company-supplied photo: ${alt}` });
export const companyPhotos = {
  aerial: photo('stockyard-aerial', 'Company-supplied aerial view of sand stockpiles, a loader and surrounding access tracks'),
  deck: photo('suction-deck', 'Suction-pipe assembly and red lifting gantry along a dredger deck', 2),
  pontoon: photo('pump-pontoon', 'Submersible pump suspended from a blue A-frame on a floating pontoon, with its discharge hose'),
  intake: photo('pump-intake', 'Perforated pump intake screen, central agitator and protective metal hoops'),
  pump: photo('submersible-pump', 'Vertical submersible slurry pump with motor guards, intake and flanged discharge'),
  field: photo('field-pontoon', 'Floating green dredging pontoon with twin lifting gantries and discharge hoses', 2),
  mobilisation: photo('mobilisation', 'Crew beside a small dredging pontoon with a cabin, upright frames and yellow rails'),
} as const;

export const equipmentGallery = [
  { ...companyPhotos.pump, title: 'Submersible slurry pump', description: 'Motor, intake and flanged discharge.' },
  { ...companyPhotos.intake, title: 'Intake and agitator', description: 'Screen and agitator at the pump intake.' },
  { ...companyPhotos.mobilisation, title: 'Pontoon mobilisation', description: 'Cabin, upright frames and working deck.' },
] as const;

export const fieldClips = {
  discharge: {
    id: 'slurry-discharge', title: 'Slurry discharge', duration: '18 seconds',
    src: '/media/company/videos/slurry-discharge-v1.mp4',
    poster: photo('discharge-poster', 'Slurry flows from a discharge pipe into the placement area'),
    description: 'Sand and water flow from a discharge pipe into the placement area.',
    transcript: 'Silent field footage: a fixed discharge pipe carries a continuous stream of sand and water into a water-filled placement area. The camera shows the outlet, slurry stream and surrounding sand banks.',
  },
  handling: {
    id: 'suction-hose-handling', title: 'Suction-hose handling', duration: '14 seconds',
    src: '/media/company/videos/suction-hose-handling-v1.mp4',
    poster: photo('handling-poster', 'A crane holds a curved suction hose above ground pipe sections beside a vessel'),
    description: 'A crane positions a suction hose beside the vessel.',
    transcript: 'Silent field footage: a curved suction hose is suspended on a crane cable beside a blue vessel. Pipe sections lie on the ground. This lower-resolution clip is shown in a compact player, not as a full-width background.',
  },
} as const;
export type FieldClipData = typeof fieldClips[keyof typeof fieldClips];

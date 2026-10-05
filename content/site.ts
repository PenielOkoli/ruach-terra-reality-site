export type Project = {
  title: string;
  category: 'Reclamation' | 'Supply' | 'Survey' | 'Marine';
  location: string;
  scale: string;
  detail: string;
  client: string;
  sourceSlide: number;
  scopeDetails: readonly string[];
  status: 'Completed' | 'Ongoing';
};

export const company = {
  name: 'RUACH DREDGING NIG LTD',
  rc: 'RC 9001841',
  tagline: 'Water Moves Possibilities',
  subline: 'Dredging | Hydraulic Fill | Reclamation',
  address: '32 Vover Close, Adiva Plainfield Estate, KM 69 Lekki-Epe Expressway, Lagos, Nigeria.',
  phones: ['08055212777', '08098129888'],
  whatsapp: '09044441234',
};

export const stats = [
  { value: '10', label: 'hopper dredgers' },
  { value: '14″ / 16″', label: 'submersible dredgers' },
  { value: '2 km', label: 'HDPE pipeline' },
  { value: '20–40 m', label: 'deep borrow capacity' },
  { value: '25,000 m³+', label: 'delivered on one project' },
];

export const capabilities = [
  ['01', 'Hydraulic Dredging & Reclamation', 'Source-to-placement dredging systems for creating usable land.'],
  ['02', 'Sand Winning & Bulk Supply', 'Controlled winning, stockpiling and supply for construction needs.'],
  ['03', 'Coastal & Lagoon Engineering', 'Marine works for lagoon-edge and shoreline environments.'],
  ['04', 'Surveying & Bathymetry', 'Survey control and depth verification to inform project decisions.'],
  ['05', 'Terrain & Earthworks', 'Placement, grading and compaction support for prepared sites.'],
  ['06', 'Pipeline & Marine Support', 'Pumping, HDPE pipeline and support-vessel coordination.'],
] as const;

export const process = [
  'Source & boundary verification',
  'Bathymetry & reserve assessment',
  'Sampling & testing',
  'Pump, pipeline & trial production',
  'Controlled placement',
  'Daily records & sign-off',
];

export const projects: Project[] = [
  { title: 'Igbolomi–Lekki Coastal Sand Reclamation', category: 'Reclamation', location: 'Igbolomi, Lekki–Epe Axis', scale: '1,200 m pipeline · 800–1,000 m³/day', detail: 'Lagoon sand extraction, shoreline build-up and preliminary reclamation.', client: 'Private Developers’ Consortium', sourceSlide: 7, scopeDetails: ['Ruach & Terra Realty Ltd. executed mechanical sand filling and early-phase reclamation for a private residential layout.', 'Dredging, dyke shaping, HDPE installation and terrain stabilisation; submersible-system production averaged 800–1,000 m³/day.'], status: 'Completed' },
  { title: 'Coastal Road Subbase Sand Supply', category: 'Supply', location: 'Lekki Coastal Road Corridor', scale: '600–800 m pipeline', detail: 'Sand extraction and supply for road subbase preparation.', client: 'Hitech Construction Company, via subcontracting chain', sourceSlide: 7, scopeDetails: ['Continuous lagoon-sand pumping for road embankment works.', 'Submersible pump deployment, pipeline welding, sand-material quality control and fill-elevation management.'], status: 'Ongoing' },
  { title: 'Epe Lagoon Shoreline Stabilization & Stockpiling', category: 'Reclamation', location: 'Epe Lagoon Waterfront', scale: '25,000 m³+ · 12–16 in HDPE', detail: 'Sand stockpiling for future reclamation and shoreline shaping.', client: 'Private Estate Developer', sourceSlide: 7, scopeDetails: ['Lagoon sand winning, shoreline reinforcement and preliminary revetment shaping.', 'Bulk sand delivery using a submersible suction dredger; deliveries exceeded 25,000 m³.'], status: 'Completed' },
  { title: 'Lekki–Eleko Perimeter Filling', category: 'Reclamation', location: 'Lekki–Eleko', scale: '15,000–25,000 m³ · 12–14 in pump system', detail: 'Pre-reclamation filling for layout formation and terrain preparation.', client: 'Residential Development Firm', sourceSlide: 7, scopeDetails: ['Controlled sand filling using a 12–14 in submersible pump system.', 'Dyke formation, geotextile placement, controlled slurry delivery and bulldozer grading.'], status: 'Completed' },
  { title: 'Lagoon Bathymetry Verification', category: 'Survey', location: 'Lekki Lagoon', scale: 'Hydrographic survey / borrow pit mapping', detail: 'Bathymetry verification and dredge-alignment survey.', client: 'Craneburg Construction Company Ltd.', sourceSlide: 8, scopeDetails: ['Single-beam bathymetric mapping, seabed profiling and channel marking.', 'Dredge-path recommendations for a future reclamation project.'], status: 'Completed' },
  { title: 'Orchid Road Waterfront Plot Filling', category: 'Reclamation', location: 'Orchid Road – Chevron Axis, Lekki', scale: 'Residential construction platforms', detail: 'Controlled filling and back-of-plot soil stabilisation.', client: 'Not named in profile', sourceSlide: 8, scopeDetails: ['Compact dredging units for localised pumping, dyke control and sediment management.', 'Sand delivery for private waterfront residential construction platforms.'], status: 'Completed' },
  { title: 'Lagoon Sand Haulage & Barge Loading', category: 'Marine', location: 'Lagos Lagoon', scale: 'Barge-assisted sand supply', detail: 'Mechanical extraction and barge-loading support.', client: 'Not named in profile', sourceSlide: 8, scopeDetails: ['Loading support for barge-based sand transport to Lagos construction sites.', 'Mechanical dredging, barge positioning and material testing.'], status: 'Completed' },
];

export const fleet = [
  { group: 'Dredgers', name: '16″ submersible DP400 class dredger', note: '1 unit' },
  { group: 'Dredgers', name: '14″ submersible DP200 class dredger', note: '1 unit' },
  { group: 'Dredgers', name: '10″ 50HP submersible dredger', note: '1 unit' },
  { group: 'Dredgers', name: '8″ 75HP submersible dredger', note: '1 unit' },
  { group: 'Hopper fleet', name: 'Hopper dredgers', note: '10 units · 100 m³ each' },
  { group: 'Pumping & pipeline', name: 'Booster pump station', note: '1 unit · 350–450 kW' },
  { group: 'Pumping & pipeline', name: 'HDPE pipeline', note: '2 km · 12″' },
  { group: 'Support fleet', name: 'Marine & earthworks support', note: 'Tugboats, workboats, welding and anchor barges, 20–25 t excavators, D6–D8 bulldozers and vibro-compactors' },
] as const;

export { coreSystems as systems } from './profile-details';

export const team = [
  ['Blessing O. Uzo', 'MD/CEO'],
  ['Ikechukwu C. Uzo M.Arch', 'COO'],
  ['Barr. Tosan Omatseye', 'HOD Legal'],
  ['Dr. Adaora Uzo', 'HOD Admin/HR'],
  ['Dr. Rotimi Mafoluku', 'HOD HSE'],
  ['Joyce Bamidele', 'CFO/HOD Finance'],
  ['Mark Revett', 'Technical Consultant, Circle pumps'],
] as const;

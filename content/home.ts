import { profilePhotos, projectPhotos } from './photography';

export const services = [
  ["Hydraulic dredging", "Dredge and place suitable fill."],
  ["Sand winning", "Win and supply bulk sand."],
  ["Coastal engineering", "Support lagoon and shoreline works."],
  ["Surveying", "Measure depths and material reserves."],
  ["Earthworks", "Grade and compact placed material."],
  ["Marine support", "Operate pipelines and workboats."],
] as const;
export const projects = [
  {
    name: "Coastal sand reclamation",
    location: "Igbolomi–Lekki",
    figure: "1,200 m",
    unit: "delivery pipeline",
    image: profilePhotos.excavator.src,
    alt: profilePhotos.excavator.alt,
  },
  {
    name: "Coastal Road sand supply",
    location: "Lekki",
    figure: "600–800 m",
    unit: "delivery pipeline",
    image: profilePhotos.coastalRoad.src,
    alt: profilePhotos.coastalRoad.alt,
  },
  {
    name: "Shoreline stockpiling",
    location: "Epe Lagoon",
    figure: "25,000 m³+",
    unit: "project volume",
    image: projectPhotos['Epe Lagoon Shoreline Stabilization & Stockpiling'].src,
    alt: projectPhotos['Epe Lagoon Shoreline Stabilization & Stockpiling'].alt,
    landscape: true,
  },
] as const;
export const workSteps = [
  "Verify source",
  "Survey reserves",
  "Test material",
  "Set pipeline",
  "Place fill",
  "Record work",
];

export const safetyItems = [
  "Zero-incident policy",
  "Compulsory PPE",
  "Daily toolbox talks",
  "NIWA/LASWA compliance",
] as const;

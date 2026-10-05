import { projects, type Project } from './site';

// Source: company profile slides 7–8. Missing quantities stay missing;
// a pipeline length or daily production rate is not a delivered total.
export const projectEvidence = [
  { equipment: 'Submersible dredging system and HDPE pipeline', quantity: 'Total not stated; production averaged 800–1,000 m³/day', outcome: 'Early-phase reclamation for a private residential layout; recorded completed.' },
  { equipment: 'Submersible pumps and welded pipeline', quantity: 'Delivered volume not stated', outcome: 'Sand supply supported road embankment works; recorded ongoing in the profile.' },
  { equipment: 'Submersible suction dredger; 12–16 in HDPE pipeline', quantity: 'More than 25,000 m³ delivered', outcome: 'Sand stockpiling, shoreline reinforcement and preliminary revetment shaping; recorded completed.' },
  { equipment: '12–14 in submersible pump system and bulldozer', quantity: '15,000–25,000 m³ recorded', outcome: 'Controlled filling and grading for layout formation; recorded completed.' },
  { equipment: 'Single-beam bathymetric survey system', quantity: 'Survey area and sounding count not stated', outcome: 'Seabed profiles, channel marking and dredge-path recommendations; recorded completed.' },
  { equipment: 'Compact dredging units', quantity: 'Delivered volume not stated', outcome: 'Sand delivered for residential construction platforms; recorded completed.' },
  { equipment: 'Mechanical dredging and barge positioning; models not stated', quantity: 'Delivered volume not stated', outcome: 'Barge-loading support for Lagos construction sites; recorded completed.' },
] as const;

export type PublicProject = Project & { evidence: typeof projectEvidence[number] };
// Do not pass unapproved client names into a browser bundle/serialized props.
export const publicProjects: PublicProject[] = projects.map((project, index) => ({
  ...project, client: 'Client name not published', evidence: projectEvidence[index],
}));

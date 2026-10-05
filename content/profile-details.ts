import { company } from './company';

// Source: supplied company profile, slides as annotated below; operating base updated by company confirmation.
// Profile recommendations are not independently verified OEM specifications.
export const coreSystems = [
  { name: 'TOYO DP-200-12A', discharge: '12 in', power: '160 kW', role: 'Primary heavy-duty sand / hydraulic fill production' },
  { name: 'TOYO DP-50BL', discharge: '10 in', power: 'Medium duty', role: 'Secondary production / fill / stockpile support' },
  { name: 'TOYO DP-75B', discharge: '8 in', power: 'Medium duty', role: 'Supplementary / confined dredging operations' },
  { name: 'Hydra-Tech HT006X8', discharge: '8 in hydraulic', power: 'Hydraulic drive', role: 'Dewatering / dirty-water / support pumping; not primary abrasive sand dredging' },
] as const; // slide 14

export const productionBasis = {
  low: 160, high: 350, typicalDistanceMinKm: 0.14, typicalDistanceMaxKm: 0.4,
  systems: 'DP-200 + DP-50BL + DP-75',
  shift: '1,280–2,800 m³ per 8-hour shift',
  envelope: '140–400 m typical discharge distance',
  caveat: 'Combined planning range only. Final output depends on source quality, dredging depth, distance, elevation and a pipeline test run.',
} as const; // slide 14

export const pipelineNotes = [
  'The 2 km pipeline inventory is not a guaranteed discharge-distance or production rating.',
  'Booster-assisted longer reaches require project-specific hydraulic modelling before output is committed.',
  'Recoverable reserves require an approved boundary, bathymetry and subsurface sampling; visible water area alone is not a certified reserve.',
  'The slide 12 fleet register and slide 14 core-systems table list different sizes and model descriptions. They are retained separately; their exact unit-to-model mapping requires confirmation.',
] as const;

export const powerUnitRecommendation = [
  ['Engine', '150–180 HP mechanical diesel'],
  ['Hydraulic pump', 'Variable-displacement axial-piston'],
  ['Maximum hydraulic output', '70 GPM / 265 L/min'],
  ['Working pressure', '170–190 bar / 2,500–2,800 psi'],
  ['Reservoir', '350–400 L, AW46 hydraulic oil'],
  ['Filtration', '10 micron return filtration'],
  ['Cooling', 'Large hydraulic oil cooler'],
  ['Hoses', '1.5 in pressure/return + case drain'],
  ['Discharge', '8 in hose or HDPE line packages'],
] as const; // slide 19: recommended, not an installed-equipment claim

export const engineNotes = [
  'Profile continuous-duty recommendation: 155–180 HP.',
  'Profile engine options: Deutz BF6L913C / BF6L914C; alternatives Cummins 6BTA / 6CTA and Perkins 1006-6T.',
  'The profile describes WP10/WP12 as technically possible but oversized for one pump.',
  'Commission gradually in clean water; confirm pressure, flow, oil temperature and case-drain behaviour before refinery deployment.',
] as const;

export const industrialPumping = {
  title: 'Industrial pumping and dewatering',
  copy: 'An 8-inch hydraulic submersible vortex-pump package for dirty water, wastewater and temporary bypass pumping.',
  restriction: 'Non-flammable service only unless OEM confirmation and refinery HSE approval are obtained. Not a primary abrasive sand-slurry dredging pump.',
  applications: [
    'Refinery / petrochemical: ETP support, contaminated stormwater and utility sumps.',
    'Wastewater / ETP: emergency bypass, basin transfer and sludge-bearing water.',
    'Tank farms: wash-water removal after HSE clearance, hydrotest transfer and bottom-water removal.',
    'Marine / jetty: dock, chamber, bilge-water and utility dewatering.',
    'Construction: trenches, pits, excavations and foundations.',
    'Quarry / mining: pit dewatering and process-water transfer.',
    'Flood response: pumping during heavy rainfall.',
    'Utilities: cooling-water, hydrotest and settling-pond transfer.',
  ],
  package: 'Pump, power unit, hoses, operator, HSE documentation and performance report; planned hire, standby or emergency call-out.',
  base: `Mobilisation from ${company.operatingBase}.`,
} as const; // slides 18–21: capability, not completed refinery work

export const serviceDetails = [
  ['Lagoon, river and nearshore sand sourcing; profile deep-borrow capability 20–40 m and deep-sea maintenance up to 40 m.', 'Hydraulic fill for road embankments, bridge approaches, industrial plots and reclamation.', 'Dyke construction, containment, elevation control and settlement management.'],
  ['Sharp sand / selected fill supplied by m³, tonnes or agreed project measurement.', 'Sand winning, stockpiling and delivery from approved marine or lagoon sources.'],
  ['Flood-control berms and perimeter sand bunds.', 'Geotextile and rip-rap erosion mitigation, bank protection and shoreline stabilisation.'],
  ['Bathymetric / hydrographic surveying and as-built verification.', 'Reclamation volume assessment, settlement monitoring and compaction mapping.'],
  ['Estate earthworks, compaction, grading and soil stabilisation.', 'Access roads, platforms and marine loading areas.'],
  ['HDPE welding and deployment; marine logistics, tugboats, winches and moorings.', 'Anchor-system installation and workshop / onsite repairs.'],
] as const; // slides 2–3, 13

export const qualityDetails = [
  { title: 'Source and reserve verification', items: ['Approved/licensed source boundaries; RTK/GPS and bathymetric survey.', 'Boreholes, vibrocores or equivalent subsurface investigation where required.', 'Usable sand thickness, exclusion zones and recoverable reserve calculation.', 'Periodic resurvey to reconcile extraction against production records.'] },
  { title: 'Laboratory testing', items: ['Particle-size distribution, sieve analysis and percentage fines.', 'Moisture content, bulk density and specific gravity.', 'MDD/OMC (Proctor) and CBR when road / subgrade specifications require.', 'Atterberg limits where applicable.', 'Chloride / salinity, organic or contaminant screening when specified.'] },
  { title: 'Material acceptance and quantity checks', items: ['Sample → Test → Approve → Produce → Verify.', 'Representative source and discharge-point samples; approved laboratory / engineer-required test matrix.', 'Contract-specification acceptance; survey, weighbridge or quantity reconciliation.', "Test frequency, sample custody and acceptance records aligned with the contractor / supervising engineer's ITP and material-source approval process."] },
] as const; // slide 15

export const hseDetails = [
  'Zero-incident policy; compulsory life jackets, helmets, gloves and eye protection.',
  'Daily toolbox talks before each shift and onsite HSE officers throughout operations.',
  'SIMOPS procedures for simultaneous marine and land activities.',
  'NIWA/LASWA vessel-movement and navigation controls; local community engagement.',
  'Turbidity and siltation control during discharge.',
  'Fuel handling, spill prevention and spill response planning.',
] as const; // slides 4, 10

export const executionSteps = [
  ['Source approval', 'Boundary, permits, reserve and material compliance.'],
  ['Mobilise and configure', 'Pump selection, power, route and discharge controls.'],
  ['Dredge and pump', 'Production within the approved source and operating envelope.'],
  ['Place and contain', 'Discharge into dykes / designated cells with managed runoff.'],
  ['Drain and shape', 'Dewatering, spreading, grading and staged formation.'],
  ['Verify and hand over', 'Surveyed volume, daily records and engineer/client acceptance.'],
] as const; // slide 16

export const commercialOptions = [
  'Dredging subcontract by m³ dredged or placed.',
  'Hydraulic-fill subcontract including source and pipeline.',
  'Bulk sand supply by tonnes, weighbridge or truckload.',
  'Plant-and-operator deployment by day or month.',
  'Dedicated sand-source operation with agreed reserve and quality controls.',
  'Combined dredging, pumping, placement and measurement package.',
] as const; // slide 17

export const reporting = [
  'Daily dredging / pumping hours; equipment availability and downtime.',
  'Production volumes and discharge location.',
  'Material test certificates and source records.',
  'Surveyed / weighbridge quantities, as applicable.',
  'HSE observations and toolbox records.',
  'Client / engineer approvals and progress reports.',
] as const; // slide 17

export const organisation = [
  'Managing Director: leadership and operational oversight.',
  'Marine Operations Manager: dredging coordination and fleet management.',
  'Dredge masters and engineers: daily dredging supervision.',
  'Hydrographic survey team: pre-, interim- and post-dredge mapping.',
  'Mechanical / electrical team: maintenance and emergency repairs.',
  'HSE unit: safety, documentation and compliance.',
  'Logistics / procurement: fuel, spares, transport and consumables.',
  'Administration / finance: reporting, invoicing and regulatory compliance.',
] as const; // slide 4

export const leadershipQualifications = [
  ['Blessing O. Uzo', 'BSc Political Science; Diploma Public Administration'],
  ['Ikechukwu C. Uzo', 'M.Arch'],
  ['Barr. Tosan Omatseye', 'BL, LLB, MBA'],
  ['Dr. Adaora Uzo', 'MBBS'],
  ['Dr. Rotimi Mafoluku', 'MSc Public Health, MBA'],
  ['Joyce Bamidele', 'BSc Accounting, ACCA, ICAN'],
] as const; // slide 6

export const quoteFields = [
  ["name", "Name", "text"],
  ["company", "Company or organisation", "text"],
  ["email", "Email address", "email"],
  ["phone", "Phone number", "tel"],
  ["location", "Project location", "text"],
  ["volume", "Approximate volume", "number"],
  ["pipelineDistance", "Pipeline distance", "number"],
  ["timeline", "Required timeline", "text"],
] as const;
export const quoteRequiredFields = [
  "name",
  "email",
  "phone",
  "location",
  "projectType",
] as const;
export const quoteProjectTypes = [
  "Hydraulic dredging and reclamation",
  "Sand winning and bulk supply",
  "Coastal and lagoon engineering",
  "Surveying and bathymetry",
  "Terrain and earthworks",
  "Pipeline and marine support",
  "Industrial pumping and emergency dewatering",
] as const;
export const MAX_QUOTE_ATTACHMENT_BYTES = 5_000_000;

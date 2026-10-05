export const quoteFields = [
  ["name", "Name", "text"],
  ["phone", "Phone / WhatsApp", "tel"],
  ["location", "Project location", "text"],
  ["email", "Email address (optional)", "email"],
  ["company", "Company or organisation (optional)", "text"],
] as const;
export const quoteEngineeringFields = [
  ["volume", "Approximate volume (m³)", "number"],
  ["pipelineDistance", "Pipeline distance (m)", "number"],
  ["timeline", "Required timeline", "text"],
] as const;
export const quoteRequiredFields = [
  "name",
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
  "Not sure yet",
] as const;
export const MAX_QUOTE_ATTACHMENT_BYTES = 5_000_000;
export const MAX_QUOTE_REQUEST_BYTES = MAX_QUOTE_ATTACHMENT_BYTES + 100_000;

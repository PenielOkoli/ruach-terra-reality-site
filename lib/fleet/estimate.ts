export interface FillEstimateInput {
  volume: string | number;
  distance: string | number;
  hours: string | number;
}

import { productionBasis } from '@/content/profile-details';

// Simple volume / combined planning-rate arithmetic, not a hydraulic model.
export function estimateHydraulicFill({
  volume,
  distance,
  hours,
}: FillEstimateInput) {
  const cubic = Number.isFinite(Number(volume)) ? Math.max(0, Number(volume)) : 0;
  const pipeline = Number(distance);
  const shift = Number.isFinite(Number(hours)) ? Math.max(1, Number(hours) || 1) : 1;
  return {
    low: cubic / (productionBasis.high * shift),
    high: cubic / (productionBasis.low * shift),
    requiresAssessment: !Number.isFinite(pipeline) || pipeline < productionBasis.typicalDistanceMinKm || pipeline > productionBasis.typicalDistanceMaxKm,
  };
}

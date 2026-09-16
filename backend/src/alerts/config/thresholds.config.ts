import { SensorType } from '../../database/schemas/reading.schema';

export interface ThresholdBounds {
  min?: number;
  max?: number;
}

/**
 * Single source of truth for alert thresholds, per sensor type.
 * See README for rationale behind each bound.
 */
export const THRESHOLDS: Record<SensorType, ThresholdBounds> = {
  temperature: { min: -10, max: 40 }, // °C
  humidity: { min: 10, max: 90 }, // %
  air_quality: { max: 150 }, // AQI
};

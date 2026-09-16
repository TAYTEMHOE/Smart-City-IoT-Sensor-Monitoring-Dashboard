export type SensorType = 'temperature' | 'humidity' | 'air_quality';

export interface ReadingPayload {
  sensorId: string;
  sensorType: SensorType;
  value: number;
  unit: string;
  timestamp: string;
}

interface Range {
  min: number;
  max: number;
}

export interface SensorDefinition {
  sensorId: string;
  sensorType: SensorType;
  unit: string;
  intervalMs: number;
  decimals: number;
  normalRange: Range;
  /** Ranges that fall outside the backend's alert thresholds (see
   * backend/src/alerts/config/thresholds.config.ts) — picking a value from
   * one of these is what makes a reading trigger an alert. */
  spikeRanges: Range[];
}

// Normal ranges stay comfortably inside the backend thresholds (temperature
// -10..40°C, humidity 10..90%, air_quality max 150 AQI); spike ranges are
// deliberately outside them so alerting is actually exercised during a demo.
export const SENSORS: SensorDefinition[] = [
  {
    sensorId: 'temp-01',
    sensorType: 'temperature',
    unit: '°C',
    intervalMs: 3000,
    decimals: 1,
    normalRange: { min: 15, max: 30 },
    spikeRanges: [
      { min: -25, max: -11 },
      { min: 41, max: 55 },
    ],
  },
  {
    sensorId: 'hum-01',
    sensorType: 'humidity',
    unit: '%',
    intervalMs: 4000,
    decimals: 1,
    normalRange: { min: 30, max: 70 },
    spikeRanges: [
      { min: 0, max: 9 },
      { min: 91, max: 100 },
    ],
  },
  {
    sensorId: 'aq-01',
    sensorType: 'air_quality',
    unit: 'AQI',
    intervalMs: 5000,
    decimals: 0,
    normalRange: { min: 20, max: 100 },
    spikeRanges: [{ min: 151, max: 300 }],
  },
];

function randomInRange(range: Range, decimals: number): number {
  const value = Math.random() * (range.max - range.min) + range.min;
  return Number(value.toFixed(decimals));
}

function pickSpikeRange(sensor: SensorDefinition): Range {
  const index = Math.floor(Math.random() * sensor.spikeRanges.length);
  return sensor.spikeRanges[index];
}

export interface GeneratedReading {
  payload: ReadingPayload;
  isSpike: boolean;
}

export function generateReading(
  sensor: SensorDefinition,
  spikeProbability: number,
): GeneratedReading {
  const isSpike = Math.random() < spikeProbability;
  const range = isSpike ? pickSpikeRange(sensor) : sensor.normalRange;
  const value = randomInRange(range, sensor.decimals);

  return {
    isSpike,
    payload: {
      sensorId: sensor.sensorId,
      sensorType: sensor.sensorType,
      value,
      unit: sensor.unit,
      timestamp: new Date().toISOString(),
    },
  };
}

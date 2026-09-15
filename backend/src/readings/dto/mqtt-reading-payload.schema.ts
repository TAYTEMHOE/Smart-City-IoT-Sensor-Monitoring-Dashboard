import { z } from 'zod';

/**
 * Validates inbound MQTT payloads published to smartcity/sensors/{sensorId}/reading.
 * Also the source of truth for the Reading shape as ingested (before server-added
 * fields like receivedAt/isAlert).
 */
export const mqttReadingPayloadSchema = z.object({
  sensorId: z.string().min(1),
  sensorType: z.enum(['temperature', 'humidity', 'air_quality']),
  value: z.number(),
  unit: z.string().min(1),
  timestamp: z.string().datetime(),
});

export type MqttReadingPayload = z.infer<typeof mqttReadingPayloadSchema>;

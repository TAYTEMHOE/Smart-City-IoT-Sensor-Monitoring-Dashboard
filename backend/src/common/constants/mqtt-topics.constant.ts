/**
 * Topic structure is fixed by the take-home spec: smartcity/sensors/{sensorId}/reading
 */
export const MQTT_READING_TOPIC_WILDCARD = 'smartcity/sensors/+/reading';

export function buildReadingTopic(sensorId: string): string {
  return `smartcity/sensors/${sensorId}/reading`;
}

/**
 * Extracts the sensorId segment from a concrete (non-wildcard) reading topic.
 * Returns null if the topic doesn't match the expected shape.
 */
export function parseSensorIdFromTopic(topic: string): string | null {
  const match = topic.match(/^smartcity\/sensors\/([^/]+)\/reading$/);
  return match ? match[1] : null;
}

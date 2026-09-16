import mqtt, { MqttClient } from 'mqtt';

const READING_TOPIC_PREFIX = 'smartcity/sensors';

/** Mirrors backend/src/common/constants/mqtt-topics.constant.ts. Duplicated
 * rather than shared: the simulator is a standalone publisher, not a
 * consumer of backend code (real sensors wouldn't import the ingestion
 * service either). */
export function buildReadingTopic(sensorId: string): string {
  return `${READING_TOPIC_PREFIX}/${sensorId}/reading`;
}

export function connect(url: string): Promise<MqttClient> {
  return new Promise((resolve, reject) => {
    const client = mqtt.connect(url, { reconnectPeriod: 2000 });

    const onConnect = () => {
      client.off('error', onError);
      console.log(`[mqtt] connected to ${url}`);
      resolve(client);
    };
    const onError = (err: Error) => {
      client.off('connect', onConnect);
      console.error(`[mqtt] connection error: ${err.message}`);
      reject(err);
    };

    client.once('connect', onConnect);
    client.once('error', onError);
    client.on('reconnect', () => console.log('[mqtt] reconnecting...'));
    client.on('close', () => console.log('[mqtt] connection closed'));
  });
}

export function publishReading(
  client: MqttClient,
  sensorId: string,
  payload: unknown,
): void {
  const topic = buildReadingTopic(sensorId);
  client.publish(topic, JSON.stringify(payload), { qos: 0 }, (err) => {
    if (err) {
      console.error(`[mqtt] failed to publish to ${topic}: ${err.message}`);
    }
  });
}

import 'dotenv/config';
import type { MqttClient } from 'mqtt';
import { connect, publishReading } from './mqtt-client';
import { generateReading, SENSORS } from './sensors';

const MQTT_URL = process.env.MQTT_URL ?? 'mqtt://localhost:1883';
const SPIKE_PROBABILITY = Number(process.env.SIM_SPIKE_PROBABILITY ?? 0.15);
const INTERVAL_OVERRIDE_MS = process.env.SIM_PUBLISH_INTERVAL_MS
  ? Number(process.env.SIM_PUBLISH_INTERVAL_MS)
  : undefined;

function startPublishing(client: MqttClient): NodeJS.Timeout[] {
  return SENSORS.map((sensor) => {
    const intervalMs = INTERVAL_OVERRIDE_MS ?? sensor.intervalMs;

    const tick = () => {
      const { payload, isSpike } = generateReading(sensor, SPIKE_PROBABILITY);
      publishReading(client, sensor.sensorId, payload);
      console.log(
        `[sim] ${payload.sensorId} -> ${payload.value}${payload.unit}${
          isSpike ? ' (spike)' : ''
        }`,
      );
    };

    tick();
    return setInterval(tick, intervalMs);
  });
}

async function main(): Promise<void> {
  const client = await connect(MQTT_URL);
  const timers = startPublishing(client);

  const shutdown = () => {
    console.log('\n[sim] shutting down...');
    timers.forEach(clearInterval);
    client.end(false, {}, () => process.exit(0));
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((err) => {
  console.error(`[sim] fatal error: ${(err as Error).message}`);
  process.exit(1);
});

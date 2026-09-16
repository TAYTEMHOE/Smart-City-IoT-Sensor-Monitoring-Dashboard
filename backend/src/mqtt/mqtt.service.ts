import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { EventEmitter } from 'events';
import { MqttClient } from 'mqtt';
import { MQTT_CLIENT } from './mqtt.tokens';

export type MqttMessageHandler = (topic: string, payload: Buffer) => void;

/**
 * Owns the MQTT connection lifecycle and exposes a small event-emitter style
 * API so consumers (IngestionModule) don't need to know about the underlying
 * `mqtt` client. The client itself is provided via the MQTT_CLIENT DI token
 * (see mqtt.module.ts) so it can be swapped for a mock in unit tests.
 * Reconnection is handled by the client (reconnectPeriod), so a dropped
 * broker connection retries automatically.
 */
@Injectable()
export class MqttService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MqttService.name);
  private readonly emitter = new EventEmitter();

  constructor(@Inject(MQTT_CLIENT) private readonly client: MqttClient) {}

  onModuleInit(): void {
    this.client.on('connect', () =>
      this.logger.log('Connected to MQTT broker'),
    );
    this.client.on('reconnect', () =>
      this.logger.warn('Reconnecting to MQTT broker...'),
    );
    this.client.on('error', (err) =>
      this.logger.error(`MQTT client error: ${err.message}`),
    );
    this.client.on('message', (topic, payload) =>
      this.emitter.emit('message', topic, payload),
    );
  }

  onModuleDestroy(): void {
    this.client.end(true);
  }

  subscribe(topic: string): void {
    this.client.subscribe(topic, (err) => {
      if (err) {
        this.logger.error(`Failed to subscribe to ${topic}: ${err.message}`);
      } else {
        this.logger.log(`Subscribed to ${topic}`);
      }
    });
  }

  onMessage(handler: MqttMessageHandler): void {
    this.emitter.on('message', handler);
  }
}

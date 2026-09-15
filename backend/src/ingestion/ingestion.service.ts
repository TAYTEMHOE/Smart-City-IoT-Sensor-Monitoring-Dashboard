import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AlertsService } from '../alerts/alerts.service';
import { MqttService } from '../mqtt/mqtt.service';
import { mqttReadingPayloadSchema } from '../readings/dto/mqtt-reading-payload.schema';
import { ReadingsService } from '../readings/readings.service';

/**
 * Orchestrates the ingestion pipeline: validate -> persist -> evaluate.
 * Contains no persistence/alerting logic itself, just the glue between
 * MqttService, ReadingsService and AlertsService, so each stays independently
 * testable and this can be unit-tested by mocking the three.
 */
@Injectable()
export class IngestionService implements OnModuleInit {
  private readonly logger = new Logger(IngestionService.name);

  constructor(
    private readonly mqttService: MqttService,
    private readonly readingsService: ReadingsService,
    private readonly alertsService: AlertsService,
    private readonly config: ConfigService,
  ) {}

  onModuleInit(): void {
    const topic = this.config.get<string>('mqtt.readingTopic')!;
    this.mqttService.subscribe(topic);
    this.mqttService.onMessage((topic, payload) =>
      this.handleMessage(topic, payload),
    );
  }

  private async handleMessage(topic: string, payload: Buffer): Promise<void> {
    let parsed: unknown;
    try {
      parsed = JSON.parse(payload.toString());
    } catch {
      this.logger.warn(`Dropping message on ${topic}: not valid JSON`);
      return;
    }

    const result = mqttReadingPayloadSchema.safeParse(parsed);
    if (!result.success) {
      this.logger.warn(`Dropping message on ${topic}: ${result.error.message}`);
      return;
    }

    const payloadData = result.data;

    try {
      const reading = await this.readingsService.create({
        sensorId: payloadData.sensorId,
        sensorType: payloadData.sensorType,
        value: payloadData.value,
        unit: payloadData.unit,
        timestamp: new Date(payloadData.timestamp),
      });

      const alert = await this.alertsService.evaluate(reading);
      if (alert) {
        await this.readingsService.markAsAlert(String(reading._id));
      }
    } catch (err) {
      this.logger.error(
        `Failed to process reading from ${topic}: ${(err as Error).message}`,
      );
    }
  }
}

import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { connect } from 'mqtt';
import { MqttService } from './mqtt.service';
import { MQTT_CLIENT } from './mqtt.tokens';

/**
 * Global so ReadingsModule/AlertsModule siblings never need to re-import it;
 * IngestionModule is the only consumer that actually subscribes to topics.
 */
@Global()
@Module({
  providers: [
    {
      provide: MQTT_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        connect(config.get<string>('mqtt.url')!, { reconnectPeriod: 2000 }),
    },
    MqttService,
  ],
  exports: [MqttService],
})
export class MqttModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AlertsModule } from './alerts/alerts.module';
import configuration from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { IngestionModule } from './ingestion/ingestion.module';
import { MqttModule } from './mqtt/mqtt.module';
import { ReadingsModule } from './readings/readings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    MqttModule,
    ReadingsModule,
    AlertsModule,
    IngestionModule,
  ],
})
export class AppModule {}

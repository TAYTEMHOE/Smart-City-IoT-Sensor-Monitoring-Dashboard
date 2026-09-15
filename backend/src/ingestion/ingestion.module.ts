import { Module } from '@nestjs/common';
import { AlertsModule } from '../alerts/alerts.module';
import { ReadingsModule } from '../readings/readings.module';
import { IngestionService } from './ingestion.service';

@Module({
  imports: [ReadingsModule, AlertsModule],
  providers: [IngestionService],
})
export class IngestionModule {}

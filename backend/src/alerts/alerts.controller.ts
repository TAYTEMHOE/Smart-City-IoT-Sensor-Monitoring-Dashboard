import { Controller, Get, Query } from '@nestjs/common';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { AlertsService } from './alerts.service';
import { queryAlertsSchema, QueryAlertsDto } from './dto/query-alerts.schema';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  findAll(
    @Query(new ZodValidationPipe(queryAlertsSchema)) query: QueryAlertsDto,
  ) {
    return this.alertsService.query(query);
  }
}

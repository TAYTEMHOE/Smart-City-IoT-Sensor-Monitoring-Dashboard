import { Controller, Get, Query } from '@nestjs/common';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import {
  queryReadingsSchema,
  QueryReadingsDto,
} from './dto/query-readings.schema';
import { ReadingsService } from './readings.service';

@Controller('readings')
export class ReadingsController {
  constructor(private readonly readingsService: ReadingsService) {}

  @Get()
  findAll(
    @Query(new ZodValidationPipe(queryReadingsSchema)) query: QueryReadingsDto,
  ) {
    return this.readingsService.query(query);
  }
}

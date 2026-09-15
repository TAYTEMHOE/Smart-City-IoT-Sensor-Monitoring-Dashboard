import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Reading, ReadingSchema } from '../database/schemas/reading.schema';
import { ReadingsController } from './readings.controller';
import { ReadingsService } from './readings.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Reading.name, schema: ReadingSchema }]),
  ],
  controllers: [ReadingsController],
  providers: [ReadingsService],
  exports: [ReadingsService],
})
export class ReadingsModule {}

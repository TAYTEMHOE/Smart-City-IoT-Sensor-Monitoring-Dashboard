import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SensorType = 'temperature' | 'humidity' | 'air_quality';

export type ReadingDocument = Reading & Document;

@Schema({ collection: 'readings' })
export class Reading {
  @Prop({ required: true, index: true })
  sensorId: string;

  @Prop({
    required: true,
    enum: ['temperature', 'humidity', 'air_quality'],
    index: true,
  })
  sensorType: SensorType;

  @Prop({ required: true, type: Number })
  value: number;

  @Prop({ required: true })
  unit: string;

  @Prop({ required: true, index: true })
  timestamp: Date;

  @Prop({ required: true })
  receivedAt: Date;

  @Prop({ required: true, default: false, index: true })
  isAlert: boolean;
}

export const ReadingSchema = SchemaFactory.createForClass(Reading);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { SensorType } from './reading.schema';

export type AlertDirection = 'above' | 'below';

export type AlertDocument = Alert & Document;

@Schema({ collection: 'alerts' })
export class Alert {
  @Prop({ type: Types.ObjectId, ref: 'Reading', required: true })
  readingId: Types.ObjectId;

  @Prop({ required: true, index: true })
  sensorId: string;

  @Prop({ required: true, enum: ['temperature', 'humidity', 'air_quality'] })
  sensorType: SensorType;

  @Prop({ required: true, type: Number })
  value: number;

  @Prop({ required: true, type: Number })
  threshold: number;

  @Prop({ required: true, enum: ['above', 'below'] })
  direction: AlertDirection;

  @Prop({ required: true, index: true })
  triggeredAt: Date;

  @Prop({ required: true, default: false })
  acknowledged: boolean;
}

export const AlertSchema = SchemaFactory.createForClass(Alert);

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { Alert, AlertDocument } from '../database/schemas/alert.schema';
import { ReadingDocument } from '../database/schemas/reading.schema';
import { THRESHOLDS } from './config/thresholds.config';
import { QueryAlertsDto } from './dto/query-alerts.schema';

@Injectable()
export class AlertsService {
  private readonly logger = new Logger(AlertsService.name);

  constructor(
    @InjectModel(Alert.name) private readonly alertModel: Model<AlertDocument>,
  ) {}

  /**
   * Evaluates a persisted reading against its sensor type's threshold bounds.
   * Stateless/synchronous per reading — no debouncing/hysteresis, by design
   * (see architecture doc §5.6).
   */
  async evaluate(reading: ReadingDocument): Promise<AlertDocument | null> {
    const bounds = THRESHOLDS[reading.sensorType];
    if (!bounds) return null;

    let threshold: number | undefined;
    let direction: 'above' | 'below' | undefined;

    if (bounds.max !== undefined && reading.value > bounds.max) {
      threshold = bounds.max;
      direction = 'above';
    } else if (bounds.min !== undefined && reading.value < bounds.min) {
      threshold = bounds.min;
      direction = 'below';
    }

    if (!direction || threshold === undefined) return null;

    const alert = await this.alertModel.create({
      readingId: reading._id as Types.ObjectId,
      sensorId: reading.sensorId,
      sensorType: reading.sensorType,
      value: reading.value,
      threshold,
      direction,
      triggeredAt: reading.timestamp,
      acknowledged: false,
    });

    this.logger.warn(
      `Alert: ${reading.sensorId} ${reading.sensorType} ${reading.value} ${direction} threshold ${threshold}`,
    );

    return alert;
  }

  async query(filters: QueryAlertsDto) {
    const where: FilterQuery<AlertDocument> = {};

    if (filters.sensorId) where.sensorId = filters.sensorId;
    if (filters.acknowledged !== undefined)
      where.acknowledged = filters.acknowledged;
    if (filters.from || filters.to) {
      where.triggeredAt = {};
      if (filters.from) where.triggeredAt.$gte = new Date(filters.from);
      if (filters.to) where.triggeredAt.$lte = new Date(filters.to);
    }

    return this.alertModel.find(where).sort({ triggeredAt: -1 }).exec();
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Reading, ReadingDocument } from '../database/schemas/reading.schema';
import { QueryReadingsDto } from './dto/query-readings.schema';
import {
  CreateReadingInput,
  PaginatedResult,
} from './interfaces/reading.interface';

@Injectable()
export class ReadingsService {
  private readonly logger = new Logger(ReadingsService.name);

  constructor(
    @InjectModel(Reading.name)
    private readonly readingModel: Model<ReadingDocument>,
  ) {}

  async create(input: CreateReadingInput): Promise<ReadingDocument> {
    try {
      return await this.readingModel.create({
        ...input,
        receivedAt: new Date(),
        isAlert: false,
      });
    } catch (err) {
      this.logger.error(
        `Failed to persist reading for ${input.sensorId}: ${(err as Error).message}`,
      );
      throw err;
    }
  }

  async markAsAlert(readingId: string): Promise<void> {
    await this.readingModel.updateOne(
      { _id: readingId },
      { $set: { isAlert: true } },
    );
  }

  async query(
    filters: QueryReadingsDto,
  ): Promise<PaginatedResult<ReadingDocument>> {
    const where: FilterQuery<ReadingDocument> = {};

    if (filters.sensorId) where.sensorId = filters.sensorId;
    if (filters.sensorType) where.sensorType = filters.sensorType;
    if (filters.onlyAlerts) where.isAlert = true;
    if (filters.from || filters.to) {
      where.timestamp = {};
      if (filters.from) where.timestamp.$gte = new Date(filters.from);
      if (filters.to) where.timestamp.$lte = new Date(filters.to);
    }

    const skip = (filters.page - 1) * filters.limit;

    const [data, total] = await Promise.all([
      this.readingModel
        .find(where)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(filters.limit)
        .exec(),
      this.readingModel.countDocuments(where).exec(),
    ]);

    return {
      data,
      meta: { total, page: filters.page, limit: filters.limit },
    };
  }
}

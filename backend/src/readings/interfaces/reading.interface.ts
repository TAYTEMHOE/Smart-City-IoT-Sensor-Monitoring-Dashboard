import { SensorType } from '../../database/schemas/reading.schema';

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface CreateReadingInput {
  sensorId: string;
  sensorType: SensorType;
  value: number;
  unit: string;
  timestamp: Date;
}

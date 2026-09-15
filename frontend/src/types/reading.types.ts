export type SensorType = 'temperature' | 'humidity' | 'air_quality';

export interface Reading {
  _id: string;
  sensorId: string;
  sensorType: SensorType;
  value: number;
  unit: string;
  timestamp: string;
  receivedAt: string;
  isAlert: boolean;
}

export type AlertDirection = 'above' | 'below';

export interface Alert {
  _id: string;
  readingId: string;
  sensorId: string;
  sensorType: SensorType;
  value: number;
  threshold: number;
  direction: AlertDirection;
  triggeredAt: string;
  acknowledged: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface ReadingsFilters {
  sensorId?: string;
  sensorType?: SensorType;
  from?: string;
  to?: string;
  onlyAlerts?: boolean;
  limit?: number;
  page?: number;
}

export interface AlertsFilters {
  sensorId?: string;
  from?: string;
  to?: string;
  acknowledged?: boolean;
}

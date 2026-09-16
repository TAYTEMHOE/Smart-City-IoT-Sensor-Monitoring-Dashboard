import type { PaginatedResult, Reading, ReadingsFilters } from '../types/reading.types';
import { apiGet } from './client';

export function getReadings(filters: ReadingsFilters = {}): Promise<PaginatedResult<Reading>> {
  return apiGet<PaginatedResult<Reading>>('/readings', filters);
}

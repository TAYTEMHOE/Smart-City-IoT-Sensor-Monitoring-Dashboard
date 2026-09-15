import type { Alert, AlertsFilters } from '../types/reading.types';
import { apiGet } from './client';

export function getAlerts(filters: AlertsFilters = {}): Promise<Alert[]> {
  return apiGet<Alert[]>('/alerts', filters);
}

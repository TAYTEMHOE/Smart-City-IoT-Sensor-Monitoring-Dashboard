import { useCallback } from 'react';
import { getAlerts } from '../api/alerts.api';
import { POLL_INTERVAL_MS } from '../constants';
import type { AlertsFilters } from '../types/reading.types';
import { usePolling } from './usePolling';

export function useAlerts(filters: AlertsFilters) {
  const fetcher = useCallback(() => getAlerts(filters), [filters]);
  return usePolling(fetcher, POLL_INTERVAL_MS);
}

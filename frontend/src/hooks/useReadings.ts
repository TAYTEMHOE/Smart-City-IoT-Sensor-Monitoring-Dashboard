import { useCallback } from 'react';
import { getReadings } from '../api/readings.api';
import { POLL_INTERVAL_MS } from '../constants';
import type { ReadingsFilters } from '../types/reading.types';
import { usePolling } from './usePolling';

export function useReadings(filters: ReadingsFilters) {
  const fetcher = useCallback(() => getReadings(filters), [filters]);
  return usePolling(fetcher, POLL_INTERVAL_MS);
}

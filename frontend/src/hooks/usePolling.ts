import { useEffect, useRef, useState } from 'react';

interface PollingState<T> {
  data: T | undefined;
  error: Error | undefined;
  loading: boolean;
}

/**
 * Generic setInterval-based refetch hook. Refetches immediately when
 * `fetcher` changes (e.g. filters change) and then on every `intervalMs`.
 * Guards against overlapping requests: a fetch already in flight skips the
 * next tick rather than stacking up.
 */
export function usePolling<T>(fetcher: () => Promise<T>, intervalMs: number): PollingState<T> {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(true);
  const inFlight = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const tick = async () => {
      if (inFlight.current) return;
      inFlight.current = true;

      try {
        const result = await fetcher();
        if (!cancelled) {
          setData(result);
          setError(undefined);
        }
      } catch (err) {
        if (!cancelled) setError(err as Error);
      } finally {
        inFlight.current = false;
        if (!cancelled) setLoading(false);
      }
    };

    void tick();
    const id = setInterval(tick, intervalMs);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher, intervalMs]);

  return { data, error, loading };
}

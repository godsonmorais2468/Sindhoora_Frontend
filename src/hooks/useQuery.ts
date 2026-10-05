import { useCallback, useEffect, useEffectEvent, useState } from 'react';

/**
 * A deliberately small data-fetching hook for the service layer.
 *
 * - Caches results by key, so returning to a page renders instantly while it revalidates.
 * - `invalidateQueries(prefix)` refetches every mounted query whose key starts with `prefix`.
 *
 * If the project grows, this can be swapped for TanStack Query with the same call sites.
 */

const cache = new Map<string, unknown>();
const listeners = new Set<(prefix: string) => void>();

export function invalidateQueries(prefix = ''): void {
  for (const key of [...cache.keys()]) if (key.startsWith(prefix)) cache.delete(key);
  listeners.forEach((notify) => notify(prefix));
}

interface QueryState<T> {
  key: string;
  data: T | undefined;
  error: Error | null;
}

export function useQuery<T>(key: string, fetcher: () => Promise<T>) {
  const [state, setState] = useState<QueryState<T>>(() => ({ key, data: cache.get(key) as T | undefined, error: null }));
  const [version, setVersion] = useState(0);

  const runFetch = useEffectEvent(() => fetcher());

  useEffect(() => {
    const onInvalidate = (prefix: string) => {
      if (key.startsWith(prefix)) setVersion((v) => v + 1);
    };
    listeners.add(onInvalidate);
    return () => {
      listeners.delete(onInvalidate);
    };
  }, [key]);

  useEffect(() => {
    let cancelled = false;
    runFetch().then(
      (data) => {
        if (cancelled) return;
        cache.set(key, data);
        setState({ key, data, error: null });
      },
      (error: unknown) => {
        if (cancelled) return;
        setState((prev) => ({ key, data: prev.key === key ? prev.data : undefined, error: error instanceof Error ? error : new Error(String(error)) }));
      },
    );
    return () => {
      cancelled = true;
    };
  }, [key, version]);

  // When the key changes, fall back to cached data for the new key until the fetch resolves.
  const isCurrent = state.key === key;
  const data = isCurrent ? state.data : (cache.get(key) as T | undefined);
  const error = isCurrent ? state.error : null;

  const refetch = useCallback(() => setVersion((v) => v + 1), []);

  return { data, error, isLoading: data === undefined && !error, refetch };
}

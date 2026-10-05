import { useCallback, useEffect, useState } from 'react';
import { readStorage, writeStorage } from '@/utils/storage';

/**
 * State that persists to localStorage and stays in sync across browser tabs.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => readStorage(key, initialValue));

  useEffect(() => {
    writeStorage(key, value);
  }, [key, value]);

  // Keep other open tabs in sync (e.g. cart updated in a second tab).
  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key === key) setValue(readStorage(key, initialValue));
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
    // initialValue is only a fallback; re-subscribing when its identity changes is unnecessary.
  }, [key]);

  const update = useCallback((next: T | ((prev: T) => T)) => setValue(next), []);

  return [value, update] as const;
}

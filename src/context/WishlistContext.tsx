import { createContext, useCallback, useMemo, type ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/utils/storage';

export interface WishlistValue {
  ids: string[];
  idSet: ReadonlySet<string>;
  toggle: (productId: string) => void;
  remove: (productId: string) => void;
  clear: () => void;
}

export const WishlistContext = createContext<WishlistValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useLocalStorage<string[]>(STORAGE_KEYS.wishlist, []);

  const toggle = useCallback(
    (productId: string) =>
      setIds((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId])),
    [setIds],
  );
  const remove = useCallback((productId: string) => setIds((prev) => prev.filter((id) => id !== productId)), [setIds]);
  const clear = useCallback(() => setIds([]), [setIds]);

  const value = useMemo<WishlistValue>(() => ({ ids, idSet: new Set(ids), toggle, remove, clear }), [ids, toggle, remove, clear]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

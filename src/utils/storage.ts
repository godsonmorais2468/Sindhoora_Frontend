/**
 * The single place that touches Web Storage.
 * Every read/write is guarded: storage can be unavailable (private mode, blocked cookies)
 * or full, and the app must keep working either way.
 */

type StorageKind = 'local' | 'session';

function getStore(kind: StorageKind): Storage | null {
  try {
    return kind === 'local' ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

export function readStorage<T>(key: string, fallback: T, kind: StorageKind = 'local'): T {
  try {
    const raw = getStore(kind)?.getItem(key);
    return raw == null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

/** Returns false when the value could not be saved (e.g. quota exceeded). */
export function writeStorage<T>(key: string, value: T, kind: StorageKind = 'local'): boolean {
  try {
    getStore(kind)?.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeStorage(key: string, kind: StorageKind = 'local'): void {
  try {
    getStore(kind)?.removeItem(key);
  } catch {
    /* ignore */
  }
}

export const STORAGE_KEYS = {
  cart: 'sindhoora.cart.v1',
  wishlist: 'sindhoora.wishlist.v1',
  auth: 'sindhoora.auth.v1',
  splashSeen: 'sindhoora.hasSeenSplash',
  lastOrder: 'sindhoora.lastOrder',
  dbProducts: 'sindhoora.db.products.v1',
  dbOrders: 'sindhoora.db.orders.v1',
  dbCustomers: 'sindhoora.db.customers.v1',
  settings: 'sindhoora.settings.v1',
} as const;

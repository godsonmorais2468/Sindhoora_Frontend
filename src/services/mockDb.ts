/**
 * A tiny localStorage-backed "database" for the prototype.
 *
 * Services read and write through these tables; components never touch them directly.
 * When the Django REST backend is ready, only the service files need to change —
 * their function signatures already return Promises shaped like API responses.
 */
import { seedCustomers } from '@/data/customers';
import { seedOrders } from '@/data/orders';
import { seedProducts } from '@/data/products';
import type { Customer } from '@/types/customer';
import type { Order } from '@/types/order';
import type { Product } from '@/types/product';
import { wait } from '@/utils/helpers';
import { readStorage, removeStorage, STORAGE_KEYS, writeStorage } from '@/utils/storage';

export class StorageQuotaError extends Error {
  constructor() {
    super('Browser storage is full. Try using fewer or smaller images.');
    this.name = 'StorageQuotaError';
  }
}

function createTable<T>(key: string, seed: T[]) {
  let rows: T[] | null = null;
  return {
    all(): T[] {
      if (!rows) rows = readStorage<T[] | null>(key, null) ?? structuredClone(seed);
      return rows;
    },
    save(next: T[]): void {
      if (!writeStorage(key, next)) throw new StorageQuotaError();
      rows = next;
    },
    reset(): void {
      rows = null;
      removeStorage(key);
    },
  };
}

export const db = {
  products: createTable<Product>(STORAGE_KEYS.dbProducts, seedProducts),
  orders: createTable<Order>(STORAGE_KEYS.dbOrders, seedOrders),
  customers: createTable<Customer>(STORAGE_KEYS.dbCustomers, seedCustomers),
};

/** Restores the original demo catalogue, orders and customers. */
export function resetMockDb(): void {
  db.products.reset();
  db.orders.reset();
  db.customers.reset();
  removeStorage(STORAGE_KEYS.settings);
}

/** Simulated network latency so loading states are exercised like a real API. */
export function networkDelay(ms = 220): Promise<void> {
  return wait(ms);
}

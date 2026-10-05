import { defaultSettings } from '@/data/settings';
import type { StoreSettings } from '@/types/common';
import { readStorage, STORAGE_KEYS, writeStorage } from '@/utils/storage';
import { networkDelay } from './mockDb';

// Future DRF mapping: GET/PATCH /api/admin/settings/

export function readSettings(): StoreSettings {
  return { ...defaultSettings, ...readStorage<Partial<StoreSettings>>(STORAGE_KEYS.settings, {}) };
}

export async function getSettings(): Promise<StoreSettings> {
  await networkDelay(120);
  return readSettings();
}

export async function updateSettings(patch: Partial<StoreSettings>): Promise<StoreSettings> {
  await networkDelay(300);
  const next = { ...readSettings(), ...patch };
  writeStorage(STORAGE_KEYS.settings, next);
  return next;
}

/** Shipping rule shared by the cart preview and order creation. */
export function calculateShipping(subtotal: number, settings: StoreSettings): number {
  if (subtotal <= 0) return 0;
  return subtotal >= settings.freeShippingThreshold ? 0 : settings.shippingFee;
}

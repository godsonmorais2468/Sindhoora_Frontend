import type { StoreSettings } from '@/types/common';
import { siteInfo } from './brand';

export const defaultSettings: StoreSettings = {
  storeName: siteInfo.name,
  supportEmail: siteInfo.email,
  supportPhone: siteInfo.phone,
  address: siteInfo.location,
  shippingFee: 250,
  freeShippingThreshold: 10000,
  lowStockThreshold: 3,
};

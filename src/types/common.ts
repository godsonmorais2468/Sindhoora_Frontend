import type { CategorySlug } from './product';

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  category: CategorySlug;
  image: string;
  /** Effective unit price (sale price when applicable). */
  price: number;
  quantity: number;
  /** Stock available when the item was added; caps the quantity selector. */
  maxQuantity: number;
}

export interface StoreSettings {
  storeName: string;
  supportEmail: string;
  supportPhone: string;
  address: string;
  shippingFee: number;
  freeShippingThreshold: number;
  lowStockThreshold: number;
}

export interface AdminUser {
  email: string;
  name: string;
  role: 'owner';
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  location: string;
  piece: string;
}

import type { OrderStatus, PaymentMethod, PaymentStatus } from '@/types/order';
import type { ProductStatus } from '@/types/product';

/** Order lifecycle, in the sequence an order normally moves through. */
export const ORDER_STATUSES: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'packed', label: 'Packed' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export const orderStatusLabel: Record<OrderStatus, string> = Object.fromEntries(
  ORDER_STATUSES.map((s) => [s.value, s.label]),
) as Record<OrderStatus, string>;

export const paymentStatusLabel: Record<PaymentStatus, string> = {
  pending: 'Payment pending',
  paid: 'Paid',
  refunded: 'Refunded',
};

export const paymentMethodLabel: Record<PaymentMethod, string> = {
  cod: 'Cash on Delivery',
  upi: 'UPI',
  card: 'Card',
};

export const productStatusLabel: Record<ProductStatus, string> = {
  active: 'Active',
  draft: 'Draft',
  archived: 'Archived',
};

export type OrderStatus = 'pending' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'refunded';

export type PaymentMethod = 'cod' | 'upi' | 'card';

export interface ShippingAddress {
  fullName: string;
  phone: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  sku: string;
  image: string;
  /** Unit price charged at the time of purchase. */
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
  updatedAt: string;
  shippingAddress: ShippingAddress;
}

export interface CheckoutPayload {
  customer: { fullName: string; phone: string; email: string };
  address: Omit<ShippingAddress, 'fullName' | 'phone'>;
  paymentMethod: PaymentMethod;
  items: { productId: string; quantity: number }[];
}

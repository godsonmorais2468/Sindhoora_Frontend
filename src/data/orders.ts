import type { Order, OrderStatus, PaymentMethod, PaymentStatus, ShippingAddress } from '@/types/order';
import { seedCustomers } from './customers';
import { seedProducts } from './products';
import { defaultSettings } from './settings';

const addresses: Record<string, Omit<ShippingAddress, 'fullName' | 'phone'>> = {
  'cus-001': { line1: 'Plot 24, Road No. 3, Banjara Hills', city: 'Hyderabad', state: 'Telangana', pincode: '500034' },
  'cus-002': { line1: '12, 4th Cross Street, Mylapore', city: 'Chennai', state: 'Tamil Nadu', pincode: '600004' },
  'cus-003': { line1: 'Ivy House, Panampilly Nagar', city: 'Kochi', state: 'Kerala', pincode: '682036' },
  'cus-004': { line1: '88, 12th Main, Indiranagar', city: 'Bengaluru', state: 'Karnataka', pincode: '560038' },
  'cus-005': { line1: '40-1-12, Benz Circle', city: 'Vijayawada', state: 'Andhra Pradesh', pincode: '520010' },
  'cus-006': { line1: 'Flat 702, Sea Breeze, Bandra West', city: 'Mumbai', state: 'Maharashtra', pincode: '400050' },
  'cus-007': { line1: '15, Lane 6, Koregaon Park', city: 'Pune', state: 'Maharashtra', pincode: '411001' },
  'cus-008': { line1: '21, DB Road, RS Puram', city: 'Coimbatore', state: 'Tamil Nadu', pincode: '641002' },
  'cus-009': { line1: 'Door 9-12, Siripuram Junction', city: 'Visakhapatnam', state: 'Andhra Pradesh', pincode: '530003' },
  'cus-010': { line1: '7, Kalidasa Road, VV Mohalla', city: 'Mysuru', state: 'Karnataka', pincode: '570002' },
};

interface SeedOrderSpec {
  id: string;
  customerId: string;
  createdAt: string;
  items: Array<[productId: string, quantity: number]>;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
}

/** Builds an order from product ids so prices and totals always agree with the catalogue. */
function buildOrder(spec: SeedOrderSpec): Order {
  const customer = seedCustomers.find((c) => c.id === spec.customerId)!;
  const items = spec.items.map(([productId, quantity]) => {
    const product = seedProducts.find((p) => p.id === productId)!;
    return {
      productId,
      name: product.name,
      sku: product.sku,
      image: product.images[0],
      price: product.salePrice ?? product.price,
      quantity,
    };
  });
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= defaultSettings.freeShippingThreshold ? 0 : defaultSettings.shippingFee;
  return {
    id: spec.id,
    customerId: spec.customerId,
    items,
    subtotal,
    shipping,
    total: subtotal + shipping,
    status: spec.status,
    paymentStatus: spec.paymentStatus,
    paymentMethod: spec.paymentMethod,
    createdAt: spec.createdAt,
    updatedAt: spec.createdAt,
    shippingAddress: { fullName: customer.name, phone: customer.phone, ...addresses[customer.id] },
  };
}

const specs: SeedOrderSpec[] = [
  { id: 'SJ-10241', customerId: 'cus-001', createdAt: '2026-05-06T10:24:00.000Z', items: [['prd-1001', 1], ['prd-1005', 1]], status: 'delivered', paymentStatus: 'paid', paymentMethod: 'upi' },
  { id: 'SJ-10242', customerId: 'cus-002', createdAt: '2026-05-19T13:02:00.000Z', items: [['prd-1003', 1]], status: 'delivered', paymentStatus: 'paid', paymentMethod: 'card' },
  { id: 'SJ-10243', customerId: 'cus-003', createdAt: '2026-06-03T16:45:00.000Z', items: [['prd-1014', 1]], status: 'delivered', paymentStatus: 'paid', paymentMethod: 'cod' },
  { id: 'SJ-10244', customerId: 'cus-004', createdAt: '2026-06-17T11:18:00.000Z', items: [['prd-1006', 1], ['prd-1020', 1]], status: 'delivered', paymentStatus: 'paid', paymentMethod: 'upi' },
  { id: 'SJ-10245', customerId: 'cus-005', createdAt: '2026-07-02T09:30:00.000Z', items: [['prd-1007', 1]], status: 'delivered', paymentStatus: 'paid', paymentMethod: 'card' },
  { id: 'SJ-10246', customerId: 'cus-006', createdAt: '2026-07-15T18:12:00.000Z', items: [['prd-1004', 1]], status: 'cancelled', paymentStatus: 'refunded', paymentMethod: 'upi' },
  { id: 'SJ-10247', customerId: 'cus-001', createdAt: '2026-07-28T12:40:00.000Z', items: [['prd-1002', 1]], status: 'delivered', paymentStatus: 'paid', paymentMethod: 'upi' },
  { id: 'SJ-10248', customerId: 'cus-007', createdAt: '2026-08-09T15:55:00.000Z', items: [['prd-1021', 1]], status: 'delivered', paymentStatus: 'paid', paymentMethod: 'card' },
  { id: 'SJ-10249', customerId: 'cus-008', createdAt: '2026-08-23T10:05:00.000Z', items: [['prd-1013', 2]], status: 'delivered', paymentStatus: 'paid', paymentMethod: 'cod' },
  { id: 'SJ-10250', customerId: 'cus-009', createdAt: '2026-09-04T14:20:00.000Z', items: [['prd-1009', 1]], status: 'delivered', paymentStatus: 'paid', paymentMethod: 'card' },
  { id: 'SJ-10251', customerId: 'cus-010', createdAt: '2026-09-12T17:48:00.000Z', items: [['prd-1018', 1], ['prd-1012', 1]], status: 'cancelled', paymentStatus: 'refunded', paymentMethod: 'card' },
  { id: 'SJ-10252', customerId: 'cus-002', createdAt: '2026-09-22T11:11:00.000Z', items: [['prd-1016', 1]], status: 'shipped', paymentStatus: 'paid', paymentMethod: 'card' },
  { id: 'SJ-10253', customerId: 'cus-003', createdAt: '2026-09-27T19:34:00.000Z', items: [['prd-1008', 1]], status: 'shipped', paymentStatus: 'paid', paymentMethod: 'upi' },
  { id: 'SJ-10254', customerId: 'cus-004', createdAt: '2026-10-01T10:50:00.000Z', items: [['prd-1010', 1], ['prd-1022', 1]], status: 'packed', paymentStatus: 'paid', paymentMethod: 'upi' },
  { id: 'SJ-10255', customerId: 'cus-006', createdAt: '2026-10-02T16:15:00.000Z', items: [['prd-1017', 1]], status: 'packed', paymentStatus: 'pending', paymentMethod: 'cod' },
  { id: 'SJ-10256', customerId: 'cus-007', createdAt: '2026-10-03T13:27:00.000Z', items: [['prd-1023', 1]], status: 'confirmed', paymentStatus: 'paid', paymentMethod: 'upi' },
  { id: 'SJ-10257', customerId: 'cus-009', createdAt: '2026-10-04T09:42:00.000Z', items: [['prd-1015', 1], ['prd-1019', 1]], status: 'confirmed', paymentStatus: 'paid', paymentMethod: 'card' },
  { id: 'SJ-10258', customerId: 'cus-005', createdAt: '2026-10-05T05:08:00.000Z', items: [['prd-1005', 1], ['prd-1024', 1]], status: 'pending', paymentStatus: 'pending', paymentMethod: 'cod' },
  { id: 'SJ-10259', customerId: 'cus-008', createdAt: '2026-10-05T09:36:00.000Z', items: [['prd-1025', 1]], status: 'pending', paymentStatus: 'pending', paymentMethod: 'upi' },
  { id: 'SJ-10260', customerId: 'cus-010', createdAt: '2026-10-05T13:15:00.000Z', items: [['prd-1001', 1]], status: 'pending', paymentStatus: 'pending', paymentMethod: 'cod' },
];

export const seedOrders: Order[] = specs.map(buildOrder);

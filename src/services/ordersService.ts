import type { Customer } from '@/types/customer';
import type { CheckoutPayload, Order, OrderItem, OrderStatus, PaymentStatus } from '@/types/order';
import { db, networkDelay } from './mockDb';
import { calculateShipping, readSettings } from './settingsService';

// Future DRF mapping:
//   listOrders         → GET   /api/admin/orders/
//   getOrder           → GET   /api/orders/:id/
//   createOrder        → POST  /api/orders/          (server validates stock & prices)
//   updateOrderStatus  → PATCH /api/admin/orders/:id/

function byNewest(a: Order, b: Order): number {
  return b.createdAt.localeCompare(a.createdAt);
}

export async function listOrders(): Promise<Order[]> {
  await networkDelay();
  return [...db.orders.all()].sort(byNewest);
}

export async function getOrder(id: string): Promise<Order | null> {
  await networkDelay(180);
  return db.orders.all().find((o) => o.id === id) ?? null;
}

function nextOrderId(): string {
  const max = db.orders.all().reduce((m, o) => Math.max(m, Number(o.id.replace(/\D/g, '')) || 0), 10240);
  return `SJ-${max + 1}`;
}

function findOrCreateCustomer(details: CheckoutPayload['customer'], city: string): Customer {
  const customers = db.customers.all();
  const email = details.email.trim().toLowerCase();
  const existing = customers.find((c) => c.email.toLowerCase() === email);
  if (existing) return existing;
  const maxId = customers.reduce((m, c) => Math.max(m, Number(c.id.replace(/\D/g, '')) || 0), 0);
  const customer: Customer = {
    id: `cus-${String(maxId + 1).padStart(3, '0')}`,
    name: details.fullName.trim(),
    email,
    phone: details.phone.replace(/\D/g, '').slice(-10),
    city,
    createdAt: new Date().toISOString(),
  };
  db.customers.save([...customers, customer]);
  return customer;
}

/**
 * Prototype checkout. Prices and stock are re-validated against the catalogue here,
 * exactly as the real API should do — the cart's stored prices are never trusted.
 * No payment is processed.
 */
export async function createOrder(payload: CheckoutPayload): Promise<Order> {
  await networkDelay(700);
  const products = db.products.all();

  const items: OrderItem[] = payload.items.map(({ productId, quantity }) => {
    const product = products.find((p) => p.id === productId && p.status === 'active');
    if (!product) throw new Error('One of the pieces in your bag is no longer available.');
    if (product.stock < quantity) {
      throw new Error(
        product.stock === 0
          ? `${product.name} has just sold out.`
          : `Only ${product.stock} of ${product.name} left — please update your bag.`,
      );
    }
    return {
      productId,
      name: product.name,
      sku: product.sku,
      image: product.images[0],
      price: product.salePrice ?? product.price,
      quantity,
    };
  });
  if (items.length === 0) throw new Error('Your bag is empty.');

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = calculateShipping(subtotal, readSettings());
  const customer = findOrCreateCustomer(payload.customer, payload.address.city);
  const now = new Date().toISOString();

  const order: Order = {
    id: nextOrderId(),
    customerId: customer.id,
    items,
    subtotal,
    shipping,
    total: subtotal + shipping,
    status: 'pending',
    paymentStatus: 'pending',
    paymentMethod: payload.paymentMethod,
    createdAt: now,
    updatedAt: now,
    shippingAddress: {
      fullName: payload.customer.fullName.trim(),
      phone: payload.customer.phone.replace(/\D/g, '').slice(-10),
      ...payload.address,
    },
  };

  // Reserve stock for the order.
  db.products.save(
    products.map((p) => {
      const line = items.find((i) => i.productId === p.id);
      return line ? { ...p, stock: p.stock - line.quantity } : p;
    }),
  );
  db.orders.save([order, ...db.orders.all()]);
  return order;
}

/** Keeps payment status consistent with the order lifecycle (mock business rules). */
function derivePaymentStatus(order: Order, status: OrderStatus): PaymentStatus {
  if (status === 'cancelled') return order.paymentStatus === 'paid' ? 'refunded' : order.paymentStatus;
  if (status === 'delivered' && order.paymentMethod === 'cod') return 'paid';
  return order.paymentStatus;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  await networkDelay(350);
  const orders = db.orders.all();
  const order = orders.find((o) => o.id === id);
  if (!order) throw new Error('Order not found.');

  const updated: Order = {
    ...order,
    status,
    paymentStatus: derivePaymentStatus(order, status),
    updatedAt: new Date().toISOString(),
  };

  // Return reserved stock when an order is cancelled.
  if (status === 'cancelled' && order.status !== 'cancelled') {
    db.products.save(
      db.products.all().map((p) => {
        const line = order.items.find((i) => i.productId === p.id);
        return line ? { ...p, stock: p.stock + line.quantity } : p;
      }),
    );
  }

  db.orders.save(orders.map((o) => (o.id === id ? updated : o)));
  return updated;
}

export async function updatePaymentStatus(id: string, paymentStatus: PaymentStatus): Promise<Order> {
  await networkDelay(300);
  const orders = db.orders.all();
  const order = orders.find((o) => o.id === id);
  if (!order) throw new Error('Order not found.');
  const updated: Order = { ...order, paymentStatus, updatedAt: new Date().toISOString() };
  db.orders.save(orders.map((o) => (o.id === id ? updated : o)));
  return updated;
}

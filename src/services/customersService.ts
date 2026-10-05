import type { Customer, CustomerSummary } from '@/types/customer';
import { db, networkDelay } from './mockDb';

// Future DRF mapping: GET /api/admin/customers/ (with order aggregates computed server-side)

function summarise(customer: Customer): CustomerSummary {
  const orders = db.orders.all().filter((o) => o.customerId === customer.id);
  const billable = orders.filter((o) => o.status !== 'cancelled');
  const lastOrderAt = orders.reduce<string | null>((latest, o) => (!latest || o.createdAt > latest ? o.createdAt : latest), null);
  return {
    ...customer,
    orderCount: orders.length,
    totalSpent: billable.reduce((sum, o) => sum + o.total, 0),
    lastOrderAt,
  };
}

export async function listCustomers(): Promise<CustomerSummary[]> {
  await networkDelay();
  return db.customers
    .all()
    .map(summarise)
    .sort((a, b) => (b.lastOrderAt ?? '').localeCompare(a.lastOrderAt ?? ''));
}

export async function getCustomer(id: string): Promise<CustomerSummary | null> {
  await networkDelay(150);
  const customer = db.customers.all().find((c) => c.id === id);
  return customer ? summarise(customer) : null;
}

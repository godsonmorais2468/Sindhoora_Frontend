import { ORDER_STATUSES } from '@/data/statuses';
import type { Order, OrderStatus } from '@/types/order';
import type { Product } from '@/types/product';
import { formatMonth } from '@/utils/formatters';
import { db, networkDelay } from './mockDb';
import { readSettings } from './settingsService';

// Future DRF mapping: GET /api/admin/dashboard/ — aggregates computed server-side.

export interface MonthlyPoint {
  key: string;
  label: string;
  revenue: number;
  orders: number;
}

export interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  /** Change in revenue for the latest month vs the month before, as a fraction (0.12 = +12%). */
  revenueChange: number | null;
  monthly: MonthlyPoint[];
  ordersByStatus: { status: OrderStatus; label: string; count: number }[];
  recentOrders: Order[];
  lowStock: Product[];
}

const MONTHS_SHOWN = 6;

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  await networkDelay(300);
  const products = db.products.all();
  const orders = [...db.orders.all()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const billable = orders.filter((o) => o.status !== 'cancelled');
  const { lowStockThreshold } = readSettings();

  // Anchor the chart to the most recent order so the demo data always has a full window.
  const latest = orders[0] ? new Date(orders[0].createdAt) : new Date();
  const anchor = new Date(Math.max(latest.getTime(), Date.now()));
  const monthly: MonthlyPoint[] = [];
  for (let i = MONTHS_SHOWN - 1; i >= 0; i--) {
    const d = new Date(anchor.getFullYear(), anchor.getMonth() - i, 1);
    monthly.push({ key: monthKey(d), label: formatMonth(d), revenue: 0, orders: 0 });
  }
  const byKey = new Map(monthly.map((m) => [m.key, m]));
  for (const order of billable) {
    const point = byKey.get(monthKey(new Date(order.createdAt)));
    if (point) {
      point.revenue += order.total;
      point.orders += 1;
    }
  }

  const [prev, current] = monthly.slice(-2);
  const revenueChange = prev && prev.revenue > 0 ? (current.revenue - prev.revenue) / prev.revenue : null;

  return {
    totalProducts: products.length,
    activeProducts: products.filter((p) => p.status === 'active').length,
    totalOrders: orders.length,
    pendingOrders: orders.filter((o) => o.status === 'pending').length,
    totalRevenue: billable.reduce((sum, o) => sum + o.total, 0),
    revenueChange,
    monthly,
    ordersByStatus: ORDER_STATUSES.map(({ value, label }) => ({
      status: value,
      label,
      count: orders.filter((o) => o.status === value).length,
    })),
    recentOrders: orders.slice(0, 6),
    lowStock: products
      .filter((p) => p.status === 'active' && p.stock <= lowStockThreshold)
      .sort((a, b) => a.stock - b.stock),
  };
}

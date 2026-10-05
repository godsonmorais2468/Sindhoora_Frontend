import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Inbox, Search } from 'lucide-react';
import { AdminCard, AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminTable, type Column } from '@/components/admin/AdminTable';
import { EmptyState } from '@/components/common/EmptyState';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ORDER_STATUSES, paymentMethodLabel } from '@/data/statuses';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useQuery } from '@/hooks/useQuery';
import { listOrders } from '@/services/ordersService';
import type { Order, OrderStatus } from '@/types/order';
import { formatINR } from '@/utils/currency';
import { formatDate } from '@/utils/formatters';
import { cn } from '@/utils/helpers';

const columns: Column<Order>[] = [
  {
    key: 'id',
    header: 'Order ID',
    render: (o) => (
      <Link to={`/admin/orders/${o.id}`} className="font-medium whitespace-nowrap hover:text-gold-700 hover:underline">
        {o.id}
      </Link>
    ),
  },
  {
    key: 'customer',
    header: 'Customer',
    render: (o) => (
      <div>
        <p>{o.shippingAddress.fullName}</p>
        <p className="text-xs text-taupe">{o.shippingAddress.city}</p>
      </div>
    ),
  },
  { key: 'date', header: 'Date', render: (o) => <span className="whitespace-nowrap text-taupe">{formatDate(o.createdAt)}</span> },
  { key: 'items', header: 'Items', align: 'right', render: (o) => <span className="tabular-nums">{o.items.reduce((n, i) => n + i.quantity, 0)}</span>, hideBelow: 'xl' },
  { key: 'amount', header: 'Amount', align: 'right', render: (o) => <span className="font-medium tabular-nums">{formatINR(o.total)}</span> },
  {
    key: 'payment',
    header: 'Payment',
    render: (o) => (
      <div className="flex flex-col items-start gap-1">
        <StatusBadge kind="payment" status={o.paymentStatus} />
        <span className="text-xs text-taupe">{paymentMethodLabel[o.paymentMethod]}</span>
      </div>
    ),
    hideBelow: 'xl',
  },
  { key: 'status', header: 'Status', render: (o) => <StatusBadge kind="order" status={o.status} /> },
];

export default function Orders() {
  useDocumentTitle('Orders · Admin');
  const [params, setParams] = useSearchParams();
  const statusFilter = (params.get('status') as OrderStatus | null) ?? null;
  const [search, setSearch] = useState('');
  const { data: orders, isLoading } = useQuery('admin:orders', listOrders);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: orders?.length ?? 0 };
    for (const o of orders ?? []) c[o.status] = (c[o.status] ?? 0) + 1;
    return c;
  }, [orders]);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (orders ?? []).filter(
      (o) =>
        (!statusFilter || o.status === statusFilter) &&
        (!q || o.id.toLowerCase().includes(q) || o.shippingAddress.fullName.toLowerCase().includes(q) || o.shippingAddress.city.toLowerCase().includes(q)),
    );
  }, [orders, statusFilter, search]);

  const tabs = [{ value: null, label: 'All' }, ...ORDER_STATUSES];

  return (
    <>
      <AdminPageHeader title="Orders" description="Track, update and fulfil customer orders." />

      <AdminCard>
        <div className="border-b border-line">
          <div role="tablist" aria-label="Filter orders by status" className="no-scrollbar flex gap-1 overflow-x-auto px-3 pt-2">
            {tabs.map((t) => {
              const active = statusFilter === t.value;
              const count = counts[t.value ?? 'all'] ?? 0;
              return (
                <button
                  key={t.label}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setParams(t.value ? { status: t.value } : {}, { replace: true })}
                  className={cn(
                    'relative flex shrink-0 items-center gap-2 px-3 py-3 text-sm whitespace-nowrap transition-colors',
                    active ? 'font-medium text-charcoal' : 'text-taupe hover:text-charcoal',
                  )}
                >
                  {t.label}
                  <span className={cn('rounded-full px-1.5 py-0.5 text-[11px] tabular-nums', active ? 'bg-ink-900 text-cream' : 'bg-sand text-taupe')}>{count}</span>
                  {active && <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-gold-500" aria-hidden />}
                </button>
              );
            })}
          </div>
        </div>
        <div className="border-b border-line p-4">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-taupe" aria-hidden />
            <label htmlFor="order-search" className="sr-only">
              Search orders
            </label>
            <input
              id="order-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order ID, customer or city"
              className="h-11 w-full rounded-sm border border-line bg-white pr-3 pl-9 text-[15px] outline-none focus:border-gold-600 focus:ring-2 focus:ring-gold-500/15"
            />
          </div>
        </div>

        <AdminTable
          caption="Orders"
          columns={columns}
          rows={rows}
          rowKey={(o) => o.id}
          loading={isLoading}
          empty={
            <EmptyState
              icon={Inbox}
              title="No orders here"
              description={statusFilter ? 'There are no orders with this status right now.' : 'Orders placed through the shop will appear here.'}
            />
          }
          mobileCard={(o) => (
            <Link to={`/admin/orders/${o.id}`} className="block">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium">{o.id}</p>
                  <p className="truncate text-[13px] text-taupe">
                    {o.shippingAddress.fullName} · {formatDate(o.createdAt)}
                  </p>
                </div>
                <p className="font-medium tabular-nums">{formatINR(o.total)}</p>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-2">
                <StatusBadge kind="order" status={o.status} />
                <StatusBadge kind="payment" status={o.paymentStatus} />
              </div>
            </Link>
          )}
        />
      </AdminCard>
    </>
  );
}

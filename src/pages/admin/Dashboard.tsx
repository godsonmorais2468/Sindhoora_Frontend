import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Gem, IndianRupee, Plus, ReceiptText, TriangleAlert } from 'lucide-react';
import { AdminCard, AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminTable, type Column } from '@/components/admin/AdminTable';
import { OrdersStatusChart } from '@/components/admin/charts/OrdersStatusChart';
import { RevenueChart } from '@/components/admin/charts/RevenueChart';
import { StatCard } from '@/components/admin/StatCard';
import { SmartImage } from '@/components/common/SmartImage';
import { ButtonLink } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useAuth } from '@/hooks/useAuth';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useQuery } from '@/hooks/useQuery';
import { getDashboardStats } from '@/services/dashboardService';
import type { Order } from '@/types/order';
import { formatINR } from '@/utils/currency';
import { formatDate } from '@/utils/formatters';
import { cn } from '@/utils/helpers';

const orderColumns: Column<Order>[] = [
  {
    key: 'id',
    header: 'Order ID',
    render: (o) => (
      <Link to={`/admin/orders/${o.id}`} className="font-medium whitespace-nowrap text-charcoal hover:text-gold-700 hover:underline">
        {o.id}
      </Link>
    ),
  },
  { key: 'customer', header: 'Customer', render: (o) => o.shippingAddress.fullName },
  { key: 'date', header: 'Date', render: (o) => <span className="text-taupe">{formatDate(o.createdAt)}</span>, hideBelow: 'lg' },
  { key: 'amount', header: 'Amount', align: 'right', render: (o) => <span className="font-medium tabular-nums">{formatINR(o.total)}</span> },
  { key: 'status', header: 'Status', render: (o) => <StatusBadge kind="order" status={o.status} /> },
];

function ViewToggle({ view, onChange }: { view: 'chart' | 'table'; onChange: (v: 'chart' | 'table') => void }) {
  return (
    <div className="flex rounded-md border border-line p-0.5 text-xs" role="group" aria-label="Display as">
      {(['chart', 'table'] as const).map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          aria-pressed={view === v}
          className={cn('rounded px-2.5 py-1 capitalize transition-colors', view === v ? 'bg-ink-900 text-cream' : 'text-taupe hover:text-charcoal')}
        >
          {v}
        </button>
      ))}
    </div>
  );
}

export default function Dashboard() {
  useDocumentTitle('Admin Dashboard');
  const { user } = useAuth();
  const { data: stats, isLoading } = useQuery('admin:dashboard', getDashboardStats);
  const [salesView, setSalesView] = useState<'chart' | 'table'>('chart');
  const [ordersView, setOrdersView] = useState<'chart' | 'table'>('chart');

  return (
    <>
      <AdminPageHeader
        title={`Welcome back, ${user?.name ?? 'Admin'}`}
        description="Here is how Sindhoora is doing."
        actions={
          <ButtonLink to="/admin/products/new" variant="dark" size="sm" icon={<Plus className="size-4" aria-hidden />}>
            Add product
          </ButtonLink>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total revenue" icon={IndianRupee} loading={isLoading} value={stats && formatINR(stats.totalRevenue)} delta={stats?.revenueChange} hint={stats?.revenueChange != null ? 'vs last month' : 'Excludes cancelled orders'} />
        <StatCard label="Total orders" icon={ReceiptText} loading={isLoading} value={stats?.totalOrders} hint="All time" />
        <StatCard
          label="Pending orders"
          icon={Clock}
          loading={isLoading}
          value={stats?.pendingOrders}
          hint={
            <Link to="/admin/orders?status=pending" className="font-medium text-gold-700 hover:underline">
              Review now
            </Link>
          }
        />
        <StatCard label="Total products" icon={Gem} loading={isLoading} value={stats?.totalProducts} hint={stats && `${stats.activeProducts} live in the shop`} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <AdminCard title="Sales overview" actions={<ViewToggle view={salesView} onChange={setSalesView} />} bodyClassName="p-5">
          <p className="-mt-1 mb-4 text-[13px] text-taupe">Monthly revenue, last 6 months · excludes cancelled orders</p>
          {!stats ? (
            <div className="skeleton h-[260px] w-full" />
          ) : salesView === 'chart' ? (
            <RevenueChart data={stats.monthly} />
          ) : (
            <table className="w-full text-sm">
              <caption className="sr-only">Monthly revenue</caption>
              <thead>
                <tr className="border-b border-line text-left text-xs text-taupe uppercase">
                  <th className="py-2 font-medium">Month</th>
                  <th className="py-2 text-right font-medium">Orders</th>
                  <th className="py-2 text-right font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {stats.monthly.map((m) => (
                  <tr key={m.key}>
                    <td className="py-2.5">{m.label}</td>
                    <td className="py-2.5 text-right tabular-nums">{m.orders}</td>
                    <td className="py-2.5 text-right font-medium tabular-nums">{formatINR(m.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </AdminCard>

        <AdminCard title="Orders overview" actions={<ViewToggle view={ordersView} onChange={setOrdersView} />} bodyClassName="p-5">
          <p className="-mt-1 mb-3 text-[13px] text-taupe">Orders by current status · {stats?.totalOrders ?? '—'} total</p>
          {!stats ? (
            <div className="skeleton h-[260px] w-full" />
          ) : ordersView === 'chart' ? (
            <OrdersStatusChart data={stats.ordersByStatus} />
          ) : (
            <table className="w-full text-sm">
              <caption className="sr-only">Orders by status</caption>
              <thead>
                <tr className="border-b border-line text-left text-xs text-taupe uppercase">
                  <th className="py-2 font-medium">Status</th>
                  <th className="py-2 text-right font-medium">Orders</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {stats.ordersByStatus.map((s) => (
                  <tr key={s.status}>
                    <td className="py-2.5">{s.label}</td>
                    <td className="py-2.5 text-right font-medium tabular-nums">{s.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </AdminCard>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <AdminCard
          title="Recent orders"
          actions={
            <Link to="/admin/orders" className="inline-flex items-center gap-1 text-[13px] font-medium text-gold-700 hover:underline">
              View all <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          }
        >
          <AdminTable
            caption="Recent orders"
            columns={orderColumns}
            rows={stats?.recentOrders ?? []}
            rowKey={(o) => o.id}
            loading={isLoading}
            mobileCard={(o) => (
              <Link to={`/admin/orders/${o.id}`} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{o.id}</p>
                  <p className="truncate text-[13px] text-taupe">
                    {o.shippingAddress.fullName} · {formatDate(o.createdAt)}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="text-sm font-medium tabular-nums">{formatINR(o.total)}</span>
                  <StatusBadge kind="order" status={o.status} />
                </div>
              </Link>
            )}
          />
        </AdminCard>

        <AdminCard
          title="Low stock"
          actions={
            <Link to="/admin/inventory" className="inline-flex items-center gap-1 text-[13px] font-medium text-gold-700 hover:underline">
              Inventory <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          }
        >
          {!stats ? (
            <div className="space-y-3 p-5">
              <div className="skeleton h-10" />
              <div className="skeleton h-10" />
            </div>
          ) : stats.lowStock.length === 0 ? (
            <p className="p-5 text-sm text-taupe">Every piece is well stocked.</p>
          ) : (
            <ul className="divide-y divide-line">
              {stats.lowStock.slice(0, 6).map((p) => (
                <li key={p.id} className="flex items-center gap-3 px-5 py-3">
                  <SmartImage src={p.images[0]} alt="" aspectRatio={1} widths={[96]} sizes="40px" fade={false} className="size-10 shrink-0 rounded bg-ink-800 object-cover" />
                  <div className="min-w-0 flex-1">
                    <Link to={`/admin/products/${p.id}/edit`} className="block truncate text-sm font-medium hover:underline">
                      {p.name}
                    </Link>
                    <p className="text-xs text-taupe">{p.sku}</p>
                  </div>
                  <span className={cn('inline-flex items-center gap-1 text-[13px] font-medium tabular-nums', p.stock === 0 ? 'text-danger' : 'text-warning')}>
                    <TriangleAlert className="size-3.5" aria-hidden />
                    {p.stock === 0 ? 'Out' : `${p.stock} left`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>
      </div>
    </>
  );
}

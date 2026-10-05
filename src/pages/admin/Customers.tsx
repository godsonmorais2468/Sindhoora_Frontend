import { useMemo, useState } from 'react';
import { IndianRupee, Repeat, Search, Users } from 'lucide-react';
import { AdminCard, AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminTable, type Column } from '@/components/admin/AdminTable';
import { StatCard } from '@/components/admin/StatCard';
import { EmptyState } from '@/components/common/EmptyState';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useQuery } from '@/hooks/useQuery';
import { listCustomers } from '@/services/customersService';
import type { CustomerSummary } from '@/types/customer';
import { formatINR } from '@/utils/currency';
import { formatDate, formatPhone, initials } from '@/utils/formatters';

const columns: Column<CustomerSummary>[] = [
  {
    key: 'name',
    header: 'Customer',
    render: (c) => (
      <div className="flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sand text-xs font-semibold text-charcoal">{initials(c.name)}</span>
        <div>
          <p className="font-medium">{c.name}</p>
          <p className="text-xs text-taupe">{c.city}</p>
        </div>
      </div>
    ),
  },
  { key: 'phone', header: 'Phone', render: (c) => <span className="whitespace-nowrap tabular-nums">{formatPhone(c.phone)}</span>, hideBelow: 'lg' },
  {
    key: 'email',
    header: 'Email',
    render: (c) => (
      <a href={`mailto:${c.email}`} className="text-taupe hover:text-charcoal hover:underline">
        {c.email}
      </a>
    ),
  },
  { key: 'orders', header: 'Orders', align: 'right', render: (c) => <span className="tabular-nums">{c.orderCount}</span> },
  { key: 'spent', header: 'Total spent', align: 'right', render: (c) => <span className="font-medium tabular-nums">{formatINR(c.totalSpent)}</span> },
  { key: 'last', header: 'Last order', render: (c) => <span className="whitespace-nowrap text-taupe">{c.lastOrderAt ? formatDate(c.lastOrderAt) : '—'}</span>, hideBelow: 'xl' },
];

export default function Customers() {
  useDocumentTitle('Customers · Admin');
  const { data: customers, isLoading } = useQuery('admin:customers', listCustomers);
  const [search, setSearch] = useState('');

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (customers ?? []).filter((c) => !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q) || c.city.toLowerCase().includes(q));
  }, [customers, search]);

  const totals = useMemo(() => {
    const list = customers ?? [];
    const revenue = list.reduce((s, c) => s + c.totalSpent, 0);
    return {
      count: list.length,
      repeat: list.filter((c) => c.orderCount > 1).length,
      average: list.length ? revenue / list.length : 0,
    };
  }, [customers]);

  return (
    <>
      <AdminPageHeader title="Customers" description="Everyone who has ordered from Sindhoora." />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Customers" icon={Users} loading={isLoading} value={totals.count} />
        <StatCard label="Repeat customers" icon={Repeat} loading={isLoading} value={totals.repeat} hint="Placed more than one order" />
        <StatCard label="Average lifetime value" icon={IndianRupee} loading={isLoading} value={formatINR(totals.average)} />
      </div>

      <AdminCard>
        <div className="border-b border-line p-4">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-taupe" aria-hidden />
            <label htmlFor="customer-search" className="sr-only">
              Search customers
            </label>
            <input
              id="customer-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, phone or city"
              className="h-11 w-full rounded-sm border border-line bg-white pr-3 pl-9 text-[15px] outline-none focus:border-gold-600 focus:ring-2 focus:ring-gold-500/15"
            />
          </div>
        </div>
        <AdminTable
          caption="Customers"
          columns={columns}
          rows={rows}
          rowKey={(c) => c.id}
          loading={isLoading}
          empty={<EmptyState icon={Users} title="No customers found" description="Try a different search." />}
          mobileCard={(c) => (
            <div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sand text-xs font-semibold">{initials(c.name)}</span>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{c.name}</p>
                    <p className="truncate text-xs text-taupe">{c.email}</p>
                  </div>
                </div>
                <p className="font-medium tabular-nums">{formatINR(c.totalSpent)}</p>
              </div>
              <p className="mt-2 text-[13px] text-taupe">
                {formatPhone(c.phone)} · {c.orderCount} {c.orderCount === 1 ? 'order' : 'orders'}
                {c.lastOrderAt && ` · last ${formatDate(c.lastOrderAt)}`}
              </p>
            </div>
          )}
        />
      </AdminCard>
    </>
  );
}

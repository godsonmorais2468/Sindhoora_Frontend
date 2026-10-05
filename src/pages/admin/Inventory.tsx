import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Boxes, CircleX, Minus, PackageCheck, Plus, TriangleAlert } from 'lucide-react';
import { AdminCard, AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminTable, type Column } from '@/components/admin/AdminTable';
import { StatCard } from '@/components/admin/StatCard';
import { EmptyState } from '@/components/common/EmptyState';
import { getStockLevel, StatusBadge, type StockLevel } from '@/components/ui/StatusBadge';
import { getCategoryName } from '@/data/categories';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { invalidateQueries, useQuery } from '@/hooks/useQuery';
import { useToast } from '@/hooks/useToast';
import { listProducts, setProductStock } from '@/services/productsService';
import { getSettings } from '@/services/settingsService';
import type { Product } from '@/types/product';
import { cn } from '@/utils/helpers';

const filters: { value: StockLevel | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'in-stock', label: 'In stock' },
  { value: 'low-stock', label: 'Low stock' },
  { value: 'out-of-stock', label: 'Out of stock' },
];

function StockStepper({ product, onChange, busy }: { product: Product; onChange: (stock: number) => void; busy: boolean }) {
  const btn = 'flex size-8 items-center justify-center rounded text-taupe transition-colors hover:bg-black/5 hover:text-charcoal disabled:opacity-30';
  return (
    <div className={cn('inline-flex items-center rounded-md border border-line bg-white', busy && 'opacity-60')} role="group" aria-label={`Adjust stock for ${product.name}`}>
      <button type="button" className={btn} onClick={() => onChange(product.stock - 1)} disabled={busy || product.stock <= 0} aria-label="Decrease stock">
        <Minus className="size-3.5" />
      </button>
      <span className="w-9 text-center text-sm font-semibold tabular-nums" aria-live="polite">
        {product.stock}
      </span>
      <button type="button" className={btn} onClick={() => onChange(product.stock + 1)} disabled={busy} aria-label="Increase stock">
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}

export default function Inventory() {
  useDocumentTitle('Inventory · Admin');
  const toast = useToast();
  const { data: products, isLoading } = useQuery('admin:products', () => listProducts({ includeInactive: true }));
  const { data: settings } = useQuery('settings', getSettings);
  const threshold = settings?.lowStockThreshold ?? 3;
  const [filter, setFilter] = useState<StockLevel | 'all'>('all');
  const [busyId, setBusyId] = useState<string | null>(null);

  const withLevel = useMemo(
    () => (products ?? []).map((p) => ({ product: p, level: getStockLevel(p.stock, threshold) })).sort((a, b) => a.product.stock - b.product.stock),
    [products, threshold],
  );
  const summary = useMemo(
    () => ({
      units: withLevel.reduce((s, r) => s + r.product.stock, 0),
      low: withLevel.filter((r) => r.level === 'low-stock').length,
      out: withLevel.filter((r) => r.level === 'out-of-stock').length,
    }),
    [withLevel],
  );
  const rows = filter === 'all' ? withLevel : withLevel.filter((r) => r.level === filter);

  async function changeStock(product: Product, stock: number) {
    setBusyId(product.id);
    try {
      await setProductStock(product.id, stock);
      invalidateQueries('admin');
      invalidateQueries('product');
    } catch (err) {
      toast({ title: 'Could not update stock', description: err instanceof Error ? err.message : undefined, tone: 'error' });
    } finally {
      setBusyId(null);
    }
  }

  type Row = (typeof withLevel)[number];
  const columns: Column<Row>[] = [
    { key: 'sku', header: 'SKU', render: ({ product }) => <span className="font-mono text-xs text-taupe">{product.sku}</span> },
    {
      key: 'product',
      header: 'Product',
      render: ({ product }) => (
        <Link to={`/admin/products/${product.id}/edit`} className="font-medium hover:underline">
          {product.name}
        </Link>
      ),
    },
    { key: 'category', header: 'Category', render: ({ product }) => <span className="text-taupe">{getCategoryName(product.category)}</span>, hideBelow: 'lg' },
    { key: 'stock', header: 'Stock', render: ({ product }) => <StockStepper product={product} busy={busyId === product.id} onChange={(s) => changeStock(product, s)} /> },
    { key: 'threshold', header: 'Low stock at', align: 'right', render: () => <span className="text-taupe tabular-nums">≤ {threshold}</span>, hideBelow: 'xl' },
    { key: 'status', header: 'Status', render: ({ level }) => <StatusBadge kind="stock" status={level} /> },
  ];

  return (
    <>
      <AdminPageHeader title="Inventory" description="Stock levels across the catalogue. Adjust counts inline." />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Units in stock" icon={Boxes} loading={isLoading} value={summary.units} hint={`${withLevel.length} products`} />
        <StatCard label="Low stock" icon={TriangleAlert} loading={isLoading} value={summary.low} hint={`At or below ${threshold} units`} />
        <StatCard label="Out of stock" icon={CircleX} loading={isLoading} value={summary.out} hint="Shown as sold out in the shop" />
      </div>

      <AdminCard>
        <div className="flex flex-wrap gap-2 border-b border-line p-4" role="group" aria-label="Filter by stock level">
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              aria-pressed={filter === f.value}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-[13px] transition-colors',
                filter === f.value ? 'border-ink-900 bg-ink-900 text-cream' : 'border-line text-taupe hover:border-charcoal/30 hover:text-charcoal',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <AdminTable
          caption="Inventory"
          columns={columns}
          rows={rows}
          rowKey={(r) => r.product.id}
          loading={isLoading}
          rowClassName={(r) => (r.level === 'out-of-stock' ? 'bg-red-50/60' : r.level === 'low-stock' ? 'bg-amber-50/70' : undefined)}
          empty={<EmptyState icon={PackageCheck} title="Nothing to show" description="No products match this stock level." />}
          mobileCard={({ product, level }) => (
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <Link to={`/admin/products/${product.id}/edit`} className="block truncate font-medium">
                  {product.name}
                </Link>
                <p className="mb-2 font-mono text-xs text-taupe">{product.sku}</p>
                <StatusBadge kind="stock" status={level} />
              </div>
              <StockStepper product={product} busy={busyId === product.id} onChange={(s) => changeStock(product, s)} />
            </div>
          )}
        />
      </AdminCard>
    </>
  );
}

import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, PackageOpen, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { AdminCard, AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminTable, type Column } from '@/components/admin/AdminTable';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { SmartImage } from '@/components/common/SmartImage';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Select } from '@/components/ui/FormControls';
import { getStockLevel, StatusBadge } from '@/components/ui/StatusBadge';
import { categories, getCategoryName } from '@/data/categories';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { invalidateQueries, useQuery } from '@/hooks/useQuery';
import { useToast } from '@/hooks/useToast';
import { deleteProduct, listProducts } from '@/services/productsService';
import { getSettings } from '@/services/settingsService';
import type { Product } from '@/types/product';
import { formatINR } from '@/utils/currency';
import { cn } from '@/utils/helpers';

const iconAction = 'flex size-9 items-center justify-center rounded-md text-taupe transition-colors hover:bg-black/[0.04] hover:text-charcoal';

export default function Products() {
  useDocumentTitle('Products · Admin');
  const toast = useToast();
  const { data: products, isLoading } = useQuery('admin:products', () => listProducts({ includeInactive: true }));
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [toDelete, setToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { data: settings } = useQuery('settings', getSettings);
  const lowStockThreshold = settings?.lowStockThreshold ?? 3;

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (products ?? []).filter(
      (p) =>
        (!q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)) &&
        (!category || p.category === category) &&
        (!status || p.status === status),
    );
  }, [products, search, category, status]);

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteProduct(toDelete.id);
      invalidateQueries('admin');
      invalidateQueries('product');
      toast({ title: 'Product deleted', description: toDelete.name });
      setToDelete(null);
    } catch (err) {
      toast({ title: 'Could not delete product', description: err instanceof Error ? err.message : undefined, tone: 'error' });
    } finally {
      setDeleting(false);
    }
  }

  const actions = (p: Product) => (
    <div className="flex items-center justify-end gap-0.5">
      <a href={`/product/${p.slug}`} target="_blank" rel="noreferrer" className={iconAction} aria-label={`View ${p.name} in the store`} title="View in store">
        <Eye className="size-4" strokeWidth={1.6} />
      </a>
      <Link to={`/admin/products/${p.id}/edit`} className={iconAction} aria-label={`Edit ${p.name}`} title="Edit">
        <Pencil className="size-4" strokeWidth={1.6} />
      </Link>
      <button type="button" onClick={() => setToDelete(p)} className={cn(iconAction, 'hover:bg-red-50 hover:text-danger')} aria-label={`Delete ${p.name}`} title="Delete">
        <Trash2 className="size-4" strokeWidth={1.6} />
      </button>
    </div>
  );

  const columns: Column<Product>[] = [
    {
      key: 'product',
      header: 'Product',
      render: (p) => (
        <div className="flex items-center gap-3">
          <SmartImage src={p.images[0]} alt="" aspectRatio={1} widths={[96]} sizes="44px" fade={false} className="size-11 shrink-0 rounded bg-ink-800 object-cover" />
          <div className="min-w-0">
            <Link to={`/admin/products/${p.id}/edit`} className="block max-w-[260px] truncate font-medium hover:underline">
              {p.name}
            </Link>
            <p className="text-xs text-taupe">{p.sku}</p>
          </div>
        </div>
      ),
    },
    { key: 'category', header: 'Category', render: (p) => <span className="text-taupe">{getCategoryName(p.category)}</span>, hideBelow: 'xl' },
    {
      key: 'price',
      header: 'Price',
      align: 'right',
      render: (p) => (
        <div className="tabular-nums">
          <span className="font-medium">{formatINR(p.salePrice ?? p.price)}</span>
          {p.salePrice != null && <s className="ml-1.5 text-xs text-taupe">{formatINR(p.price)}</s>}
        </div>
      ),
    },
    {
      key: 'stock',
      header: 'Stock',
      align: 'right',
      render: (p) => {
        const level = getStockLevel(p.stock, lowStockThreshold);
        return <span className={cn('font-medium tabular-nums', level === 'out-of-stock' ? 'text-danger' : level === 'low-stock' ? 'text-warning' : '')}>{p.stock}</span>;
      },
    },
    { key: 'status', header: 'Status', render: (p) => <StatusBadge kind="product" status={p.status} /> },
    { key: 'actions', header: 'Actions', align: 'right', render: actions },
  ];

  return (
    <>
      <AdminPageHeader
        title="Products"
        description={products ? `${products.length} products in the catalogue` : 'Loading catalogue…'}
        actions={
          <ButtonLink to="/admin/products/new" variant="dark" size="sm" icon={<Plus className="size-4" aria-hidden />}>
            Add product
          </ButtonLink>
        }
      />

      <AdminCard>
        <div className="grid gap-3 border-b border-line p-4 sm:grid-cols-[1fr_200px_160px]">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-taupe" aria-hidden />
            <label htmlFor="product-search" className="sr-only">
              Search products
            </label>
            <input
              id="product-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or SKU"
              className="h-11 w-full rounded-sm border border-line bg-white pr-3 pl-9 text-[15px] outline-none focus:border-gold-600 focus:ring-2 focus:ring-gold-500/15"
            />
          </div>
          <Select aria-label="Filter by category" value={category} onChange={(e) => setCategory(e.target.value)} options={[{ value: '', label: 'All categories' }, ...categories.map((c) => ({ value: c.slug, label: c.name }))]} />
          <Select
            aria-label="Filter by status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { value: '', label: 'All statuses' },
              { value: 'active', label: 'Active' },
              { value: 'draft', label: 'Draft' },
              { value: 'archived', label: 'Archived' },
            ]}
          />
        </div>

        <AdminTable
          caption="Products"
          columns={columns}
          rows={rows}
          rowKey={(p) => p.id}
          loading={isLoading}
          empty={
            <EmptyState
              icon={PackageOpen}
              title="No products found"
              description={products?.length ? 'No products match these filters.' : 'Add your first piece to start building the catalogue.'}
              action={
                products?.length ? (
                  <Button variant="outline-dark" onClick={() => { setSearch(''); setCategory(''); setStatus(''); }}>
                    Clear filters
                  </Button>
                ) : (
                  <ButtonLink to="/admin/products/new" variant="dark">Add product</ButtonLink>
                )
              }
            />
          }
          mobileCard={(p) => (
            <div className="flex gap-3">
              <SmartImage src={p.images[0]} alt="" aspectRatio={1} widths={[120]} sizes="64px" fade={false} className="size-16 shrink-0 rounded bg-ink-800 object-cover" />
              <div className="min-w-0 flex-1">
                <Link to={`/admin/products/${p.id}/edit`} className="block truncate font-medium">
                  {p.name}
                </Link>
                <p className="text-xs text-taupe">
                  {p.sku} · {getCategoryName(p.category)}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-medium tabular-nums">{formatINR(p.salePrice ?? p.price)}</span>
                  <span className="text-taupe">· {p.stock} in stock</span>
                  <StatusBadge kind="product" status={p.status} />
                </div>
              </div>
              {actions(p)}
            </div>
          )}
        />
      </AdminCard>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete this product?"
        description={
          <>
            <strong className="text-charcoal">{toDelete?.name}</strong> will be removed from the catalogue and the shop. This is mock data, so you can restore it from{' '}
            Settings → Reset demo data.
          </>
        }
        confirmLabel="Delete product"
        destructive
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}

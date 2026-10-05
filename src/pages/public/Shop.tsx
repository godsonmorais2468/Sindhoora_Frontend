import { useEffect, useEffectEvent, useMemo, useRef, useState } from 'react';
import { Navigate, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { Search, SearchX, SlidersHorizontal, X } from 'lucide-react';
import { ProductGridSkeleton } from '@/components/common/Skeletons';
import { EmptyState } from '@/components/common/EmptyState';
import { PageHeader } from '@/components/layout/PageHeader';
import { ProductGrid, productGridClasses } from '@/components/product/ProductGrid';
import { ShopFilters, type ShopFilterValues } from '@/components/product/ShopFilters';
import { Button } from '@/components/ui/Button';
import { Drawer } from '@/components/ui/Drawer';
import { Select } from '@/components/ui/FormControls';
import { getCategory, getCollection } from '@/data/categories';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useQuery } from '@/hooks/useQuery';
import { listProducts } from '@/services/productsService';
import type { CollectionSlug, PriceRange, SortOption } from '@/types/product';
import { pluralize } from '@/utils/formatters';
import { filterProducts, PRICE_RANGES, SORT_OPTIONS } from '@/utils/productFilters';

const PAGE_SIZE = 12;

export default function Shop() {
  const { category: categorySlug } = useParams();
  const category = getCategory(categorySlug);
  const { search } = useLocation();
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { data: products, isLoading } = useQuery('products:public', () => listProducts());

  const query = params.get('q') ?? '';
  const sort = (params.get('sort') as SortOption) || 'featured';
  const price = (params.get('price') as PriceRange) || 'all';
  const collection = getCollection(params.get('collection'));
  const inStockOnly = params.get('stock') === '1';

  // Local input state so typing stays responsive; the URL updates after a short pause.
  // `pushedQuery` remembers what we wrote to the URL, so that update isn't echoed back
  // into the input while the user is still typing.
  const [searchInput, setSearchInput] = useState(query);
  const pushedQuery = useRef(query);
  const debouncedSearch = useDebouncedValue(searchInput.trim(), 250);

  useEffect(() => {
    if (query !== pushedQuery.current) {
      pushedQuery.current = query;
      setSearchInput(query);
    }
  }, [query]);

  const pushSearch = useEffectEvent((value: string) => {
    if (value === query) return;
    pushedQuery.current = value;
    updateParams({ q: value || null });
  });
  useEffect(() => pushSearch(debouncedSearch), [debouncedSearch]);

  function updateParams(patch: Record<string, string | null>) {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(patch)) {
      if (value == null || value === '') next.delete(key);
      else next.set(key, value);
    }
    setParams(next, { replace: true });
  }

  function onFilterChange(patch: Partial<ShopFilterValues>) {
    updateParams({
      ...('price' in patch ? { price: patch.price === 'all' ? null : (patch.price ?? null) } : {}),
      ...('collection' in patch ? { collection: patch.collection ?? null } : {}),
      ...('inStockOnly' in patch ? { stock: patch.inStockOnly ? '1' : null } : {}),
    });
  }

  const collectionSlug: CollectionSlug | null = collection?.slug ?? null;

  const { results, counts } = useMemo(() => {
    if (!products) return { results: [], counts: {} as Record<string, number> };
    // Category counts reflect every other active filter (faceted search).
    const withoutCategory = filterProducts(products, { query, sort, price, collection: collectionSlug, inStockOnly });
    const tally: Record<string, number> = {};
    for (const p of withoutCategory) tally[p.category] = (tally[p.category] ?? 0) + 1;
    return {
      results: category ? withoutCategory.filter((p) => p.category === category.slug) : withoutCategory,
      counts: tally,
    };
  }, [products, category, query, sort, price, collectionSlug, inStockOnly]);

  // Reset pagination whenever the result set changes.
  const resultKey = `${categorySlug}|${query}|${sort}|${price}|${collection?.slug}|${inStockOnly}`;
  const [visible, setVisible] = useState({ key: resultKey, count: PAGE_SIZE });
  const visibleCount = visible.key === resultKey ? visible.count : PAGE_SIZE;

  const title = category?.name ?? collection?.name ?? 'Shop';
  useDocumentTitle(title, category?.description ?? 'Discover timeless antique and temple jewellery from Sindhoora Jewels.');

  if (categorySlug && !category) return <Navigate to={`/shop${search}`} replace />;

  const categoryHref = (slug?: string) => `/shop${slug ? `/${slug}` : ''}${search}`;
  const priceLabel = PRICE_RANGES.find((r) => r.value === price)?.label;
  const chips = [
    query && { key: 'q', label: `“${query}”`, clear: () => updateParams({ q: null }) },
    price !== 'all' && { key: 'price', label: priceLabel, clear: () => updateParams({ price: null }) },
    collection && { key: 'collection', label: collection.name, clear: () => updateParams({ collection: null }) },
    inStockOnly && { key: 'stock', label: 'In stock', clear: () => updateParams({ stock: null }) },
  ].filter(Boolean) as { key: string; label: string; clear: () => void }[];

  const filterPanel = (
    <ShopFilters
      values={{ category: category?.slug, collection: collectionSlug, price, inStockOnly }}
      counts={counts}
      totalCount={Object.values(counts).reduce((a, b) => a + b, 0)}
      categoryHref={categoryHref}
      onChange={onFilterChange}
    />
  );

  return (
    <>
      <PageHeader
        compact
        eyebrow={collection && !category ? 'Collection' : 'Sindhoora Jewels'}
        title={title}
        description={category?.description ?? collection?.description ?? 'Discover timeless pieces crafted with character.'}
        breadcrumbs={[{ label: 'Home', to: '/' }, ...(category ? [{ label: 'Shop', to: '/shop' }, { label: category.name }] : [{ label: 'Shop' }])]}
      />

      <section className="bg-ivory-50 pb-24 text-charcoal">
        <div className="container-luxe">
          {/* Toolbar */}
          <div className="flex flex-col gap-4 border-b border-line py-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-sm">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-taupe" aria-hidden />
              <label htmlFor="shop-search" className="sr-only">
                Search the shop
              </label>
              <input
                id="shop-search"
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by name, stone or style"
                className="h-11 w-full rounded-sm border border-line bg-white pr-4 pl-10 text-[15px] outline-none placeholder:text-taupe/70 focus:border-gold-600 focus:ring-2 focus:ring-gold-500/15"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline-dark"
                className="flex-1 lg:hidden"
                onClick={() => setFiltersOpen(true)}
                icon={<SlidersHorizontal className="size-4" strokeWidth={1.6} aria-hidden />}
              >
                Filters{chips.length > 0 && ` (${chips.length})`}
              </Button>
              <p className="hidden text-sm text-taupe lg:block" aria-live="polite">
                {products ? pluralize(results.length, 'piece') : ' '}
              </p>
              <Select
                aria-label="Sort products"
                value={sort}
                onChange={(e) => updateParams({ sort: e.target.value === 'featured' ? null : e.target.value })}
                options={SORT_OPTIONS}
                wrapperClassName="flex-1 lg:w-56 lg:flex-none"
              />
            </div>
          </div>

          {chips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-5">
              {chips.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={chip.clear}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white py-1.5 pr-2.5 pl-3.5 text-[13px] text-charcoal transition-colors hover:border-charcoal/40"
                >
                  {chip.label}
                  <X className="size-3.5 text-taupe" aria-hidden />
                  <span className="sr-only">Remove filter</span>
                </button>
              ))}
              <button type="button" onClick={() => setParams(new URLSearchParams(), { replace: true })} className="px-2 text-[13px] text-taupe underline-offset-4 hover:text-charcoal hover:underline">
                Clear all
              </button>
            </div>
          )}

          <div className="mt-8 grid gap-10 lg:mt-10 lg:grid-cols-[220px_1fr] lg:gap-12">
            <aside className="hidden lg:block" aria-label="Filters">
              <div className="sticky top-28">{filterPanel}</div>
            </aside>

            <div>
              <p className="mb-5 text-sm text-taupe lg:hidden" aria-live="polite">
                {products ? pluralize(results.length, 'piece') : ' '}
              </p>
              {isLoading ? (
                <ProductGridSkeleton count={8} className={productGridClasses.sidebar} />
              ) : results.length === 0 ? (
                <EmptyState
                  icon={SearchX}
                  title="No pieces found"
                  description="Nothing matches these filters just yet. Try a broader search, or explore the full collection."
                  action={
                    <Button variant="dark" onClick={() => setParams(new URLSearchParams(), { replace: true })}>
                      Clear filters
                    </Button>
                  }
                />
              ) : (
                <>
                  <ProductGrid products={results.slice(0, visibleCount)} priorityCount={4} layout="sidebar" />
                  {visibleCount < results.length && (
                    <div className="mt-14 flex flex-col items-center gap-3">
                      <p className="text-[13px] text-taupe">
                        Showing {visibleCount} of {results.length}
                      </p>
                      <Button variant="outline-dark" onClick={() => setVisible({ key: resultKey, count: visibleCount + PAGE_SIZE })}>
                        Load more pieces
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <Drawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        side="bottom"
        tone="light"
        title="Filters"
        footer={
          <Button variant="dark" className="w-full" onClick={() => setFiltersOpen(false)}>
            Show {pluralize(results.length, 'piece')}
          </Button>
        }
      >
        <div className="px-5 py-6">{filterPanel}</div>
      </Drawer>
    </>
  );
}

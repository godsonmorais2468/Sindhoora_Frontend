import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Checkbox } from '@/components/ui/FormControls';
import { categories, collections } from '@/data/categories';
import type { CollectionSlug, PriceRange } from '@/types/product';
import { cn } from '@/utils/helpers';
import { PRICE_RANGES } from '@/utils/productFilters';

export interface ShopFilterValues {
  category?: string;
  collection: CollectionSlug | null;
  price: PriceRange;
  inStockOnly: boolean;
}

interface ShopFiltersProps {
  values: ShopFilterValues;
  counts: Record<string, number>;
  totalCount: number;
  categoryHref: (slug?: string) => string;
  onChange: (patch: Partial<ShopFilterValues>) => void;
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="border-b border-line pb-7">
      <legend className="eyebrow mb-4 text-charcoal">{title}</legend>
      {children}
    </fieldset>
  );
}

function RadioRow({ name, checked, label, onSelect }: { name: string; checked: boolean; label: string; onSelect: () => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 py-1.5 text-[15px] text-charcoal/85 hover:text-charcoal">
      <input type="radio" name={name} checked={checked} onChange={onSelect} className="peer sr-only" />
      <span
        className="flex size-[18px] items-center justify-center rounded-full border border-charcoal/30 peer-checked:border-ink-900 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold-400 after:size-2 after:scale-0 after:rounded-full after:bg-ink-900 after:transition-transform peer-checked:after:scale-100"
        aria-hidden
      />
      <span className={cn(checked && 'font-medium text-charcoal')}>{label}</span>
    </label>
  );
}

export function ShopFilters({ values, counts, totalCount, categoryHref, onChange }: ShopFiltersProps) {
  return (
    <div className="space-y-7">
      <nav aria-label="Categories" className="border-b border-line pb-7">
        <h2 className="eyebrow mb-4 text-charcoal">Category</h2>
        <ul className="space-y-0.5">
          <li>
            <CategoryLink to={categoryHref()} active={!values.category} label="All jewellery" count={totalCount} />
          </li>
          {categories.map((c) => (
            <li key={c.slug}>
              <CategoryLink to={categoryHref(c.slug)} active={values.category === c.slug} label={c.name} count={counts[c.slug] ?? 0} />
            </li>
          ))}
        </ul>
      </nav>

      <FilterGroup title="Price">
        {PRICE_RANGES.map((r) => (
          <RadioRow key={r.value} name="price" label={r.label} checked={values.price === r.value} onSelect={() => onChange({ price: r.value })} />
        ))}
      </FilterGroup>

      <FilterGroup title="Collection">
        <RadioRow name="collection" label="All collections" checked={!values.collection} onSelect={() => onChange({ collection: null })} />
        {collections.map((c) => (
          <RadioRow key={c.slug} name="collection" label={c.name} checked={values.collection === c.slug} onSelect={() => onChange({ collection: c.slug })} />
        ))}
      </FilterGroup>

      <FilterGroup title="Availability">
        <Checkbox label="In stock only" checked={values.inStockOnly} onChange={(e) => onChange({ inStockOnly: e.target.checked })} />
      </FilterGroup>
    </div>
  );
}

function CategoryLink({ to, active, label, count }: { to: string; active: boolean; label: string; count: number }) {
  return (
    <Link
      to={to}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex items-center justify-between rounded-sm py-1.5 text-[15px] transition-colors',
        active ? 'font-medium text-charcoal' : 'text-charcoal/75 hover:text-charcoal',
      )}
    >
      <span className="flex items-center gap-2">
        <span className={cn('h-px bg-gold-600 transition-all duration-300', active ? 'w-4' : 'w-0')} aria-hidden />
        {label}
      </span>
      <span className="text-[13px] text-taupe tabular-nums">{count}</span>
    </Link>
  );
}

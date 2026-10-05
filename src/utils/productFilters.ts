import { getCategoryName } from '@/data/categories';
import type { CollectionSlug, PriceRange, Product, SortOption } from '@/types/product';

/** Effective selling price. */
export function priceOf(product: Product): number {
  return product.salePrice ?? product.price;
}

export const PRICE_RANGES: { value: PriceRange; label: string; min: number; max: number }[] = [
  { value: 'all', label: 'All prices', min: 0, max: Infinity },
  { value: 'under-25k', label: 'Under ₹25,000', min: 0, max: 25000 },
  { value: '25k-50k', label: '₹25,000 – ₹50,000', min: 25000, max: 50000 },
  { value: '50k-100k', label: '₹50,000 – ₹1,00,000', min: 50000, max: 100000 },
  { value: 'above-100k', label: 'Above ₹1,00,000', min: 100000, max: Infinity },
];

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name: A to Z' },
];

/** Case-insensitive match on name, category, material and description. Every word must match. */
export function searchProducts(products: Product[], query: string): Product[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return products;
  return products.filter((p) => {
    const haystack = `${p.name} ${getCategoryName(p.category)} ${p.material} ${p.shortDescription}`.toLowerCase();
    // Allow simple plurals ("necklaces" → "necklace").
    return terms.every((t) => haystack.includes(t) || haystack.includes(t.replace(/e?s$/, '')));
  });
}

export interface ProductFilters {
  query?: string;
  category?: string;
  collection?: CollectionSlug | null;
  price?: PriceRange;
  inStockOnly?: boolean;
  sort?: SortOption;
}

function compare(sort: SortOption) {
  switch (sort) {
    case 'newest':
      return (a: Product, b: Product) => b.createdAt.localeCompare(a.createdAt);
    case 'price-asc':
      return (a: Product, b: Product) => priceOf(a) - priceOf(b);
    case 'price-desc':
      return (a: Product, b: Product) => priceOf(b) - priceOf(a);
    case 'name':
      return (a: Product, b: Product) => a.name.localeCompare(b.name);
    case 'featured':
    default:
      // Featured first, then best sellers, then in-stock before sold-out.
      return (a: Product, b: Product) =>
        Number(b.featured) - Number(a.featured) ||
        Number(b.bestSeller) - Number(a.bestSeller) ||
        Number(b.stock > 0) - Number(a.stock > 0);
  }
}

/**
 * Client-side filtering for the prototype. With the real API these become query params
 * (e.g. `?search=&category=&min_price=&max_price=&ordering=`).
 */
export function filterProducts(products: Product[], filters: ProductFilters): Product[] {
  const range = PRICE_RANGES.find((r) => r.value === filters.price) ?? PRICE_RANGES[0];
  let result = filters.query ? searchProducts(products, filters.query) : products;
  result = result.filter(
    (p) =>
      (!filters.category || p.category === filters.category) &&
      (!filters.collection || p.collections.includes(filters.collection)) &&
      (!filters.inStockOnly || p.stock > 0) &&
      priceOf(p) >= range.min &&
      priceOf(p) < range.max,
  );
  return [...result].sort(compare(filters.sort ?? 'featured'));
}

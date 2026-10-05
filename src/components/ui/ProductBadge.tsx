import type { Product } from '@/types/product';
import { cn } from '@/utils/helpers';

/** The single most relevant merchandising label for a product, if any. */
export function getProductBadge(product: Product): string | null {
  if (product.stock <= 0) return 'Sold Out';
  if (product.limited) return 'Limited';
  if (product.isNew) return 'New';
  if (product.bestSeller) return 'Best Seller';
  if (product.salePrice) return 'Offer';
  return null;
}

export function ProductBadge({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-[2px] px-2 py-1 text-[11px] font-medium tracking-[0.12em] uppercase',
        label === 'Sold Out' ? 'bg-ink-950/80 text-cream' : 'bg-ivory/95 text-charcoal',
        className,
      )}
    >
      {label}
    </span>
  );
}

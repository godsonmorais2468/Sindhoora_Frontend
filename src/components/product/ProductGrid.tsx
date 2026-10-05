import { useCallback, useEffect, useRef, useState } from 'react';
import { useShopActions } from '@/hooks/useShopActions';
import type { Product } from '@/types/product';
import { cn } from '@/utils/helpers';
import { ProductCard } from './ProductCard';
import { QuickViewModal } from './QuickViewModal';

type GridLayout = 'full' | 'sidebar';

interface ProductGridProps {
  products: Product[];
  className?: string;
  /** `sidebar` leaves room for the shop's filter column. */
  layout?: GridLayout;
  /** Number of leading cards to load eagerly (above the fold). */
  priorityCount?: number;
}

const gridBase = 'grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-3 xl:gap-x-6';

/** 2 columns on phones, 3 on tablets, 4 on desktop (the sidebar layout waits for enough width). */
export const productGridClasses: Record<GridLayout, string> = {
  full: `${gridBase} xl:grid-cols-4`,
  sidebar: `${gridBase} min-[1360px]:grid-cols-4`,
};

export function ProductGrid({ products, className, layout = 'full', priorityCount = 0 }: ProductGridProps) {
  const { toggleWishlist, isWishlisted } = useShopActions();
  const [quickView, setQuickView] = useState<Product | null>(null);

  // Stable callback for memoised cards: toggling one item's wishlist state
  // only re-renders the card whose `wishlisted` prop changed.
  const toggleRef = useRef(toggleWishlist);
  useEffect(() => {
    toggleRef.current = toggleWishlist;
  }, [toggleWishlist]);
  const onToggleWishlist = useCallback((p: Product) => toggleRef.current(p), []);

  return (
    <>
      <div className={cn(productGridClasses[layout], className)}>
        {products.map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            index={i}
            priority={i < priorityCount}
            wishlisted={isWishlisted(product.id)}
            onToggleWishlist={onToggleWishlist}
            onQuickView={setQuickView}
          />
        ))}
      </div>
      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
    </>
  );
}

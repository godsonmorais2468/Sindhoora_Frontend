import { useCallback } from 'react';
import type { Product } from '@/types/product';
import { useCartActions } from './useCart';
import { useToast } from './useToast';
import { useWishlist } from './useWishlist';

/** Add-to-bag and wishlist actions with consistent toast feedback. */
export function useShopActions() {
  const { addItem } = useCartActions();
  const { idSet, toggle } = useWishlist();
  const toast = useToast();

  const addToBag = useCallback(
    (product: Product, quantity = 1) => {
      if (product.stock <= 0) {
        toast({ title: 'Sold out', description: `${product.name} is currently unavailable.`, tone: 'error' });
        return;
      }
      addItem(product, quantity);
      toast({ title: 'Added to your bag', description: product.name, action: { label: 'View bag', to: '/cart' } });
    },
    [addItem, toast],
  );

  const toggleWishlist = useCallback(
    (product: Product) => {
      const wasSaved = idSet.has(product.id);
      toggle(product.id);
      toast(
        wasSaved
          ? { title: 'Removed from wishlist', description: product.name, tone: 'wishlist' }
          : { title: 'Saved to your wishlist', description: product.name, tone: 'wishlist', action: { label: 'View wishlist', to: '/wishlist' } },
      );
    },
    [idSet, toggle, toast],
  );

  return { addToBag, toggleWishlist, isWishlisted: (id: string) => idSet.has(id) };
}

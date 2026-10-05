import { createContext, useMemo, type ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { CartItem } from '@/types/common';
import type { Product } from '@/types/product';
import { clamp } from '@/utils/helpers';
import { STORAGE_KEYS } from '@/utils/storage';

export interface CartState {
  items: CartItem[];
  count: number;
  subtotal: number;
}

export interface CartActions {
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

// State and actions are split so components that only add to the cart
// (product cards, quick view) don't re-render whenever the cart changes.
export const CartStateContext = createContext<CartState | null>(null);
export const CartActionsContext = createContext<CartActions | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useLocalStorage<CartItem[]>(STORAGE_KEYS.cart, []);

  const actions = useMemo<CartActions>(
    () => ({
      addItem(product, quantity = 1) {
        setItems((prev) => {
          const existing = prev.find((i) => i.productId === product.id);
          if (existing) {
            return prev.map((i) =>
              i.productId === product.id
                ? { ...i, maxQuantity: product.stock, quantity: clamp(i.quantity + quantity, 1, Math.max(1, product.stock)) }
                : i,
            );
          }
          const item: CartItem = {
            productId: product.id,
            slug: product.slug,
            name: product.name,
            category: product.category,
            image: product.images[0],
            price: product.salePrice ?? product.price,
            quantity: clamp(quantity, 1, Math.max(1, product.stock)),
            maxQuantity: product.stock,
          };
          return [...prev, item];
        });
      },
      updateQuantity(productId, quantity) {
        setItems((prev) =>
          prev.map((i) => (i.productId === productId ? { ...i, quantity: clamp(quantity, 1, Math.max(1, i.maxQuantity)) } : i)),
        );
      },
      removeItem(productId) {
        setItems((prev) => prev.filter((i) => i.productId !== productId));
      },
      clearCart() {
        setItems([]);
      },
    }),
    [setItems],
  );

  const state = useMemo<CartState>(
    () => ({
      items,
      count: items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    [items],
  );

  return (
    <CartActionsContext.Provider value={actions}>
      <CartStateContext.Provider value={state}>{children}</CartStateContext.Provider>
    </CartActionsContext.Provider>
  );
}

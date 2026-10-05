import { useContext } from 'react';
import { CartActionsContext, CartStateContext } from '@/context/CartContext';

/** Cart contents and totals, plus actions. Re-renders when the cart changes. */
export function useCart() {
  const state = useContext(CartStateContext);
  const actions = useContext(CartActionsContext);
  if (!state || !actions) throw new Error('useCart must be used inside <CartProvider>.');
  return { ...state, ...actions };
}

/** Cart actions only — stable, so callers don't re-render when the cart changes. */
export function useCartActions() {
  const actions = useContext(CartActionsContext);
  if (!actions) throw new Error('useCartActions must be used inside <CartProvider>.');
  return actions;
}

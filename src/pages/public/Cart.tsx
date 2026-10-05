import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CartLineItem } from '@/components/cart/CartLineItem';
import { OrderSummary } from '@/components/cart/OrderSummary';
import { EmptyState } from '@/components/common/EmptyState';
import { PageHeader } from '@/components/layout/PageHeader';
import { ButtonLink } from '@/components/ui/Button';
import { useCart } from '@/hooks/useCart';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useQuery } from '@/hooks/useQuery';
import { calculateShipping, getSettings } from '@/services/settingsService';

export default function Cart() {
  useDocumentTitle('Shopping Bag');
  const { items, count, subtotal, updateQuantity, removeItem } = useCart();
  const { data: settings } = useQuery('settings', getSettings);
  const shipping = settings ? calculateShipping(subtotal, settings) : null;

  return (
    <>
      <PageHeader compact title="Shopping Bag" breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Shopping bag' }]} />
      <section className="min-h-[50vh] bg-ivory-50 pb-24 text-charcoal">
        {items.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="Your bag is empty"
            description="Pieces you add will wait for you here. Begin with our bestsellers, or explore a collection."
            action={
              <>
                <ButtonLink to="/shop" variant="dark">
                  Shop the collection
                </ButtonLink>
                <ButtonLink to="/wishlist" variant="outline-dark">
                  View wishlist
                </ButtonLink>
              </>
            }
          />
        ) : (
          <div className="container-luxe grid gap-10 pt-6 lg:grid-cols-[1fr_400px] lg:gap-16 lg:pt-10">
            <div>
              <div className="hidden grid-cols-[1fr_auto] border-b border-line pb-4 text-xs tracking-[0.14em] text-taupe uppercase sm:grid">
                <span>Product</span>
                <span>Subtotal</span>
              </div>
              <ul className="divide-y divide-line border-b border-line">
                {items.map((item) => (
                  <CartLineItem key={item.productId} item={item} onQuantityChange={updateQuantity} onRemove={removeItem} />
                ))}
              </ul>
              <Link to="/shop" className="mt-6 inline-flex items-center gap-2 text-sm text-taupe hover:text-charcoal">
                ← Continue shopping
              </Link>
            </div>

            <div className="lg:sticky lg:top-28 lg:self-start">
              <OrderSummary subtotal={subtotal} shipping={shipping} freeShippingThreshold={settings?.freeShippingThreshold} itemCount={count}>
                <ButtonLink to="/checkout" variant="dark" size="lg" className="w-full" icon={<ArrowRight className="size-4" aria-hidden />}>
                  Proceed to Checkout
                </ButtonLink>
              </OrderSummary>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

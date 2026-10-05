import { useMemo } from 'react';
import { HeartOff } from 'lucide-react';
import { EmptyState } from '@/components/common/EmptyState';
import { ProductGridSkeleton } from '@/components/common/Skeletons';
import { PageHeader } from '@/components/layout/PageHeader';
import { ProductGrid, productGridClasses } from '@/components/product/ProductGrid';
import { Button, ButtonLink } from '@/components/ui/Button';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useQuery } from '@/hooks/useQuery';
import { useWishlist } from '@/hooks/useWishlist';
import { listProducts } from '@/services/productsService';
import { pluralize } from '@/utils/formatters';

export default function Wishlist() {
  useDocumentTitle('Wishlist');
  const { ids, clear } = useWishlist();
  const { data: products } = useQuery('products:public', () => listProducts());

  // Keep the order the pieces were saved in (most recent first).
  const saved = useMemo(() => {
    if (!products) return [];
    const byId = new Map(products.map((p) => [p.id, p]));
    return [...ids].reverse().flatMap((id) => byId.get(id) ?? []);
  }, [products, ids]);

  return (
    <>
      <PageHeader compact title="Wishlist" description="Pieces you have saved for later." breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Wishlist' }]} />
      <section className="min-h-[50vh] bg-ivory-50 pb-24 text-charcoal">
        <div className="container-luxe">
          {ids.length === 0 ? (
            <EmptyState
              icon={HeartOff}
              title="No saved pieces yet"
              description="Tap the heart on any piece to keep it here while you decide."
              action={<ButtonLink to="/shop" variant="dark">Discover the collection</ButtonLink>}
            />
          ) : !products ? (
            <ProductGridSkeleton count={Math.min(ids.length, 8)} className={`${productGridClasses.full} pt-10`} />
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-line py-6">
                <p className="text-sm text-taupe">{pluralize(saved.length, 'saved piece')}</p>
                <Button variant="ghost-dark" size="sm" onClick={clear}>
                  Clear wishlist
                </Button>
              </div>
              <ProductGrid products={saved} className="pt-10" />
            </>
          )}
        </div>
      </section>
    </>
  );
}

import { useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/common/Reveal';
import { SectionHeading } from '@/components/common/SectionHeading';
import { ProductGridSkeleton } from '@/components/common/Skeletons';
import { ProductGrid, productGridClasses } from '@/components/product/ProductGrid';
import { ButtonLink } from '@/components/ui/Button';
import { useQuery } from '@/hooks/useQuery';
import { listProducts } from '@/services/productsService';

export function Bestsellers() {
  const { data: products } = useQuery('products:public', () => listProducts());
  const bestsellers = useMemo(() => (products ?? []).filter((p) => p.bestSeller).slice(0, 8), [products]);

  return (
    <section className="bg-ivory-50 py-20 sm:py-28 lg:py-32">
      <div className="container-luxe">
        <Reveal>
          <SectionHeading
            eyebrow="Most loved"
            title="Bestsellers"
            description="The pieces our clients return to — and recommend to their sisters, daughters and friends."
            action={
              <ButtonLink to="/shop" variant="outline-dark" size="md" icon={<ArrowRight className="size-4" aria-hidden />}>
                Shop all
              </ButtonLink>
            }
          />
        </Reveal>
        <div className="mt-12 lg:mt-16">
          {products ? <ProductGrid products={bestsellers} /> : <ProductGridSkeleton count={8} className={productGridClasses.full} />}
        </div>
      </div>
    </section>
  );
}

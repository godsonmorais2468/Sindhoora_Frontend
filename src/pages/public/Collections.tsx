import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/common/Reveal';
import { SectionHeading } from '@/components/common/SectionHeading';
import { SmartImage } from '@/components/common/SmartImage';
import { PageHeader } from '@/components/layout/PageHeader';
import { ButtonLink } from '@/components/ui/Button';
import { categories, collections } from '@/data/categories';
import { editorialImages } from '@/data/images';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useQuery } from '@/hooks/useQuery';
import { listProducts } from '@/services/productsService';
import type { CollectionSlug } from '@/types/product';
import { cn } from '@/utils/helpers';

export default function Collections() {
  useDocumentTitle('Collections', 'Temple jewellery, bridal heritage, antique gold and statement pieces — curated collections from Sindhoora Jewels.');
  const { data: products } = useQuery('products:public', () => listProducts());
  const countFor = (slug: CollectionSlug) => products?.filter((p) => p.collections.includes(slug)).length;

  return (
    <>
      <PageHeader
        eyebrow="Collections"
        title={
          <>
            Curated stories,
            <br />
            <span className="text-champagne italic">told in gold.</span>
          </>
        }
        description="Each collection gathers pieces around a single idea — a tradition, an occasion or a feeling."
        image={editorialImages.pageHeader}
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Collections' }]}
      />

      <section className="bg-ivory-50 py-16 text-charcoal sm:py-24">
        <div className="container-luxe space-y-20 lg:space-y-28">
          {collections.map((collection, i) => {
            const count = countFor(collection.slug);
            return (
              <Reveal key={collection.slug} className="grid items-center gap-8 lg:grid-cols-12 lg:gap-16">
                <Link
                  to={`/shop?collection=${collection.slug}`}
                  className={cn('group block overflow-hidden rounded-sm bg-ink-800 lg:col-span-7', i % 2 === 1 && 'lg:order-2')}
                  tabIndex={-1}
                  aria-hidden
                >
                  <SmartImage
                    src={collection.image}
                    alt=""
                    aspectRatio={4 / 3}
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    className="motion-safe-scale aspect-[4/3] w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
                  />
                </Link>
                <div className="lg:col-span-5">
                  <p className="eyebrow text-gold-700">
                    {String(i + 1).padStart(2, '0')} · {collection.tagline}
                  </p>
                  <h2 className="heading-display mt-4 text-4xl sm:text-5xl">{collection.name}</h2>
                  <div className="gold-rule mt-6" aria-hidden />
                  <p className="mt-6 text-[17px] leading-relaxed text-taupe">{collection.description}</p>
                  {count != null && <p className="mt-4 text-sm text-taupe">{count} pieces available</p>}
                  <ButtonLink to={`/shop?collection=${collection.slug}`} variant="dark" className="mt-8" icon={<ArrowRight className="size-4" aria-hidden />}>
                    Explore the collection
                  </ButtonLink>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="bg-ink-900 py-20 sm:py-28">
        <div className="container-luxe">
          <Reveal>
            <SectionHeading tone="dark" eyebrow="Shop by category" title="Find your piece" />
          </Reveal>
          <Reveal delay={0.1} className="mt-12">
            <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link to={`/shop/${c.slug}`} className="group relative block aspect-[4/3] overflow-hidden rounded-sm bg-ink-800 sm:aspect-[16/10]">
                    <SmartImage
                      src={c.image}
                      alt=""
                      aspectRatio={16 / 10}
                      sizes="(min-width: 768px) 33vw, 50vw"
                      className="motion-safe-scale absolute inset-0 size-full object-cover opacity-80 transition-[transform,opacity] duration-700 group-hover:scale-[1.04] group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-ink-950/85 to-transparent" aria-hidden />
                    <span className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4 sm:p-5">
                      <span className="text-[15px] font-medium text-cream sm:text-lg">{c.name}</span>
                      <ArrowRight className="size-4 text-gold-400 transition-transform group-hover:translate-x-1" aria-hidden />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </>
  );
}

import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, m } from 'framer-motion';
import { Gem, Heart, PackageSearch, RotateCcw, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import { Accordion } from '@/components/common/Accordion';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { EmptyState } from '@/components/common/EmptyState';
import { Price } from '@/components/common/Price';
import { QuantitySelector } from '@/components/common/QuantitySelector';
import { Reveal } from '@/components/common/Reveal';
import { SectionHeading } from '@/components/common/SectionHeading';
import { ProductDetailSkeleton } from '@/components/common/Skeletons';
import { WhatsAppIcon } from '@/components/common/SocialIcons';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductGrid } from '@/components/product/ProductGrid';
import { StockNote } from '@/components/product/StockNote';
import { Button, ButtonLink } from '@/components/ui/Button';
import { siteInfo } from '@/data/brand';
import { getCategory } from '@/data/categories';
import { policies } from '@/data/policies';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useQuery } from '@/hooks/useQuery';
import { useShopActions } from '@/hooks/useShopActions';
import { getProduct, listProducts } from '@/services/productsService';
import type { Product } from '@/types/product';
import { formatINR } from '@/utils/currency';
import { cn } from '@/utils/helpers';
import { priceOf } from '@/utils/productFilters';

export default function ProductDetails() {
  const { id = '' } = useParams();
  const { data: product, isLoading } = useQuery(`product:${id}`, () => getProduct(id));
  useDocumentTitle(product?.name ?? (isLoading ? 'Loading' : 'Piece not found'), product?.shortDescription);

  return (
    <>
      <div className="bg-ink-950 pt-24 pb-5 lg:pt-28">
        <div className="container-luxe">
          <Breadcrumbs
            items={[
              { label: 'Home', to: '/' },
              { label: 'Shop', to: '/shop' },
              ...(product ? [{ label: getCategory(product.category)?.name ?? 'Category', to: `/shop/${product.category}` }, { label: product.name }] : []),
            ]}
          />
        </div>
      </div>

      <div className="bg-ivory-50 text-charcoal">
        {isLoading ? (
          <div className="container-luxe py-10 lg:py-14">
            <ProductDetailSkeleton />
          </div>
        ) : product ? (
          <ProductView key={product.id} product={product} />
        ) : (
          <EmptyState
            icon={PackageSearch}
            title="This piece could not be found"
            description="It may have been sold or moved to a different collection. Explore the shop for similar heritage pieces."
            action={<ButtonLink to="/shop" variant="dark">Browse the shop</ButtonLink>}
          />
        )}
      </div>
    </>
  );
}

function ProductView({ product }: { product: Product }) {
  const navigate = useNavigate();
  const { addToBag, toggleWishlist, isWishlisted } = useShopActions();
  const [quantity, setQuantity] = useState(1);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const soldOut = product.stock <= 0;
  const saved = isWishlisted(product.id);
  const category = getCategory(product.category);
  const enquiryText = encodeURIComponent(`Hello Sindhoora, I'd like to know more about the ${product.name} (${product.sku}).`);

  // Show the sticky mobile bar only once the main buttons have scrolled above the viewport.
  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setShowStickyBar(!entry.isIntersecting && entry.boundingClientRect.top < 0));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const accordionItems = [
    { id: 'description', title: 'Description', content: <p>{product.description}</p> },
    {
      id: 'specifications',
      title: 'Specifications',
      content: (
        <dl className="grid grid-cols-[minmax(110px,auto)_1fr] gap-x-6 gap-y-3">
          {[
            ['Material', product.material],
            ['Weight', product.weight],
            ['Dimensions', product.dimensions],
            ['SKU', product.sku],
            ['Category', category?.name ?? product.category],
          ].map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="text-taupe">{label}</dt>
              <dd className="text-charcoal">{value}</dd>
            </div>
          ))}
        </dl>
      ),
    },
    ...(['shipping', 'returns'] as const).map((slug) => {
      const policy = policies.find((p) => p.slug === slug)!;
      return {
        id: slug,
        title: policy.title,
        content: (
          <div className="space-y-3">
            {policy.sections.slice(0, 2).map((s) => (
              <p key={s.heading}>{s.body}</p>
            ))}
            <Link to={`/policies/${slug}`} className="inline-block text-charcoal underline underline-offset-4">
              Read the full {policy.title.toLowerCase()} policy
            </Link>
          </div>
        ),
      };
    }),
  ];

  function buyNow() {
    addToBag(product, quantity);
    navigate('/checkout');
  }

  return (
    <>
      <section className="container-luxe grid gap-10 py-8 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:py-14 xl:gap-24 [&>*]:min-w-0">
        <ProductGallery images={product.images} name={product.name} />

        <div className="lg:sticky lg:top-28 lg:self-start">
          <Link to={`/shop/${product.category}`} className="eyebrow text-gold-700 hover:text-gold-600">
            {category?.name}
          </Link>
          <h1 className="mt-3 text-3xl leading-tight font-medium tracking-tight text-charcoal sm:text-[2.1rem]">{product.name}</h1>
          <Price price={product.price} salePrice={product.salePrice} className="mt-4 text-2xl" />
          <p className="mt-1 text-[13px] text-taupe">Inclusive of all taxes</p>
          <StockNote stock={product.stock} className="mt-5" />

          <p className="mt-6 text-[17px] leading-relaxed text-taupe">{product.shortDescription}</p>

          <div ref={ctaRef} className="mt-8 space-y-3">
            {/* Wraps on narrow phones: quantity on its own line, then bag + wishlist. */}
            <div className="flex flex-wrap gap-3">
              {!soldOut && <QuantitySelector value={quantity} max={product.stock} onChange={setQuantity} />}
              <Button
                variant="dark"
                size="lg"
                className="min-w-[11rem] flex-1"
                disabled={soldOut}
                onClick={() => addToBag(product, quantity)}
                icon={<ShoppingBag className="size-4" strokeWidth={1.6} />}
              >
                {soldOut ? 'Sold out' : 'Add to bag'}
              </Button>
              <Button
                variant="outline-dark"
                size="icon"
                className="size-12 shrink-0"
                onClick={() => toggleWishlist(product)}
                aria-pressed={saved}
                aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <Heart className={cn('size-5', saved && 'fill-gold-500 text-gold-600')} strokeWidth={1.5} />
              </Button>
            </div>
            {!soldOut && (
              <Button variant="gold" size="lg" className="w-full" onClick={buyNow}>
                Buy now
              </Button>
            )}
            <a
              href={`https://wa.me/${siteInfo.whatsapp}?text=${enquiryText}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 py-2 text-sm text-taupe transition-colors hover:text-charcoal"
            >
              <WhatsAppIcon className="size-4" />
              {soldOut ? 'Enquire about a similar piece' : 'Questions? Chat with us on WhatsApp'}
            </a>
          </div>

          <ul className="mt-8 grid grid-cols-3 gap-3 border-y border-line py-6 text-center text-[13px] leading-snug text-taupe">
            {[
              { icon: ShieldCheck, label: 'Authenticity assured' },
              { icon: Truck, label: 'Insured shipping' },
              { icon: RotateCcw, label: '7-day returns' },
            ].map(({ icon: Icon, label }) => (
              <li key={label} className="flex flex-col items-center gap-2">
                <Icon className="size-5 text-gold-600" strokeWidth={1.4} aria-hidden />
                {label}
              </li>
            ))}
          </ul>

          <Accordion items={accordionItems} defaultOpen="description" className="mt-2 border-t-0" />

          <p className="mt-6 flex items-start gap-2 text-[13px] leading-relaxed text-taupe">
            <Gem className="mt-0.5 size-4 shrink-0 text-gold-600" strokeWidth={1.4} aria-hidden />
            Handcrafted pieces vary slightly in finish and weight — part of what makes each one yours.
          </p>
        </div>
      </section>

      <RelatedProducts product={product} />

      {/* Mobile: keep the primary action within thumb reach once the main button scrolls away. */}
      <AnimatePresence>
        {showStickyBar && !soldOut && (
          <m.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgb(0_0_0/0.06)] backdrop-blur lg:hidden"
          >
            <div className="flex items-center gap-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-charcoal">{product.name}</p>
                <p className="text-sm text-taupe tabular-nums">{formatINR(priceOf(product))}</p>
              </div>
              <Button variant="dark" onClick={() => addToBag(product, quantity)} icon={<ShoppingBag className="size-4" strokeWidth={1.6} />}>
                Add to bag
              </Button>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}

function RelatedProducts({ product }: { product: Product }) {
  const { data: products } = useQuery('products:public', () => listProducts());
  const related = useMemo(() => {
    if (!products) return [];
    const others = products.filter((p) => p.id !== product.id && p.stock > 0);
    const sameCategory = others.filter((p) => p.category === product.category);
    const sharedCollection = others.filter((p) => p.category !== product.category && p.collections.some((c) => product.collections.includes(c)));
    return [...sameCategory, ...sharedCollection].slice(0, 4);
  }, [products, product]);

  if (related.length === 0) return null;
  return (
    <section className="border-t border-line py-20 lg:py-24">
      <div className="container-luxe">
        <Reveal>
          <SectionHeading eyebrow="Complete the look" title="You may also love" />
        </Reveal>
        <ProductGrid products={related} className="mt-12" />
      </div>
    </section>
  );
}

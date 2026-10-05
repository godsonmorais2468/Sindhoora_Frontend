import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Heart } from 'lucide-react';
import { Price } from '@/components/common/Price';
import { SmartImage } from '@/components/common/SmartImage';
import { getProductBadge, ProductBadge } from '@/components/ui/ProductBadge';
import { getCategoryName } from '@/data/categories';
import type { Product } from '@/types/product';
import { cn } from '@/utils/helpers';

const CARD_SIZES = '(min-width: 1280px) 22vw, (min-width: 768px) 31vw, 48vw';

interface ProductCardProps {
  product: Product;
  wishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  /** Position in the grid — used for a short, capped entrance stagger. */
  index?: number;
  priority?: boolean;
}

/**
 * Product tile. Hover effects are CSS-only (transform/opacity), so a grid of many cards
 * costs nothing extra at runtime.
 */
export const ProductCard = memo(function ProductCard({
  product,
  wishlisted,
  onToggleWishlist,
  onQuickView,
  index = 0,
  priority,
}: ProductCardProps) {
  const href = `/product/${product.slug}`;
  const badge = getProductBadge(product);
  const [cover, hoverImage] = product.images;

  return (
    <article className="group relative animate-fade-up" style={{ animationDelay: `${Math.min(index, 7) * 60}ms` }}>
      <div className="relative overflow-hidden rounded-sm bg-ink-800">
        <Link to={href} tabIndex={-1} aria-hidden className="block aspect-[4/5]">
          <SmartImage
            src={cover}
            alt={product.name}
            aspectRatio={4 / 5}
            sizes={CARD_SIZES}
            priority={priority}
            className="motion-safe-scale size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          {hoverImage && (
            <SmartImage
              src={hoverImage}
              alt=""
              aspectRatio={4 / 5}
              sizes={CARD_SIZES}
              fade={false}
              className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-500 pointer-fine:group-hover:opacity-100"
            />
          )}
        </Link>

        {badge && <ProductBadge label={badge} className="absolute top-3 left-3" />}

        <button
          type="button"
          onClick={() => onToggleWishlist(product)}
          aria-pressed={wishlisted}
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          className="absolute top-2 right-2 flex size-11 items-center justify-center rounded-full"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-ivory/90 text-charcoal shadow-sm transition-transform duration-200 group-hover:scale-105 hover:bg-white">
            <Heart className={cn('size-[18px] transition-colors', wishlisted && 'fill-gold-500 text-gold-600')} strokeWidth={1.6} />
          </span>
        </button>

        {onQuickView && (
          <button
            type="button"
            onClick={() => onQuickView(product)}
            className="absolute inset-x-3 bottom-3 hidden h-10 translate-y-2 items-center justify-center gap-2 rounded-sm bg-ivory/95 text-[13px] font-medium text-charcoal opacity-0 transition-[opacity,transform] duration-300 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-white pointer-fine:flex"
          >
            <Eye className="size-4" strokeWidth={1.6} aria-hidden />
            Quick view
          </button>
        )}
      </div>

      <div className="pt-4">
        <p className="text-xs tracking-[0.14em] text-taupe uppercase">{getCategoryName(product.category)}</p>
        <h3 className="mt-1.5 text-[15px] leading-snug font-medium text-charcoal">
          <Link to={href} className="transition-colors hover:text-gold-700">
            {product.name}
          </Link>
        </h3>
        <Price price={product.price} salePrice={product.salePrice} className="mt-1.5 text-[15px]" />
      </div>
    </article>
  );
});

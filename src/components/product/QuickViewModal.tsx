import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, ShoppingBag } from 'lucide-react';
import { Price } from '@/components/common/Price';
import { QuantitySelector } from '@/components/common/QuantitySelector';
import { SmartImage } from '@/components/common/SmartImage';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { getCategoryName } from '@/data/categories';
import { useShopActions } from '@/hooks/useShopActions';
import type { Product } from '@/types/product';
import { cn } from '@/utils/helpers';
import { StockNote } from './StockNote';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  // Keep showing the last product while the modal animates out.
  const [shown, setShown] = useState<Product | null>(product);
  if (product && product !== shown) setShown(product);

  return (
    <Modal open={Boolean(product)} onClose={onClose} title={shown?.name ?? 'Quick view'} hideTitle size="xl">
      {shown && <QuickViewContent key={shown.id} product={shown} onClose={onClose} />}
    </Modal>
  );
}

function QuickViewContent({ product, onClose }: { product: Product; onClose: () => void }) {
  const { addToBag, toggleWishlist, isWishlisted } = useShopActions();
  const [active, setActive] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const soldOut = product.stock <= 0;
  const saved = isWishlisted(product.id);

  return (
    <div className="grid md:grid-cols-2">
      <div className="bg-ink-800">
        <SmartImage
          key={active}
          src={product.images[active]}
          alt={product.name}
          aspectRatio={4 / 5}
          sizes="(min-width: 768px) 512px, 100vw"
          className="aspect-[4/5] w-full object-cover"
        />
        {product.images.length > 1 && (
          <div className="flex gap-2 p-3">
            {product.images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show image ${i + 1}`}
                aria-current={i === active}
                className={cn('overflow-hidden rounded-sm ring-1 transition', i === active ? 'ring-gold-400' : 'ring-white/10 opacity-70 hover:opacity-100')}
              >
                <SmartImage src={src} alt="" aspectRatio={1} widths={[120]} sizes="56px" fade={false} className="size-14 object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col p-6 sm:p-8">
        <p className="text-xs tracking-[0.14em] text-taupe uppercase">{getCategoryName(product.category)}</p>
        <h2 className="mt-2 text-2xl font-medium tracking-tight text-charcoal">{product.name}</h2>
        <Price price={product.price} salePrice={product.salePrice} className="mt-3 text-xl" />
        <StockNote stock={product.stock} className="mt-3" />
        <p className="mt-5 text-[15px] leading-relaxed text-taupe">{product.shortDescription}</p>

        <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-t border-line pt-5 text-sm">
          <dt className="text-taupe">Material</dt>
          <dd className="text-charcoal">{product.material}</dd>
          <dt className="text-taupe">Weight</dt>
          <dd className="text-charcoal">{product.weight}</dd>
        </dl>

        <div className="mt-auto pt-8">
          <div className="flex flex-wrap gap-3">
            {!soldOut && <QuantitySelector value={quantity} max={product.stock} onChange={setQuantity} />}
            <Button
              variant="dark"
              className="min-w-[10rem] flex-1"
              disabled={soldOut}
              icon={<ShoppingBag className="size-4" strokeWidth={1.6} />}
              onClick={() => {
                addToBag(product, quantity);
                onClose();
              }}
            >
              {soldOut ? 'Sold out' : 'Add to bag'}
            </Button>
            <Button
              variant="outline-dark"
              size="icon"
              className="size-11 shrink-0"
              onClick={() => toggleWishlist(product)}
              aria-pressed={saved}
              aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
            >
              <Heart className={cn('size-[18px]', saved && 'fill-gold-500 text-gold-600')} strokeWidth={1.6} />
            </Button>
          </div>
          <Link
            to={`/product/${product.slug}`}
            onClick={onClose}
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-charcoal underline-offset-4 hover:underline"
          >
            View full details <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}

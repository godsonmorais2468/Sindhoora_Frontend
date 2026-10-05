import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { QuantitySelector } from '@/components/common/QuantitySelector';
import { SmartImage } from '@/components/common/SmartImage';
import { getCategoryName } from '@/data/categories';
import type { CartItem } from '@/types/common';
import { formatINR } from '@/utils/currency';

interface CartLineItemProps {
  item: CartItem;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export const CartLineItem = memo(function CartLineItem({ item, onQuantityChange, onRemove }: CartLineItemProps) {
  const href = `/product/${item.slug}`;
  return (
    <li className="flex gap-4 py-6 sm:gap-6">
      <Link to={href} className="w-24 shrink-0 overflow-hidden rounded-sm bg-ink-800 sm:w-28" tabIndex={-1} aria-hidden>
        <SmartImage src={item.image} alt="" aspectRatio={4 / 5} widths={[200, 320]} sizes="112px" fade={false} className="aspect-[4/5] w-full object-cover" />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs tracking-[0.14em] text-taupe uppercase">{getCategoryName(item.category)}</p>
            <h3 className="mt-1 text-[15px] leading-snug font-medium text-charcoal">
              <Link to={href} className="hover:text-gold-700">
                {item.name}
              </Link>
            </h3>
            <p className="mt-1 text-sm text-taupe tabular-nums">{formatINR(item.price)} each</p>
          </div>
          <p className="text-[15px] font-medium text-charcoal tabular-nums">{formatINR(item.price * item.quantity)}</p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-4 pt-4">
          <QuantitySelector
            size="sm"
            value={item.quantity}
            max={Math.max(1, item.maxQuantity)}
            onChange={(q) => onQuantityChange(item.productId, q)}
            label={`Quantity for ${item.name}`}
          />
          <button
            type="button"
            onClick={() => onRemove(item.productId)}
            className="inline-flex items-center gap-1.5 rounded-sm px-2 py-2 text-[13px] text-taupe transition-colors hover:text-danger"
          >
            <Trash2 className="size-4" strokeWidth={1.5} aria-hidden />
            <span>Remove</span>
            <span className="sr-only">{item.name}</span>
          </button>
        </div>
      </div>
    </li>
  );
});

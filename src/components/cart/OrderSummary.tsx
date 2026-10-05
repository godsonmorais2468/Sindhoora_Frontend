import type { ReactNode } from 'react';
import { ShieldCheck, Truck } from 'lucide-react';
import { formatINR } from '@/utils/currency';
import { cn } from '@/utils/helpers';

interface OrderSummaryProps {
  subtotal: number;
  shipping: number | null;
  freeShippingThreshold?: number;
  itemCount: number;
  /** Optional line items shown above the totals (checkout). */
  items?: ReactNode;
  /** Actions shown below the totals. */
  children?: ReactNode;
  className?: string;
  title?: string;
}

export function OrderSummary({ subtotal, shipping, freeShippingThreshold, itemCount, items, children, className, title = 'Order summary' }: OrderSummaryProps) {
  const remaining = freeShippingThreshold ? freeShippingThreshold - subtotal : 0;
  return (
    <section aria-label={title} className={cn('rounded-sm border border-line bg-white p-6 sm:p-7', className)}>
      <h2 className="text-lg font-medium text-charcoal">{title}</h2>
      {items && <div className="mt-5 border-b border-line pb-5">{items}</div>}
      <dl className="mt-6 space-y-3 text-[15px]">
        <div className="flex justify-between">
          <dt className="text-taupe">Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</dt>
          <dd className="text-charcoal tabular-nums">{formatINR(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-taupe">Insured shipping</dt>
          <dd className="text-charcoal tabular-nums">{shipping == null ? '—' : shipping === 0 ? 'Complimentary' : formatINR(shipping)}</dd>
        </div>
        <div className="flex justify-between border-t border-line pt-4 text-base">
          <dt className="font-medium text-charcoal">Total</dt>
          <dd className="font-semibold text-charcoal tabular-nums">{formatINR(subtotal + (shipping ?? 0))}</dd>
        </div>
      </dl>
      {remaining > 0 && (
        <p className="mt-4 rounded-sm bg-ivory px-3 py-2.5 text-[13px] text-taupe">
          Add {formatINR(remaining)} more for complimentary insured shipping.
        </p>
      )}
      {children && <div className="mt-6">{children}</div>}
      <ul className="mt-6 space-y-2.5 border-t border-line pt-5 text-[13px] text-taupe">
        <li className="flex items-center gap-2.5">
          <ShieldCheck className="size-4 text-gold-600" strokeWidth={1.6} aria-hidden /> Authenticity assured on every piece
        </li>
        <li className="flex items-center gap-2.5">
          <Truck className="size-4 text-gold-600" strokeWidth={1.6} aria-hidden /> Insured, tamper-evident delivery across India
        </li>
      </ul>
    </section>
  );
}

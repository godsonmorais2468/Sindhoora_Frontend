import { formatINR } from '@/utils/currency';
import { cn } from '@/utils/helpers';

interface PriceProps {
  price: number;
  salePrice?: number | null;
  className?: string;
  tone?: 'light' | 'dark';
}

export function Price({ price, salePrice, className, tone = 'light' }: PriceProps) {
  const sale = salePrice != null && salePrice < price ? salePrice : null;
  return (
    <p className={cn('flex flex-wrap items-baseline gap-x-2 tabular-nums', className)}>
      <span className="sr-only">{sale != null ? 'Sale price' : 'Price'}</span>
      <span className={cn('font-medium', tone === 'dark' ? 'text-cream' : 'text-charcoal')}>{formatINR(sale ?? price)}</span>
      {sale != null && (
        <>
          <span className="sr-only">Original price</span>
          <s className={cn('text-[0.85em]', tone === 'dark' ? 'text-muted' : 'text-taupe')}>{formatINR(price)}</s>
        </>
      )}
    </p>
  );
}

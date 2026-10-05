import { CircleCheck, CircleX, TriangleAlert } from 'lucide-react';
import { cn } from '@/utils/helpers';

/** Customer-facing availability line. Icon + text so it never relies on colour alone. */
export function StockNote({ stock, className }: { stock: number; className?: string }) {
  if (stock <= 0) {
    return (
      <p className={cn('flex items-center gap-2 text-sm text-danger', className)}>
        <CircleX className="size-4" strokeWidth={1.8} aria-hidden /> Sold out — enquire for a similar piece
      </p>
    );
  }
  if (stock <= 3) {
    return (
      <p className={cn('flex items-center gap-2 text-sm text-warning', className)}>
        <TriangleAlert className="size-4" strokeWidth={1.8} aria-hidden /> Only {stock} left
      </p>
    );
  }
  return (
    <p className={cn('flex items-center gap-2 text-sm text-success', className)}>
      <CircleCheck className="size-4" strokeWidth={1.8} aria-hidden /> In stock, ready to ship
    </p>
  );
}

import { cn } from '@/utils/helpers';

export function ProductCardSkeleton({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const block = tone === 'dark' ? 'skeleton-dark' : 'skeleton';
  return (
    <div aria-hidden>
      <div className={cn(block, 'aspect-[4/5] w-full rounded-sm')} />
      <div className={cn(block, 'mt-4 h-3 w-1/3')} />
      <div className={cn(block, 'mt-2.5 h-4 w-3/4')} />
      <div className={cn(block, 'mt-2.5 h-4 w-1/4')} />
    </div>
  );
}

export function ProductGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
  return (
    <div role="status" aria-label="Loading products" className={className}>
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div role="status" aria-label="Loading" className="divide-y divide-line">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4">
          <div className="skeleton size-10 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-3.5 w-1/3" />
            <div className="skeleton h-3 w-1/5" />
          </div>
          <div className="skeleton hidden h-3.5 w-20 sm:block" />
        </div>
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div role="status" aria-label="Loading product" className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="skeleton aspect-[4/5] w-full rounded-sm" />
      <div className="space-y-4 pt-4">
        <div className="skeleton h-3 w-24" />
        <div className="skeleton h-9 w-3/4" />
        <div className="skeleton h-6 w-32" />
        <div className="skeleton mt-8 h-24 w-full" />
        <div className="skeleton h-12 w-full" />
      </div>
    </div>
  );
}

import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/utils/helpers';

interface StatCardProps {
  label: string;
  value: ReactNode;
  icon: LucideIcon;
  hint?: ReactNode;
  /** Fractional change, e.g. 0.12 for +12%. */
  delta?: number | null;
  loading?: boolean;
}

export function StatCard({ label, value, icon: Icon, hint, delta, loading }: StatCardProps) {
  return (
    <div className="rounded-lg border border-line bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13px] font-medium text-taupe">{label}</p>
        <span className="flex size-9 items-center justify-center rounded-md bg-ivory text-gold-700">
          <Icon className="size-[18px]" strokeWidth={1.6} aria-hidden />
        </span>
      </div>
      {loading ? (
        <div className="skeleton mt-3 h-8 w-28" />
      ) : (
        <p className="mt-2 text-[1.75rem] leading-tight font-semibold tracking-tight text-charcoal">{value}</p>
      )}
      <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px] text-taupe">
        {delta != null && !loading && (
          <span className={cn('inline-flex items-center gap-1 font-medium', delta >= 0 ? 'text-success' : 'text-danger')}>
            {delta >= 0 ? <TrendingUp className="size-3.5" aria-hidden /> : <TrendingDown className="size-3.5" aria-hidden />}
            {delta >= 0 ? '+' : ''}
            {(delta * 100).toFixed(1)}%
          </span>
        )}
        {hint}
      </div>
    </div>
  );
}

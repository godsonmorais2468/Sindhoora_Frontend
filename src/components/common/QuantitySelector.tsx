import { Minus, Plus } from 'lucide-react';
import { cn } from '@/utils/helpers';

interface QuantitySelectorProps {
  value: number;
  min?: number;
  max: number;
  onChange: (value: number) => void;
  size?: 'sm' | 'md';
  label?: string;
}

export function QuantitySelector({ value, min = 1, max, onChange, size = 'md', label = 'Quantity' }: QuantitySelectorProps) {
  const btn = cn(
    'flex items-center justify-center text-charcoal/70 transition-colors hover:text-charcoal disabled:cursor-not-allowed disabled:opacity-30',
    size === 'sm' ? 'size-9' : 'size-11',
  );
  return (
    <div role="group" aria-label={label} className="inline-flex items-center rounded-sm border border-line bg-white">
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="Decrease quantity">
        <Minus className="size-4" strokeWidth={1.6} />
      </button>
      <span aria-live="polite" className={cn('text-center font-medium text-charcoal tabular-nums', size === 'sm' ? 'w-7 text-sm' : 'w-9')}>
        {value}
      </span>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Increase quantity">
        <Plus className="size-4" strokeWidth={1.6} />
      </button>
    </div>
  );
}

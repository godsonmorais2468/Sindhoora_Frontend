import {
  BadgeCheck,
  CircleCheck,
  CircleDashed,
  CircleX,
  Clock,
  Archive,
  Package,
  RotateCcw,
  TriangleAlert,
  Truck,
  type LucideIcon,
} from 'lucide-react';
import { orderStatusLabel, paymentStatusLabel, productStatusLabel } from '@/data/statuses';
import type { OrderStatus, PaymentStatus } from '@/types/order';
import type { ProductStatus } from '@/types/product';
import { cn } from '@/utils/helpers';

type Palette = 'amber' | 'blue' | 'slate' | 'teal' | 'green' | 'red' | 'gold';

const palettes: Record<Palette, string> = {
  amber: 'bg-amber-50 text-amber-800 ring-amber-600/20',
  blue: 'bg-sky-50 text-sky-800 ring-sky-600/20',
  slate: 'bg-stone-100 text-stone-700 ring-stone-500/20',
  teal: 'bg-teal-50 text-teal-800 ring-teal-600/20',
  green: 'bg-emerald-50 text-emerald-800 ring-emerald-600/20',
  red: 'bg-red-50 text-red-800 ring-red-600/20',
  gold: 'bg-[#f8f0dc] text-gold-700 ring-gold-600/25',
};

interface BadgeSpec {
  label: string;
  icon: LucideIcon;
  palette: Palette;
}

const orderSpecs: Record<OrderStatus, Omit<BadgeSpec, 'label'>> = {
  pending: { icon: Clock, palette: 'amber' },
  confirmed: { icon: CircleCheck, palette: 'blue' },
  packed: { icon: Package, palette: 'slate' },
  shipped: { icon: Truck, palette: 'teal' },
  delivered: { icon: BadgeCheck, palette: 'green' },
  cancelled: { icon: CircleX, palette: 'red' },
};

const paymentSpecs: Record<PaymentStatus, Omit<BadgeSpec, 'label'>> = {
  pending: { icon: Clock, palette: 'amber' },
  paid: { icon: CircleCheck, palette: 'green' },
  refunded: { icon: RotateCcw, palette: 'slate' },
};

const productSpecs: Record<ProductStatus, Omit<BadgeSpec, 'label'>> = {
  active: { icon: CircleCheck, palette: 'green' },
  draft: { icon: CircleDashed, palette: 'slate' },
  archived: { icon: Archive, palette: 'slate' },
};

export type StockLevel = 'in-stock' | 'low-stock' | 'out-of-stock';

const stockSpecs: Record<StockLevel, BadgeSpec> = {
  'in-stock': { label: 'In Stock', icon: CircleCheck, palette: 'green' },
  'low-stock': { label: 'Low Stock', icon: TriangleAlert, palette: 'amber' },
  'out-of-stock': { label: 'Out of Stock', icon: CircleX, palette: 'red' },
};

export function getStockLevel(stock: number, lowStockThreshold: number): StockLevel {
  if (stock <= 0) return 'out-of-stock';
  if (stock <= lowStockThreshold) return 'low-stock';
  return 'in-stock';
}

function Pill({ spec, className }: { spec: BadgeSpec; className?: string }) {
  const Icon = spec.icon;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ring-1 ring-inset',
        palettes[spec.palette],
        className,
      )}
    >
      <Icon className="size-3.5" strokeWidth={2} aria-hidden />
      {spec.label}
    </span>
  );
}

type StatusBadgeProps =
  | { kind: 'order'; status: OrderStatus; className?: string }
  | { kind: 'payment'; status: PaymentStatus; className?: string }
  | { kind: 'product'; status: ProductStatus; className?: string }
  | { kind: 'stock'; status: StockLevel; className?: string };

/** Status pill with an icon and text label, so status is never conveyed by colour alone. */
export function StatusBadge(props: StatusBadgeProps) {
  let spec: BadgeSpec;
  switch (props.kind) {
    case 'order':
      spec = { ...orderSpecs[props.status], label: orderStatusLabel[props.status] };
      break;
    case 'payment':
      spec = { ...paymentSpecs[props.status], label: paymentStatusLabel[props.status] };
      break;
    case 'product':
      spec = { ...productSpecs[props.status], label: productStatusLabel[props.status] };
      break;
    case 'stock':
      spec = stockSpecs[props.status];
      break;
  }
  return <Pill spec={spec} className={props.className} />;
}

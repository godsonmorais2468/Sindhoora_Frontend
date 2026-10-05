import type { OrderStatus } from '@/types/order';

interface StatusCount {
  status: OrderStatus;
  label: string;
  count: number;
}

const MARK = '#a8842f';

/**
 * Horizontal bars — one per order status, value at each bar tip.
 * Bars are 12px thick, rounded at the data end and square at the baseline.
 * Hover/focus reveals each status's share of all orders.
 */
export function OrdersStatusChart({ data }: { data: StatusCount[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <ul className="space-y-1" aria-label="Orders by status">
      {data.map((d) => {
        const share = total ? Math.round((d.count / total) * 100) : 0;
        return (
          <li
            key={d.status}
            tabIndex={0}
            className="group relative grid grid-cols-[88px_1fr] items-center gap-3 rounded-md px-2 py-2.5 outline-none hover:bg-ivory-50 focus-visible:bg-ivory-50 focus-visible:ring-2 focus-visible:ring-gold-500/40"
            aria-label={`${d.label}: ${d.count} orders, ${share}% of all orders`}
          >
            <span className="text-[13px] text-taupe">{d.label}</span>
            <span className="flex items-center gap-2.5">
              <span
                className="h-3 rounded-r-[4px] transition-opacity group-hover:opacity-80"
                style={{ width: `${(d.count / max) * 85}%`, minWidth: d.count > 0 ? 3 : 0, backgroundColor: MARK }}
                aria-hidden
              />
              <span className="text-[13px] font-semibold text-charcoal tabular-nums">{d.count}</span>
              <span className="text-xs text-taupe opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                {share}%
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

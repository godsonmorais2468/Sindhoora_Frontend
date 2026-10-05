import { useState } from 'react';
import { useElementWidth } from '@/hooks/useElementWidth';
import type { MonthlyPoint } from '@/services/dashboardService';
import { formatINR, formatINRCompact } from '@/utils/currency';

// Single-series column chart. Mark colours are one gold ramp validated against the
// white card surface: every month in gold-600, the current month accented in gold-700.
const MARK = '#a8842f';
const MARK_ACCENT = '#8a6a1f';
const GRID = '#ece6d8';

const HEIGHT = 260;
const M = { top: 30, right: 8, bottom: 30, left: 52 };
const MAX_BAR = 24;
const RADIUS = 4;

/** Rounds up to a "nice" axis step: 1, 2, 2.5 or 5 × 10^n. */
function niceStep(raw: number): number {
  const exp = Math.pow(10, Math.floor(Math.log10(raw || 1)));
  const f = raw / exp;
  const nice = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10;
  return nice * exp;
}

/** Column with a 4px rounded data-end and a square baseline. */
function columnPath(x: number, y: number, w: number, base: number): string {
  const h = base - y;
  const r = Math.min(RADIUS, w / 2, h);
  return `M${x},${base}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${base}Z`;
}

export function RevenueChart({ data }: { data: MonthlyPoint[] }) {
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);

  const innerW = Math.max(0, width - M.left - M.right);
  const innerH = HEIGHT - M.top - M.bottom;
  const max = Math.max(...data.map((d) => d.revenue), 1);
  const step = niceStep(max / 4);
  const yMax = step * Math.ceil(max / step);
  const ticks = Array.from({ length: Math.round(yMax / step) + 1 }, (_, i) => i * step);
  const band = data.length ? innerW / data.length : 0;
  const barW = Math.min(MAX_BAR, band * 0.5);
  const y = (v: number) => M.top + innerH - (v / yMax) * innerH;
  const base = M.top + innerH;
  const last = data.length - 1;
  const activePoint = active != null ? data[active] : null;

  return (
    <div ref={ref} className="relative" onPointerLeave={() => setActive(null)}>
      {width > 0 && (
        <svg width={width} height={HEIGHT} role="img" aria-label={`Monthly revenue, ${data[0]?.label} to ${data[last]?.label}`} className="block overflow-visible">
          {ticks.map((t) => (
            <g key={t}>
              <line x1={M.left} x2={width - M.right} y1={y(t)} y2={y(t)} stroke={GRID} strokeWidth={1} shapeRendering="crispEdges" />
              <text x={M.left - 10} y={y(t)} dy="0.32em" textAnchor="end" className="fill-taupe text-[11px] tabular-nums">
                {t === 0 ? '₹0' : formatINRCompact(t)}
              </text>
            </g>
          ))}

          {data.map((d, i) => {
            const cx = M.left + band * (i + 0.5);
            const top = y(d.revenue);
            const dimmed = active != null && active !== i;
            return (
              <g key={d.key}>
                {d.revenue > 0 && (
                  <path
                    d={columnPath(cx - barW / 2, top, barW, base)}
                    fill={i === last ? MARK_ACCENT : MARK}
                    opacity={dimmed ? 0.4 : 1}
                    className="transition-opacity duration-150"
                  />
                )}
                <text x={cx} y={base + 20} textAnchor="middle" className="fill-taupe text-[12px]">
                  {d.label}
                </text>
                {/* Selective direct label: the current month only. */}
                {i === last && d.revenue > 0 && (
                  <text x={cx} y={top - 9} textAnchor="middle" className="fill-charcoal text-[12px] font-semibold tabular-nums">
                    {formatINRCompact(d.revenue)}
                  </text>
                )}
                {/* Hit target: the whole band, not just the painted column. */}
                <rect
                  x={M.left + band * i}
                  y={M.top}
                  width={band}
                  height={innerH}
                  fill="transparent"
                  tabIndex={0}
                  aria-label={`${d.label}: ${formatINR(d.revenue)} from ${d.orders} orders`}
                  onPointerEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  className="outline-none"
                />
              </g>
            );
          })}
        </svg>
      )}

      {activePoint && active != null && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-md border border-line bg-white px-3 py-2 shadow-lg"
          style={{ left: M.left + band * (active + 0.5), top: Math.max(8, y(activePoint.revenue) - 10) }}
          role="status"
        >
          <p className="text-sm font-semibold whitespace-nowrap text-charcoal tabular-nums">{formatINR(activePoint.revenue)}</p>
          <p className="text-xs whitespace-nowrap text-taupe">
            {activePoint.label} · {activePoint.orders} {activePoint.orders === 1 ? 'order' : 'orders'}
          </p>
        </div>
      )}
    </div>
  );
}

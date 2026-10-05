import type { ReactNode } from 'react';
import { TableSkeleton } from '@/components/common/Skeletons';
import { cn } from '@/utils/helpers';

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  align?: 'left' | 'right' | 'center';
  /** Hide the column below a breakpoint in the table view. */
  hideBelow?: 'lg' | 'xl';
  className?: string;
}

interface AdminTableProps<T> {
  caption: string;
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  loading?: boolean;
  empty?: ReactNode;
  /** Highlight a row (e.g. low stock). */
  rowClassName?: (row: T) => string | undefined;
  /**
   * Card layout for phones. When omitted, the table scrolls horizontally on small screens.
   */
  mobileCard?: (row: T) => ReactNode;
}

const hideClass = { lg: 'hidden lg:table-cell', xl: 'hidden xl:table-cell' } as const;
const alignClass = { left: 'text-left', right: 'text-right', center: 'text-center' } as const;

/**
 * Reusable admin data table. Phones get stacked cards (via `mobileCard`) instead of a cramped table.
 */
export function AdminTable<T>({ caption, columns, rows, rowKey, loading, empty, rowClassName, mobileCard }: AdminTableProps<T>) {
  if (loading) return <TableSkeleton />;
  if (rows.length === 0 && empty) return <>{empty}</>;

  return (
    <>
      {mobileCard && (
        <ul className="divide-y divide-line md:hidden" aria-label={caption}>
          {rows.map((row) => (
            <li key={rowKey(row)} className={cn('p-4', rowClassName?.(row))}>
              {mobileCard(row)}
            </li>
          ))}
        </ul>
      )}
      <div className={cn('admin-scroll overflow-x-auto', mobileCard && 'hidden md:block')}>
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-b border-line bg-ivory-50/70">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={cn(
                    'px-4 py-3 text-xs font-medium first:pl-5 last:pr-5 tracking-wide whitespace-nowrap text-taupe uppercase',
                    alignClass[col.align ?? 'left'],
                    col.hideBelow && hideClass[col.hideBelow],
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((row) => (
              <tr key={rowKey(row)} className={cn('transition-colors hover:bg-ivory-50/80', rowClassName?.(row))}>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn('px-4 py-3.5 align-middle text-charcoal first:pl-5 last:pr-5', alignClass[col.align ?? 'left'], col.hideBelow && hideClass[col.hideBelow], col.className)}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

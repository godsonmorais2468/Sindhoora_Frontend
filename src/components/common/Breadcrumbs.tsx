import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/utils/helpers';

export interface Crumb {
  label: string;
  to?: string;
}

export function Breadcrumbs({ items, tone = 'dark', className }: { items: Crumb[]; tone?: 'light' | 'dark'; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className={cn('flex flex-wrap items-center gap-1.5 text-[13px]', tone === 'dark' ? 'text-muted' : 'text-taupe')}>
        {items.map((item, i) => (
          <Fragment key={item.label}>
            {i > 0 && <ChevronRight className="size-3.5 opacity-60" aria-hidden />}
            <li>
              {item.to ? (
                <Link to={item.to} className={cn('transition-colors', tone === 'dark' ? 'hover:text-cream' : 'hover:text-charcoal')}>
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className={tone === 'dark' ? 'text-cream/90' : 'text-charcoal'}>
                  {item.label}
                </span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}

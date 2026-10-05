import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/helpers';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  tone?: 'light' | 'dark';
  className?: string;
  /** Use 'h1' when the empty state is the page's main content (e.g. 404). */
  headingLevel?: 'h1' | 'h2';
}

export function EmptyState({ icon: Icon, title, description, action, tone = 'light', className, headingLevel: Heading = 'h2' }: EmptyStateProps) {
  const dark = tone === 'dark';
  return (
    <div className={cn('mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center sm:py-24', className)}>
      <div
        className={cn(
          'mb-6 flex size-16 items-center justify-center rounded-full border',
          dark ? 'border-gold-500/30 text-gold-400' : 'border-gold-600/25 bg-white text-gold-600',
        )}
      >
        <Icon className="size-7" strokeWidth={1.3} aria-hidden />
      </div>
      <Heading className={cn('heading-display text-3xl', dark ? 'text-cream' : 'text-charcoal')}>{title}</Heading>
      <p className={cn('mt-3 text-[15px] leading-relaxed', dark ? 'text-muted' : 'text-taupe')}>{description}</p>
      {action && <div className="mt-8 flex flex-wrap justify-center gap-3">{action}</div>}
    </div>
  );
}

import type { ReactNode } from 'react';
import { cn } from '@/utils/helpers';

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  tone?: 'light' | 'dark';
  className?: string;
  /** Heading level — keeps the document outline correct. */
  as?: 'h1' | 'h2' | 'h3';
  action?: ReactNode;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  tone = 'light',
  className,
  as: Heading = 'h2',
  action,
}: SectionHeadingProps) {
  const centered = align === 'center';
  return (
    <div className={cn('flex flex-col gap-6 md:flex-row md:items-end md:justify-between', centered && 'md:flex-col md:items-center', className)}>
      <div className={cn('max-w-2xl', centered && 'mx-auto text-center')}>
        {eyebrow && (
          <div className={cn('mb-4 flex items-center gap-3', centered && 'justify-center')}>
            <span className={cn('eyebrow', tone === 'dark' ? 'text-gold-400' : 'text-gold-700')}>{eyebrow}</span>
          </div>
        )}
        <Heading
          className={cn(
            'heading-display text-[2.25rem] sm:text-5xl lg:text-[3.4rem]',
            tone === 'dark' ? 'text-cream' : 'text-charcoal',
          )}
        >
          {title}
        </Heading>
        {description && (
          <p className={cn('mt-4 text-base leading-relaxed sm:text-[17px]', tone === 'dark' ? 'text-muted' : 'text-taupe')}>{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

import type { ReactNode } from 'react';
import { m } from 'framer-motion';
import { Breadcrumbs, type Crumb } from '@/components/common/Breadcrumbs';
import { SmartImage } from '@/components/common/SmartImage';
import { cn } from '@/utils/helpers';

interface PageHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  breadcrumbs?: Crumb[];
  image?: string;
  compact?: boolean;
  children?: ReactNode;
}

/** Dark introductory band at the top of inner pages; the navbar sits transparently over it. */
export function PageHeader({ eyebrow, title, description, breadcrumbs, image, compact, children }: PageHeaderProps) {
  return (
    <section className={cn('relative overflow-hidden bg-ink-950 text-cream gold-glow', compact ? 'pt-28 pb-10 lg:pt-32 lg:pb-12' : 'pt-32 pb-14 lg:pt-40 lg:pb-20')}>
      {image && (
        <>
          <SmartImage src={image} alt="" aspectRatio={16 / 7} sizes="100vw" priority className="absolute inset-0 size-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-linear-to-r from-ink-950 via-ink-950/85 to-ink-950/40" aria-hidden />
        </>
      )}
      <m.div
        className="container-luxe relative"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} className="mb-6" />}
        {eyebrow && <p className="eyebrow mb-4 text-gold-400">{eyebrow}</p>}
        <h1 className={cn('heading-display max-w-3xl', compact ? 'text-4xl sm:text-5xl' : 'text-[2.6rem] sm:text-6xl lg:text-7xl')}>{title}</h1>
        {description && <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-[17px]">{description}</p>}
        {children}
      </m.div>
    </section>
  );
}

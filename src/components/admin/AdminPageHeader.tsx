import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface AdminPageHeaderProps {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  back?: { to: string; label: string };
}

export function AdminPageHeader({ title, description, actions, back }: AdminPageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {back && (
          <Link to={back.to} className="mb-3 inline-flex items-center gap-1.5 text-[13px] text-taupe transition-colors hover:text-charcoal">
            <ArrowLeft className="size-3.5" aria-hidden />
            {back.label}
          </Link>
        )}
        <h1 className="text-2xl font-semibold tracking-tight text-charcoal sm:text-[1.7rem]">{title}</h1>
        {description && <p className="mt-1 text-[15px] text-taupe">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2.5">{actions}</div>}
    </div>
  );
}

/** White card used to group admin content. */
export function AdminCard({ title, actions, children, className = '', bodyClassName = '' }: { title?: string; actions?: ReactNode; children: ReactNode; className?: string; bodyClassName?: string }) {
  return (
    <section className={`overflow-hidden rounded-lg border border-line bg-white ${className}`}>
      {(title || actions) && (
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
          {title && <h2 className="text-[15px] font-semibold text-charcoal">{title}</h2>}
          {actions}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

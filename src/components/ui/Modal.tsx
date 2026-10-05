import { useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, m } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/utils/helpers';
import { useDialog } from './useDialog';

type Tone = 'light' | 'dark';

const sizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-3xl',
  xl: 'max-w-5xl',
} as const;

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Visually hide the title (it is still announced to screen readers). */
  hideTitle?: boolean;
  description?: string;
  size?: keyof typeof sizes;
  tone?: Tone;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, hideTitle, description, size = 'md', tone = 'light', children, footer, className }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useDialog(open, onClose, panelRef);

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6">
          <m.div
            className="absolute inset-0 bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden
          />
          <m.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98, transition: { duration: 0.15 } }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'relative flex max-h-[92svh] w-full flex-col overflow-hidden rounded-t-lg shadow-2xl outline-none sm:rounded-lg',
              sizes[size],
              tone === 'dark' ? 'border border-white/10 bg-ink-850 text-cream' : 'bg-white text-charcoal',
              className,
            )}
          >
            <div className={cn('flex items-start justify-between gap-4 px-5 pt-5 pr-14 sm:px-6 sm:pr-14', hideTitle && 'sr-only')}>
              <div>
                <h2 id={titleId} className="text-lg font-semibold">
                  {title}
                </h2>
                {description && <p className={cn('mt-1 text-sm', tone === 'dark' ? 'text-muted' : 'text-taupe')}>{description}</p>}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className={cn(
                'absolute top-3 right-3 z-10 flex size-10 items-center justify-center rounded-full transition-colors',
                tone === 'dark' ? 'bg-ink-950/60 text-cream hover:bg-ink-950' : 'bg-white/80 text-charcoal hover:bg-ivory',
              )}
              aria-label="Close"
            >
              <X className="size-5" strokeWidth={1.6} />
            </button>
            <div className="admin-scroll flex-1 overflow-y-auto">{children}</div>
            {footer && (
              <div className={cn('flex flex-wrap justify-end gap-3 border-t px-5 py-4 sm:px-6', tone === 'dark' ? 'border-white/10' : 'border-line')}>
                {footer}
              </div>
            )}
          </m.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

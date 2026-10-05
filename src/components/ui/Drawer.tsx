import { useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, m } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/utils/helpers';
import { useDialog } from './useDialog';

type Side = 'left' | 'right' | 'bottom';

const panelPosition: Record<Side, string> = {
  left: 'inset-y-0 left-0 h-full w-[88vw] max-w-sm',
  right: 'inset-y-0 right-0 h-full w-[88vw] max-w-sm',
  bottom: 'inset-x-0 bottom-0 max-h-[88svh] w-full rounded-t-xl',
};

const offscreen: Record<Side, { x?: string; y?: string }> = {
  left: { x: '-100%' },
  right: { x: '100%' },
  bottom: { y: '100%' },
};

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  side?: Side;
  tone?: 'light' | 'dark';
  /** Custom header content; the title is still used as the accessible name. */
  header?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

/** Side or bottom sheet. Mobile navigation, shop filters, admin navigation. */
export function Drawer({ open, onClose, title, side = 'right', tone = 'dark', header, children, footer }: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useDialog(open, onClose, panelRef);

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]">
          <m.div
            className="absolute inset-0 bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            aria-hidden
          />
          <m.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            initial={offscreen[side]}
            animate={{ x: 0, y: 0 }}
            exit={offscreen[side]}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'absolute flex flex-col shadow-2xl outline-none',
              panelPosition[side],
              tone === 'dark' ? 'bg-ink-900 text-cream' : 'bg-white text-charcoal',
            )}
          >
            <div className={cn('flex min-h-16 items-center justify-between gap-4 border-b px-5', tone === 'dark' ? 'border-white/10' : 'border-line')}>
              <div id={titleId} className="min-w-0">
                {header ?? <h2 className="text-base font-semibold">{title}</h2>}
                {header && <span className="sr-only">{title}</span>}
              </div>
              <button
                type="button"
                onClick={onClose}
                className={cn(
                  '-mr-2 flex size-11 items-center justify-center rounded-full transition-colors',
                  tone === 'dark' ? 'text-cream/80 hover:bg-white/5 hover:text-cream' : 'text-charcoal/70 hover:bg-black/5',
                )}
                aria-label="Close"
              >
                <X className="size-5" strokeWidth={1.6} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>
            {footer && (
              <div className={cn('border-t px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]', tone === 'dark' ? 'border-white/10' : 'border-line')}>
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

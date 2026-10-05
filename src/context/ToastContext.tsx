import { createContext, useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { CircleAlert, CircleCheck, Heart, X } from 'lucide-react';
import { Link } from 'react-router-dom';

type ToastTone = 'success' | 'error' | 'wishlist';

export interface ToastOptions {
  title: string;
  description?: string;
  tone?: ToastTone;
  action?: { label: string; to: string };
}

interface ToastRecord extends ToastOptions {
  id: number;
}

export const ToastContext = createContext<((options: ToastOptions) => void) | null>(null);

const icons = {
  success: CircleCheck,
  error: CircleAlert,
  wishlist: Heart,
} as const;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);

  const toast = useCallback(
    (options: ToastOptions) => {
      const id = nextId.current++;
      setToasts((prev) => [...prev.slice(-2), { ...options, id }]);
      window.setTimeout(() => dismiss(id), options.tone === 'error' ? 5000 : 3200);
    },
    [dismiss],
  );

  const value = useMemo(() => toast, [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[90] flex flex-col items-center gap-2 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:items-end sm:px-6 sm:pb-6"
      >
        <AnimatePresence initial={false}>
          {toasts.map((t) => {
            const Icon = icons[t.tone ?? 'success'];
            return (
              <m.div
                key={t.id}
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, transition: { duration: 0.15 } }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                role={t.tone === 'error' ? 'alert' : 'status'}
                className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-md border border-white/10 bg-ink-800 p-4 text-cream shadow-xl shadow-black/40"
              >
                <Icon
                  className={t.tone === 'error' ? 'mt-0.5 size-5 shrink-0 text-red-400' : 'mt-0.5 size-5 shrink-0 text-gold-400'}
                  strokeWidth={1.6}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{t.title}</p>
                  {t.description && <p className="mt-0.5 text-[13px] leading-snug text-muted">{t.description}</p>}
                  {t.action && (
                    <Link
                      to={t.action.to}
                      onClick={() => dismiss(t.id)}
                      className="mt-2 inline-block text-[13px] font-medium text-gold-400 underline-offset-4 hover:underline"
                    >
                      {t.action.label}
                    </Link>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(t.id)}
                  className="-m-1 rounded p-1 text-muted transition-colors hover:text-cream"
                  aria-label="Dismiss notification"
                >
                  <X className="size-4" />
                </button>
              </m.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

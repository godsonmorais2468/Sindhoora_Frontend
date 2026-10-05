import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, m } from 'framer-motion';
import { Heart, LockKeyhole, ShoppingBag, User } from 'lucide-react';

const items = [
  { label: 'Wishlist', to: '/wishlist', icon: Heart },
  { label: 'Shopping bag', to: '/cart', icon: ShoppingBag },
  { label: 'Store admin', to: '/admin/login', icon: LockKeyhole },
];

/** Small account dropdown. Customer accounts are out of scope for the prototype. */
export function AccountMenu({ buttonClassName }: { buttonClassName: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        className={buttonClassName}
        onClick={() => setOpen((v) => !v)}
        aria-label="Account"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <User className="size-5" strokeWidth={1.5} />
      </button>
      <AnimatePresence>
        {open && (
          <m.div
            role="menu"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4, transition: { duration: 0.12 } }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-56 overflow-hidden rounded-md border border-white/10 bg-ink-850 py-2 shadow-2xl shadow-black/50"
          >
            <p className="px-4 pt-1 pb-2 text-xs text-muted">Customer accounts are coming soon.</p>
            {items.map(({ label, to, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-cream/85 transition-colors hover:bg-white/5 hover:text-cream"
              >
                <Icon className="size-4 text-gold-400" strokeWidth={1.6} aria-hidden />
                {label}
              </Link>
            ))}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

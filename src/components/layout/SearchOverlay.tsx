import { useMemo, useRef, useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, m } from 'framer-motion';
import { ArrowRight, Search, SearchX, X } from 'lucide-react';
import { SmartImage } from '@/components/common/SmartImage';
import { useDialog } from '@/components/ui/useDialog';
import { getCategoryName } from '@/data/categories';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useQuery } from '@/hooks/useQuery';
import { listProducts } from '@/services/productsService';
import { formatINR } from '@/utils/currency';
import { searchProducts } from '@/utils/productFilters';

const suggestions = ['Temple necklace', 'Jhumka', 'Haram', 'Bangles', 'Bridal'];

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  return createPortal(<AnimatePresence>{open && <SearchPanel onClose={onClose} />}</AnimatePresence>, document.body);
}

function SearchPanel({ onClose }: { onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const debounced = useDebouncedValue(query.trim(), 150);
  const { data: products } = useQuery('products:public', () => listProducts());
  useDialog(true, onClose, panelRef);

  const results = useMemo(() => (products && debounced ? searchProducts(products, debounced).slice(0, 6) : []), [products, debounced]);

  function submit(event?: FormEvent) {
    event?.preventDefault();
    if (!query.trim()) return;
    onClose();
    navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <div className="fixed inset-0 z-[85]">
      <m.div
        className="absolute inset-0 bg-black/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        aria-hidden
      />
      <m.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search the collection"
        tabIndex={-1}
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16, transition: { duration: 0.18 } }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-h-[90svh] overflow-y-auto border-b border-gold-500/15 bg-ink-900 text-cream shadow-2xl outline-none"
      >
        <div className="container-luxe py-5 sm:py-8">
          <form onSubmit={submit} className="flex items-center gap-3 border-b border-white/15 pb-3 focus-within:border-gold-400/70">
            <Search className="size-5 shrink-0 text-gold-400" strokeWidth={1.5} aria-hidden />
            <label htmlFor="site-search" className="sr-only">
              Search jewellery
            </label>
            <input
              id="site-search"
              data-autofocus
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search necklaces, jhumkas, bangles…"
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent py-2 text-lg text-cream outline-none placeholder:text-muted/70 sm:text-2xl [&::-webkit-search-cancel-button]:hidden"
            />
            <button
              type="button"
              onClick={onClose}
              className="flex size-10 shrink-0 items-center justify-center rounded-full text-cream/70 hover:bg-white/5 hover:text-cream"
              aria-label="Close search"
            >
              <X className="size-5" strokeWidth={1.5} />
            </button>
          </form>

          <div className="pt-6 pb-2" aria-live="polite">
            {!debounced && (
              <div>
                <p className="eyebrow mb-4 text-muted">Popular searches</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setQuery(s)}
                      className="rounded-full border border-white/12 px-4 py-2 text-sm text-cream/85 transition-colors hover:border-gold-500/60 hover:text-gold-300"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {debounced && results.length === 0 && products && (
              <div className="flex items-center gap-3 py-6 text-muted">
                <SearchX className="size-5 text-gold-500/80" strokeWidth={1.5} aria-hidden />
                <p>
                  No pieces match “{debounced}”. Try a category like <span className="text-cream">haram</span> or{' '}
                  <span className="text-cream">jhumka</span>.
                </p>
              </div>
            )}

            {results.length > 0 && (
              <>
                <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {results.map((p) => (
                    <li key={p.id}>
                      <Link
                        to={`/product/${p.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-4 rounded-md p-2 transition-colors hover:bg-white/[0.04]"
                      >
                        <SmartImage
                          src={p.images[0]}
                          alt=""
                          aspectRatio={1}
                          widths={[120, 240]}
                          sizes="64px" fade={false}
                          className="size-16 shrink-0 rounded-sm bg-ink-800 object-cover"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-[15px] text-cream">{p.name}</p>
                          <p className="text-[13px] text-muted">
                            {getCategoryName(p.category)} · {formatINR(p.salePrice ?? p.price)}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => submit()}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-gold-300 hover:text-gold-400"
                >
                  View all results <ArrowRight className="size-4" aria-hidden />
                </button>
              </>
            )}
          </div>
        </div>
      </m.div>
    </div>
  );
}

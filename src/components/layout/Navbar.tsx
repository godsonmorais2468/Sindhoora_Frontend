import { useContext, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { m, useMotionValueEvent, useScroll } from 'framer-motion';
import { Heart, Menu, Search, ShoppingBag } from 'lucide-react';
import { BrandLogo } from '@/components/common/BrandLogo';
import { IntroContext } from '@/context/IntroContext';
import { mainNavigation } from '@/data/brand';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { cn } from '@/utils/helpers';
import { AccountMenu } from './AccountMenu';
import { MobileMenu } from './MobileMenu';
import { SearchOverlay } from './SearchOverlay';

function CountBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold-500 px-1 text-[11px] leading-none font-semibold text-ink-950 tabular-nums">
      {count > 9 ? '9+' : count}
    </span>
  );
}

const iconButton =
  'relative flex size-11 items-center justify-center rounded-full text-cream/85 transition-colors hover:text-gold-300';

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count } = useCart();
  const { ids } = useWishlist();
  const introReady = useContext(IntroContext);

  useMotionValueEvent(scrollY, 'change', (y) => {
    const next = y > 24;
    if (next !== scrolled) setScrolled(next);
  });

  return (
    <>
      <m.header
        className={cn('fixed inset-x-0 top-0 z-50 border-b', scrolled && 'backdrop-blur-md')}
        initial={false}
        animate={{
          opacity: introReady ? 1 : 0,
          backgroundColor: scrolled ? 'rgba(5,5,5,0.92)' : 'rgba(5,5,5,0)',
          borderColor: scrolled ? 'rgba(201,162,77,0.14)' : 'rgba(201,162,77,0)',
        }}
        transition={{ duration: 0.35, ease: 'easeOut', opacity: { duration: 0.8, delay: 0.5 } }}
      >
        {/* Soft top shade keeps icons legible over bright hero imagery before the bar fills in. */}
        <div
          className={cn(
            'pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-black/50 to-transparent transition-opacity duration-300',
            scrolled ? 'opacity-0' : 'opacity-100',
          )}
          aria-hidden
        />
        <nav aria-label="Main" className="container-luxe flex h-16 items-center justify-between gap-4 lg:grid lg:h-20 lg:grid-cols-[1fr_auto_1fr]">
          <Link to="/" className="shrink-0 rounded-sm" aria-label="Sindhoora Jewels — home">
            <BrandLogo variant="wordmark" priority className="h-7 w-auto sm:h-8 lg:h-9" alt="Sindhoora Jewels" />
          </Link>

          <ul className="hidden items-center gap-9 lg:flex">
            {mainNavigation.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'relative py-2 text-[13px] font-medium tracking-[0.16em] uppercase transition-colors',
                      'after:absolute after:inset-x-0 after:-bottom-0.5 after:mx-auto after:h-px after:bg-gold-400 after:transition-[width] after:duration-300',
                      isActive ? 'text-gold-300 after:w-full' : 'text-cream/80 after:w-0 hover:text-cream hover:after:w-full',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-end gap-0.5 sm:gap-1">
            <button type="button" className={iconButton} onClick={() => setSearchOpen(true)} aria-label="Search jewellery">
              <Search className="size-5" strokeWidth={1.5} />
            </button>
            <Link to="/wishlist" className={cn(iconButton, 'hidden sm:flex')} aria-label={`Wishlist, ${ids.length} items`}>
              <Heart className="size-5" strokeWidth={1.5} />
              <CountBadge count={ids.length} />
            </Link>
            <Link to="/cart" className={iconButton} aria-label={`Shopping bag, ${count} items`}>
              <ShoppingBag className="size-5" strokeWidth={1.5} />
              <CountBadge count={count} />
            </Link>
            <div className="hidden lg:block">
              <AccountMenu buttonClassName={iconButton} />
            </div>
            <button
              type="button"
              className={cn(iconButton, '-mr-2 lg:hidden')}
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
            >
              <Menu className="size-6" strokeWidth={1.4} />
            </button>
          </div>
        </nav>
      </m.header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

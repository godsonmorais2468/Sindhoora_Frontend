import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { m } from 'framer-motion';
import { PageLoader } from '@/components/common/PageLoader';
import { ScrollToTop } from '@/components/common/ScrollToTop';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';

export function PublicLayout() {
  const { pathname } = useLocation();
  return (
    <>
      <ScrollToTop />
      <a
        href="#main"
        className="sr-only z-[95] rounded-sm bg-gold-500 px-4 py-2 text-sm font-medium text-ink-950 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <Navbar />
      {/* Enter-only page transition: fast, never delays navigation. */}
      <m.main
        id="main"
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </m.main>
      <Footer />
    </>
  );
}

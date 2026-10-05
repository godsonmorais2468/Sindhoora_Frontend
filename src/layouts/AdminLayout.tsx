import { Suspense, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { FlaskConical, Menu } from 'lucide-react';
import { AdminNav } from '@/components/admin/AdminNav';
import { BrandLogo } from '@/components/common/BrandLogo';
import { TableSkeleton } from '@/components/common/Skeletons';
import { Drawer } from '@/components/ui/Drawer';

/** Functional admin shell: dark sidebar, light working area. No public navbar or footer. */
export function AdminLayout() {
  const [navOpen, setNavOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setNavOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div className="min-h-screen bg-ivory-50 text-charcoal">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-ink-950 xl:block">
        <AdminNav />
      </aside>

      <div className="xl:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-white/90 px-4 backdrop-blur sm:px-6 lg:px-10">
          <button
            type="button"
            onClick={() => setNavOpen(true)}
            className="-ml-2 flex size-10 items-center justify-center rounded-md text-charcoal/70 hover:bg-black/5 xl:hidden"
            aria-label="Open admin menu"
          >
            <Menu className="size-5" strokeWidth={1.6} />
          </button>
          <div className="rounded-sm bg-ink-950 px-2.5 py-1.5 xl:hidden">
            <BrandLogo variant="wordmark" className="h-5 w-auto" alt="Sindhoora Jewels admin" />
          </div>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-sand px-3 py-1 text-xs font-medium text-taupe">
            <FlaskConical className="size-3.5" strokeWidth={1.8} aria-hidden />
            <span className="hidden xs:inline">Prototype ·</span> mock data
          </span>
        </header>

        <main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
          <Suspense
            fallback={
              <div className="rounded-lg border border-line bg-white">
                <TableSkeleton />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </main>
      </div>

      <Drawer open={navOpen} onClose={() => setNavOpen(false)} side="left" title="Admin menu" header={<BrandLogo variant="wordmark" className="h-6 w-auto" alt="Sindhoora Jewels admin" />}>
        <AdminNav showLogo={false} />
      </Drawer>
    </div>
  );
}

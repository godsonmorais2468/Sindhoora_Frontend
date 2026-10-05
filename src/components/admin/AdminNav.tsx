import { NavLink, useNavigate } from 'react-router-dom';
import { Boxes, ExternalLink, Gem, LayoutDashboard, LogOut, ReceiptText, Settings, Users } from 'lucide-react';
import { BrandLogo } from '@/components/common/BrandLogo';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@/hooks/useQuery';
import { listOrders } from '@/services/ordersService';
import { initials } from '@/utils/formatters';
import { cn } from '@/utils/helpers';

const navItems = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Products', to: '/admin/products', icon: Gem },
  { label: 'Orders', to: '/admin/orders', icon: ReceiptText, badge: 'pending' as const },
  { label: 'Customers', to: '/admin/customers', icon: Users },
  { label: 'Inventory', to: '/admin/inventory', icon: Boxes },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
];

/** Sidebar contents — shared by the desktop sidebar and the mobile drawer. */
export function AdminNav({ showLogo = true }: { showLogo?: boolean }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { data: orders } = useQuery('admin:orders', listOrders);
  const pending = orders?.filter((o) => o.status === 'pending').length ?? 0;

  async function handleLogout() {
    await logout();
    navigate('/admin/login', { replace: true });
  }

  return (
    <div className="flex h-full flex-col">
      {showLogo && (
        <div className="flex h-16 items-center border-b border-white/[0.07] px-6">
          <BrandLogo variant="wordmark" className="h-7 w-auto" alt="Sindhoora Jewels admin" />
        </div>
      )}
      <nav aria-label="Admin" className="flex-1 overflow-y-auto px-3 py-5">
        <p className="px-3 pb-2 text-[11px] font-medium tracking-[0.18em] text-muted/80 uppercase">Manage</p>
        <ul className="space-y-0.5">
          {navItems.map(({ label, to, icon: Icon, end, badge }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors',
                    isActive ? 'bg-white/[0.07] text-cream' : 'text-cream/65 hover:bg-white/[0.04] hover:text-cream',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-gold-400" aria-hidden />}
                    <Icon className={cn('size-[18px]', isActive ? 'text-gold-400' : 'text-cream/50 group-hover:text-cream/80')} strokeWidth={1.6} aria-hidden />
                    <span className="flex-1">{label}</span>
                    {badge && pending > 0 && (
                      <span className="rounded-full bg-gold-500/15 px-2 py-0.5 text-[11px] font-semibold text-gold-300 tabular-nums">
                        {pending}
                        <span className="sr-only"> pending</span>
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <p className="mt-8 px-3 pb-2 text-[11px] font-medium tracking-[0.18em] text-muted/80 uppercase">Storefront</p>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-cream/65 transition-colors hover:bg-white/[0.04] hover:text-cream"
        >
          <ExternalLink className="size-[18px] text-cream/50" strokeWidth={1.6} aria-hidden />
          View store
        </a>
      </nav>

      <div className="border-t border-white/[0.07] p-3">
        <div className="flex items-center gap-3 rounded-md px-3 py-2">
          <span className="flex size-9 items-center justify-center rounded-full bg-gold-500/15 text-[13px] font-semibold text-gold-300">
            {initials(user?.name ?? 'Admin')}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-cream">{user?.name}</p>
            <p className="truncate text-xs text-muted">{user?.email}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex size-9 items-center justify-center rounded-md text-cream/60 transition-colors hover:bg-white/5 hover:text-cream"
            aria-label="Log out"
            title="Log out"
          >
            <LogOut className="size-[18px]" strokeWidth={1.6} />
          </button>
        </div>
      </div>
    </div>
  );
}

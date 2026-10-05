import { useEffect, useEffectEvent } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { m } from 'framer-motion';
import { ArrowRight, Heart, LockKeyhole, Mail, Phone } from 'lucide-react';
import { BrandLogo } from '@/components/common/BrandLogo';
import { InstagramIcon, FacebookIcon, WhatsAppIcon } from '@/components/common/SocialIcons';
import { Drawer } from '@/components/ui/Drawer';
import { mainNavigation, siteInfo } from '@/data/brand';
import { cn } from '@/utils/helpers';

const secondary = [
  { label: 'Wishlist', to: '/wishlist', icon: Heart },
  { label: 'Account', to: '/admin/login', icon: LockKeyhole, note: 'Store admin' },
];

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { pathname } = useLocation();
  const closeMenu = useEffectEvent(onClose);

  // Close when navigating.
  useEffect(() => {
    closeMenu();
  }, [pathname]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      side="left"
      title="Menu"
      header={<BrandLogo variant="wordmark" className="h-7 w-auto" alt="Sindhoora Jewels" />}
      footer={
        <div className="flex items-center gap-2">
          {[
            { href: siteInfo.social.instagram, label: 'Instagram', Icon: InstagramIcon },
            { href: siteInfo.social.facebook, label: 'Facebook', Icon: FacebookIcon },
            { href: `https://wa.me/${siteInfo.whatsapp}`, label: 'WhatsApp', Icon: WhatsAppIcon },
          ].map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="flex size-11 items-center justify-center rounded-full border border-white/10 text-cream/80 transition-colors hover:border-gold-500/50 hover:text-gold-300"
            >
              <Icon className="size-[18px]" />
            </a>
          ))}
        </div>
      }
    >
      <nav aria-label="Mobile" className="px-5 py-6">
        <ul>
          {mainNavigation.map((item, i) => (
            <m.li
              key={item.to}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 + i * 0.04, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <NavLink
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center justify-between border-b border-white/[0.07] py-4 text-xl transition-colors',
                    isActive ? 'text-gold-300' : 'text-cream hover:text-gold-300',
                  )
                }
              >
                {item.label}
                <ArrowRight className="size-4 text-gold-500/70 transition-transform group-hover:translate-x-1" strokeWidth={1.5} aria-hidden />
              </NavLink>
            </m.li>
          ))}
        </ul>

        <ul className="mt-8 space-y-1">
          {secondary.map(({ label, to, icon: Icon, note }) => (
            <li key={to}>
              <NavLink to={to} className="flex items-center gap-3 py-2.5 text-[15px] text-cream/80 transition-colors hover:text-cream">
                <Icon className="size-[18px] text-gold-400" strokeWidth={1.5} aria-hidden />
                {label}
                {note && <span className="text-xs text-muted">· {note}</span>}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="mt-8 space-y-3 rounded-md border border-white/[0.08] bg-white/[0.02] p-4 text-sm">
          <p className="eyebrow text-gold-400">Personal styling</p>
          <a href={`tel:${siteInfo.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 text-cream/85 hover:text-cream">
            <Phone className="size-4 text-muted" strokeWidth={1.5} aria-hidden />
            {siteInfo.phone}
          </a>
          <a href={`mailto:${siteInfo.email}`} className="flex items-center gap-3 break-all text-cream/85 hover:text-cream">
            <Mail className="size-4 shrink-0 text-muted" strokeWidth={1.5} aria-hidden />
            {siteInfo.email}
          </a>
        </div>
      </nav>
    </Drawer>
  );
}

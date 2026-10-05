import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { BrandLogo } from '@/components/common/BrandLogo';
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from '@/components/common/SocialIcons';
import { siteInfo } from '@/data/brand';

const columns = [
  {
    title: 'Explore',
    links: [
      { label: 'Shop', to: '/shop' },
      { label: 'Collections', to: '/collections' },
      { label: 'About', to: '/about' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Customer Care',
    links: [
      { label: 'Shipping', to: '/policies/shipping' },
      { label: 'Returns', to: '/policies/returns' },
      { label: 'Privacy', to: '/policies/privacy' },
      { label: 'Terms', to: '/policies/terms' },
    ],
  },
];

const socials = [
  { label: 'Instagram', href: siteInfo.social.instagram, Icon: InstagramIcon },
  { label: 'Facebook', href: siteInfo.social.facebook, Icon: FacebookIcon },
  { label: 'WhatsApp', href: `https://wa.me/${siteInfo.whatsapp}`, Icon: WhatsAppIcon },
];

export function Footer() {
  return (
    <footer className="border-t border-gold-500/10 bg-ink-950 text-cream">
      <div className="container-luxe grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.3fr] lg:gap-10 lg:py-20">
        <div className="max-w-xs">
          <Link to="/" aria-label="Sindhoora Jewels — home" className="inline-block rounded-sm">
            <BrandLogo variant="primary" className="w-44 sm:w-48" />
          </Link>
          <p className="mt-6 text-[15px] leading-relaxed text-muted">{siteInfo.description}</p>
          <ul className="mt-6 flex gap-2">
            {socials.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex size-11 items-center justify-center rounded-full border border-white/10 text-cream/75 transition-colors hover:border-gold-500/50 hover:text-gold-300"
                >
                  <Icon className="size-[18px]" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h2 className="eyebrow text-gold-400">{col.title}</h2>
            <ul className="mt-5 space-y-3">
              {col.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-[15px] text-cream/75 transition-colors hover:text-cream">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h2 className="eyebrow text-gold-400">Visit &amp; Contact</h2>
          <ul className="mt-5 space-y-4 text-[15px] text-cream/75">
            <li>
              <a href={`tel:${siteInfo.phone.replace(/\s/g, '')}`} className="flex gap-3 transition-colors hover:text-cream">
                <Phone className="mt-0.5 size-4 shrink-0 text-gold-500/80" strokeWidth={1.5} aria-hidden />
                {siteInfo.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${siteInfo.email}`} className="flex gap-3 break-all transition-colors hover:text-cream">
                <Mail className="mt-0.5 size-4 shrink-0 text-gold-500/80" strokeWidth={1.5} aria-hidden />
                {siteInfo.email}
              </a>
            </li>
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold-500/80" strokeWidth={1.5} aria-hidden />
              <span>
                {siteInfo.location}
                <span className="mt-1 block text-[13px] text-muted">{siteInfo.hours}</span>
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/[0.06]">
        <div className="container-luxe flex flex-col gap-2 py-6 text-[13px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Sindhoora Jewels. All Rights Reserved.</p>
          <p className="font-serif text-[15px] text-cream/60 italic">{siteInfo.signature}</p>
        </div>
      </div>
    </footer>
  );
}

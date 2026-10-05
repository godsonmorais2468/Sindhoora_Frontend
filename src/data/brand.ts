/**
 * Brand assets and business details.
 *
 * Logo files live in `public/assets/branding/`. The two original logos are kept untouched
 * (`sindhoora-logo-primary.jpg`, `sindhoora-logo-signature.jpg`); the `.webp` files are crops
 * of those originals with the black background made transparent so they sit cleanly on any dark surface.
 */
const BRANDING = `${import.meta.env.BASE_URL}assets/branding`;

export const brandAssets = {
  /** Full primary logo: emblem + SINDHOORA JEWELS. Splash, footer, admin login. (880×753) */
  primary: { src: `${BRANDING}/sindhoora-primary.webp`, width: 880, height: 753 },
  /** Extended logo with "Signature by Soumya" + tagline. Needs to be shown large to stay legible. (900×893) */
  signature: { src: `${BRANDING}/sindhoora-signature.webp`, width: 900, height: 893 },
  /** Horizontal wordmark crop of the primary logo. Navbars and admin sidebar. (600×128) */
  wordmark: { src: `${BRANDING}/sindhoora-wordmark.webp`, width: 600, height: 128 },
  /** The gold "S" emblem alone. Compact spots and empty states. (240×394) */
  emblem: { src: `${BRANDING}/sindhoora-emblem.webp`, width: 240, height: 394 },
} as const;

/** Vertical bands of the primary logo (percent of its height) — used by the splash reveal. */
export const primaryLogoBands = {
  emblem: [0, 55.9],
  wordmark: [55.9, 77.8],
  jewels: [77.8, 90],
  ornament: [90, 100],
} as const;

// NOTE: Contact details are placeholders for the prototype — replace with the business's real details.
export const siteInfo = {
  name: 'Sindhoora Jewels',
  signature: 'Signature by Soumya',
  tagline: 'Where Elegance Becomes a Legacy',
  description:
    'Antique and temple jewellery chosen with care — heritage designs, honest craftsmanship and pieces made to be handed down.',
  phone: '+91 90000 12345',
  whatsapp: '919000012345',
  email: 'hello@sindhoorajewels.in',
  location: 'Banjara Hills, Hyderabad, Telangana',
  hours: 'Mon – Sat, 11 am – 7 pm (by appointment)',
  social: {
    instagram: 'https://instagram.com/',
    facebook: 'https://facebook.com/',
  },
} as const;

export const mainNavigation = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Collections', to: '/collections' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
] as const;

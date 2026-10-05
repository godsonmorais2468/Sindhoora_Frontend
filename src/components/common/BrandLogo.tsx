import { brandAssets } from '@/data/brand';
import { cn } from '@/utils/helpers';

type LogoVariant = keyof typeof brandAssets;

interface BrandLogoProps {
  variant?: LogoVariant;
  className?: string;
  /** Above-the-fold logos load eagerly; others lazily. */
  priority?: boolean;
  alt?: string;
}

const defaultAlt: Record<LogoVariant, string> = {
  primary: 'Sindhoora Jewels',
  signature: 'Sindhoora Jewels — Signature by Soumya. Where elegance becomes a legacy.',
  wordmark: 'Sindhoora Jewels',
  emblem: 'Sindhoora emblem',
};

/**
 * Renders the provided Sindhoora logo artwork (never a re-drawn version).
 * Size it with a height or width class, e.g. `h-9 w-auto`.
 */
export function BrandLogo({ variant = 'wordmark', className, priority, alt }: BrandLogoProps) {
  const asset = brandAssets[variant];
  return (
    <img
      src={asset.src}
      width={asset.width}
      height={asset.height}
      alt={alt ?? defaultAlt[variant]}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
      className={cn('block select-none', className)}
    />
  );
}

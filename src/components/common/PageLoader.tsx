import { BrandLogo } from './BrandLogo';

/** Route-level Suspense fallback while a lazily-loaded page chunk downloads. */
export function PageLoader({ tone = 'dark' }: { tone?: 'light' | 'dark' }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={tone === 'dark' ? 'flex min-h-[70vh] items-center justify-center bg-ink-950' : 'flex min-h-[60vh] items-center justify-center'}
    >
      <BrandLogo variant="emblem" priority className="h-14 w-auto animate-pulse opacity-70" alt="" />
    </div>
  );
}

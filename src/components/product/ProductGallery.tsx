import { useRef, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { SmartImage } from '@/components/common/SmartImage';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/utils/helpers';

interface ProductGalleryProps {
  images: string[];
  name: string;
}

/**
 * Desktop: thumbnails + main image with a soft cross-fade.
 * Mobile: native swipe carousel (CSS scroll-snap) with position dots.
 */
export function ProductGallery({ images, name }: ProductGalleryProps) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  return isDesktop ? <DesktopGallery images={images} name={name} /> : <MobileGallery images={images} name={name} />;
}

function DesktopGallery({ images, name }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  return (
    <div className="grid grid-cols-[72px_1fr] gap-4">
      <div className="flex flex-col gap-3" role="tablist" aria-label="Product images">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={`Image ${i + 1} of ${images.length}`}
            onClick={() => setActive(i)}
            onMouseEnter={() => setActive(i)}
            className={cn(
              'overflow-hidden rounded-sm bg-ink-800 ring-1 transition',
              i === active ? 'ring-charcoal' : 'ring-transparent opacity-60 hover:opacity-100',
            )}
          >
            <SmartImage src={src} alt="" aspectRatio={4 / 5} widths={[160]} sizes="72px" fade={false} className="aspect-[4/5] w-full object-cover" />
          </button>
        ))}
      </div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-ink-800">
        <AnimatePresence initial={false}>
          <m.div
            key={active}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            <SmartImage
              src={images[active]}
              alt={`${name} — image ${active + 1}`}
              aspectRatio={4 / 5}
              sizes="(min-width: 1320px) 600px, 46vw"
              priority={active === 0}
              fade={false}
              className="size-full object-cover"
            />
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function MobileGallery({ images, name }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  function onScroll() {
    const el = trackRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    if (index !== active) setActive(index);
  }

  return (
    <div className="-mx-4 sm:mx-0">
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto bg-ink-800 sm:rounded-sm"
        aria-roledescription="carousel"
        aria-label={`${name} images`}
      >
        {images.map((src, i) => (
          <div key={src} className="w-full shrink-0 snap-center" aria-roledescription="slide" aria-label={`${i + 1} of ${images.length}`}>
            <SmartImage
              src={src}
              alt={`${name} — image ${i + 1}`}
              aspectRatio={4 / 5}
              sizes="100vw"
              priority={i === 0}
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <div className="mt-4 flex justify-center gap-2" aria-hidden>
          {images.map((src, i) => (
            <span key={src} className={cn('h-1 rounded-full transition-all duration-300', i === active ? 'w-6 bg-charcoal' : 'w-1.5 bg-charcoal/25')} />
          ))}
        </div>
      )}
    </div>
  );
}

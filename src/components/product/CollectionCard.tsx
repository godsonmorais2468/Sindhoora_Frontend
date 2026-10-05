import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SmartImage } from '@/components/common/SmartImage';
import type { Collection } from '@/types/product';
import { cn } from '@/utils/helpers';

interface CollectionCardProps {
  collection: Collection;
  className?: string;
  sizes?: string;
}

export function CollectionCard({ collection, className, sizes = '(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 80vw' }: CollectionCardProps) {
  return (
    <Link
      to={`/shop?collection=${collection.slug}`}
      className={cn('group relative block aspect-[4/5] overflow-hidden rounded-sm bg-ink-800 xl:aspect-[3/4.3]', className)}
    >
      <SmartImage
        src={collection.image}
        alt={`${collection.name} collection`}
        aspectRatio={4 / 5}
        sizes={sizes}
        className="motion-safe-scale absolute inset-0 size-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
      />
      {/* Text protection: solid at the bottom where copy sits, clear at the top where the jewellery is. */}
      <div className="absolute inset-0 bg-linear-to-t from-ink-950 via-ink-950/70 via-35% to-transparent to-70%" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 p-5 transition-transform duration-500 ease-out group-hover:-translate-y-1 sm:p-6">
        <p className="eyebrow text-gold-300">{collection.tagline}</p>
        <h3 className="heading-display mt-2 text-3xl text-cream sm:text-[2.1rem]">{collection.name}</h3>
        <p className="mt-2 line-clamp-2 max-w-xs text-sm leading-relaxed text-cream/75">{collection.description}</p>
        <span className="mt-4 inline-flex items-center gap-2 text-[13px] font-medium tracking-[0.14em] text-cream uppercase">
          Explore
          <ArrowRight
            className="size-4 -translate-x-1 text-gold-400 opacity-60 transition-[opacity,transform] duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
            aria-hidden
          />
        </span>
      </div>
    </Link>
  );
}

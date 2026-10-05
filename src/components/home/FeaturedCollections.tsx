import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Reveal } from '@/components/common/Reveal';
import { SectionHeading } from '@/components/common/SectionHeading';
import { CollectionCard } from '@/components/product/CollectionCard';
import { collections } from '@/data/categories';

export function FeaturedCollections() {
  return (
    <section className="bg-ink-900 py-20 sm:py-28 lg:py-32">
      <div className="container-luxe">
        <Reveal>
          <SectionHeading
            tone="dark"
            eyebrow="Featured collections"
            title="Curated for every chapter"
            description="Four collections, each chosen around a single idea — from devotional temple craft to the pieces made for a bride."
            action={
              <Link to="/collections" className="group inline-flex items-center gap-2 text-sm font-medium tracking-[0.14em] text-cream uppercase">
                All collections
                <ArrowRight className="size-4 text-gold-400 transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
            }
          />
        </Reveal>

        {/* Horizontal snap carousel on phones; a 2/4-column grid from tablet up. */}
        <Reveal className="mt-12 lg:mt-16" delay={0.1}>
          <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 xl:grid-cols-4">
            {collections.map((collection) => (
              <li key={collection.slug} className="w-[78vw] max-w-sm shrink-0 snap-start sm:w-auto sm:max-w-none">
                <CollectionCard collection={collection} />
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

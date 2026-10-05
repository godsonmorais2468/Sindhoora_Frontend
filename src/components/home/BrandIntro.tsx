import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Reveal } from '@/components/common/Reveal';
import { SmartImage } from '@/components/common/SmartImage';
import { editorialImages } from '@/data/images';

export function BrandIntro() {
  return (
    <section className="bg-ivory py-20 text-charcoal sm:py-28 lg:py-36">
      <div className="container-luxe grid items-center gap-12 lg:grid-cols-12 lg:gap-20">
        <Reveal className="relative lg:col-span-6">
          <div className="relative overflow-hidden rounded-sm bg-ink-800">
            <SmartImage
              src={editorialImages.brandIntro}
              alt="Layered antique gold necklaces worn with a purple and pink silk saree"
              aspectRatio={4 / 5}
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="aspect-[4/5] w-full object-cover sm:aspect-[5/4] lg:aspect-[4/5]"
            />
          </div>
          {/* Offset hairline frame — a quiet nod to a jewellery display case. */}
          <div className="pointer-events-none absolute -right-4 -bottom-4 hidden h-full w-full rounded-sm border border-gold-600/30 lg:block" aria-hidden />
        </Reveal>

        <Reveal className="lg:col-span-6 lg:pl-4" delay={0.1}>
          <p className="eyebrow text-gold-700">Our philosophy</p>
          <h2 className="heading-display mt-5 text-[2.5rem] sm:text-5xl lg:text-6xl">
            Where Elegance
            <br />
            Becomes a Legacy
          </h2>
          <div className="gold-rule mt-8 w-16" aria-hidden />
          <div className="mt-8 space-y-5 text-[17px] leading-relaxed text-taupe">
            <p>
              Sindhoora is a small house of antique jewellery, built on a simple belief: the most beautiful pieces are the ones that stay in a family.
            </p>
            <p>
              Every design is chosen for its heritage — temple motifs, kempu stones, nakshi detailing, the soft glow of an antique finish — and for the
              craftsmanship that makes it last. Pieces that feel personal today, and precious for generations after.
            </p>
          </div>

          <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-line pt-8">
            {[
              ['Curated', 'by Soumya'],
              ['Insured', 'pan-India delivery'],
              ['7-day', 'easy returns'],
            ].map(([value, label]) => (
              <div key={value}>
                <dt className="font-serif text-2xl text-charcoal sm:text-3xl">{value}</dt>
                <dd className="mt-1 text-[13px] leading-snug text-taupe">{label}</dd>
              </div>
            ))}
          </dl>

          <Link to="/about" className="group mt-10 inline-flex items-center gap-2 text-sm font-medium tracking-[0.14em] text-charcoal uppercase">
            Our story
            <ArrowRight className="size-4 text-gold-700 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

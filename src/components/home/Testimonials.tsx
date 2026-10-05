import { Quote, Star } from 'lucide-react';
import { Reveal } from '@/components/common/Reveal';
import { SectionHeading } from '@/components/common/SectionHeading';
import { testimonials } from '@/data/testimonials';

export function Testimonials() {
  return (
    <section className="border-t border-line bg-ivory-50 py-20 sm:py-28 lg:py-32">
      <div className="container-luxe">
        <Reveal>
          <SectionHeading align="center" eyebrow="Kind words" title="Worn, loved and passed on" />
        </Reveal>
        {/* Swipeable on phones, three columns on desktop. */}
        <Reveal delay={0.1} className="mt-14 lg:mt-16">
          <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0">
            {testimonials.map((t) => (
              <li key={t.id} className="w-[85vw] max-w-sm shrink-0 snap-center md:w-auto md:max-w-none">
                <figure className="flex h-full flex-col rounded-sm border border-line bg-white p-7 sm:p-9">
                  <Quote className="size-7 text-gold-600/60" strokeWidth={1.2} aria-hidden />
                  <div className="mt-5 flex gap-1" role="img" aria-label="Rated 5 out of 5">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} className="size-3.5 fill-gold-500 text-gold-500" aria-hidden />
                    ))}
                  </div>
                  <blockquote className="mt-4 flex-1 font-serif text-[1.35rem] leading-snug text-charcoal">“{t.quote}”</blockquote>
                  <figcaption className="mt-7 border-t border-line pt-5">
                    <p className="text-[15px] font-medium text-charcoal">{t.name}</p>
                    <p className="text-[13px] text-taupe">
                      {t.location} · {t.piece}
                    </p>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

import { useRef } from 'react';
import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Reveal } from '@/components/common/Reveal';
import { SmartImage } from '@/components/common/SmartImage';
import { ButtonLink } from '@/components/ui/Button';
import { editorialImages } from '@/data/images';

export function HeritageStory() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduceMotion ? ['0%', '0%'] : ['-6%', '6%']);

  return (
    <section ref={ref} className="relative overflow-hidden bg-ink-950 py-28 sm:py-36 lg:py-48">
      <m.div className="absolute -inset-y-[8%] inset-x-0 will-change-transform" style={{ y }}>
        <SmartImage
          src={editorialImages.heritage}
          alt=""
          aspectRatio={16 / 9}
          sizes="100vw"
          className="size-full object-cover opacity-55"
        />
      </m.div>
      <div className="absolute inset-0 bg-linear-to-b from-ink-950 via-ink-950/40 to-ink-950" aria-hidden />
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_50%,transparent,rgb(5_5_5/0.7))]" aria-hidden />

      <Reveal className="container-luxe relative text-center">
        <p className="eyebrow text-gold-300">Heritage</p>
        <h2 className="heading-display mx-auto mt-6 max-w-3xl text-[2.6rem] text-cream italic sm:text-6xl lg:text-7xl">
          “Jewellery that carries a story.”
        </h2>
        <div className="mx-auto mt-8 h-px w-16 bg-gold-500/70" aria-hidden />
        <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-cream/75 sm:text-lg">
          Long before it was fashion, jewellery was memory — gifted at weddings, worn at festivals, passed quietly from one generation to the next.
          Our pieces honour the techniques behind that tradition: hand-chased motifs, set kempu stones and finishes softened by hand.
        </p>
        <ButtonLink to="/about" variant="outline" size="lg" className="mt-10">
          Discover our story
        </ButtonLink>
      </Reveal>
    </section>
  );
}

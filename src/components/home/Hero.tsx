import { useContext, useRef } from 'react';
import { m, useReducedMotion, useScroll, useTransform, type Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { IntroContext } from '@/context/IntroContext';
import { editorialImages } from '@/data/images';
import { imageSrcSet, sizedImage } from '@/utils/image';

const EASE = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 22 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const introReady = useContext(IntroContext);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  // Gentle parallax: the image drifts slower than the page; content lifts and fades as it leaves.
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', reduceMotion ? '0%' : '14%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', reduceMotion ? '0%' : '-12%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const state = introReady ? 'shown' : 'hidden';

  return (
    <section ref={ref} className="relative flex min-h-[100svh] items-end overflow-hidden bg-ink-950 sm:items-center lg:max-h-[960px] lg:min-h-[720px]">
      <m.div className="absolute inset-0 will-change-transform" style={{ y: imageY }}>
        <m.picture
          className="block size-full"
          initial={{ scale: 1.08, opacity: 0 }}
          animate={introReady ? { scale: 1, opacity: 1 } : { scale: 1.08, opacity: 0 }}
          transition={{ scale: { duration: 2.4, ease: EASE }, opacity: { duration: 1.2, ease: 'easeOut' } }}
        >
          <source media="(max-width: 767px)" srcSet={imageSrcSet(editorialImages.heroMobile, [480, 750, 1080], 3 / 4.6)} sizes="100vw" />
          <img
            src={sizedImage(editorialImages.hero, 1600, 16 / 9)}
            srcSet={imageSrcSet(editorialImages.hero, [960, 1280, 1600, 2000, 2400], 16 / 9)}
            sizes="100vw"
            alt="Antique gold temple pendant with ruby stones resting on dark velvet"
            fetchPriority="high"
            decoding="async"
            // Mirrored from tablet up so the pendant sits in the open right half, clear of the headline.
            className="size-full object-cover sm:-scale-x-100"
          />
        </m.picture>
      </m.div>

      {/* Legibility gradients: left for desktop copy, bottom for mobile copy. */}
      <div className="absolute inset-0 bg-linear-to-t from-ink-950 via-ink-950/55 to-ink-950/10 sm:bg-linear-to-r sm:from-ink-950/95 sm:via-ink-950/60 sm:to-transparent" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-ink-950 to-transparent" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_40%_at_70%_45%,rgb(201_162_77/0.12),transparent_70%)]" aria-hidden />

      <m.div className="container-luxe relative z-10 pt-28 pb-16 sm:py-32" style={{ y: contentY, opacity: contentOpacity }}>
        <m.div className="max-w-xl" variants={container} initial="hidden" animate={state}>
          <m.p variants={item} className="eyebrow flex items-center gap-3 text-gold-300">
            <span className="h-px w-8 bg-gold-400/70" aria-hidden />
            Sindhoora Jewels
          </m.p>
          <m.p variants={item} className="mt-6 text-xs tracking-[0.28em] text-cream/60 uppercase">
            The art of timeless beauty
          </m.p>
          <m.h1 variants={item} className="heading-display mt-4 text-[2.9rem] text-cream xs:text-[3.3rem] sm:text-6xl lg:text-[5.2rem]">
            Antique Jewellery,
            <br />
            <span className="text-champagne italic">Made to Become Legacy.</span>
          </m.h1>
          <m.p variants={item} className="mt-6 max-w-md text-base leading-relaxed text-cream/75 sm:text-lg">
            Discover timeless pieces inspired by heritage, craftsmanship and enduring elegance.
          </m.p>
          <m.div variants={item} className="mt-10 flex flex-col gap-3 xs:flex-row">
            <ButtonLink to="/collections" variant="gold" size="lg" icon={<ArrowRight className="size-4" aria-hidden />}>
              Explore Collection
            </ButtonLink>
            <ButtonLink to="/shop?sort=newest" variant="outline" size="lg">
              View New Arrivals
            </ButtonLink>
          </m.div>
        </m.div>
      </m.div>
    </section>
  );
}

import { Gem, HandHeart, Hourglass, Sparkles } from 'lucide-react';
import { Reveal } from '@/components/common/Reveal';
import { SectionHeading } from '@/components/common/SectionHeading';

export const brandPromises = [
  {
    icon: Gem,
    title: 'Authentic Craftsmanship',
    text: 'Hand-chased motifs, carefully set stones and finishes worked by skilled artisans — never mass-produced.',
  },
  {
    icon: Hourglass,
    title: 'Timeless Designs',
    text: 'Silhouettes drawn from temple, Chettinad and Nizami traditions, chosen to outlast trends.',
  },
  {
    icon: Sparkles,
    title: 'Curated Collections',
    text: 'A small, considered edit. Every piece is personally selected by Soumya before it reaches you.',
  },
  {
    icon: HandHeart,
    title: 'Personal Service',
    text: 'Styling advice over WhatsApp or video call, careful packaging and help long after delivery.',
  },
];

export function WhySindhoora() {
  return (
    <section className="bg-ivory py-20 sm:py-28 lg:py-32">
      <div className="container-luxe">
        <Reveal>
          <SectionHeading align="center" eyebrow="Why Sindhoora" title="Chosen with care, made to last" />
        </Reveal>
        <Reveal className="mt-14 grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2 lg:mt-16 lg:grid-cols-4" delay={0.1}>
          {brandPromises.map(({ icon: Icon, title, text }) => (
            <div key={title} className="bg-ivory-50 p-8 transition-colors duration-300 hover:bg-white lg:p-10">
              <div className="flex size-12 items-center justify-center rounded-full border border-gold-600/30 text-gold-700">
                <Icon className="size-5" strokeWidth={1.4} aria-hidden />
              </div>
              <h3 className="mt-6 text-lg font-medium text-charcoal">{title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-taupe">{text}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

import { ArrowRight } from 'lucide-react';
import { BrandLogo } from '@/components/common/BrandLogo';
import { Reveal } from '@/components/common/Reveal';
import { SectionHeading } from '@/components/common/SectionHeading';
import { SmartImage } from '@/components/common/SmartImage';
import { brandPromises } from '@/components/home/WhySindhoora';
import { PageHeader } from '@/components/layout/PageHeader';
import { ButtonLink } from '@/components/ui/Button';
import { editorialImages } from '@/data/images';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const process = [
  { step: '01', title: 'Selected', text: 'Every design begins with a reference — a temple carving, an heirloom, a regional tradition.' },
  { step: '02', title: 'Crafted', text: 'Artisans hand-chase motifs, set kempu and polki-style stones, and assemble each piece by hand.' },
  { step: '03', title: 'Finished', text: 'The antique finish is rubbed in slowly, so the relief work glows the way old gold does.' },
  { step: '04', title: 'Delivered', text: 'Inspected by Soumya, packed in a keepsake box and shipped insured to your door.' },
];

// NOTE: Founder story is placeholder copy for the prototype — to be replaced with Soumya's own words.
export default function About() {
  useDocumentTitle('About Sindhoora', 'The story behind Sindhoora Jewels — antique jewellery curated by Soumya.');

  return (
    <>
      <PageHeader
        eyebrow="About Sindhoora"
        title={
          <>
            A small house of
            <br />
            <span className="text-champagne italic">heritage jewellery.</span>
          </>
        }
        description="Sindhoora began with a love for the jewellery that families keep — and a wish to make it accessible, personal and beautifully made."
        image={editorialImages.craftDetail}
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'About' }]}
      />

      {/* Signature — the extended brand logo, shown large enough for its tagline to read. */}
      <section className="border-t border-gold-500/10 bg-ink-950 py-20 sm:py-28">
        <div className="container-luxe grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal className="mx-auto w-full max-w-md">
            <BrandLogo variant="signature" className="w-full" />
          </Reveal>
          <Reveal delay={0.1}>
            <p className="eyebrow text-gold-300">Signature by Soumya</p>
            <h2 className="heading-display mt-5 text-4xl text-cream sm:text-5xl">Chosen by hand, one piece at a time.</h2>
            <div className="mt-8 space-y-5 text-[17px] leading-relaxed text-muted">
              <p>
                Sindhoora is led by Soumya, who grew up surrounded by the temple jewellery of South India — the kasu malas, harams and vaddanams brought out for weddings
                and festivals, and carefully put away again.
              </p>
              <p>
                Every piece in the collection is personally selected for its design, its craftsmanship and its finish. If it would not be worthy of a family
                heirloom box, it does not become part of Sindhoora.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-ivory py-20 text-charcoal sm:py-28">
        <div className="container-luxe grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="order-2 lg:order-1">
            <SectionHeading eyebrow="Our craft" title="From reference to heirloom" />
            <ol className="mt-10 space-y-8">
              {process.map((p) => (
                <li key={p.step} className="grid grid-cols-[3rem_1fr] gap-4">
                  <span className="font-serif text-3xl text-gold-700">{p.step}</span>
                  <div>
                    <h3 className="text-lg font-medium">{p.title}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-taupe">{p.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal className="order-1 lg:order-2" delay={0.1}>
            <div className="overflow-hidden rounded-sm bg-ink-800">
              <SmartImage
                src={editorialImages.portrait}
                alt="A woman wearing layered antique gold jewellery"
                aspectRatio={4 / 5}
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-ivory-50 py-20 text-charcoal sm:py-28">
        <div className="container-luxe">
          <Reveal>
            <SectionHeading align="center" eyebrow="What we promise" title="The Sindhoora standard" />
          </Reveal>
          <Reveal delay={0.1} className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {brandPromises.map(({ icon: Icon, title, text }) => (
              <div key={title} className="text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-gold-600/30 text-gold-700">
                  <Icon className="size-6" strokeWidth={1.3} aria-hidden />
                </div>
                <h3 className="mt-5 text-lg font-medium">{title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-taupe">{text}</p>
              </div>
            ))}
          </Reveal>
          <div className="mt-16 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink to="/shop" variant="dark" size="lg" icon={<ArrowRight className="size-4" aria-hidden />}>
              Explore the shop
            </ButtonLink>
            <ButtonLink to="/contact" variant="outline-dark" size="lg">
              Book a styling call
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}

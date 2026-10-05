import { BrandIntro } from '@/components/home/BrandIntro';
import { Bestsellers } from '@/components/home/Bestsellers';
import { FeaturedCollections } from '@/components/home/FeaturedCollections';
import { HeritageStory } from '@/components/home/HeritageStory';
import { Hero } from '@/components/home/Hero';
import { NewsletterCTA } from '@/components/home/NewsletterCTA';
import { Testimonials } from '@/components/home/Testimonials';
import { WhySindhoora } from '@/components/home/WhySindhoora';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function Home() {
  useDocumentTitle(undefined);
  return (
    <>
      <Hero />
      <BrandIntro />
      <FeaturedCollections />
      <Bestsellers />
      <HeritageStory />
      <WhySindhoora />
      <Testimonials />
      <NewsletterCTA />
    </>
  );
}

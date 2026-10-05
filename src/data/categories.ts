import type { Category, CategorySlug, Collection } from '@/types/product';
import { categoryImages, collectionImages } from './images';

export const categories: Category[] = [
  {
    slug: 'temple-jewellery',
    name: 'Temple Jewellery',
    description: 'Deity motifs and kempu stones inspired by South Indian temple craft.',
    image: categoryImages.temple,
  },
  {
    slug: 'necklaces',
    name: 'Necklaces',
    description: 'Chokers, coin necklaces and pendant sets with an antique finish.',
    image: categoryImages.necklaces,
  },
  {
    slug: 'haram',
    name: 'Haram',
    description: 'Long, layered harams for festive and ceremonial dressing.',
    image: categoryImages.haram,
  },
  {
    slug: 'jhumkas',
    name: 'Jhumkas',
    description: 'Bell-shaped jhumkas with pearl drops and temple detailing.',
    image: categoryImages.jhumkas,
  },
  {
    slug: 'earrings',
    name: 'Earrings',
    description: 'Chandbalis, studs and drops with heritage character.',
    image: categoryImages.earrings,
  },
  {
    slug: 'bangles',
    name: 'Bangles',
    description: 'Kadas and bangle sets in antique gold finishes.',
    image: categoryImages.bangles,
  },
  {
    slug: 'bridal',
    name: 'Bridal',
    description: 'Statement sets made for the most important days.',
    image: categoryImages.bridal,
  },
  {
    slug: 'rings',
    name: 'Rings',
    description: 'Cocktail and heirloom rings with antique detailing.',
    image: categoryImages.rings,
  },
  {
    slug: 'accessories',
    name: 'Accessories',
    description: 'Vaddanams, brooches and finishing pieces.',
    image: categoryImages.accessories,
  },
];

const categoryMap = new Map(categories.map((c) => [c.slug, c]));

export function getCategory(slug: string | undefined): Category | undefined {
  return slug ? categoryMap.get(slug as CategorySlug) : undefined;
}

export function getCategoryName(slug: string): string {
  return categoryMap.get(slug as CategorySlug)?.name ?? slug;
}

export const collections: Collection[] = [
  {
    slug: 'temple-jewellery',
    name: 'Temple Jewellery',
    tagline: 'Devotion, rendered in gold',
    description:
      'Lakshmi motifs, kempu stones and the sculptural detail of South Indian temple craft — pieces that carry their meaning with them.',
    image: collectionImages.temple,
  },
  {
    slug: 'bridal-heritage',
    name: 'Bridal Heritage',
    tagline: 'For the days that become memories',
    description:
      'Layered harams, polki necklaces and statement sets chosen for brides who want something that will outlast the occasion.',
    image: collectionImages.bridal,
  },
  {
    slug: 'antique-gold',
    name: 'Antique Gold',
    tagline: 'The warmth of an old finish',
    description:
      'Matte, hand-finished gold tones with the softness of age — kadas, coin necklaces and pieces that feel inherited.',
    image: collectionImages.antique,
  },
  {
    slug: 'statement-pieces',
    name: 'Statement Pieces',
    tagline: 'One piece, entire presence',
    description:
      'Bold silhouettes and rich stonework for when a single piece should carry the whole look.',
    image: collectionImages.statement,
  },
];

export function getCollection(slug: string | null | undefined): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}

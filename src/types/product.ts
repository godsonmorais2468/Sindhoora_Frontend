export type ProductStatus = 'active' | 'draft' | 'archived';

export type CategorySlug =
  | 'temple-jewellery'
  | 'necklaces'
  | 'haram'
  | 'jhumkas'
  | 'earrings'
  | 'bangles'
  | 'bridal'
  | 'rings'
  | 'accessories';

export type CollectionSlug = 'temple-jewellery' | 'bridal-heritage' | 'antique-gold' | 'statement-pieces';

/**
 * Shape mirrors what a Django REST `ProductSerializer` would return,
 * so the mock service can later be swapped for a real API call.
 */
export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category: CategorySlug;
  collections: CollectionSlug[];
  price: number;
  /** Discounted price, if any. `null` when not on sale. */
  salePrice: number | null;
  shortDescription: string;
  description: string;
  /** Ordered image URLs; the first is the cover image. */
  images: string[];
  material: string;
  weight: string;
  dimensions: string;
  stock: number;
  featured: boolean;
  bestSeller: boolean;
  isNew: boolean;
  limited: boolean;
  status: ProductStatus;
  createdAt: string;
}

export type ProductInput = Omit<Product, 'id' | 'createdAt' | 'slug'> & { slug?: string };

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  image: string;
}

export interface Collection {
  slug: CollectionSlug;
  name: string;
  tagline: string;
  description: string;
  image: string;
}

export type SortOption = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'name';

export type PriceRange = 'all' | 'under-25k' | '25k-50k' | '50k-100k' | 'above-100k';

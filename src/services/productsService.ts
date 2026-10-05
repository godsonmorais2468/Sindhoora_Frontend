import type { Product, ProductInput } from '@/types/product';
import { slugify } from '@/utils/helpers';
import { db, networkDelay } from './mockDb';

// Future DRF mapping:
//   listProducts     → GET    /api/products/            (public: ?status=active)
//   getProduct       → GET    /api/products/:idOrSlug/
//   createProduct    → POST   /api/admin/products/
//   updateProduct    → PATCH  /api/admin/products/:id/
//   deleteProduct    → DELETE /api/admin/products/:id/

interface ListOptions {
  /** Admin views include drafts and archived products. */
  includeInactive?: boolean;
}

export async function listProducts({ includeInactive = false }: ListOptions = {}): Promise<Product[]> {
  await networkDelay();
  const rows = db.products.all();
  return includeInactive ? rows : rows.filter((p) => p.status === 'active');
}

export async function getProduct(idOrSlug: string, { includeInactive = false }: ListOptions = {}): Promise<Product | null> {
  await networkDelay(180);
  const product = db.products.all().find((p) => p.id === idOrSlug || p.slug === idOrSlug);
  if (!product) return null;
  return includeInactive || product.status === 'active' ? product : null;
}

function uniqueSlug(base: string, ignoreId?: string): string {
  const taken = new Set(db.products.all().filter((p) => p.id !== ignoreId).map((p) => p.slug));
  let slug = slugify(base) || 'product';
  let n = 2;
  while (taken.has(slug)) slug = `${slugify(base)}-${n++}`;
  return slug;
}

function nextProductId(): string {
  const max = db.products.all().reduce((m, p) => Math.max(m, Number(p.id.replace(/\D/g, '')) || 0), 1000);
  return `prd-${max + 1}`;
}

export async function createProduct(input: ProductInput): Promise<Product> {
  await networkDelay(350);
  const product: Product = {
    ...input,
    id: nextProductId(),
    slug: uniqueSlug(input.slug || input.name),
    createdAt: new Date().toISOString(),
  };
  db.products.save([product, ...db.products.all()]);
  return product;
}

export async function updateProduct(id: string, input: Partial<ProductInput>): Promise<Product> {
  await networkDelay(350);
  const rows = db.products.all();
  const existing = rows.find((p) => p.id === id);
  if (!existing) throw new Error('Product not found.');
  const updated: Product = {
    ...existing,
    ...input,
    slug: input.name && input.name !== existing.name ? uniqueSlug(input.slug || input.name, id) : existing.slug,
  };
  db.products.save(rows.map((p) => (p.id === id ? updated : p)));
  return updated;
}

export async function deleteProduct(id: string): Promise<void> {
  await networkDelay(300);
  db.products.save(db.products.all().filter((p) => p.id !== id));
}

export async function setProductStock(id: string, stock: number): Promise<Product> {
  return updateProduct(id, { stock: Math.max(0, Math.round(stock)) });
}

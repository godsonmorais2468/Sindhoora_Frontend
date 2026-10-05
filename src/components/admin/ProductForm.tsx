import { useRef, useState, type DragEvent, type FormEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { CircleAlert, ImagePlus, Star, X } from 'lucide-react';
import { SmartImage } from '@/components/common/SmartImage';
import { Button } from '@/components/ui/Button';
import { Checkbox, Input, Select, Textarea } from '@/components/ui/FormControls';
import { categories, collections } from '@/data/categories';
import type { CategorySlug, CollectionSlug, Product, ProductInput, ProductStatus } from '@/types/product';
import { cn } from '@/utils/helpers';
import { compressImageFile } from '@/utils/image';

interface FormValues {
  name: string;
  sku: string;
  category: CategorySlug | '';
  price: string;
  salePrice: string;
  shortDescription: string;
  description: string;
  material: string;
  weight: string;
  dimensions: string;
  stock: string;
  status: ProductStatus;
  featured: boolean;
  bestSeller: boolean;
  isNew: boolean;
  limited: boolean;
  collections: CollectionSlug[];
  images: string[];
}

type Errors = Partial<Record<keyof FormValues, string>>;

/** Form fields whose value is a string (text inputs and selects). */
type StringField = { [K in keyof FormValues]: FormValues[K] extends string ? K : never }[keyof FormValues];

function toValues(p?: Product): FormValues {
  return {
    name: p?.name ?? '',
    sku: p?.sku ?? '',
    category: p?.category ?? '',
    price: p ? String(p.price) : '',
    salePrice: p?.salePrice != null ? String(p.salePrice) : '',
    shortDescription: p?.shortDescription ?? '',
    description: p?.description ?? '',
    material: p?.material ?? '92.5 sterling silver, 22K gold polish',
    weight: p?.weight ?? '',
    dimensions: p?.dimensions ?? '',
    stock: p ? String(p.stock) : '1',
    status: p?.status ?? 'draft',
    featured: p?.featured ?? false,
    bestSeller: p?.bestSeller ?? false,
    isNew: p?.isNew ?? true,
    limited: p?.limited ?? false,
    collections: p?.collections ?? [],
    images: p?.images ?? [],
  };
}

function validate(v: FormValues): Errors {
  const e: Errors = {};
  const price = Number(v.price);
  if (v.name.trim().length < 3) e.name = 'Enter a product name (at least 3 characters).';
  if (!/^[A-Z0-9-]{4,}$/i.test(v.sku.trim())) e.sku = 'Use letters, numbers and dashes, e.g. SJ-NCK-030.';
  if (!v.category) e.category = 'Choose a category.';
  if (!v.price || !Number.isFinite(price) || price <= 0) e.price = 'Enter a price greater than ₹0.';
  if (v.salePrice) {
    const sale = Number(v.salePrice);
    if (!Number.isFinite(sale) || sale <= 0) e.salePrice = 'Enter a valid discount price.';
    else if (sale >= price) e.salePrice = 'Discount price must be lower than the price.';
  }
  if (v.shortDescription.trim().length < 10) e.shortDescription = 'Add a one-line summary (at least 10 characters).';
  if (v.description.trim().length < 20) e.description = 'Add a fuller description (at least 20 characters).';
  if (!/^\d+$/.test(v.stock.trim())) e.stock = 'Stock must be a whole number (0 or more).';
  if (v.images.length === 0) e.images = 'Add at least one product image.';
  return e;
}

function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-line bg-white">
      <div className="border-b border-line px-5 py-4">
        <h2 className="text-[15px] font-semibold">{title}</h2>
        {description && <p className="mt-0.5 text-[13px] text-taupe">{description}</p>}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

interface ProductFormProps {
  initial?: Product;
  submitLabel: string;
  onSubmit: (input: ProductInput) => Promise<void>;
}

export function ProductForm({ initial, submitLabel, onSubmit }: ProductFormProps) {
  const [values, setValues] = useState<FormValues>(() => toValues(initial));
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }
  const text = (key: StringField) => (e: { target: { value: string } }) => set(key, e.target.value as FormValues[StringField]);

  async function addFiles(files: FileList | File[]) {
    const images = [...files].filter((f) => f.type.startsWith('image/'));
    if (images.length === 0) return;
    setUploading(true);
    try {
      // Prototype "upload": images are downsized in the browser and stored as data URLs.
      const urls = await Promise.all(images.slice(0, 6).map((f) => compressImageFile(f)));
      set('images', [...values.images, ...urls].slice(0, 8));
    } catch (err) {
      setErrors((e) => ({ ...e, images: err instanceof Error ? err.message : 'Could not read that image.' }));
    } finally {
      setUploading(false);
    }
  }

  function onDrop(event: DragEvent) {
    event.preventDefault();
    setDragging(false);
    void addFiles(event.dataTransfer.files);
  }

  function moveToCover(index: number) {
    const next = [...values.images];
    const [img] = next.splice(index, 1);
    set('images', [img, ...next]);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setFormError('Please correct the highlighted fields.');
      requestAnimationFrame(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    setFormError(null);
    setSaving(true);
    try {
      await onSubmit({
        name: values.name.trim(),
        sku: values.sku.trim().toUpperCase(),
        category: values.category as CategorySlug,
        collections: values.collections,
        price: Math.round(Number(values.price)),
        salePrice: values.salePrice ? Math.round(Number(values.salePrice)) : null,
        shortDescription: values.shortDescription.trim(),
        description: values.description.trim(),
        images: values.images,
        material: values.material.trim(),
        weight: values.weight.trim(),
        dimensions: values.dimensions.trim(),
        stock: Number(values.stock),
        featured: values.featured,
        bestSeller: values.bestSeller,
        isNew: values.isNew,
        limited: values.limited,
        status: values.status,
      });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not save the product.');
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-6 xl:grid-cols-[1fr_340px]">
      <div className="space-y-6">
        {formError && (
          <div role="alert" className="flex items-start gap-2.5 rounded-md border border-danger/25 bg-red-50 px-4 py-3 text-sm text-danger">
            <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
            {formError}
          </div>
        )}

        <Section title="Basic information">
          <div className="grid gap-5 sm:grid-cols-2">
            <Input label="Product name" required value={values.name} onChange={text('name')} error={errors.name} wrapperClassName="sm:col-span-2" placeholder="e.g. Lakshmi Temple Necklace" />
            <Input label="SKU" required value={values.sku} onChange={text('sku')} error={errors.sku} placeholder="SJ-NCK-030" />
            <Select
              label="Category"
              required
              value={values.category}
              onChange={text('category')}
              error={errors.category}
              options={[{ value: '', label: 'Choose a category' }, ...categories.map((c) => ({ value: c.slug, label: c.name }))]}
            />
            <Input label="Short description" required value={values.shortDescription} onChange={text('shortDescription')} error={errors.shortDescription} wrapperClassName="sm:col-span-2" hint="One line shown on product cards and quick view." />
            <Textarea label="Description" required rows={5} value={values.description} onChange={text('description')} error={errors.description} wrapperClassName="sm:col-span-2" />
          </div>
        </Section>

        <Section title="Product images" description="The first image is the cover. Up to 8 images; JPG, PNG or WebP.">
          {values.images.length > 0 && (
            <ul className="mb-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {values.images.map((src, i) => (
                <li key={`${i}-${src.slice(-24)}`} className="group relative overflow-hidden rounded-md bg-ink-800">
                  <SmartImage src={src} alt={`Product image ${i + 1}`} aspectRatio={4 / 5} widths={[240]} sizes="160px" fade={false} className="aspect-[4/5] w-full object-cover" />
                  {i === 0 && <span className="absolute top-1.5 left-1.5 rounded-sm bg-ivory/95 px-1.5 py-0.5 text-[11px] font-medium text-charcoal">Cover</span>}
                  <div className="absolute inset-x-1.5 bottom-1.5 flex justify-end gap-1">
                    {i > 0 && (
                      <button type="button" onClick={() => moveToCover(i)} className="flex size-8 items-center justify-center rounded-md bg-white/95 text-charcoal shadow-sm hover:bg-white" aria-label={`Make image ${i + 1} the cover`} title="Make cover">
                        <Star className="size-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => set('images', values.images.filter((_, idx) => idx !== i))}
                      className="flex size-8 items-center justify-center rounded-md bg-white/95 text-charcoal shadow-sm hover:bg-white hover:text-danger"
                      aria-label={`Remove image ${i + 1}`}
                      title="Remove"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={cn(
              'flex flex-col items-center justify-center rounded-md border border-dashed px-4 py-8 text-center transition-colors',
              dragging ? 'border-gold-600 bg-ivory' : errors.images ? 'border-danger/50' : 'border-line',
            )}
          >
            <ImagePlus className="size-7 text-gold-600" strokeWidth={1.4} aria-hidden />
            <p className="mt-3 text-sm text-charcoal">Drag images here, or</p>
            <Button type="button" variant="outline-dark" size="sm" className="mt-3" loading={uploading} onClick={() => fileInput.current?.click()}>
              Choose files
            </Button>
            <input ref={fileInput} type="file" accept="image/*" multiple className="sr-only" tabIndex={-1} onChange={(e) => e.target.files && addFiles(e.target.files)} />
            <p className="mt-3 text-xs text-taupe">Prototype: images are stored in this browser only — no server upload.</p>
          </div>
          {errors.images && <p className="mt-2 text-[13px] text-danger">{errors.images}</p>}
        </Section>

        <Section title="Specifications">
          <div className="grid gap-5 sm:grid-cols-3">
            <Input label="Material" value={values.material} onChange={text('material')} wrapperClassName="sm:col-span-3" />
            <Input label="Weight" value={values.weight} onChange={text('weight')} placeholder="e.g. 68 g" />
            <Input label="Dimensions" value={values.dimensions} onChange={text('dimensions')} placeholder="e.g. Length 16 in" wrapperClassName="sm:col-span-2" />
          </div>
        </Section>
      </div>

      <div className="space-y-6">
        <Section title="Status">
          <Select
            label="Visibility"
            value={values.status}
            onChange={text('status')}
            options={[
              { value: 'active', label: 'Active — visible in the shop' },
              { value: 'draft', label: 'Draft — hidden' },
              { value: 'archived', label: 'Archived — hidden' },
            ]}
          />
        </Section>

        <Section title="Pricing & stock">
          <div className="grid gap-5">
            <Input label="Price (₹)" required type="number" inputMode="numeric" min={0} value={values.price} onChange={text('price')} error={errors.price} />
            <Input label="Discount price (₹)" type="number" inputMode="numeric" min={0} value={values.salePrice} onChange={text('salePrice')} error={errors.salePrice} hint="Leave empty if not on offer." />
            <Input label="Stock" required type="number" inputMode="numeric" min={0} value={values.stock} onChange={text('stock')} error={errors.stock} />
          </div>
        </Section>

        <Section title="Merchandising">
          <div className="space-y-3.5">
            <Checkbox label="Featured" description="Highlighted in featured placements" checked={values.featured} onChange={(e) => set('featured', e.target.checked)} />
            <Checkbox label="Best seller" description="Appears in the homepage bestsellers" checked={values.bestSeller} onChange={(e) => set('bestSeller', e.target.checked)} />
            <Checkbox label="New arrival" checked={values.isNew} onChange={(e) => set('isNew', e.target.checked)} />
            <Checkbox label="Limited edition" checked={values.limited} onChange={(e) => set('limited', e.target.checked)} />
          </div>
          <div role="group" aria-labelledby="product-collections-label" className="mt-6 border-t border-line pt-5">
            <p id="product-collections-label" className="mb-3 text-[13px] font-medium text-charcoal/85">
              Collections
            </p>
            <div className="space-y-3">
              {collections.map((c) => (
                <Checkbox
                  key={c.slug}
                  label={c.name}
                  checked={values.collections.includes(c.slug)}
                  onChange={(e) => set('collections', e.target.checked ? [...values.collections, c.slug] : values.collections.filter((s) => s !== c.slug))}
                />
              ))}
            </div>
          </div>
        </Section>

        <div className="flex gap-3 xl:sticky xl:top-24">
          <Link to="/admin/products" className="flex h-11 flex-1 items-center justify-center rounded-sm border border-charcoal/20 text-sm font-medium text-charcoal hover:border-charcoal/60">
            Cancel
          </Link>
          <Button type="submit" variant="dark" className="flex-1" loading={saving}>
            {submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
}

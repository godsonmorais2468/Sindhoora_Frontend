import { useNavigate, useParams } from 'react-router-dom';
import { ExternalLink, PackageSearch } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ProductForm } from '@/components/admin/ProductForm';
import { EmptyState } from '@/components/common/EmptyState';
import { ButtonLink } from '@/components/ui/Button';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { invalidateQueries, useQuery } from '@/hooks/useQuery';
import { useToast } from '@/hooks/useToast';
import { getProduct, updateProduct } from '@/services/productsService';

export default function EditProduct() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { data: product, isLoading } = useQuery(`admin:product:${id}`, () => getProduct(id, { includeInactive: true }));
  useDocumentTitle(`${product?.name ?? 'Edit Product'} · Admin`);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-8 w-64" />
        <div className="skeleton h-96 w-full" />
      </div>
    );
  }

  if (!product) {
    return (
      <EmptyState
        icon={PackageSearch}
        title="Product not found"
        description="It may have been deleted. Return to the product list to continue."
        action={<ButtonLink to="/admin/products" variant="dark">Back to products</ButtonLink>}
      />
    );
  }

  return (
    <>
      <AdminPageHeader
        title="Edit product"
        description={`${product.name} · ${product.sku}`}
        back={{ to: '/admin/products', label: 'Products' }}
        actions={
          product.status === 'active' && (
            <a href={`/product/${product.slug}`} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center gap-2 rounded-sm border border-charcoal/20 px-4 text-[13px] font-medium hover:border-charcoal/60">
              View in store <ExternalLink className="size-3.5" aria-hidden />
            </a>
          )
        }
      />
      <ProductForm
        key={product.id}
        initial={product}
        submitLabel="Save changes"
        onSubmit={async (input) => {
          const updated = await updateProduct(product.id, input);
          invalidateQueries('admin');
          invalidateQueries('product');
          toast({ title: 'Changes saved', description: updated.name });
          navigate('/admin/products');
        }}
      />
    </>
  );
}

import { useNavigate } from 'react-router-dom';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ProductForm } from '@/components/admin/ProductForm';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { invalidateQueries } from '@/hooks/useQuery';
import { useToast } from '@/hooks/useToast';
import { createProduct } from '@/services/productsService';

export default function AddProduct() {
  useDocumentTitle('Add Product · Admin');
  const navigate = useNavigate();
  const toast = useToast();

  return (
    <>
      <AdminPageHeader title="Add product" description="Create a new piece for the catalogue." back={{ to: '/admin/products', label: 'Products' }} />
      <ProductForm
        submitLabel="Create product"
        onSubmit={async (input) => {
          const product = await createProduct(input);
          invalidateQueries('admin');
          invalidateQueries('product');
          toast({ title: 'Product created', description: product.name });
          navigate('/admin/products');
        }}
      />
    </>
  );
}

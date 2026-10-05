import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { PageLoader } from '@/components/common/PageLoader';
import { AdminLayout } from '@/layouts/AdminLayout';
import { PublicLayout } from '@/layouts/PublicLayout';
import Home from '@/pages/public/Home';
import { ProtectedRoute } from './ProtectedRoute';

// The home page ships in the main bundle (it is the landing page);
// every other page — and the whole admin — is split into its own chunk.
const Shop = lazy(() => import('@/pages/public/Shop'));
const ProductDetails = lazy(() => import('@/pages/public/ProductDetails'));
const Collections = lazy(() => import('@/pages/public/Collections'));
const About = lazy(() => import('@/pages/public/About'));
const Contact = lazy(() => import('@/pages/public/Contact'));
const Cart = lazy(() => import('@/pages/public/Cart'));
const Wishlist = lazy(() => import('@/pages/public/Wishlist'));
const Checkout = lazy(() => import('@/pages/public/Checkout'));
const OrderSuccess = lazy(() => import('@/pages/public/OrderSuccess'));
const Policy = lazy(() => import('@/pages/public/Policy'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const AdminLogin = lazy(() => import('@/pages/admin/AdminLogin'));
const Dashboard = lazy(() => import('@/pages/admin/Dashboard'));
const Products = lazy(() => import('@/pages/admin/Products'));
const AddProduct = lazy(() => import('@/pages/admin/AddProduct'));
const EditProduct = lazy(() => import('@/pages/admin/EditProduct'));
const Orders = lazy(() => import('@/pages/admin/Orders'));
const OrderDetails = lazy(() => import('@/pages/admin/OrderDetails'));
const Customers = lazy(() => import('@/pages/admin/Customers'));
const Inventory = lazy(() => import('@/pages/admin/Inventory'));
const Settings = lazy(() => import('@/pages/admin/Settings'));

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="shop/:category" element={<Shop />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="collections" element={<Collections />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="cart" element={<Cart />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="order-success" element={<OrderSuccess />} />
        <Route path="policies/:slug" element={<Policy />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route
        path="admin/login"
        element={
          <Suspense fallback={<PageLoader />}>
            <AdminLogin />
          </Suspense>
        }
      />
      <Route
        path="admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="products/new" element={<AddProduct />} />
        <Route path="products/:id/edit" element={<EditProduct />} />
        <Route path="orders" element={<Orders />} />
        <Route path="orders/:id" element={<OrderDetails />} />
        <Route path="customers" element={<Customers />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
}

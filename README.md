# Sindhoora Jewels — Frontend Prototype

*Signature by Soumya · Where Elegance Becomes a Legacy*

A frontend-only prototype of the Sindhoora antique jewellery store and its admin panel.
All data is mock data stored in the browser — there is no backend yet.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build
```

**Admin (mock login):** `/admin/login` — `admin@sindhoora.com` / `admin123`.
This is *not* secure authentication; the credentials ship in the bundle. Replace with Django auth before any real use.

**Reset demo data:** Admin → Settings → *Reset demo data* restores the original products, orders and customers.

## Stack

React 19 · Vite 8 · TypeScript · Tailwind CSS 4 · Framer Motion (`LazyMotion` + `m`) · React Router 7 · Lucide icons.
Charts are small custom SVG/HTML components (no chart library).

## Project structure

```
src/
  components/
    admin/      AdminTable, StatCard, ProductForm, charts/, …
    cart/       CartLineItem, OrderSummary
    common/     BrandLogo, SplashScreen, SmartImage, Reveal, EmptyState, Skeletons, …
    home/       Hero, BrandIntro, FeaturedCollections, Bestsellers, …
    layout/     Navbar, MobileMenu, SearchOverlay, Footer, PageHeader
    product/    ProductCard, ProductGrid, QuickViewModal, ProductGallery, ShopFilters
    ui/         Button, FormControls, Modal, Drawer, StatusBadge, ProductBadge
  context/      Cart, Wishlist, Auth, Toast, Intro (splash → hero hand-off)
  data/         Mock data: products, orders, customers, categories, images, brand, policies
  hooks/        useQuery, useLocalStorage, useCart, useWishlist, useShopActions, …
  layouts/      PublicLayout, AdminLayout
  pages/        public/* and admin/*
  routes/       AppRoutes, ProtectedRoute
  services/     The API boundary (mock implementations) — see below
  types/        Product, Order, Customer, …
  utils/        currency (₹ formatting), formatters, image sizing, storage, product filters
```

## Connecting the Django REST backend

Components never touch data directly. They call functions in `src/services/`, which return
Promises shaped like API responses and currently read/write a localStorage "database"
(`services/mockDb.ts`). To go live, replace each service body with a `fetch` call — the
call sites don't change. Each service file lists its intended endpoint, e.g.:

| Service | Intended endpoint |
|---|---|
| `productsService.listProducts` | `GET /api/products/` |
| `ordersService.createOrder` | `POST /api/orders/` (server re-validates price & stock) |
| `ordersService.updateOrderStatus` | `PATCH /api/admin/orders/:id/` |
| `dashboardService.getDashboardStats` | `GET /api/admin/dashboard/` |
| `authService.login` | Django session / JWT |

`hooks/useQuery.ts` is a deliberately tiny cache; it can be swapped for TanStack Query with the same call sites.
Shop filtering currently runs client-side in `utils/productFilters.ts`; with a large catalogue, move it to API query params.

## Brand assets

`public/assets/branding/` holds the two **original, untouched** logo files
(`sindhoora-logo-primary.jpg`, `sindhoora-logo-signature.jpg`) plus web crops derived from them:

| File | Used for |
|---|---|
| `sindhoora-primary.webp` | Splash screen, footer, admin login |
| `sindhoora-wordmark.webp` | Desktop & mobile navbar, admin sidebar |
| `sindhoora-signature.webp` | About page (shown large so the tagline stays legible) |
| `sindhoora-emblem.webp` | Loading state |
| `favicon.png`, `apple-touch-icon.png` | Browser icons |

The crops have the black background made transparent so they sit cleanly on any dark surface.
Regenerate them with `python scripts/generate_brand_assets.py` (requires Pillow).

## Images

Product and editorial photos are free Unsplash images, all defined in `src/data/images.ts` and served
through Unsplash's CDN with responsive `srcset` sizes. Replace them with the business's own photography
before launch.

## Notes

- Contact details, founder story and policy text are placeholder copy — replace with the business's own.
- Cart, wishlist, admin session and mock database persist in `localStorage`; the splash plays once per browser session (`sessionStorage`).
- When deploying the built `dist/`, configure the host to serve `index.html` for unknown paths (SPA routing).

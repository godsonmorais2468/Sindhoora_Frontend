import { Link, useSearchParams } from 'react-router-dom';
import { m } from 'framer-motion';
import { Check, PackageSearch } from 'lucide-react';
import { EmptyState } from '@/components/common/EmptyState';
import { SmartImage } from '@/components/common/SmartImage';
import { ButtonLink } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { paymentMethodLabel } from '@/data/statuses';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useQuery } from '@/hooks/useQuery';
import { getOrder } from '@/services/ordersService';
import { formatINR } from '@/utils/currency';
import { formatDateTime } from '@/utils/formatters';

export default function OrderSuccess() {
  useDocumentTitle('Order Confirmed');
  const [params] = useSearchParams();
  const orderId = params.get('id') ?? '';
  const { data: order, isLoading } = useQuery(`order:${orderId}`, () => getOrder(orderId));

  return (
    <section className="min-h-screen bg-ivory-50 pb-24 text-charcoal">
      <div className="bg-ink-950 pt-28 pb-14 text-center text-cream lg:pt-36 lg:pb-20">
        <m.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto flex size-16 items-center justify-center rounded-full border border-gold-500/50 text-gold-400"
        >
          <Check className="size-7" strokeWidth={1.6} aria-hidden />
        </m.div>
        <m.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="container-luxe">
          <p className="eyebrow mt-8 text-gold-300">Thank you</p>
          <h1 className="heading-display mt-4 text-[2.6rem] sm:text-6xl">Your order is confirmed</h1>
          <p className="mx-auto mt-4 max-w-md text-muted">
            A piece of Sindhoora is on its way to becoming part of your story. We will be in touch shortly to confirm delivery.
          </p>
        </m.div>
      </div>

      <div className="container-luxe -mt-6 max-w-2xl">
        {isLoading ? (
          <div className="skeleton h-80 w-full" />
        ) : !order ? (
          <div className="rounded-sm border border-line bg-white">
            <EmptyState
              icon={PackageSearch}
              title="Order not found"
              description="We could not find that order reference. If you have just placed an order, check your bag or contact us."
              action={<ButtonLink to="/shop" variant="dark">Continue shopping</ButtonLink>}
            />
          </div>
        ) : (
          <div className="rounded-sm border border-line bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-6">
              <div>
                <p className="text-[13px] text-taupe">Order reference</p>
                <p className="mt-1 text-xl font-medium tracking-wide">{order.id}</p>
                <p className="mt-1 text-[13px] text-taupe">{formatDateTime(order.createdAt)}</p>
              </div>
              <StatusBadge kind="order" status={order.status} />
            </div>

            <ul className="divide-y divide-line">
              {order.items.map((item) => (
                <li key={item.productId} className="flex items-center gap-4 py-4">
                  <SmartImage src={item.image} alt="" aspectRatio={4 / 5} widths={[120]} sizes="56px" fade={false} className="aspect-[4/5] w-14 rounded-sm bg-ink-800 object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px]">{item.name}</p>
                    <p className="text-[13px] text-taupe">Qty {item.quantity}</p>
                  </div>
                  <p className="text-[15px] tabular-nums">{formatINR(item.price * item.quantity)}</p>
                </li>
              ))}
            </ul>

            <dl className="space-y-2 border-t border-line pt-5 text-[15px]">
              <div className="flex justify-between">
                <dt className="text-taupe">Subtotal</dt>
                <dd className="tabular-nums">{formatINR(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-taupe">Insured shipping</dt>
                <dd className="tabular-nums">{order.shipping === 0 ? 'Complimentary' : formatINR(order.shipping)}</dd>
              </div>
              <div className="flex justify-between pt-2 text-base font-semibold">
                <dt>Total</dt>
                <dd className="tabular-nums">{formatINR(order.total)}</dd>
              </div>
            </dl>

            <div className="mt-6 grid gap-6 rounded-sm bg-ivory p-5 text-sm sm:grid-cols-2">
              <div>
                <p className="eyebrow text-gold-700">Delivering to</p>
                <p className="mt-2 leading-relaxed">
                  {order.shippingAddress.fullName}
                  <br />
                  {order.shippingAddress.line1}
                  <br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
                </p>
              </div>
              <div>
                <p className="eyebrow text-gold-700">Payment</p>
                <p className="mt-2">{paymentMethodLabel[order.paymentMethod]}</p>
                <p className="mt-1 text-[13px] text-taupe">Prototype order — no payment was taken.</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink to="/shop" variant="dark" className="flex-1">
                Continue shopping
              </ButtonLink>
              <ButtonLink to="/contact" variant="outline-dark" className="flex-1">
                Need help?
              </ButtonLink>
            </div>
          </div>
        )}
        <p className="mt-6 text-center text-[13px] text-taupe">
          Store owner? <Link to="/admin/orders" className="underline underline-offset-4 hover:text-charcoal">See this order in the admin panel</Link>.
        </p>
      </div>
    </section>
  );
}

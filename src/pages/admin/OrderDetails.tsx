import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Check, CircleX, Mail, MapPin, PackageSearch, Phone, User } from 'lucide-react';
import { AdminCard, AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { SmartImage } from '@/components/common/SmartImage';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Select } from '@/components/ui/FormControls';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ORDER_STATUSES, paymentMethodLabel } from '@/data/statuses';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { invalidateQueries, useQuery } from '@/hooks/useQuery';
import { useToast } from '@/hooks/useToast';
import { getCustomer } from '@/services/customersService';
import { getOrder, updateOrderStatus, updatePaymentStatus } from '@/services/ordersService';
import type { Order, OrderStatus } from '@/types/order';
import { formatINR } from '@/utils/currency';
import { formatDateTime, formatPhone } from '@/utils/formatters';
import { cn } from '@/utils/helpers';

const FLOW: OrderStatus[] = ['pending', 'confirmed', 'packed', 'shipped', 'delivered'];

function StatusTimeline({ status }: { status: OrderStatus }) {
  if (status === 'cancelled') {
    return (
      <p className="flex items-center gap-2 rounded-md bg-red-50 px-4 py-3 text-sm text-danger">
        <CircleX className="size-4" aria-hidden /> This order was cancelled. Reserved stock has been returned to inventory.
      </p>
    );
  }
  const current = FLOW.indexOf(status);
  return (
    <ol className="grid grid-cols-5 gap-1" aria-label="Order progress">
      {FLOW.map((step, i) => {
        const done = i <= current;
        return (
          <li key={step} className="flex flex-col items-center gap-2 text-center" aria-current={i === current ? 'step' : undefined}>
            <div className="relative flex w-full items-center justify-center">
              {i > 0 && <span className={cn('absolute right-1/2 h-0.5 w-full', i <= current ? 'bg-gold-500' : 'bg-line')} aria-hidden />}
              <span
                className={cn(
                  'relative flex size-7 items-center justify-center rounded-full border-2 text-xs',
                  done ? 'border-gold-500 bg-gold-500 text-ink-950' : 'border-line bg-white text-taupe',
                )}
              >
                {done ? <Check className="size-3.5" strokeWidth={3} aria-hidden /> : i + 1}
              </span>
            </div>
            <span className={cn('text-[11px] capitalize sm:text-xs', done ? 'font-medium text-charcoal' : 'text-taupe')}>{step}</span>
          </li>
        );
      })}
    </ol>
  );
}

export default function OrderDetails() {
  const { id = '' } = useParams();
  const { data: order, isLoading } = useQuery(`admin:order:${id}`, () => getOrder(id));
  useDocumentTitle(`Order ${id} · Admin`);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-8 w-56" />
        <div className="skeleton h-72 w-full" />
      </div>
    );
  }
  if (!order) {
    return (
      <EmptyState
        icon={PackageSearch}
        title="Order not found"
        description={`We couldn't find an order with the reference ${id}.`}
        action={<ButtonLink to="/admin/orders" variant="dark">Back to orders</ButtonLink>}
      />
    );
  }
  return <OrderView key={order.id + order.updatedAt} order={order} />;
}

function OrderView({ order }: { order: Order }) {
  const toast = useToast();
  const { data: customer } = useQuery(`admin:customer:${order.customerId}`, () => getCustomer(order.customerId));
  const [nextStatus, setNextStatus] = useState<OrderStatus>(order.status);
  const [saving, setSaving] = useState(false);

  async function saveStatus() {
    setSaving(true);
    try {
      const updated = await updateOrderStatus(order.id, nextStatus);
      invalidateQueries('admin');
      invalidateQueries('product');
      toast({ title: 'Order updated', description: `${updated.id} is now ${nextStatus}.` });
    } catch (err) {
      toast({ title: 'Could not update order', description: err instanceof Error ? err.message : undefined, tone: 'error' });
      setSaving(false);
    }
  }

  async function markPaid() {
    await updatePaymentStatus(order.id, 'paid');
    invalidateQueries('admin');
    toast({ title: 'Payment recorded', description: `${order.id} marked as paid.` });
  }

  const address = order.shippingAddress;

  return (
    <>
      <AdminPageHeader
        title={`Order ${order.id}`}
        description={`Placed ${formatDateTime(order.createdAt)}`}
        back={{ to: '/admin/orders', label: 'Orders' }}
        actions={
          <div className="flex flex-wrap gap-2">
            <StatusBadge kind="order" status={order.status} />
            <StatusBadge kind="payment" status={order.paymentStatus} />
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <AdminCard title="Fulfilment" bodyClassName="p-5 space-y-6">
            <StatusTimeline status={order.status} />
            <div className="flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-end">
              <Select
                label="Update order status"
                value={nextStatus}
                onChange={(e) => setNextStatus(e.target.value as OrderStatus)}
                options={ORDER_STATUSES.map((s) => ({ value: s.value, label: s.label }))}
                wrapperClassName="sm:w-64"
              />
              <Button variant="dark" onClick={saveStatus} loading={saving} disabled={nextStatus === order.status}>
                Save status
              </Button>
            </div>
            <p className="text-[13px] text-taupe">
              Cancelling returns reserved stock to inventory. Delivering a cash-on-delivery order marks it as paid. Last updated {formatDateTime(order.updatedAt)}.
            </p>
          </AdminCard>

          <AdminCard title={`Items (${order.items.reduce((n, i) => n + i.quantity, 0)})`}>
            <ul className="divide-y divide-line">
              {order.items.map((item) => (
                <li key={item.productId} className="flex items-center gap-4 px-5 py-4">
                  <SmartImage src={item.image} alt="" aspectRatio={1} widths={[120]} sizes="56px" fade={false} className="size-14 shrink-0 rounded bg-ink-800 object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-[13px] text-taupe">
                      {item.sku} · {formatINR(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium tabular-nums">{formatINR(item.price * item.quantity)}</p>
                </li>
              ))}
            </ul>
            <dl className="space-y-2 border-t border-line px-5 py-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-taupe">Subtotal</dt>
                <dd className="tabular-nums">{formatINR(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-taupe">Shipping</dt>
                <dd className="tabular-nums">{order.shipping === 0 ? 'Free' : formatINR(order.shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-3 text-base font-semibold">
                <dt>Total</dt>
                <dd className="tabular-nums">{formatINR(order.total)}</dd>
              </div>
            </dl>
          </AdminCard>
        </div>

        <div className="space-y-6">
          <AdminCard title="Customer" bodyClassName="p-5 space-y-3 text-sm">
            <p className="flex items-center gap-2.5 font-medium">
              <User className="size-4 text-taupe" aria-hidden />
              {customer?.name ?? address.fullName}
            </p>
            {customer && (
              <a href={`mailto:${customer.email}`} className="flex items-center gap-2.5 break-all text-taupe hover:text-charcoal">
                <Mail className="size-4 shrink-0" aria-hidden />
                {customer.email}
              </a>
            )}
            <a href={`tel:+91${address.phone}`} className="flex items-center gap-2.5 text-taupe hover:text-charcoal">
              <Phone className="size-4" aria-hidden />
              {formatPhone(address.phone)}
            </a>
            {customer && (
              <p className="border-t border-line pt-3 text-[13px] text-taupe">
                {customer.orderCount} {customer.orderCount === 1 ? 'order' : 'orders'} · {formatINR(customer.totalSpent)} lifetime
              </p>
            )}
          </AdminCard>

          <AdminCard title="Shipping address" bodyClassName="p-5 text-sm">
            <p className="flex gap-2.5 leading-relaxed">
              <MapPin className="mt-0.5 size-4 shrink-0 text-taupe" aria-hidden />
              <span>
                {address.fullName}
                <br />
                {address.line1}
                <br />
                {address.city}, {address.state} {address.pincode}
              </span>
            </p>
          </AdminCard>

          <AdminCard title="Payment" bodyClassName="p-5 text-sm space-y-3">
            <div className="flex justify-between">
              <span className="text-taupe">Method</span>
              <span>{paymentMethodLabel[order.paymentMethod]}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-taupe">Status</span>
              <StatusBadge kind="payment" status={order.paymentStatus} />
            </div>
            {order.paymentStatus === 'pending' && order.status !== 'cancelled' && (
              <Button variant="outline-dark" size="sm" className="w-full" onClick={markPaid}>
                Mark as paid
              </Button>
            )}
            <p className="text-[13px] text-taupe">Prototype — no real payment is processed.</p>
          </AdminCard>
        </div>
      </div>
    </>
  );
}

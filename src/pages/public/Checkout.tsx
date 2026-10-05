import { useState, type FormEvent, type ReactNode } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Banknote, CircleAlert, CreditCard, Lock, Smartphone, type LucideIcon } from 'lucide-react';
import { OrderSummary } from '@/components/cart/OrderSummary';
import { SmartImage } from '@/components/common/SmartImage';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/FormControls';
import { INDIAN_STATES } from '@/data/indianStates';
import { useCart } from '@/hooks/useCart';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { invalidateQueries, useQuery } from '@/hooks/useQuery';
import { createOrder } from '@/services/ordersService';
import { calculateShipping, getSettings } from '@/services/settingsService';
import type { PaymentMethod } from '@/types/order';
import { formatINR } from '@/utils/currency';
import { cn } from '@/utils/helpers';

interface CheckoutForm {
  fullName: string;
  phone: string;
  email: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
}

type Errors = Partial<Record<keyof CheckoutForm, string>>;

const emptyForm: CheckoutForm = { fullName: '', phone: '', email: '', line1: '', city: '', state: '', pincode: '' };

const paymentOptions: { value: PaymentMethod; label: string; description: string; icon: LucideIcon }[] = [
  { value: 'cod', label: 'Cash on Delivery', description: 'Pay in cash or UPI when your order arrives.', icon: Banknote },
  { value: 'upi', label: 'UPI', description: 'Google Pay, PhonePe, Paytm or any UPI app.', icon: Smartphone },
  { value: 'card', label: 'Credit / Debit Card', description: 'Visa, Mastercard, RuPay and American Express.', icon: CreditCard },
];

function validate(f: CheckoutForm): Errors {
  const e: Errors = {};
  if (f.fullName.trim().length < 2) e.fullName = 'Please enter your full name.';
  const digits = f.phone.replace(/\D/g, '');
  const local = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
  if (!/^[6-9]\d{9}$/.test(local)) e.phone = 'Enter a valid 10-digit Indian mobile number.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = 'Enter a valid email address.';
  if (f.line1.trim().length < 6) e.line1 = 'Please enter your full street address.';
  if (f.city.trim().length < 2) e.city = 'Please enter your city.';
  if (!f.state) e.state = 'Please choose your state.';
  if (!/^[1-9]\d{5}$/.test(f.pincode.trim())) e.pincode = 'Enter a valid 6-digit pincode.';
  return e;
}

function FormSection({ step, title, children }: { step: number; title: string; children: ReactNode }) {
  return (
    <section className="rounded-sm border border-line bg-white p-6 sm:p-8" aria-labelledby={`checkout-step-${step}`}>
      <h2 id={`checkout-step-${step}`} className="flex items-center gap-3 text-lg font-medium text-charcoal">
        <span className="flex size-7 items-center justify-center rounded-full bg-ink-900 text-[13px] text-cream">{step}</span>
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function Checkout() {
  useDocumentTitle('Checkout');
  const navigate = useNavigate();
  const { items, count, subtotal, clearCart } = useCart();
  const { data: settings } = useQuery('settings', getSettings);
  const [form, setForm] = useState<CheckoutForm>(emptyForm);
  const [errors, setErrors] = useState<Errors>({});
  const [payment, setPayment] = useState<PaymentMethod>('cod');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (items.length === 0 && !submitting) return <Navigate to="/cart" replace />;

  const shipping = settings ? calculateShipping(subtotal, settings) : null;
  const set = (key: keyof CheckoutForm) => (e: { target: { value: string } }) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  async function placeOrder(event: FormEvent) {
    event.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      // Move focus to the first invalid field.
      requestAnimationFrame(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const order = await createOrder({
        customer: { fullName: form.fullName, phone: form.phone, email: form.email },
        address: { line1: form.line1.trim(), city: form.city.trim(), state: form.state, pincode: form.pincode.trim() },
        paymentMethod: payment,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      });
      // Stock, orders and dashboards changed — refresh any cached views.
      invalidateQueries('product');
      invalidateQueries('admin');
      navigate(`/order-success?id=${encodeURIComponent(order.id)}`, { replace: true });
      clearCart();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHeader compact title="Checkout" breadcrumbs={[{ label: 'Bag', to: '/cart' }, { label: 'Checkout' }]} />
      <section className="bg-ivory-50 pb-24 text-charcoal">
        <form onSubmit={placeOrder} noValidate className="container-luxe grid gap-8 pt-6 lg:grid-cols-[1fr_420px] lg:gap-12 lg:pt-10">
          <div className="space-y-6">
            {submitError && (
              <div role="alert" className="flex items-start gap-3 rounded-sm border border-danger/30 bg-red-50 p-4 text-sm text-danger">
                <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
                {submitError}
              </div>
            )}

            <FormSection step={1} title="Contact information">
              <div className="grid gap-5 sm:grid-cols-2">
                <Input label="Full name" required autoComplete="name" value={form.fullName} onChange={set('fullName')} error={errors.fullName} wrapperClassName="sm:col-span-2" />
                <Input label="Mobile number" required type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="10-digit mobile" value={form.phone} onChange={set('phone')} error={errors.phone} />
                <Input label="Email" required type="email" inputMode="email" autoComplete="email" value={form.email} onChange={set('email')} error={errors.email} />
              </div>
            </FormSection>

            <FormSection step={2} title="Shipping address">
              <div className="grid gap-5 sm:grid-cols-2">
                <Input label="Address" required autoComplete="street-address" placeholder="House no., street, area" value={form.line1} onChange={set('line1')} error={errors.line1} wrapperClassName="sm:col-span-2" />
                <Input label="City" required autoComplete="address-level2" value={form.city} onChange={set('city')} error={errors.city} />
                <Select
                  label="State"
                  required
                  autoComplete="address-level1"
                  value={form.state}
                  onChange={set('state')}
                  error={errors.state}
                  options={[{ value: '', label: 'Select state' }, ...INDIAN_STATES.map((s) => ({ value: s, label: s }))]}
                />
                <Input label="Pincode" required inputMode="numeric" autoComplete="postal-code" maxLength={6} value={form.pincode} onChange={set('pincode')} error={errors.pincode} />
              </div>
            </FormSection>

            <FormSection step={3} title="Payment method">
              <fieldset>
                <legend className="sr-only">Choose a payment method</legend>
                <div className="grid gap-3">
                  {paymentOptions.map(({ value, label, description, icon: Icon }) => (
                    <label
                      key={value}
                      className={cn(
                        'flex cursor-pointer items-start gap-4 rounded-sm border p-4 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold-400',
                        payment === value ? 'border-ink-900 bg-ivory' : 'border-line hover:border-charcoal/30',
                      )}
                    >
                      <input type="radio" name="payment" value={value} checked={payment === value} onChange={() => setPayment(value)} className="sr-only" />
                      <span
                        className={cn('mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border', payment === value ? 'border-ink-900' : 'border-charcoal/30')}
                        aria-hidden
                      >
                        {payment === value && <span className="size-2.5 rounded-full bg-ink-900" />}
                      </span>
                      <span className="flex-1">
                        <span className="block text-[15px] font-medium">{label}</span>
                        <span className="mt-0.5 block text-[13px] text-taupe">{description}</span>
                      </span>
                      <Icon className="size-5 shrink-0 text-gold-700" strokeWidth={1.5} aria-hidden />
                    </label>
                  ))}
                </div>
              </fieldset>
              <p className="mt-4 flex items-start gap-2 rounded-sm bg-ivory px-3 py-2.5 text-[13px] text-taupe">
                <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                Prototype checkout — no payment is collected and no card details are requested. Your order is recorded for demonstration only.
              </p>
            </FormSection>
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <OrderSummary
              subtotal={subtotal}
              shipping={shipping}
              itemCount={count}
              title="Your order"
              items={
                <ul className="max-h-72 space-y-4 overflow-y-auto pt-2 pr-1">
                  {items.map((item) => (
                    <li key={item.productId} className="flex items-center gap-4">
                      <div className="relative w-14 shrink-0 overflow-visible rounded-sm bg-ink-800">
                        <SmartImage src={item.image} alt="" aspectRatio={4 / 5} widths={[120]} sizes="56px" fade={false} className="aspect-[4/5] w-full rounded-sm object-cover" />
                        <span className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full bg-ink-900 text-[11px] text-cream ring-2 ring-white">
                          {item.quantity}
                          <span className="sr-only"> × </span>
                        </span>
                      </div>
                      <p className="min-w-0 flex-1 text-sm leading-snug">{item.name}</p>
                      <p className="text-sm tabular-nums">{formatINR(item.price * item.quantity)}</p>
                    </li>
                  ))}
                </ul>
              }
            >
              <Button type="submit" variant="dark" size="lg" className="w-full" loading={submitting}>
                {submitting ? 'Placing order…' : 'Place order'}
              </Button>
            </OrderSummary>
          </div>
        </form>
      </section>
    </>
  );
}

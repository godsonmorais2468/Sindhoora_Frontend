import { useState, type FormEvent } from 'react';
import { RotateCcw, ShieldAlert } from 'lucide-react';
import { AdminCard, AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/FormControls';
import { useAuth } from '@/hooks/useAuth';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { invalidateQueries, useQuery } from '@/hooks/useQuery';
import { useToast } from '@/hooks/useToast';
import { resetMockDb } from '@/services/mockDb';
import { getSettings, updateSettings } from '@/services/settingsService';
import type { StoreSettings } from '@/types/common';

export default function Settings() {
  useDocumentTitle('Settings · Admin');
  const { data: settings } = useQuery('settings', getSettings);
  return (
    <>
      <AdminPageHeader title="Settings" description="Store details, shipping rules and prototype tools." />
      {settings ? (
        <SettingsForm key={JSON.stringify(settings)} initial={settings} />
      ) : (
        <div className="skeleton h-96 w-full" />
      )}
    </>
  );
}

function SettingsForm({ initial }: { initial: StoreSettings }) {
  const toast = useToast();
  const { user } = useAuth();
  const [form, setForm] = useState({
    ...initial,
    shippingFee: String(initial.shippingFee),
    freeShippingThreshold: String(initial.freeShippingThreshold),
    lowStockThreshold: String(initial.lowStockThreshold),
  });
  const [saving, setSaving] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const set = (key: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const numbersValid = [form.shippingFee, form.freeShippingThreshold, form.lowStockThreshold].every((v) => /^\d+$/.test(v.trim()));

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!numbersValid) return;
    setSaving(true);
    await updateSettings({
      storeName: form.storeName.trim(),
      supportEmail: form.supportEmail.trim(),
      supportPhone: form.supportPhone.trim(),
      address: form.address.trim(),
      shippingFee: Number(form.shippingFee),
      freeShippingThreshold: Number(form.freeShippingThreshold),
      lowStockThreshold: Number(form.lowStockThreshold),
    });
    invalidateQueries('settings');
    invalidateQueries('admin');
    toast({ title: 'Settings saved' });
    setSaving(false);
  }

  function resetDemo() {
    resetMockDb();
    invalidateQueries();
    setConfirmReset(false);
    toast({ title: 'Demo data restored', description: 'Products, orders, customers and settings are back to the original sample data.' });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <form onSubmit={save} noValidate className="space-y-6">
        <AdminCard title="Store details" bodyClassName="grid gap-5 p-5 sm:grid-cols-2">
          <Input label="Store name" value={form.storeName} onChange={set('storeName')} />
          <Input label="Support email" type="email" value={form.supportEmail} onChange={set('supportEmail')} />
          <Input label="Support phone" type="tel" value={form.supportPhone} onChange={set('supportPhone')} />
          <Input label="Address" value={form.address} onChange={set('address')} />
        </AdminCard>

        <AdminCard title="Shipping & inventory" bodyClassName="grid gap-5 p-5 sm:grid-cols-3">
          <Input label="Shipping fee (₹)" type="number" inputMode="numeric" min={0} value={form.shippingFee} onChange={set('shippingFee')} hint="Charged below the free threshold" />
          <Input label="Free shipping from (₹)" type="number" inputMode="numeric" min={0} value={form.freeShippingThreshold} onChange={set('freeShippingThreshold')} />
          <Input label="Low stock threshold" type="number" inputMode="numeric" min={0} value={form.lowStockThreshold} onChange={set('lowStockThreshold')} hint="Units at or below this are flagged" />
          {!numbersValid && <p className="text-[13px] text-danger sm:col-span-3">Shipping and stock values must be whole numbers.</p>}
        </AdminCard>

        <div className="flex justify-end">
          <Button type="submit" variant="dark" loading={saving} disabled={!numbersValid}>
            Save settings
          </Button>
        </div>
      </form>

      <div className="space-y-6">
        <AdminCard title="Admin account" bodyClassName="p-5 text-sm space-y-2">
          <p>
            <span className="text-taupe">Name:</span> {user?.name}
          </p>
          <p>
            <span className="text-taupe">Email:</span> {user?.email}
          </p>
          <p className="flex items-start gap-2 rounded-md bg-amber-50 p-3 text-[13px] text-amber-900">
            <ShieldAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
            Mock authentication for the prototype. Real accounts and passwords will be handled by the Django backend.
          </p>
        </AdminCard>

        <AdminCard title="Prototype data" bodyClassName="p-5 text-sm space-y-4">
          <p className="text-taupe">
            All changes are stored in this browser’s local storage. Restore the original sample catalogue, orders and customers at any time.
          </p>
          <Button variant="outline-dark" className="w-full" icon={<RotateCcw className="size-4" aria-hidden />} onClick={() => setConfirmReset(true)}>
            Reset demo data
          </Button>
        </AdminCard>
      </div>

      <ConfirmDialog
        open={confirmReset}
        title="Reset all demo data?"
        description="Products, orders, customers and settings will return to the original sample data. Your admin session, cart and wishlist are kept."
        confirmLabel="Reset data"
        destructive
        onConfirm={resetDemo}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
}

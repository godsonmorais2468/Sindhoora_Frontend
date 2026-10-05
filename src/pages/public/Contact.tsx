import { useState, type FormEvent } from 'react';
import { CircleCheck, Clock, Mail, MapPin, Phone } from 'lucide-react';
import { Reveal } from '@/components/common/Reveal';
import { WhatsAppIcon } from '@/components/common/SocialIcons';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/FormControls';
import { siteInfo } from '@/data/brand';
import { editorialImages } from '@/data/images';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { wait } from '@/utils/helpers';

const topics = [
  { value: 'product', label: 'A question about a piece' },
  { value: 'styling', label: 'Book a styling call' },
  { value: 'bridal', label: 'Bridal consultation' },
  { value: 'order', label: 'An existing order' },
  { value: 'other', label: 'Something else' },
];

interface FormState {
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
}

const empty: FormState = { name: '', email: '', phone: '', topic: 'product', message: '' };

function validate(form: FormState) {
  const errors: Partial<Record<keyof FormState, string>> = {};
  if (form.name.trim().length < 2) errors.name = 'Please enter your name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = 'Please enter a valid email address.';
  if (form.phone && form.phone.replace(/\D/g, '').length < 10) errors.phone = 'Please enter a 10-digit mobile number.';
  if (form.message.trim().length < 10) errors.message = 'Please share a few more details (at least 10 characters).';
  return errors;
}

export default function Contact() {
  useDocumentTitle('Contact', 'Speak with Sindhoora Jewels — styling calls, bridal consultations and product enquiries.');
  const [form, setForm] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const set = (key: keyof FormState) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function submit(event: FormEvent) {
    event.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setStatus('sending');
    await wait(700); // Prototype: nothing is sent.
    setStatus('sent');
    setForm(empty);
  }

  const contactCards = [
    { icon: Phone, label: 'Call', value: siteInfo.phone, href: `tel:${siteInfo.phone.replace(/\s/g, '')}` },
    { icon: WhatsAppIcon, label: 'WhatsApp', value: 'Chat with Soumya', href: `https://wa.me/${siteInfo.whatsapp}` },
    { icon: Mail, label: 'Email', value: siteInfo.email, href: `mailto:${siteInfo.email}` },
    { icon: MapPin, label: 'Studio', value: siteInfo.location },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="We would love to hear from you"
        description="Questions about a piece, help choosing for an occasion, or a bridal consultation — write to us and we will reply within a day."
        image={editorialImages.contact}
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Contact' }]}
      />

      <section className="bg-ivory-50 py-16 text-charcoal sm:py-24">
        <div className="container-luxe grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <h2 className="heading-display text-4xl">Speak with us</h2>
            <p className="mt-4 text-[17px] leading-relaxed text-taupe">Every enquiry is answered personally. For quick questions, WhatsApp is the fastest way to reach us.</p>
            <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {contactCards.map(({ icon: Icon, label, value, href }) => {
                const content = (
                  <>
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-gold-600/25 text-gold-700">
                      <Icon className="size-[18px]" strokeWidth={1.5} aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[13px] text-taupe">{label}</span>
                      <span className="block break-words text-[15px] text-charcoal">{value}</span>
                    </span>
                  </>
                );
                return (
                  <li key={label}>
                    {href ? (
                      <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="flex items-center gap-4 rounded-sm border border-line bg-white p-4 transition-colors hover:border-gold-600/40">
                        {content}
                      </a>
                    ) : (
                      <div className="flex items-center gap-4 rounded-sm border border-line bg-white p-4">{content}</div>
                    )}
                  </li>
                );
              })}
            </ul>
            <p className="mt-6 flex items-center gap-2 text-sm text-taupe">
              <Clock className="size-4 text-gold-600" strokeWidth={1.5} aria-hidden />
              {siteInfo.hours}
            </p>
          </Reveal>

          <Reveal className="lg:col-span-7" delay={0.1}>
            <div className="rounded-sm border border-line bg-white p-6 sm:p-10">
              {status === 'sent' ? (
                <div className="flex flex-col items-center py-12 text-center" role="status">
                  <CircleCheck className="size-12 text-gold-600" strokeWidth={1.2} aria-hidden />
                  <h2 className="heading-display mt-6 text-3xl">Thank you for writing to us</h2>
                  <p className="mt-3 max-w-sm text-taupe">We have received your message and will reply within one working day.</p>
                  <Button variant="outline-dark" className="mt-8" onClick={() => setStatus('idle')}>
                    Send another message
                  </Button>
                </div>
              ) : (
                <form onSubmit={submit} noValidate className="grid gap-5 sm:grid-cols-2">
                  <Input label="Full name" required autoComplete="name" value={form.name} onChange={set('name')} error={errors.name} />
                  <Input label="Email" type="email" required autoComplete="email" value={form.email} onChange={set('email')} error={errors.email} />
                  <Input label="Mobile number" type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} error={errors.phone} hint="Optional" />
                  <Select label="How can we help?" value={form.topic} onChange={set('topic')} options={topics} />
                  <Textarea label="Message" required rows={5} value={form.message} onChange={set('message')} error={errors.message} wrapperClassName="sm:col-span-2" />
                  <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-[13px] text-taupe">Prototype form — messages are not sent anywhere yet.</p>
                    <Button type="submit" variant="dark" size="lg" loading={status === 'sending'}>
                      Send message
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

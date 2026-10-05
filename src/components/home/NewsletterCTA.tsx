import { useState, type FormEvent } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { CircleCheck, Mail } from 'lucide-react';
import { Reveal } from '@/components/common/Reveal';
import { SmartImage } from '@/components/common/SmartImage';
import { Button } from '@/components/ui/Button';
import { editorialImages } from '@/data/images';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Prototype newsletter sign-up — nothing is sent anywhere. */
export function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    setError(null);
    setDone(true);
  }

  return (
    <section className="relative overflow-hidden bg-ink-900 py-24 sm:py-32">
      <SmartImage src={editorialImages.newsletter} alt="" aspectRatio={16 / 7} sizes="100vw" className="absolute inset-0 size-full object-cover opacity-25" />
      <div className="absolute inset-0 bg-linear-to-r from-ink-950 via-ink-950/85 to-ink-950/60" aria-hidden />

      <Reveal className="container-luxe relative">
        <div className="max-w-xl">
          <p className="eyebrow text-gold-300">The Sindhoora circle</p>
          <h2 className="heading-display mt-5 text-[2.6rem] text-cream sm:text-6xl">Begin Your Collection</h2>
          <p className="mt-5 text-base leading-relaxed text-cream/75 sm:text-lg">
            Discover pieces chosen to become part of your story. New arrivals, private previews and styling notes — a few times a month, never more.
          </p>

          <AnimatePresence mode="wait" initial={false}>
            {done ? (
              <m.p
                key="done"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-10 flex items-center gap-3 rounded-sm border border-gold-500/30 bg-gold-500/5 px-5 py-4 text-cream"
                role="status"
              >
                <CircleCheck className="size-5 shrink-0 text-gold-400" strokeWidth={1.6} aria-hidden />
                Thank you — you’re on the list. Welcome to Sindhoora.
              </m.p>
            ) : (
              <m.form key="form" onSubmit={submit} noValidate exit={{ opacity: 0, y: -8 }} className="mt-10">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <div className="relative flex-1">
                    <Mail className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted" aria-hidden />
                    <input
                      id="newsletter-email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      aria-invalid={error ? true : undefined}
                      aria-describedby={error ? 'newsletter-error' : undefined}
                      className="h-12 w-full rounded-sm border border-white/15 bg-white/[0.04] pr-4 pl-11 text-[15px] text-cream outline-none placeholder:text-muted/80 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/15"
                    />
                  </div>
                  <Button type="submit" variant="gold" size="lg">
                    Stay Connected
                  </Button>
                </div>
                {error && (
                  <p id="newsletter-error" className="mt-2 text-[13px] text-red-300">
                    {error}
                  </p>
                )}
                <p className="mt-3 text-[13px] text-muted">We respect your inbox. Unsubscribe any time.</p>
              </m.form>
            )}
          </AnimatePresence>
        </div>
      </Reveal>
    </section>
  );
}

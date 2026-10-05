import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { m } from 'framer-motion';
import { ArrowLeft, CircleAlert, Eye, EyeOff, FlaskConical } from 'lucide-react';
import { BrandLogo } from '@/components/common/BrandLogo';
import { Button } from '@/components/ui/Button';
import { Checkbox, Input } from '@/components/ui/FormControls';
import { useAuth } from '@/hooks/useAuth';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { DEMO_CREDENTIALS } from '@/services/authService';

export default function AdminLogin() {
  useDocumentTitle('Admin Login');
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to={from} replace />;

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await login(email, password, remember);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.');
      setSubmitting(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 px-4 py-12 gold-glow">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_40%_at_50%_0%,rgb(201_162_77/0.08),transparent_70%)]" aria-hidden />

      <m.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-lg border border-gold-500/15 bg-ink-900/90 p-7 shadow-2xl shadow-black/60 sm:p-10">
          <BrandLogo variant="primary" priority className="mx-auto w-40 sm:w-44" />
          <div className="mt-8 text-center">
            <h1 className="text-xl font-semibold text-cream">Store admin</h1>
            <p className="mt-1.5 text-sm text-muted">Sign in to manage products, orders and inventory.</p>
          </div>

          {error && (
            <div role="alert" className="mt-6 flex items-start gap-2.5 rounded-md border border-red-400/30 bg-red-500/10 px-3.5 py-3 text-sm text-red-200">
              <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
              {error}
            </div>
          )}

          <form onSubmit={submit} noValidate className="mt-7 space-y-5">
            <Input tone="dark" label="Email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
            <div className="relative">
              <Input
                tone="dark"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-1 bottom-0.5 flex size-10 items-center justify-center rounded-md text-muted hover:text-cream"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <Checkbox tone="dark" label="Remember me on this device" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            <Button type="submit" variant="gold" size="lg" className="w-full" loading={submitting}>
              Sign in
            </Button>
          </form>

          <div className="mt-7 rounded-md border border-white/10 bg-white/[0.03] p-4 text-[13px] text-muted">
            <p className="flex items-center gap-2 font-medium text-cream/85">
              <FlaskConical className="size-4 text-gold-400" aria-hidden /> Prototype — mock authentication
            </p>
            <p className="mt-1.5 leading-relaxed">
              This is not secure sign-in. Use the demo account <span className="text-cream">{DEMO_CREDENTIALS.email}</span> /{' '}
              <span className="text-cream">{DEMO_CREDENTIALS.password}</span>.
            </p>
            <button
              type="button"
              onClick={() => {
                setEmail(DEMO_CREDENTIALS.email);
                setPassword(DEMO_CREDENTIALS.password);
                setError(null);
              }}
              className="mt-2.5 font-medium text-gold-300 underline-offset-4 hover:underline"
            >
              Fill demo credentials
            </button>
          </div>
        </div>

        <Link to="/" className="mt-6 flex items-center justify-center gap-2 text-sm text-muted transition-colors hover:text-cream">
          <ArrowLeft className="size-4" aria-hidden /> Back to the store
        </Link>
      </m.div>
    </main>
  );
}

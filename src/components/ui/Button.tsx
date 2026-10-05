import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { LoaderCircle } from 'lucide-react';
import { cn } from '@/utils/helpers';

export type ButtonVariant = 'gold' | 'dark' | 'light' | 'outline' | 'outline-dark' | 'ghost' | 'ghost-dark' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

const base =
  'inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-sm font-medium transition-[background-color,border-color,color,transform] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50';

const variants: Record<ButtonVariant, string> = {
  /** Primary CTA on dark surfaces. */
  gold: 'bg-gold-500 text-ink-950 hover:bg-gold-400',
  /** Primary CTA on light surfaces. */
  dark: 'bg-ink-900 text-cream hover:bg-ink-700',
  light: 'bg-cream text-ink-950 hover:bg-white',
  /** Secondary on dark surfaces. */
  outline: 'border border-cream/25 text-cream hover:border-gold-400 hover:text-gold-300',
  /** Secondary on light surfaces. */
  'outline-dark': 'border border-charcoal/20 text-charcoal hover:border-charcoal/60',
  ghost: 'text-cream/80 hover:bg-white/5 hover:text-cream',
  'ghost-dark': 'text-charcoal/80 hover:bg-black/[0.04] hover:text-charcoal',
  danger: 'bg-danger text-white hover:bg-danger/90',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-[13px]',
  md: 'h-11 px-6 text-sm',
  lg: 'h-12 px-8 text-sm tracking-[0.06em] uppercase',
  icon: 'size-10',
};

export function buttonClasses(variant: ButtonVariant = 'gold', size: ButtonSize = 'md', className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, loading, icon, className, children, disabled, type = 'button', ...rest },
  ref,
) {
  return (
    <button ref={ref} type={type} disabled={disabled || loading} className={buttonClasses(variant, size, className)} {...rest}>
      {loading ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : icon}
      {children}
    </button>
  );
});

interface ButtonLinkProps extends LinkProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
}

export function ButtonLink({ variant, size, icon, className, children, ...rest }: ButtonLinkProps) {
  return (
    <Link className={buttonClasses(variant, size, typeof className === 'string' ? className : undefined)} {...rest}>
      {children}
      {icon}
    </Link>
  );
}

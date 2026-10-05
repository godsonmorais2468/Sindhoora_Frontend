import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/utils/helpers';

type Tone = 'light' | 'dark';

const controlBase =
  'w-full rounded-sm border bg-transparent px-3.5 text-[15px] transition-colors duration-150 outline-none disabled:cursor-not-allowed disabled:opacity-60';

const controlTone: Record<Tone, string> = {
  light:
    'border-line bg-white text-charcoal placeholder:text-taupe/70 hover:border-charcoal/30 focus:border-gold-600 focus:ring-2 focus:ring-gold-500/15',
  dark: 'border-white/15 bg-white/[0.03] text-cream placeholder:text-muted/70 hover:border-white/30 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/15',
};

// The aria-invalid variant adds an attribute selector, so these reliably override the tone's border colours.
const errorClasses = 'aria-invalid:border-danger/70 aria-invalid:focus:border-danger aria-invalid:focus:ring-danger/15';

interface FieldProps {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  tone?: Tone;
  className?: string;
  children: (props: { id: string; describedBy?: string; invalid: boolean }) => ReactNode;
}

/** Label + control + hint/error, wired up with the right ids and aria attributes. */
export function Field({ label, hint, error, required, tone = 'light', className, children }: FieldProps) {
  const id = useId();
  const hintId = hint || error ? `${id}-desc` : undefined;
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={id} className={cn('text-[13px] font-medium', tone === 'dark' ? 'text-cream/90' : 'text-charcoal/85')}>
          {label}
          {required && <span className="ml-0.5 text-gold-600" aria-hidden>*</span>}
        </label>
      )}
      {children({ id, describedBy: hintId, invalid: Boolean(error) })}
      {(error || hint) && (
        <p id={hintId} className={cn('text-[13px]', error ? 'text-danger' : tone === 'dark' ? 'text-muted' : 'text-taupe')}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
}

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  hint?: string;
  error?: string;
  tone?: Tone;
  wrapperClassName?: string;
  leading?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, tone = 'light', wrapperClassName, className, leading, required, ...rest },
  ref,
) {
  return (
    <Field label={label} hint={hint} error={error} required={required} tone={tone} className={wrapperClassName}>
      {({ id, describedBy, invalid }) => (
        <div className="relative">
          {leading && (
            <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-taupe/80">{leading}</span>
          )}
          <input
            ref={ref}
            id={id}
            required={required}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            className={cn(controlBase, controlTone[tone], 'h-11', leading ? 'pl-10' : undefined, invalid && errorClasses, className)}
            {...rest}
          />
        </div>
      )}
    </Field>
  );
});

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  tone?: Tone;
  wrapperClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, tone = 'light', wrapperClassName, className, required, rows = 4, ...rest },
  ref,
) {
  return (
    <Field label={label} hint={hint} error={error} required={required} tone={tone} className={wrapperClassName}>
      {({ id, describedBy, invalid }) => (
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          required={required}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className={cn(controlBase, controlTone[tone], 'py-2.5 leading-relaxed', invalid && errorClasses, className)}
          {...rest}
        />
      )}
    </Field>
  );
});

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  tone?: Tone;
  wrapperClassName?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, error, tone = 'light', wrapperClassName, className, options, required, ...rest },
  ref,
) {
  return (
    <Field label={label} hint={hint} error={error} required={required} tone={tone} className={wrapperClassName}>
      {({ id, describedBy, invalid }) => (
        <div className="relative">
          <select
            ref={ref}
            id={id}
            required={required}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            className={cn(controlBase, controlTone[tone], 'h-11 appearance-none pr-10', invalid && errorClasses, className)}
            {...rest}
          >
            {options.map((o) => (
              <option key={o.value} value={o.value} className="bg-white text-charcoal">
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className={cn('pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2', tone === 'dark' ? 'text-muted' : 'text-taupe')}
            aria-hidden
          />
        </div>
      )}
    </Field>
  );
});

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode;
  description?: string;
  tone?: Tone;
}

export function Checkbox({ label, description, tone = 'light', className, ...rest }: CheckboxProps) {
  const id = useId();
  return (
    <label htmlFor={id} className={cn('group flex cursor-pointer items-start gap-3', className)}>
      <span className="relative mt-0.5 flex size-[18px] shrink-0">
        <input id={id} type="checkbox" className="peer absolute inset-0 cursor-pointer opacity-0" {...rest} />
        <span
          className={cn(
            'pointer-events-none flex size-[18px] items-center justify-center rounded-[3px] border transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold-400',
            tone === 'dark'
              ? 'border-white/30 peer-checked:border-gold-500 peer-checked:bg-gold-500'
              : 'border-charcoal/30 peer-checked:border-ink-900 peer-checked:bg-ink-900',
          )}
        />
        <Check
          className={cn(
            'pointer-events-none absolute inset-0 m-auto size-3 opacity-0 transition-opacity peer-checked:opacity-100',
            tone === 'dark' ? 'text-ink-950' : 'text-white',
          )}
          strokeWidth={3}
          aria-hidden
        />
      </span>
      <span className="flex flex-col">
        <span className={cn('text-sm', tone === 'dark' ? 'text-cream/90' : 'text-charcoal')}>{label}</span>
        {description && <span className={cn('text-[13px]', tone === 'dark' ? 'text-muted' : 'text-taupe')}>{description}</span>}
      </span>
    </label>
  );
}

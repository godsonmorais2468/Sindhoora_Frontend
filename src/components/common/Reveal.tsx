import type { ReactNode } from 'react';
import { m } from 'framer-motion';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Vertical travel in px. */
  y?: number;
  as?: 'div' | 'section' | 'li' | 'article';
}

/**
 * Fades content up once when it scrolls into view.
 * Use on section-level blocks — not on every item of a long list.
 * Reduced-motion users get the opacity change only (handled by <MotionConfig reducedMotion="user">).
 */
export function Reveal({ children, className, delay = 0, y = 24, as = 'div' }: RevealProps) {
  const Component = m[as];
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2, margin: '0px 0px -40px 0px' }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  );
}

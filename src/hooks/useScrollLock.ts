import { useEffect } from 'react';

let lockCount = 0;

/** Prevents background scrolling while a modal, drawer or overlay is open. Supports nesting. */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    lockCount += 1;
    if (lockCount === 1) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    return () => {
      lockCount -= 1;
      if (lockCount === 0) {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      }
    };
  }, [locked]);
}

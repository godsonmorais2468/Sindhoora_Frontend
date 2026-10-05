import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Scrolls to the top on route changes (but not when only the query string changes, e.g. shop filters). */
export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

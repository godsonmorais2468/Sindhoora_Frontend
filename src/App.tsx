import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AnimatePresence, domAnimation, LazyMotion, MotionConfig } from 'framer-motion';
import { SplashScreen } from '@/components/common/SplashScreen';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { IntroContext } from '@/context/IntroContext';
import { ToastProvider } from '@/context/ToastContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { AppRoutes } from '@/routes/AppRoutes';
import { readStorage, STORAGE_KEYS, writeStorage } from '@/utils/storage';

/**
 * Plays the brand splash once per browser session (sessionStorage), never on admin pages.
 * The site renders underneath straight away so images start loading during the splash.
 */
function SplashGate({ children }: { children: ReactNode }) {
  const [showSplash, setShowSplash] = useState(
    () => !readStorage(STORAGE_KEYS.splashSeen, false, 'session') && !window.location.pathname.startsWith('/admin'),
  );
  const [introReady, setIntroReady] = useState(!showSplash);

  useEffect(() => {
    // Mark as seen immediately, so a refresh mid-splash doesn't replay it.
    if (showSplash) writeStorage(STORAGE_KEYS.splashSeen, true, 'session');
  }, [showSplash]);

  const handleDone = useCallback(() => {
    setShowSplash(false);
    setIntroReady(true);
  }, []);

  return (
    <IntroContext.Provider value={introReady}>
      {children}
      <AnimatePresence>{showSplash && <SplashScreen key="splash" onDone={handleDone} />}</AnimatePresence>
    </IntroContext.Provider>
  );
}

export default function App() {
  return (
    // reducedMotion="user": transform animations are skipped for people who prefer reduced motion.
    <MotionConfig reducedMotion="user">
      {/* LazyMotion + `m` components keep Framer Motion's bundle cost small. */}
      <LazyMotion features={domAnimation} strict>
        <BrowserRouter>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <ToastProvider>
                  <SplashGate>
                    <AppRoutes />
                  </SplashGate>
                </ToastProvider>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </BrowserRouter>
      </LazyMotion>
    </MotionConfig>
  );
}

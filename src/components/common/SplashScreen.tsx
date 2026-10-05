import { useEffect, useState } from 'react';
import { m, useReducedMotion, type Variants } from 'framer-motion';
import { brandAssets, primaryLogoBands } from '@/data/brand';
import { useScrollLock } from '@/hooks/useScrollLock';

const EASE = [0.22, 1, 0.36, 1] as const;

/** Clip the single logo image to one horizontal band, so each part can be revealed in turn. */
function bandClip([top, bottom]: readonly [number, number]) {
  return `inset(${top}% 0 ${100 - bottom}% 0)`;
}

const layers = [
  { key: 'emblem', band: primaryLogoBands.emblem, delay: 0, y: 10, scale: 0.94, duration: 0.95 },
  { key: 'wordmark', band: primaryLogoBands.wordmark, delay: 0.55, y: 12, scale: 1, duration: 0.7 },
  { key: 'jewels', band: primaryLogoBands.jewels, delay: 0.78, y: 10, scale: 1, duration: 0.7 },
  { key: 'ornament', band: primaryLogoBands.ornament, delay: 0.95, y: 6, scale: 1, duration: 0.6 },
] as const;

interface SplashScreenProps {
  /** Called when the reveal has finished and the splash should start fading out. */
  onDone: () => void;
}

/**
 * First-visit brand moment: black screen → gold emblem → SINDHOORA → JEWELS → homepage.
 * Built from the provided primary logo (clipped into bands), animated with opacity/transform only.
 */
export function SplashScreen({ onDone }: SplashScreenProps) {
  const reduceMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  useScrollLock(true);

  // Don't start the sequence until the logo is decoded, so nothing animates in empty.
  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.src = brandAssets.primary.src;
    const markReady = () => !cancelled && setReady(true);
    img.decode().then(markReady, markReady);
    const fallback = window.setTimeout(markReady, 1200);
    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const id = window.setTimeout(onDone, reduceMotion ? 700 : 1750);
    return () => window.clearTimeout(id);
  }, [ready, reduceMotion, onDone]);

  const state = ready ? 'shown' : 'hidden';

  return (
    <m.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-950"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: reduceMotion ? 0.3 : 0.65, ease: EASE } }}
      aria-hidden
    >
      {/* Static warm glow — a gradient, not a blur filter. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_35%_at_50%_45%,rgb(201_162_77/0.09),transparent_70%)]" />

      <m.div
        className="relative w-[min(70vw,400px)]"
        style={{ aspectRatio: `${brandAssets.primary.width} / ${brandAssets.primary.height}` }}
        exit={{ scale: reduceMotion ? 1 : 1.03, transition: { duration: 0.65, ease: EASE } }}
      >
        {reduceMotion ? (
          <m.img
            src={brandAssets.primary.src}
            alt=""
            className="absolute inset-0 size-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: ready ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          />
        ) : (
          <>
            {layers.map((layer) => {
              const variants: Variants = {
                hidden: { opacity: 0, y: layer.y, scale: layer.scale },
                shown: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: layer.duration, delay: 0.15 + layer.delay, ease: EASE },
                },
              };
              return (
                <m.img
                  key={layer.key}
                  src={brandAssets.primary.src}
                  alt=""
                  draggable={false}
                  className="absolute inset-0 size-full will-change-transform"
                  style={{ clipPath: bandClip(layer.band), transformOrigin: '50% 30%' }}
                  variants={variants}
                  initial="hidden"
                  animate={state}
                />
              );
            })}

            {/* A single pass of soft champagne light, masked to the logo artwork. */}
            <div className="splash-shimmer pointer-events-none absolute inset-0 overflow-hidden">
              <m.div
                className="absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-transparent via-champagne/60 to-transparent"
                style={{ skewX: -18 }}
                initial={{ x: '-110%' }}
                animate={ready ? { x: '320%' } : { x: '-110%' }}
                transition={{ duration: 1.0, delay: 0.95, ease: [0.45, 0, 0.25, 1] }}
              />
            </div>
          </>
        )}
      </m.div>
    </m.div>
  );
}

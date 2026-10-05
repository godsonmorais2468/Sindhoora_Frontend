import { createContext } from 'react';

/**
 * `true` once the splash screen has finished (or was skipped).
 * The hero waits for this so its entrance plays as the splash lifts, not behind it.
 */
export const IntroContext = createContext(true);

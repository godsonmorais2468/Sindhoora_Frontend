import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react';
import * as authService from '@/services/authService';
import type { AdminUser } from '@/types/common';

export interface AuthValue {
  user: AdminUser | null;
  login: (email: string, password: string, remember: boolean) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthValue | null>(null);

/** Mock admin authentication state — see the warning in `services/authService.ts`. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(() => authService.getSession());

  const login = useCallback(async (email: string, password: string, remember: boolean) => {
    setUser(await authService.login(email, password, remember));
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * MOCK AUTHENTICATION — PROTOTYPE ONLY.
 *
 * The credentials below ship in the client bundle and the "session" is a flag in
 * Web Storage. This is NOT secure and only exists to demonstrate the admin flow.
 * Replace with Django authentication (session or JWT via DRF) before any real use.
 */
import type { AdminUser } from '@/types/common';
import { readStorage, removeStorage, STORAGE_KEYS, writeStorage } from '@/utils/storage';
import { networkDelay } from './mockDb';

export const DEMO_CREDENTIALS = {
  email: 'admin@sindhoora.com',
  password: 'admin123',
} as const;

const demoUser: AdminUser = { email: DEMO_CREDENTIALS.email, name: 'Soumya', role: 'owner' };

export function getSession(): AdminUser | null {
  return readStorage<AdminUser | null>(STORAGE_KEYS.auth, null, 'local') ?? readStorage<AdminUser | null>(STORAGE_KEYS.auth, null, 'session');
}

export async function login(email: string, password: string, remember: boolean): Promise<AdminUser> {
  await networkDelay(600);
  const valid = email.trim().toLowerCase() === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password;
  if (!valid) throw new Error('The email or password is incorrect.');
  // "Remember me" keeps the mock session across browser restarts; otherwise it ends with the tab.
  writeStorage(STORAGE_KEYS.auth, demoUser, remember ? 'local' : 'session');
  return demoUser;
}

export async function logout(): Promise<void> {
  removeStorage(STORAGE_KEYS.auth, 'local');
  removeStorage(STORAGE_KEYS.auth, 'session');
}

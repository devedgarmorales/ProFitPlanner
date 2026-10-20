import { MMKV } from 'react-native-mmkv';
import { ScopeData } from '../interfaces/client';
const storage = new MMKV({ id: 'client-workouts-v1' });
export const emptyScope = (): ScopeData => ({
  routines: [],
  workouts: [],
  history: [],
});
export const scopeKey = (user: string, organization: string) =>
  `${user}:${organization}`;
export function readScope(key: string): ScopeData {
  const value = storage.getString(key);
  if (!value) {
    return emptyScope();
  }
  try {
    return JSON.parse(value) as ScopeData;
  } catch {
    throw new Error('No se pudo leer el avance local. No se sobrescribió.');
  }
}
export function writeScope(key: string, value: ScopeData) {
  storage.set(key, JSON.stringify(value));
}
export function saveIdentity(user: unknown, memberships: unknown) {
  storage.set('identity', JSON.stringify({ user, memberships }));
}
export function readIdentity(): string | undefined {
  return storage.getString('identity');
}
export function clearIdentity() {
  storage.delete('identity');
}

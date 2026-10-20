import {NativeModules} from 'react-native';
import {MMKV} from 'react-native-mmkv';

export interface AuthTokens {
  access: string;
  refresh: string;
}

interface CredentialModule {
  get(): Promise<string | null>;
  set(value: string): Promise<void>;
  clear(): Promise<void>;
}

function nativeStorage(): CredentialModule {
  const storage = NativeModules.ProfitCredentialStorage as CredentialModule | undefined;
  if (!storage) {
    throw new Error('Secure credential storage is unavailable. Rebuild the native app.');
  }
  return storage;
}

let legacyCleared = false;
function clearLegacyTokens(): void {
  if (!legacyCleared) {
    new MMKV().delete('auth_tokens');
    legacyCleared = true;
  }
}

export async function getTokens(): Promise<AuthTokens | null> {
  clearLegacyTokens();
  const value = await nativeStorage().get();
  if (!value) {
    return null;
  }
  try {
    const tokens: unknown = JSON.parse(value);
    if (
      typeof tokens === 'object' && tokens !== null &&
      'access' in tokens && typeof tokens.access === 'string' && tokens.access &&
      'refresh' in tokens && typeof tokens.refresh === 'string' && tokens.refresh
    ) {
      return {access: tokens.access, refresh: tokens.refresh};
    }
  } catch {
    // Corrupted credentials must never fall back to legacy plaintext storage.
  }
  await nativeStorage().clear();
  return null;
}

export async function setTokens(tokens: AuthTokens): Promise<void> {
  if (!tokens.access || !tokens.refresh) {
    throw new Error('Both access and refresh tokens are required.');
  }
  clearLegacyTokens();
  await nativeStorage().set(JSON.stringify(tokens));
}

export async function clearTokens(): Promise<void> {
  clearLegacyTokens();
  await nativeStorage().clear();
}

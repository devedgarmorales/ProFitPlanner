import axios, {AxiosRequestConfig} from 'axios';
import Config from 'react-native-config';
import {clearTokens, getTokens, setTokens} from './credentialStorage';
import {Tokens} from '../interfaces/client';

const baseURL =
  Config.BASE_URL_API || (__DEV__ ? 'http://127.0.0.1:8000/api/' : '');
const transport = axios.create({baseURL, timeout: 15000});
let refreshFlight: Promise<Tokens> | undefined;
let authenticationExpired = () => {};
let authGeneration = 0;
export function onAuthenticationExpired(listener: () => void) {
  authenticationExpired = listener;
}
export function invalidateAuthentication() {
  authGeneration += 1;
  refreshFlight = undefined;
}
export function unwrap<T>(value: unknown): T {
  const envelope = value as {data?: T; status?: number};
  return (
    envelope && typeof envelope.status === 'number' && 'data' in envelope
      ? envelope.data
      : value
  ) as T;
}
export function listResults<T>(value: unknown): T[] {
  const data = unwrap<T[] | {results: T[]}>(value);
  return Array.isArray(data) ? data : data.results;
}
export function apiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'Sin conexión con el servidor. El avance local se conserva.';
    }
    if (error.response.status === 401) {
      return 'La sesión expiró. Inicia sesión nuevamente.';
    }
    if (error.response.status === 403) {
      return 'No tienes acceso a esta organización o recurso.';
    }
    const body = error.response.data;
    const details = body?.data || body;
    if (typeof details?.detail === 'string') {
      return details.detail;
    }
    return `No se pudo completar la operación (${error.response.status}). Revisa los datos o vuelve a intentar.`;
  }
  return error instanceof Error
    ? error.message
    : 'Ocurrió un error inesperado.';
}
async function refreshCredentials(tokens: Tokens): Promise<Tokens> {
  const generation = authGeneration;
  try {
    const response = await transport.post('token/refresh/', {
      refresh: tokens.refresh,
    });
    const updated = unwrap<Partial<Tokens>>(response.data);
    if (!updated.access) {
      throw new Error('Respuesta de sesión inválida.');
    }
    const next = {
      access: updated.access,
      refresh: updated.refresh || tokens.refresh,
    };
    if (generation !== authGeneration) {
      throw new Error('La sesión cambió.');
    }
    await setTokens(next);
    return next;
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      [400, 401, 403].includes(error.response?.status || 0) &&
      generation === authGeneration
    ) {
      await clearTokens();
      authenticationExpired();
    }
    throw error;
  }
}
export async function request<T>(
  path: string,
  config: AxiosRequestConfig = {},
  organization?: string
): Promise<T> {
  if (!baseURL) {
    throw new Error(
      'Configura BASE_URL_API antes de distribuir la aplicación.'
    );
  }
  const generation = authGeneration;
  const tokens = await getTokens();
  if (generation !== authGeneration) {
    throw new Error('La sesión cambió.');
  }
  const headers = {
    ...config.headers,
    ...(tokens ? {Authorization: `Bearer ${tokens.access}`} : {}),
    ...(organization ? {'X-Organization': organization} : {}),
  };
  try {
    const response = await transport.request({...config, url: path, headers});
    if (generation !== authGeneration) {
      throw new Error('La sesión cambió.');
    }
    return unwrap<T>(response.data);
  } catch (error) {
    if (generation !== authGeneration) {
      throw new Error('La sesión cambió.');
    }
    if (
      !axios.isAxiosError(error) ||
      error.response?.status !== 401 ||
      !tokens
    ) {
      throw error;
    }
    if (!refreshFlight) {
      refreshFlight = refreshCredentials(tokens).finally(() => {
        refreshFlight = undefined;
      });
    }
    const refreshed = await refreshFlight;
    if (generation !== authGeneration) {
      throw new Error('La sesión cambió.');
    }
    const response = await transport.request({
      ...config,
      url: path,
      headers: {...headers, Authorization: `Bearer ${refreshed.access}`},
    });
    if (generation !== authGeneration) {
      throw new Error('La sesión cambió.');
    }
    return unwrap<T>(response.data);
  }
}
export async function publicRequest<T>(
  path: string,
  body: unknown
): Promise<T> {
  if (!baseURL) {
    throw new Error(
      'Configura BASE_URL_API antes de distribuir la aplicación.'
    );
  }
  return unwrap<T>((await transport.post(path, body)).data);
}

export async function requestAll<T>(
  path: string,
  organization?: string
): Promise<T[]> {
  const records: T[] = [];
  let nextPath = path;
  const visited = new Set<string>();
  while (nextPath) {
    if (visited.has(nextPath) || visited.size >= 1000) {
      throw new Error('El servidor devolvió una paginación inválida.');
    }
    visited.add(nextPath);
    const page = await request<T[] | {results: T[]; next: string | null}>(
      nextPath,
      {},
      organization
    );
    if (Array.isArray(page)) {
      return records.concat(page);
    }
    records.push(...page.results);
    // Keep the configured API origin; never forward credentials to a pagination URL host.
    const query = page.next?.split('?')[1];
    if (page.next && !query) {
      throw new Error('El servidor devolvió una paginación inválida.');
    }
    nextPath = query ? `${path}?${query}` : '';
  }
  return records;
}

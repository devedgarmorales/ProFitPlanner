import { beforeEach, describe, expect, it, jest } from '@jest/globals';
jest.mock('axios', () => {
  const transport = { post: jest.fn(), request: jest.fn() };
  return {
    __esModule: true,
    transport,
    default: {
      create: () => transport,
      isAxiosError: (value) => value?.isAxiosError === true,
    },
  };
});
const mockTransport = require('axios').transport;
jest.mock('react-native-config', () => ({
  BASE_URL_API: 'https://example.test/api/',
}));
jest.mock('../src/services/credentialStorage', () => ({
  getTokens: jest.fn(),
  setTokens: jest.fn(),
  clearTokens: jest.fn(),
}));
import {
  getTokens,
  setTokens,
  clearTokens,
} from '../src/services/credentialStorage';
import {
  request,
  unwrap,
  listResults,
  onAuthenticationExpired,
  requestAll,
} from '../src/services/clientApi';
const expired = { isAxiosError: true, response: { status: 401 } };
beforeEach(() => {
  jest.clearAllMocks();
  getTokens.mockResolvedValue({ access: 'old', refresh: 'refresh' });
});
describe('API session handling', () => {
  it('unwraps renderer and paginated data', () => {
    expect(unwrap({ status: 200, data: { access: 'token' } })).toEqual({
      access: 'token',
    });
    expect(listResults({ status: 200, data: { results: [1] } })).toEqual([1]);
  });
  it('attaches organization and renews once with secure credentials', async () => {
    mockTransport.request
      .mockRejectedValueOnce(expired)
      .mockResolvedValueOnce({ data: { status: 200, data: ['routine'] } });
    mockTransport.post.mockResolvedValueOnce({
      data: { status: 200, data: { access: 'new' } },
    });
    expect(await request('routines/', {}, 'org')).toEqual(['routine']);
    expect(setTokens).toHaveBeenCalledWith({
      access: 'new',
      refresh: 'refresh',
    });
    expect(mockTransport.request.mock.calls[1][0].headers).toEqual({
      Authorization: 'Bearer new',
      'X-Organization': 'org',
    });
  });
  it('does not delete credentials or log out on a network-only refresh failure', async () => {
    const notify = jest.fn();
    onAuthenticationExpired(notify);
    mockTransport.request.mockRejectedValueOnce(expired);
    mockTransport.post.mockRejectedValueOnce({ isAxiosError: true });
    await expect(request('routines/')).rejects.toEqual({ isAxiosError: true });
    expect(clearTokens).not.toHaveBeenCalled();
    expect(notify).not.toHaveBeenCalled();
  });
  it('clears revoked credentials and returns to login', async () => {
    const notify = jest.fn();
    onAuthenticationExpired(notify);
    mockTransport.request.mockRejectedValueOnce(expired);
    mockTransport.post.mockRejectedValueOnce(expired);
    await expect(request('routines/')).rejects.toEqual(expired);
    expect(clearTokens).toHaveBeenCalledTimes(1);
    expect(notify).toHaveBeenCalledTimes(1);
  });
});

it('fetches every history page without using server-supplied host URLs', async () => {
  mockTransport.request
    .mockResolvedValueOnce({
      data: {
        status: 200,
        data: {
          results: [{ id: 1 }],
          next: 'https://untrusted.test/api/routines/workout-sessions/?page=2',
        },
      },
    })
    .mockResolvedValueOnce({
      data: { status: 200, data: { results: [{ id: 2 }], next: null } },
    });
  expect(await requestAll('routines/workout-sessions/', 'org')).toEqual([
    { id: 1 },
    { id: 2 },
  ]);
  expect(mockTransport.request.mock.calls[1][0].url).toBe(
    'routines/workout-sessions/?page=2'
  );
});

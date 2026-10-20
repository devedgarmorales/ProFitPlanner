const mockDelete = jest.fn();
const mockNativeStorage = {
  get: jest.fn(),
  set: jest.fn().mockResolvedValue(null),
  clear: jest.fn().mockResolvedValue(null),
};
jest.mock('react-native', () => ({NativeModules: {ProfitCredentialStorage: mockNativeStorage}}));
jest.mock('react-native-mmkv', () => ({MMKV: jest.fn(() => ({delete: mockDelete}))}));

const {getTokens, setTokens, clearTokens} = require('../src/services/credentialStorage');

describe('OS-backed credentials', () => {
  beforeEach(() => {jest.clearAllMocks();});
  it('loads credentials from the native module and removes legacy plaintext tokens', async () => {
    mockNativeStorage.get.mockResolvedValue(JSON.stringify({access: 'access', refresh: 'refresh'}));
    await expect(getTokens()).resolves.toEqual({access: 'access', refresh: 'refresh'});
    expect(mockDelete).toHaveBeenCalledWith('auth_tokens');
  });
  it('returns no session when native storage is empty', async () => {
    mockNativeStorage.get.mockResolvedValue(null);
    await expect(getTokens()).resolves.toBeNull();
  });
  it.each(['not json', '{}', '{"access":"","refresh":"r"}', '{"access":1,"refresh":"r"}'])(
    'clears malformed credentials without plaintext fallback: %s', async value => {
      mockNativeStorage.get.mockResolvedValue(value);
      await expect(getTokens()).resolves.toBeNull();
      expect(mockNativeStorage.clear).toHaveBeenCalledTimes(1);
    },
  );
  it('writes and clears only through secure native storage', async () => {
    await setTokens({access: 'a', refresh: 'r'});
    expect(mockNativeStorage.set).toHaveBeenCalledWith('{"access":"a","refresh":"r"}');
    await clearTokens();
    expect(mockNativeStorage.clear).toHaveBeenCalledTimes(1);
  });
  it('rejects incomplete writes and surfaces native storage errors', async () => {
    await expect(setTokens({access: 'a', refresh: ''})).rejects.toThrow('required');
    expect(mockNativeStorage.set).not.toHaveBeenCalled();
    mockNativeStorage.get.mockRejectedValueOnce(new Error('Device is locked'));
    await expect(getTokens()).rejects.toThrow('Device is locked');
  });
});

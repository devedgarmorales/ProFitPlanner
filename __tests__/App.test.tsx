import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { expect, it, jest } from '@jest/globals';
import App from '../App';
import { useClientStore } from '../src/store/clientStore';
jest.useFakeTimers();
jest.mock('../src/hooks/client/useClientLifecycle', () => ({
  useClientLifecycle: jest.fn(),
}));
jest.mock('../src/store/clientStore', () => ({
  useClientStore: jest.fn(() => ({ ready: false })),
}));
jest.mock('react-native-config', () => ({
  BASE_URL_API: 'https://example.test/api/',
}));
jest.mock('react-native-get-random-values', () => {});
jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: require('react-native').View,
}));
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: require('react-native').View,
  SafeAreaView: require('react-native').View,
  SafeAreaInsetsContext: require('react').createContext({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  }),
}));
jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: require('react-native').View,
    Screen: () => null,
  }),
}));
jest.mock('../src/services/credentialStorage', () => ({
  getTokens: jest.fn(),
  setTokens: jest.fn(),
  clearTokens: jest.fn(),
}));
jest.mock('../src/screens/client/LoginScreen', () => ({
  LoginScreen: () =>
    require('react').createElement(
      require('react-native').Text,
      {},
      'Client login'
    ),
}));
it('renders bootstrap without opening legacy mocked navigation', () => {
  let tree: renderer.ReactTestRenderer;
  act(() => {
    tree = renderer.create(<App />);
  });
  expect(tree!.toJSON()).toBeTruthy();
  act(() => tree!.unmount());
});
it('shows login when no secure session exists', () => {
  (useClientStore as unknown as ReturnType<typeof jest.fn>).mockReturnValue({
    ready: true,
  });
  let tree: renderer.ReactTestRenderer;
  act(() => {
    tree = renderer.create(<App />);
  });
  expect(JSON.stringify(tree!.toJSON())).toContain('Client login');
  act(() => tree!.unmount());
});
it('shows a splash instead of the organization picker while the single membership is selected', () => {
  (useClientStore as unknown as ReturnType<typeof jest.fn>).mockReturnValue({
    ready: true,
    user: { id: 'u1' },
    memberships: [{ id: 'm1', organization: { id: 'o1', name: 'Gym' } }],
    organization: undefined,
  });
  let tree: renderer.ReactTestRenderer;
  act(() => {
    tree = renderer.create(<App />);
  });
  const rendered = JSON.stringify(tree!.toJSON());
  expect(rendered).toContain('Preparando tu entrenamiento');
  expect(rendered).not.toContain('Organizations');
  act(() => tree!.unmount());
});

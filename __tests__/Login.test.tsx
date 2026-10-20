import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { beforeEach, expect, it, jest } from '@jest/globals';
import {
  Button,
  TextInput,
  PaperProvider,
  MD3DarkTheme,
} from 'react-native-paper';
import { LoginScreen } from '../src/screens/client/LoginScreen';
import { useClientStore } from '../src/store/clientStore';
jest.useFakeTimers();
jest.mock('../src/store/clientStore', () => ({ useClientStore: jest.fn() }));
jest.mock('../src/components/ClientLayout', () => ({
  clientStyles: {},
  ClientStatus: () => null,
}));
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: require('react-native').View,
  SafeAreaProvider: require('react-native').View,
  SafeAreaInsetsContext: require('react').createContext({top: 0, bottom: 0, left: 0, right: 0}),
}));
const login = jest.fn();
beforeEach(() => {
  (useClientStore as unknown as ReturnType<typeof jest.fn>).mockReturnValue({
    login,
    busy: false,
    mfaToken: '',
  });
  login.mockClear();
});
it('requires credentials and submits through the session controller', () => {
  let tree: renderer.ReactTestRenderer;
  act(() => {
    tree = renderer.create(<LoginScreen />);
  });
  expect(tree!.root.findByType(Button).props.disabled).toBe(true);
  act(() => {
    tree!.root
      .findAllByType(TextInput)[0]
      .props.onChangeText('client@example.com');
    tree!.root.findAllByType(TextInput)[1].props.onChangeText('password');
  });
  act(() => {
    tree!.root.findByType(Button).props.onPress();
  });
  expect(login).toHaveBeenCalledWith('client@example.com', 'password', '');
  act(() => tree!.unmount());
});
it('shows MFA challenge instead of collecting the password a second time', () => {
  (useClientStore as unknown as ReturnType<typeof jest.fn>).mockReturnValue({
    login,
    busy: false,
    mfaToken: 'challenge',
  });
  let tree: renderer.ReactTestRenderer;
  act(() => {
    tree = renderer.create(<LoginScreen />);
  });
  expect(tree!.root.findAllByType(TextInput)).toHaveLength(1);
  expect(tree!.root.findByType(TextInput).props.label).toBe(
    'Código de autenticación o recuperación'
  );
  act(() => tree!.unmount());
});

it('uses the active dark theme background on the sign-in surface', () => {
  let tree: renderer.ReactTestRenderer;
  act(() => {
    tree = renderer.create(
      <PaperProvider theme={MD3DarkTheme}>
        <LoginScreen />
      </PaperProvider>
    );
  });
  const surfaces = tree!.root.findAll(
    (node) =>
      Array.isArray(node.props.style) &&
      node.props.style.some(
        (style: { backgroundColor?: string } | undefined) =>
          style?.backgroundColor === MD3DarkTheme.colors.background
      )
  );
  expect(surfaces.length).toBeGreaterThan(0);
  act(() => tree!.unmount());
});

import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { beforeEach, expect, it, jest } from '@jest/globals';
import { useStartWorkout } from '../src/hooks/client/useStartWorkout';
import { useClientStore } from '../src/store/clientStore';

jest.mock('react-native-get-random-values', () => {});
jest.mock('react-native-config', () => ({ BASE_URL_API: 'https://x.test/api/' }));
jest.mock('../src/services/credentialStorage', () => ({
  getTokens: jest.fn(),
  setTokens: jest.fn(),
  clearTokens: jest.fn(),
}));
jest.mock('../src/store/clientStore', () => ({ useClientStore: jest.fn() }));

const start = jest.fn();
const onStarted = jest.fn();
let api: ReturnType<typeof useStartWorkout>;

function Probe() {
  api = useStartWorkout(onStarted);
  return null;
}

const routine = { id: 'r' } as never;
const day = { id: 'd' } as never;

beforeEach(() => {
  start.mockReset();
  onStarted.mockReset();
  (useClientStore as unknown as ReturnType<typeof jest.fn>).mockImplementation(
    (selector?: (state: unknown) => unknown) =>
      selector ? selector({ start }) : { start }
  );
});

it('starts the day and reports the new session id', () => {
  start.mockReturnValue('session-1');
  act(() => {
    renderer.create(<Probe />);
  });
  act(() => api.startDay(routine, day));
  expect(start).toHaveBeenCalledWith(routine, day);
  expect(onStarted).toHaveBeenCalledWith('session-1');
  expect(api.error).toBe('');
});

it('keeps the error and does not navigate when starting fails', () => {
  start.mockImplementation(() => {
    throw new Error('No se pudo iniciar.');
  });
  act(() => {
    renderer.create(<Probe />);
  });
  act(() => api.startDay(routine, day));
  expect(onStarted).not.toHaveBeenCalled();
  expect(api.error).not.toBe('');
});

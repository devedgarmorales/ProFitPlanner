import {beforeEach, expect, it, jest} from '@jest/globals';
jest.mock('react-native-get-random-values', () => {});
jest.mock('react-native-mmkv', () => {
  const values = new Map();
  return {
    MMKV: class {
      getString(key) {
        return values.get(key);
      }
      set(key, value) {
        values.set(key, value);
      }
      delete(key) {
        values.delete(key);
      }
    },
  };
});
jest.mock('../src/services/credentialStorage', () => ({
  getTokens: jest.fn(),
  setTokens: jest.fn(),
  clearTokens: jest.fn(),
}));
jest.mock('../src/services/clientApi', () => ({
  apiError: error => error.message,
  invalidateAuthentication: jest.fn(),
  onAuthenticationExpired: jest.fn(),
  publicRequest: jest.fn(),
  request: jest.fn(),
  requestAll: jest.fn(),
  listResults: value => value,
}));
import {useClientStore} from '../src/store/clientStore';
import {publicRequest, request, requestAll} from '../src/services/clientApi';
import {setTokens} from '../src/services/credentialStorage';
import {
  emptyScope,
  saveIdentity,
  readIdentity,
  readScope,
  scopeKey,
  writeScope,
} from '../src/services/workoutStorage';
const user = {id: 'user-a', email: 'a@example.test'};
const organization = {
  id: 'membership',
  organization: {id: 'org-a'},
  role: 'client',
};
const routine = {
  name: 'Strength',
  start_date: '2020-01-01',
  end_date: '2099-12-31',
  coach: {name: 'Coach'},
};
const day = {
  id: 'day',
  name: 'Day',
  exercises: [
    {
      exercise: {name: 'Squat'},
      sets: [{id: 'set', reps: 10, target_weight: '20', weight_unit: 'kg'}],
    },
  ],
};
beforeEach(() => {
  jest.clearAllMocks();
  useClientStore.setState({
    user,
    organization,
    memberships: [organization],
    data: emptyScope(),
    busy: false,
    error: '',
    mfaToken: '',
  });
  writeScope(scopeKey(user.id, organization.organization.id), emptyScope());
});
it('clears a previous account identity before saving new credentials even when profile loading fails', async () => {
  saveIdentity(user, [organization]);
  const oldSessionId = useClientStore.getState().start(routine, day);
  publicRequest.mockResolvedValue({access: 'b-access', refresh: 'b-refresh'});
  request.mockRejectedValue(new Error('offline'));
  setTokens.mockImplementation(async () => {
    expect(readIdentity()).toBeUndefined();
    expect(useClientStore.getState().user).toBeUndefined();
  });
  await useClientStore.getState().login('b@example.test', 'password', '');
  expect(useClientStore.getState().user).toBeUndefined();
  expect(readIdentity()).toBeUndefined();
  expect(readScope('user-a:org-a').workouts[0].id).toBe(oldSessionId);
});
it('writes edits and finished snapshots locally before a failed sync and keeps them pending', async () => {
  const id = useClientStore.getState().start(routine, day);
  useClientStore.getState().editSet(id, {
    exercise_set: 'set',
    reps_performed: 12,
    weight_used: '25',
    completed: true,
    notes: 'Good',
  });
  useClientStore.getState().finish(id);
  request.mockRejectedValue(new Error('offline'));
  await useClientStore.getState().sync();
  const saved = readScope('user-a:org-a').workouts[0];
  expect(saved.status).toBe('completed');
  expect(saved.pending).toBe(true);
  expect(saved.sets[0].reps_performed).toBe(12);
});
it('does not start expired cached routines', () => {
  expect(() =>
    useClientStore.getState().start({...routine, end_date: '2020-12-31'}, day)
  ).toThrow('vigente');
});
it('does not publish stale refresh failures into another organization', async () => {
  let rejectRefresh;
  request.mockResolvedValue({});
  requestAll.mockImplementation(
    () =>
      new Promise((resolve, reject) => {
        rejectRefresh = reject;
      })
  );
  const flight = useClientStore.getState().refresh();
  await new Promise(resolve => setImmediate(resolve));
  useClientStore.setState({
    organization: {...organization, organization: {id: 'org-b'}},
    error: '',
    offline: false,
    busy: false,
  });
  rejectRefresh(new Error('old scope offline'));
  await flight;
  expect(useClientStore.getState().error).toBe('');
  expect(useClientStore.getState().offline).toBe(false);
});
it('removes a revoked cached organization instead of showing former assignments', async () => {
  saveIdentity(user, [organization]);
  const id = useClientStore.getState().start(routine, day);
  const {getTokens, clearTokens} = require('../src/services/credentialStorage');
  getTokens.mockResolvedValue({access: 'access', refresh: 'refresh'});
  request.mockResolvedValue([]);
  await useClientStore.getState().boot();
  expect(useClientStore.getState().user).toBeUndefined();
  expect(useClientStore.getState().organization).toBeUndefined();
  expect(useClientStore.getState().data.workouts).toEqual([]);
  expect(clearTokens).toHaveBeenCalled();
  expect(useClientStore.getState().error).toContain(
    'membresía activa de cliente'
  );
  expect(readScope('user-a:org-a').workouts[0].id).toBe(id);
});

it('keeps completed snapshots and revisions unchanged when finish is repeated', () => {
  const id = useClientStore.getState().start(routine, day);
  jest.useFakeTimers();
  try {
    jest.setSystemTime(new Date('2026-10-20T12:00:00Z'));
    useClientStore.getState().finish(id);
    const completedData = useClientStore.getState().data;
    const completed = completedData.workouts[0];
    jest.setSystemTime(new Date('2026-10-20T12:01:00Z'));
    useClientStore.getState().finish(id);
    expect(useClientStore.getState().data).toBe(completedData);
    expect(useClientStore.getState().data.workouts[0]).toBe(completed);
    expect(completed.completed_at).toBe('2026-10-20T12:00:00.000Z');
    expect(readScope('user-a:org-a').workouts[0]).toEqual(completed);
  } finally {
    jest.useRealTimers();
  }
});

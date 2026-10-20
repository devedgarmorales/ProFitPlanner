import {create} from 'zustand';
import {
  User,
  Membership,
  ScopeData,
  Routine,
  RoutineDay,
  WorkoutSet,
  LocalWorkout,
  Tokens,
  HistorySession,
} from '../interfaces/client';
import {
  apiError,
  invalidateAuthentication,
  listResults,
  onAuthenticationExpired,
  publicRequest,
  request,
  requestAll,
} from '../services/clientApi';
import {clearTokens, getTokens, setTokens} from '../services/credentialStorage';
import {
  clearIdentity,
  emptyScope,
  readIdentity,
  readScope,
  saveIdentity,
  scopeKey,
  writeScope,
} from '../services/workoutStorage';
import {createWorkout, isRoutineCurrent, toSnapshot} from '../services/workout';
import {createWorkoutSync} from '../services/workoutSync';
interface ClientState {
  ready: boolean;
  busy: boolean;
  user?: User;
  memberships: Membership[];
  organization?: Membership;
  data: ScopeData;
  error: string;
  notice: string;
  offline: boolean;
  mfaToken: string;
  boot: () => Promise<void>;
  login: (email: string, password: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
  selectOrganization: (membership: Membership) => Promise<void>;
  refresh: () => Promise<void>;
  sync: () => Promise<void>;
  start: (routine: Routine, day: RoutineDay) => string;
  editSet: (id: string, set: WorkoutSet) => void;
  finish: (id: string) => void;
  rest: (id: string, seconds: number) => void;
  clearError: () => void;
}
function currentKey() {
  const {user, organization} = useClientStore.getState();
  if (!user || !organization) {
    throw new Error('Selecciona una organización.');
  }
  return scopeKey(user.id, organization.organization.id);
}
function persistData(data: ScopeData) {
  writeScope(currentKey(), data);
  useClientStore.setState({data});
}
function updateWorkout(
  id: string,
  update: (session: LocalWorkout) => LocalWorkout
) {
  const {data} = useClientStore.getState();
  let changed = false;
  const workouts = data.workouts.map(session => {
    if (session.id !== id || session.status !== 'in_progress') {
      return session;
    }
    const updated = update(session);
    if (updated === session) {
      return session;
    }
    changed = true;
    return {...updated, revision: session.revision + 1, pending: true};
  });
  if (changed) {
    persistData({...data, workouts});
  }
}
const synchronizers = new Map<string, () => Promise<void>>();
function scopeSynchronizer(key: string, organization: string) {
  if (!synchronizers.has(key)) {
    synchronizers.set(
      key,
      createWorkoutSync({
        read: () => readScope(key).workouts,
        send: snapshot => {
          const state = useClientStore.getState();
          if (!state.user || !state.organization || currentKey() !== key) {
            throw new Error(
              'La cuenta u organización cambió; el avance queda pendiente.'
            );
          }
          return request(
            `routines/workout-sessions/${snapshot.id}/`,
            {method: 'PUT', data: snapshot},
            organization
          );
        },
        snapshot: toSnapshot,
        acknowledge: (id, revision) => {
          const data = readScope(key);
          const updated = {
            ...data,
            workouts: data.workouts.map(session =>
              session.id === id && session.revision === revision
                ? {...session, pending: false}
                : session
            ),
          };
          writeScope(key, updated);
          const current = useClientStore.getState();
          if (
            current.user &&
            current.organization &&
            scopeKey(current.user.id, current.organization.organization.id) ===
              key
          ) {
            useClientStore.setState({data: updated});
          }
        },
      })
    );
  }
  return synchronizers.get(key)!;
}
async function loadIdentity() {
  const allMemberships = listResults<Membership>(
    await request('tenants/memberships/')
  );
  const memberships = allMemberships.filter(item => item.role === 'client');
  if (!memberships.length) {
    clearIdentity();
    useClientStore.setState({
      user: undefined,
      memberships: [],
      organization: undefined,
      data: emptyScope(),
      busy: false,
    });
    await clearTokens();
    throw new Error(
      'No tienes una membresía activa de cliente. Solicita a tu coach que verifique tu acceso.'
    );
  }
  const user = await request<User>(
    'auth/user/',
    {},
    (memberships[0] || allMemberships[0])?.organization.id
  );
  saveIdentity(user, memberships);
  useClientStore.setState({
    user,
    memberships,
    mfaToken: '',
    organization: undefined,
    data: emptyScope(),
  });
  if (memberships[0]) {
    await useClientStore.getState().selectOrganization(memberships[0]);
  }
}
export const useClientStore = create<ClientState>((set, get) => ({
  ready: false,
  busy: false,
  memberships: [],
  data: emptyScope(),
  error: '',
  notice: '',
  offline: false,
  mfaToken: '',
  clearError: () => set({error: ''}),
  boot: async () => {
    try {
      if (await getTokens()) {
        const cached = readIdentity();
        if (cached) {
          const identity = JSON.parse(cached) as {
            user: User;
            memberships: Membership[];
          };
          set({...identity});
          if (identity.memberships[0]) {
            set({
              organization: identity.memberships[0],
              data: readScope(
                scopeKey(
                  identity.user.id,
                  identity.memberships[0].organization.id
                )
              ),
            });
          }
        }
        await loadIdentity();
      }
    } catch (error) {
      set({error: apiError(error), offline: true});
    } finally {
      set({ready: true});
    }
  },
  login: async (email, password, code) => {
    set({busy: true, error: ''});
    try {
      const result = get().mfaToken
        ? await publicRequest<Tokens>('auth/mfa/verify-login/', {
            mfa_token: get().mfaToken,
            code,
          })
        : await publicRequest<
            Tokens & {mfa_required?: boolean; mfa_token?: string}
          >('token/', {email: email.trim(), password});
      if ('mfa_required' in result && result.mfa_required) {
        set({
          mfaToken:
            'mfa_token' in result && typeof result.mfa_token === 'string'
              ? result.mfa_token
              : '',
        });
        return;
      }
      if (!result.access || !result.refresh) {
        throw new Error('El servidor no devolvió una sesión válida.');
      }
      invalidateAuthentication();
      clearIdentity();
      set({
        user: undefined,
        memberships: [],
        organization: undefined,
        data: emptyScope(),
        mfaToken: '',
        notice: '',
      });
      await setTokens(result);
      await loadIdentity();
    } catch (error) {
      set({error: apiError(error)});
    } finally {
      set({busy: false});
    }
  },
  logout: async () => {
    set({busy: true, error: ''});
    try {
      const tokens = await getTokens();
      invalidateAuthentication();
      await clearTokens();
      clearIdentity();
      set({
        user: undefined,
        memberships: [],
        organization: undefined,
        data: emptyScope(),
        mfaToken: '',
        notice: '',
        offline: false,
      });
      if (tokens) {
        await publicRequest('token/revoke/', {refresh: tokens.refresh});
      }
    } catch (error) {
      set({error: apiError(error)});
    } finally {
      set({busy: false});
    }
  },
  selectOrganization: async membership => {
    if (get().busy && get().organization) {
      return;
    }
    try {
      const data = readScope(
        scopeKey(get().user!.id, membership.organization.id)
      );
      set({organization: membership, data, error: '', notice: ''});
      await get().refresh();
    } catch (error) {
      set({error: apiError(error)});
    }
  },
  sync: async () => {
    if (!get().user || !get().organization) {
      return;
    }
    const key = currentKey();
    try {
      await scopeSynchronizer(key, get().organization!.organization.id)();
      if (get().user && currentKey() === key) {
        set({offline: false, notice: 'Avance sincronizado.'});
      }
    } catch (error) {
      if (get().user && currentKey() === key) {
        set({
          offline: true,
          error: apiError(error),
          notice:
            'Avance guardado en este dispositivo. Sincronización pendiente.',
        });
      }
    }
  },
  refresh: async () => {
    if (!get().organization) {
      return;
    }
    const key = currentKey();
    const organization = get().organization!.organization.id;
    set({busy: true, error: ''});
    try {
      await get().sync();
      const [routinesResponse, historyResponse] = await Promise.all([
        requestAll<Routine>('routines/routines/assigned/', organization),
        requestAll<HistorySession>('routines/workout-sessions/', organization),
      ]);
      if (!get().user || currentKey() !== key) {
        return;
      }
      const data = {
        ...get().data,
        routines: listResults<Routine>(routinesResponse),
        history: listResults<HistorySession>(historyResponse),
        cached_at: new Date().toISOString(),
      };
      persistData(data);
      set({offline: false});
    } catch (error) {
      if (get().user && get().organization && currentKey() === key) {
        set({offline: true, error: apiError(error)});
      }
    } finally {
      if (get().user && get().organization && currentKey() === key) {
        set({busy: false});
      }
    }
  },
  start: (routine, day) => {
    const active = get().data.workouts.find(
      session => session.status === 'in_progress'
    );
    if (active) {
      return active.id;
    }
    if (!isRoutineCurrent(routine)) {
      throw new Error(
        'Esta rutina ya no está vigente. Actualiza las asignaciones o consulta a tu coach.'
      );
    }
    const session = createWorkout(routine, day);
    persistData({...get().data, workouts: [session, ...get().data.workouts]});
    return session.id;
  },
  editSet: (id, updatedSet) =>
    updateWorkout(id, session => {
      if (session.status !== 'in_progress') {
        return session;
      }
      return {
        ...session,
        sets: session.sets.map(item =>
          item.exercise_set === updatedSet.exercise_set ? updatedSet : item
        ),
      };
    }),
  finish: id =>
    updateWorkout(id, session => ({
      ...session,
      status: 'completed',
      completed_at: new Date().toISOString(),
    })),
  rest: (id, seconds) =>
    updateWorkout(id, session => ({
      ...session,
      rest_until: Date.now() + seconds * 1000,
    })),
}));
onAuthenticationExpired(() => {
  invalidateAuthentication();
  clearIdentity();
  useClientStore.setState({
    user: undefined,
    busy: false,
    memberships: [],
    organization: undefined,
    data: emptyScope(),
    error:
      'La sesión expiró. El avance local se conserva; inicia sesión nuevamente.',
  });
});

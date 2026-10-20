import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useClientStore } from '../../store/clientStore';
import { apiError } from '../../services/clientApi';
import { remainingSeconds, validateSet } from '../../services/workout';
import { stepValue } from '../../services/workoutDisplay';
import { WorkoutSet } from '../../interfaces/client';
export function useWorkout(sessionId: string) {
  const state = useClientStore();
  const session = state.data.workouts.find((item) => item.id === sessionId);
  const [now, setNow] = useState(Date.now());
  const [error, setError] = useState('');
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (!session?.pending) {
      return;
    }
    const timeout = setTimeout(() => {
      useClientStore.getState().sync();
    }, 1500);
    return () => clearTimeout(timeout);
  }, [session?.revision, session?.pending]);
  const finish = () => {
    Alert.alert(
      'Finalizar entrenamiento',
      'Se conservarán las series registradas. Las series sin completar quedarán marcadas como pendientes.',
      [
        { text: 'Continuar', style: 'cancel' },
        {
          text: 'Finalizar',
          onPress: () => {
            try {
              state.finish(sessionId);
              state.sync();
            } catch (failure) {
              setError(apiError(failure));
            }
          },
        },
      ]
    );
  };
  return {
    session,
    error,
    finish,
    sync: state.sync,
    remaining: remainingSeconds(session?.rest_until, now),
    elapsed: session
      ? Math.max(
          0,
          Math.floor(
            ((session.completed_at
              ? new Date(session.completed_at).getTime()
              : now) -
              new Date(session.started_at).getTime()) /
              60000
          )
        )
      : 0,
    startRest: (seconds: number) => {
      try {
        state.rest(sessionId, seconds);
      } catch (failure) {
        setError(apiError(failure));
      }
    },
  };
}
export function useSetEditor(sessionId: string, set: WorkoutSet) {
  const [reps, setReps] = useState(String(set.reps_performed));
  const [weight, setWeight] = useState(set.weight_used || '');
  const [notes, setNotes] = useState(set.notes);
  const [error, setError] = useState('');
  const save = (values: {
    reps: string;
    weight: string;
    notes: string;
    completed: boolean;
  }) => {
    try {
      const validated = validateSet(
        values.reps,
        values.weight.replace(',', '.')
      );
      useClientStore.getState().editSet(sessionId, {
        ...set,
        ...validated,
        notes: values.notes,
        completed: values.completed,
      });
      setError('');
      return true;
    } catch (failure) {
      setError(apiError(failure));
      return false;
    }
  };
  return {
    reps,
    weight,
    notes,
    error,
    changeReps: (value: string) => {
      setReps(value);
      save({ reps: value, weight, notes, completed: set.completed });
    },
    changeWeight: (value: string) => {
      setWeight(value);
      save({ reps, weight: value, notes, completed: set.completed });
    },
    changeNotes: (value: string) => {
      setNotes(value);
      save({ reps, weight, notes: value, completed: set.completed });
    },
    toggle: () => save({ reps, weight, notes, completed: !set.completed }),
    stepReps: (delta: number) => {
      const next = stepValue(reps, delta, 10000).split('.')[0];
      setReps(next);
      save({ reps: next, weight, notes, completed: set.completed });
    },
    stepWeight: (delta: number) => {
      const next = stepValue(weight, delta);
      setWeight(next);
      save({ reps, weight: next, notes, completed: set.completed });
    },
  };
}

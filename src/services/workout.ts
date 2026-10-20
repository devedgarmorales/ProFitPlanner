import 'react-native-get-random-values';
import {
  HistorySession,
  LocalWorkout,
  Routine,
  RoutineDay,
  WorkoutSnapshot,
} from '../interfaces/client';
export function createWorkout(routine: Routine, day: RoutineDay): LocalWorkout {
  const bytes = new Uint8Array(16);
  global.crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] % 16) + 64;
  bytes[8] = (bytes[8] % 64) + 128;
  const hex = Array.from(bytes, value =>
    value.toString(16).padStart(2, '0')
  ).join('');
  const id = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(
    12,
    16
  )}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  return {
    id,
    routine_day: day.id,
    started_at: new Date().toISOString(),
    completed_at: null,
    status: 'in_progress',
    routine_name: routine.name,
    day_name: day.name,
    coach_name: routine.coach.name,
    day,
    revision: 1,
    pending: true,
    sets: day.exercises.flatMap(exercise =>
      exercise.sets.map(set => ({
        exercise_set: set.id,
        reps_performed: set.reps,
        weight_used: set.target_weight,
        completed: false,
        notes: '',
      }))
    ),
  };
}
export function toSnapshot(workout: LocalWorkout): WorkoutSnapshot {
  const {id, routine_day, started_at, completed_at, status, sets} = workout;
  return {id, routine_day, started_at, completed_at, status, sets};
}
export function validateSet(reps: string, weight: string) {
  if (!/^\d+$/.test(reps) || Number(reps) > 10000) {
    throw new Error('Las repeticiones deben ser un entero entre 0 y 10000.');
  }
  if (
    weight !== '' &&
    (!/^\d+(\.\d{1,2})?$/.test(weight) || Number(weight) > 9999.99)
  ) {
    throw new Error('El peso debe ser positivo y tener hasta dos decimales.');
  }
  return {
    reps_performed: Number(reps),
    weight_used: weight === '' ? null : weight,
  };
}
export function mergeHistory(
  remote: HistorySession[],
  local: LocalWorkout[]
): HistorySession[] {
  const merged = new Map(remote.map(session => [session.id, session]));
  local.forEach(session => {
    const metadata = new Map(
      session.day.exercises.flatMap(exercise =>
        exercise.sets.map(
          set =>
            [
              set.id,
              {
                exercise_name: exercise.exercise.name,
                exercise_id:
                  exercise.exercise.uuid ||
                  (exercise.exercise.id
                    ? String(exercise.exercise.id)
                    : undefined),
                weight_unit: set.weight_unit,
                set_number: set.set_number,
              },
            ] as const
        )
      )
    );
    merged.set(session.id, {
      ...session,
      sets: session.sets.map(set => ({
        ...set,
        ...metadata.get(set.exercise_set),
      })),
    });
  });
  return Array.from(merged.values()).sort((a, b) =>
    b.started_at.localeCompare(a.started_at)
  );
}
export function remainingSeconds(until: number | undefined, now = Date.now()) {
  return Math.max(0, Math.ceil(((until || 0) - now) / 1000));
}

export function isRoutineCurrent(routine: Routine, now = new Date()) {
  const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    '0'
  )}-${String(now.getDate()).padStart(2, '0')}`;
  return routine.start_date <= date && date <= routine.end_date;
}

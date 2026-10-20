import { describe, expect, it, jest } from '@jest/globals';
jest.mock('react-native-get-random-values', () => {});
import {
  createWorkout,
  mergeHistory,
  remainingSeconds,
  toSnapshot,
  validateSet,
} from '../src/services/workout';
import { createWorkoutSync } from '../src/services/workoutSync';
const day = {
  id: 'day',
  name: 'Día 1',
  exercises: [
    {
      id: 'exercise',
      exercise: { name: 'Squat' },
      sets: [{ id: 'set', reps: 12, target_weight: '20.00' }],
    },
  ],
};
const routine = { name: 'Strength', coach: { name: 'Coach' } };
describe('workout recording', () => {
  it('creates persistent identity and prescribed defaults without reporting completed work', () => {
    const workout = createWorkout(routine, day);
    expect(workout.id).toMatch(
      /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/
    );
    expect(workout.sets[0]).toMatchObject({
      exercise_set: 'set',
      reps_performed: 12,
      weight_used: '20.00',
      completed: false,
    });
    expect(toSnapshot(workout)).not.toHaveProperty('pending');
    expect(toSnapshot(workout)).not.toHaveProperty('day');
  });
  it('validates input without silently rounding or discarding bad values', () => {
    expect(validateSet('0', '')).toEqual({
      reps_performed: 0,
      weight_used: null,
    });
    expect(validateSet('10', '42.50').weight_used).toBe('42.50');
    ['-1', '1.5', '', '10001'].forEach((value) =>
      expect(() => validateSet(value, '')).toThrow()
    );
    ['-2', 'NaN', '1.234', '10000'].forEach((value) =>
      expect(() => validateSet('1', value)).toThrow()
    );
  });
  it('resumes rest from absolute time across backgrounding', () => {
    expect(remainingSeconds(10000, 8000)).toBe(2);
    expect(remainingSeconds(10000, 20000)).toBe(0);
  });
  it('prefers newer local snapshots and removes server duplicates', () => {
    const local = {
      ...createWorkout(routine, day),
      id: 'same',
      status: 'completed',
    };
    expect(
      mergeHistory([{ ...local, status: 'in_progress' }], [local])[0]
    ).toMatchObject({
      ...local,
      sets: local.sets.map((set) => ({ ...set, exercise_name: 'Squat' })),
    });
  });
});
describe('snapshot sync queue', () => {
  it('keeps failed sessions pending and retries with the same UUID', async () => {
    let workouts = [createWorkout(routine, day)];
    const send = jest
      .fn()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValue({});
    const sync = createWorkoutSync({
      read: () => workouts,
      send,
      snapshot: toSnapshot,
      acknowledge: (id, revision) => {
        workouts = workouts.map((item) =>
          item.id === id && item.revision === revision
            ? { ...item, pending: false }
            : item
        );
      },
    });
    await expect(sync()).rejects.toThrow('offline');
    expect(workouts[0].pending).toBe(true);
    await sync();
    expect(workouts[0].pending).toBe(false);
    expect(send.mock.calls[0][0].id).toBe(send.mock.calls[1][0].id);
  });
  it('serializes concurrent callers and sends a newer revision only after the first completes', async () => {
    let workouts = [createWorkout(routine, day)];
    let resolveFirst;
    const first = new Promise((resolve) => {
      resolveFirst = resolve;
    });
    const send = jest
      .fn()
      .mockImplementationOnce(() => first)
      .mockResolvedValue({});
    const acknowledged = [];
    const sync = createWorkoutSync({
      read: () => workouts,
      send,
      snapshot: toSnapshot,
      acknowledge: (id, revision) => {
        acknowledged.push(revision);
        workouts = workouts.map((item) =>
          item.id === id && item.revision === revision
            ? { ...item, pending: false }
            : item
        );
      },
    });
    const flight = sync();
    expect(sync()).toBe(flight);
    workouts = [
      {
        ...workouts[0],
        revision: 2,
        sets: [{ ...workouts[0].sets[0], reps_performed: 15 }],
      },
    ];
    resolveFirst({});
    await flight;
    expect(send).toHaveBeenCalledTimes(2);
    expect(send.mock.calls[1][0].sets[0].reps_performed).toBe(15);
    expect(acknowledged).toEqual([1, 2]);
    expect(workouts[0].pending).toBe(false);
  });
  it('bounds work to two passes even when edits continue during transport', async () => {
    let workout = createWorkout(routine, day);
    const send = jest.fn(async () => {
      workout = { ...workout, revision: workout.revision + 1 };
    });
    const sync = createWorkoutSync({
      read: () => [workout],
      send,
      snapshot: toSnapshot,
      acknowledge: () => {},
    });
    await sync();
    expect(send).toHaveBeenCalledTimes(2);
    expect(workout.pending).toBe(true);
  });
});

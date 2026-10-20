import {expect, it} from '@jest/globals';
import {exerciseProgress} from '../src/services/workoutProgress';
const set = {
  exercise_id: 'squat',
  exercise_name: 'Squat',
  weight_unit: 'kg',
  weight_used: '20',
  reps_performed: 10,
  completed: true,
};
const session = (id, started_at, sets) => ({
  id,
  started_at,
  status: 'completed',
  sets,
});
it('compares max session loads by canonical exercise and unit, not display name or set number', () => {
  const history = [
    session('old', '2026-01-01', [set]),
    session('new', '2026-02-01', [
      {...set, weight_used: '25', reps_performed: 8},
      {...set, weight_used: '23'},
      {...set, weight_unit: 'lb', weight_used: '50'},
      {...set, exercise_id: 'another-squat', weight_used: '100'},
    ]),
  ];
  const progress = exerciseProgress(history);
  expect(progress).toHaveLength(3);
  expect(
    progress
      .find(item => item.id === 'squat:kg')
      .performances.map(item => [item.weight, item.reps])
  ).toEqual([
    [25, 8],
    [20, 10],
  ]);
  expect(
    progress.find(item => item.id === 'squat:lb').performances
  ).toHaveLength(1);
});
it('does not invent prior progress or count incomplete sessions and incomplete sets', () => {
  expect(
    exerciseProgress([
      {...session('pending', '2026-03-01', [set]), status: 'in_progress'},
      session('done', '2026-02-01', [{...set, completed: false}]),
    ])
  ).toEqual([]);
  expect(
    exerciseProgress([session('first', '2026-01-01', [set])])[0].performances
  ).toHaveLength(1);
});
it('breaks session ties deterministically and uses reps to break equal-load set ties', () => {
  const progress = exerciseProgress([
    session('a', '2026-01-01', [set]),
    session('b', '2026-01-01', [set, {...set, reps_performed: 12}]),
  ]);
  expect(progress[0].performances[0].reps).toBe(12);
});

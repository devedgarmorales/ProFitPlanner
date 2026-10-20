import { describe, expect, it } from '@jest/globals';
import {
  countRecords,
  weekActivity,
  weightSeries,
  demoUrl,
  formatClock,
  nextRoutineDay,
  sessionProgress,
  sessionVolume,
  stepValue,
} from '../src/services/workoutDisplay';

describe('stepValue', () => {
  it('adds and subtracts from a decimal weight without float noise', () => {
    expect(stepValue('20', 2.5)).toBe('22.5');
    expect(stepValue('22.5', -2.5)).toBe('20');
    expect(stepValue('0.1', 0.2)).toBe('0.3');
  });

  it('starts from zero when the field is empty and never goes below zero', () => {
    expect(stepValue('', 2.5)).toBe('2.5');
    expect(stepValue('1', -2.5)).toBe('0');
  });

  it('accepts a decimal comma and respects the maximum', () => {
    expect(stepValue('10,5', 1)).toBe('11.5');
    expect(stepValue('9999', 5, 9999.99)).toBe('9999.99');
  });

  it('keeps the current value when it is not a number', () => {
    expect(stepValue('abc', 1)).toBe('abc');
  });
});

describe('sessionProgress', () => {
  it('counts completed sets and the rounded percentage', () => {
    expect(
      sessionProgress([{ completed: true }, { completed: false }, { completed: true }])
    ).toEqual({ done: 2, total: 3, percent: 67 });
  });

  it('is zero for a session without sets', () => {
    expect(sessionProgress([])).toEqual({ done: 0, total: 0, percent: 0 });
  });
});

describe('formatClock', () => {
  it('formats seconds as m:ss', () => {
    expect(formatClock(0)).toBe('0:00');
    expect(formatClock(65)).toBe('1:05');
    expect(formatClock(600)).toBe('10:00');
  });
});

describe('sessionVolume', () => {
  it('adds reps x weight for completed sets only', () => {
    expect(
      sessionVolume([
        { completed: true, reps_performed: 10, weight_used: '20.00' },
        { completed: true, reps_performed: 8, weight_used: null },
        { completed: false, reps_performed: 10, weight_used: '100' },
        { completed: true, reps_performed: 5, weight_used: '22.5' },
      ])
    ).toBe(312.5);
  });
});

describe('countRecords', () => {
  const set = (exercise_id, weight, extra = {}) => ({
    exercise_id,
    exercise_name: `Ex ${exercise_id}`,
    weight_unit: 'kg',
    weight_used: String(weight),
    reps_performed: 8,
    completed: true,
    ...extra,
  });
  const done = (id, sets, started_at) => ({
    id,
    status: 'completed',
    started_at,
    sets,
  });

  it('flags exercises that beat the best previous weight', () => {
    const current = done('now', [set('a', 60), set('b', 40)], '2026-10-20');
    const history = [
      done('old', [set('a', 55), set('b', 45)], '2026-10-10'),
      current,
    ];
    expect(countRecords(current, history)).toEqual([
      { name: 'Ex a', weight: 60, unit: 'kg' },
    ]);
  });

  it('does not celebrate a first record or a different unit', () => {
    const current = done('now', [set('a', 60), set('b', 90, { weight_unit: 'lb' })], '2026-10-20');
    const history = [done('old', [set('b', 50)], '2026-10-10'), current];
    expect(countRecords(current, history)).toEqual([]);
  });
});

describe('nextRoutineDay', () => {
  const routine = { days: [{ id: 'd1' }, { id: 'd2' }, { id: 'd3' }] };
  const session = (routine_day, started_at) => ({
    routine_day,
    status: 'completed',
    started_at,
  });

  it('starts at the first day when nothing was completed', () => {
    expect(nextRoutineDay(routine, []).id).toBe('d1');
  });

  it('suggests the day after the most recent completed one and wraps around', () => {
    expect(
      nextRoutineDay(routine, [session('d1', '2026-10-01'), session('d2', '2026-10-03')]).id
    ).toBe('d3');
    expect(nextRoutineDay(routine, [session('d3', '2026-10-05')]).id).toBe('d1');
  });

  it('ignores sessions of other routines and unfinished ones', () => {
    expect(
      nextRoutineDay(routine, [
        session('other', '2026-10-09'),
        { routine_day: 'd2', status: 'in_progress', started_at: '2026-10-08' },
      ]).id
    ).toBe('d1');
  });
});

describe('demoUrl', () => {
  it('only returns http(s) links so a bad catalog value never reaches Linking', () => {
    expect(demoUrl('https://youtu.be/abc')).toBe('https://youtu.be/abc');
    expect(demoUrl(' http://example.com/v ')).toBe('http://example.com/v');
    expect(demoUrl('javascript:alert(1)')).toBeUndefined();
    expect(demoUrl('')).toBeUndefined();
    expect(demoUrl(undefined)).toBeUndefined();
  });
});

describe('weightSeries', () => {
  const session = (id, started_at, weights, extra = {}) => ({
    id,
    status: 'completed',
    started_at,
    sets: weights.map((weight) => ({
      exercise_id: 'a',
      weight_unit: 'kg',
      weight_used: String(weight),
      reps_performed: 8,
      completed: true,
      ...extra,
    })),
  });

  it('returns the best weight per session in chronological order', () => {
    const history = [
      session('3', '2026-10-15', [60, 62.5]),
      session('1', '2026-10-01', [50]),
      session('2', '2026-10-08', [55, 52]),
    ];
    expect(weightSeries(history, 'a:kg')).toEqual([
      { date: '2026-10-01', weight: 50 },
      { date: '2026-10-08', weight: 55 },
      { date: '2026-10-15', weight: 62.5 },
    ]);
  });

  it('keeps only the latest sessions and skips other units or open sessions', () => {
    const history = [
      session('1', '2026-10-01', [50]),
      session('2', '2026-10-02', [51]),
      session('3', '2026-10-03', [52]),
      { ...session('4', '2026-10-04', [99]), status: 'in_progress' },
      session('5', '2026-10-05', [95], { weight_unit: 'lb' }),
    ];
    expect(weightSeries(history, 'a:kg', 2).map((p) => p.weight)).toEqual([51, 52]);
  });
});

describe('weekActivity', () => {
  const now = new Date(2026, 9, 21, 12);
  const at = (day) => new Date(2026, 9, day, 9).toISOString();

  it('lists the last seven days ending today with the trained ones counted', () => {
    const week = weekActivity(
      [
        { status: 'completed', started_at: at(21) },
        { status: 'completed', started_at: at(21) },
        { status: 'completed', started_at: at(19) },
        { status: 'completed', started_at: at(10) },
        { status: 'in_progress', started_at: at(20) },
      ],
      now
    );
    expect(week).toHaveLength(7);
    expect(week[0].date).toBe('2026-10-15');
    expect(week[6]).toMatchObject({ date: '2026-10-21', count: 2 });
    expect(week.find((day) => day.date === '2026-10-19').count).toBe(1);
    expect(week.find((day) => day.date === '2026-10-20').count).toBe(0);
  });
});

import { describe, expect, it } from '@jest/globals';
import {
  formatClock,
  sessionProgress,
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

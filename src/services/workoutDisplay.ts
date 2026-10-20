const MAX_WEIGHT = 9999.99;

export function stepValue(current: string, delta: number, max = MAX_WEIGHT) {
  const base = current.trim() === '' ? 0 : Number(current.replace(',', '.'));
  if (!Number.isFinite(base)) {
    return current;
  }
  const next = Math.min(max, Math.max(0, Math.round((base + delta) * 100) / 100));
  return String(next);
}

export function sessionProgress(sets: {completed: boolean}[]) {
  const total = sets.length;
  const done = sets.filter(set => set.completed).length;
  return {done, total, percent: total ? Math.round((done / total) * 100) : 0};
}

export function formatClock(seconds: number) {
  const whole = Math.max(0, Math.floor(seconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
}

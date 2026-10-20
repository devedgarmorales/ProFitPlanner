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

interface PerformedSet {
  completed: boolean;
  weight_used: string | null;
  reps_performed: number;
}

export function sessionVolume(sets: PerformedSet[]) {
  const total = sets.reduce((sum, set) => {
    const weight = Number(set.weight_used);
    return set.completed && Number.isFinite(weight)
      ? sum + weight * set.reps_performed
      : sum;
  }, 0);
  return Math.round(total * 100) / 100;
}

interface RecordSet extends PerformedSet {
  exercise_id?: string;
  exercise_name?: string;
  weight_unit?: string;
}

interface RecordSession {
  id: string;
  status: string;
  sets: RecordSet[];
}

export interface PersonalRecord {
  name: string;
  weight: number;
  unit: string;
}

function bestWeights(session: RecordSession) {
  const best = new Map<string, {name: string; weight: number; unit: string}>();
  session.sets.forEach(set => {
    const weight = Number(set.weight_used);
    if (
      !set.completed ||
      !set.exercise_id ||
      !set.weight_unit ||
      set.weight_used === null ||
      !Number.isFinite(weight)
    ) {
      return;
    }
    const key = `${set.exercise_id}:${set.weight_unit}`;
    const current = best.get(key);
    if (!current || weight > current.weight) {
      best.set(key, {
        name: set.exercise_name || 'Ejercicio',
        weight,
        unit: set.weight_unit,
      });
    }
  });
  return best;
}

export function countRecords(
  session: RecordSession,
  history: RecordSession[]
): PersonalRecord[] {
  const previous = new Map<string, number>();
  history
    .filter(item => item.id !== session.id && item.status === 'completed')
    .forEach(item =>
      bestWeights(item).forEach((value, key) =>
        previous.set(key, Math.max(previous.get(key) ?? 0, value.weight))
      )
    );
  const records: PersonalRecord[] = [];
  bestWeights(session).forEach((value, key) => {
    const before = previous.get(key);
    if (before !== undefined && value.weight > before) {
      records.push(value);
    }
  });
  return records;
}

export function nextRoutineDay<T extends {id: string}>(
  routine: {days: T[]},
  history: {routine_day: string; status: string; started_at: string}[]
): T | undefined {
  const ids = new Set(routine.days.map(day => day.id));
  const last = history
    .filter(item => item.status === 'completed' && ids.has(item.routine_day))
    .sort((a, b) => b.started_at.localeCompare(a.started_at))[0];
  if (!last) {
    return routine.days[0];
  }
  const index = routine.days.findIndex(day => day.id === last.routine_day);
  return routine.days[(index + 1) % routine.days.length];
}

export function demoUrl(value?: string | null) {
  const url = (value || '').trim();
  return /^https?:\/\/\S+$/i.test(url) ? url : undefined;
}

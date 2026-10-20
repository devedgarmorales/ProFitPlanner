const MAX_WEIGHT = 9999.99;

export function stepValue(current: string, delta: number, max = MAX_WEIGHT) {
  const base = current.trim() === '' ? 0 : Number(current.replace(',', '.'));
  if (!Number.isFinite(base)) {
    return current;
  }
  const next = Math.min(
    max,
    Math.max(0, Math.round((base + delta) * 100) / 100)
  );
  return String(next);
}

export function sessionProgress(sets: {completed: boolean}[]) {
  const total = sets.length;
  const done = sets.filter((set) => set.completed).length;
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
  session.sets.forEach((set) => {
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
    .filter((item) => item.id !== session.id && item.status === 'completed')
    .forEach((item) =>
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
  const ids = new Set(routine.days.map((day) => day.id));
  const last = history
    .filter((item) => item.status === 'completed' && ids.has(item.routine_day))
    .sort((a, b) => b.started_at.localeCompare(a.started_at))[0];
  if (!last) {
    return routine.days[0];
  }
  const index = routine.days.findIndex((day) => day.id === last.routine_day);
  return routine.days[(index + 1) % routine.days.length];
}

export function demoUrl(value?: string | null) {
  const url = (value || '').trim();
  return /^https?:\/\/\S+$/i.test(url) ? url : undefined;
}

export function estimatedOneRm(weight: number, reps: number) {
  if (reps <= 1) {
    return weight;
  }
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}

export interface SeriesPoint {
  date: string;
  weight: number;
  reps: number;
  volume: number;
  oneRm: number;
}

type HistorySessionLike = RecordSession & {started_at: string};

function sessionPoint(
  session: HistorySessionLike,
  key: string
): SeriesPoint | undefined {
  let best: {weight: number; reps: number} | undefined;
  let volume = 0;
  let oneRm = 0;
  session.sets.forEach((set) => {
    const weight = Number(set.weight_used);
    if (
      !set.completed ||
      !set.exercise_id ||
      !set.weight_unit ||
      set.weight_used === null ||
      !Number.isFinite(weight) ||
      `${set.exercise_id}:${set.weight_unit}` !== key
    ) {
      return;
    }
    volume += weight * set.reps_performed;
    oneRm = Math.max(oneRm, estimatedOneRm(weight, set.reps_performed));
    if (
      !best ||
      weight > best.weight ||
      (weight === best.weight && set.reps_performed > best.reps)
    ) {
      best = {weight, reps: set.reps_performed};
    }
  });
  return best
    ? {
        date: session.started_at.slice(0, 10),
        weight: best.weight,
        reps: best.reps,
        volume: Math.round(volume * 100) / 100,
        oneRm,
      }
    : undefined;
}

export function exerciseSeries(history: HistorySessionLike[], key: string) {
  return history
    .filter((session) => session.status === 'completed')
    .sort((a, b) => a.started_at.localeCompare(b.started_at))
    .flatMap((session) => {
      const point = sessionPoint(session, key);
      return point ? [point] : [];
    });
}

export interface ExerciseSummary {
  key: string;
  name: string;
  unit: string;
  last: SeriesPoint;
  delta: number | null;
  points: SeriesPoint[];
}

export function exerciseSummaries(
  history: HistorySessionLike[]
): ExerciseSummary[] {
  const names = new Map<string, {name: string; unit: string; date: string}>();
  history
    .filter((session) => session.status === 'completed')
    .forEach((session) =>
      bestWeights(session).forEach((value, key) => {
        const seen = names.get(key);
        if (!seen || session.started_at.slice(0, 10) >= seen.date) {
          names.set(key, {
            name: value.name,
            unit: value.unit,
            date: session.started_at.slice(0, 10),
          });
        }
      })
    );
  return Array.from(names.entries())
    .map(([key, info]) => {
      const series = exerciseSeries(history, key);
      const last = series[series.length - 1];
      const previous = series[series.length - 2];
      return {
        key,
        name: info.name,
        unit: info.unit,
        last,
        delta: previous
          ? Math.round((last.weight - previous.weight) * 100) / 100
          : null,
        points: series.slice(-8),
      };
    })
    .sort(
      (a, b) =>
        b.last.date.localeCompare(a.last.date) || a.name.localeCompare(b.name)
    );
}

export function sessionStats(session: {
  started_at: string;
  completed_at: string | null;
  sets: PerformedSet[];
}) {
  const end = session.completed_at
    ? new Date(session.completed_at).getTime()
    : 0;
  const start = new Date(session.started_at).getTime();
  return {
    durationMin: end ? Math.max(0, Math.round((end - start) / 60000)) : 0,
    sets: session.sets.filter((set) => set.completed).length,
    totalSets: session.sets.length,
    volume: sessionVolume(session.sets),
  };
}

export function groupSessionSets<
  T extends {
    completed: boolean;
    exercise_id?: string;
    exercise_name?: string;
    set_number?: number;
  }
>(session: {sets: T[]}) {
  const groups = new Map<string, {name: string; sets: T[]}>();
  session.sets
    .filter((set) => set.completed)
    .forEach((set) => {
      const key = set.exercise_id || set.exercise_name || 'exercise';
      const group = groups.get(key) || {
        name: set.exercise_name || 'Ejercicio',
        sets: [],
      };
      group.sets.push(set);
      groups.set(key, group);
    });
  return Array.from(groups.values()).map((group) => ({
    ...group,
    sets: [...group.sets].sort(
      (a, b) => (a.set_number ?? 0) - (b.set_number ?? 0)
    ),
  }));
}

const DAY_LETTERS = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

function localDate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function weekActivity(
  history: {status: string; started_at: string}[],
  now = new Date()
) {
  const counts = new Map<string, number>();
  history
    .filter((session) => session.status === 'completed')
    .forEach((session) => {
      const date = localDate(new Date(session.started_at));
      counts.set(date, (counts.get(date) ?? 0) + 1);
    });
  return Array.from({length: 7}, (_, index) => {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    day.setDate(day.getDate() - (6 - index));
    const date = localDate(day);
    return {
      date,
      label: DAY_LETTERS[day.getDay()],
      count: counts.get(date) ?? 0,
    };
  });
}

export function formatSessionDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-MX', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

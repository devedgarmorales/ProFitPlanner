import {HistorySession} from '../interfaces/client';
interface Performance {
  weight: number;
  reps: number;
  started_at: string;
}
export interface ExerciseProgress {
  id: string;
  name: string;
  unit: string;
  performances: Performance[];
}
export function exerciseProgress(
  history: HistorySession[]
): ExerciseProgress[] {
  const completed = history
    .filter(session => session.status === 'completed')
    .sort(
      (a, b) =>
        b.started_at.localeCompare(a.started_at) || b.id.localeCompare(a.id)
    );
  const progress = new Map<string, ExerciseProgress>();
  completed.forEach(session => {
    const bestInSession = new Map<
      string,
      {id: string; name: string; unit: string; performance: Performance}
    >();
    session.sets.forEach(set => {
      if (
        !set.completed ||
        !set.exercise_id ||
        !set.weight_unit ||
        set.weight_used === null
      ) {
        return;
      }
      const key = `${set.exercise_id}:${set.weight_unit}`;
      const weight = Number(set.weight_used);
      if (!Number.isFinite(weight)) {
        return;
      }
      const best = bestInSession.get(key);
      if (
        !best ||
        weight > best.performance.weight ||
        (weight === best.performance.weight &&
          set.reps_performed > best.performance.reps)
      ) {
        bestInSession.set(key, {
          id: key,
          name: set.exercise_name || 'Ejercicio',
          unit: set.weight_unit,
          performance: {
            weight,
            reps: set.reps_performed,
            started_at: session.started_at,
          },
        });
      }
    });
    bestInSession.forEach(value => {
      const existing = progress.get(value.id) || {
        id: value.id,
        name: value.name,
        unit: value.unit,
        performances: [],
      };
      if (existing.performances.length < 2) {
        existing.performances.push(value.performance);
      }
      progress.set(value.id, existing);
    });
  });
  return Array.from(progress.values());
}

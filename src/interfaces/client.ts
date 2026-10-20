export interface Tokens {
  access: string;
  refresh: string;
}
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}
export interface Membership {
  id: string;
  role: string;
  organization: {id: string; name: string; slug: string};
}
export interface PrescribedSet {
  id: string;
  set_number: number;
  reps: number;
  target_weight: string | null;
  weight_unit: string;
  set_notes: string;
}
export interface DayExercise {
  id: string;
  exercise: {
    name: string;
    uuid?: string;
    id?: string | number;
    video_url?: string | null;
    category?: string | null;
    image?: string | null;
    primary_muscles?: {display_name: string}[];
  };
  sets: PrescribedSet[];
  rest_between_sets_seconds: number;
  client_notes: string;
}
export interface RoutineDay {
  id: string;
  name: string;
  description: string;
  day_index: number;
  estimated_duration_minutes: number;
  exercises: DayExercise[];
}
export interface Routine {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  coach: {id: string; name: string};
  days: RoutineDay[];
}
export interface WorkoutSet {
  exercise_set: string;
  reps_performed: number;
  weight_used: string | null;
  completed: boolean;
  notes: string;
}
export interface WorkoutSnapshot {
  id: string;
  routine_day: string;
  started_at: string;
  completed_at: string | null;
  status: 'in_progress' | 'completed';
  sets: WorkoutSet[];
}
export interface LocalWorkout extends WorkoutSnapshot {
  routine_name: string;
  day_name: string;
  coach_name: string;
  day: RoutineDay;
  revision: number;
  pending: boolean;
  rest_until?: number;
}
export interface HistorySession extends WorkoutSnapshot {
  routine_name: string;
  day_name: string;
  coach_name: string;
  sets: (WorkoutSet & {
    exercise_id?: string;
    exercise_name?: string;
    weight_unit?: string;
    set_number?: number;
  })[];
}
export interface ScopeData {
  routines: Routine[];
  workouts: LocalWorkout[];
  history: HistorySession[];
  cached_at?: string;
}

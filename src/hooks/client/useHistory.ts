import { useClientStore } from '../../store/clientStore';
import { mergeHistory } from '../../services/workout';
import { exerciseSummaries } from '../../services/workoutDisplay';
export function useHistory() {
  const { data, refresh, busy } = useClientStore();
  const history = mergeHistory(data.history, data.workouts);
  return {
    history,
    completedCount: history.filter((session) => session.status === 'completed')
      .length,
    summaries: exerciseSummaries(history),
    refresh,
    busy,
  };
}

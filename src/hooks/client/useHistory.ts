import {useClientStore} from '../../store/clientStore';
import {mergeHistory} from '../../services/workout';
import {exerciseProgress} from '../../services/workoutProgress';
export function useHistory() {
  const {data, refresh, busy} = useClientStore();
  const history = mergeHistory(data.history, data.workouts);
  return {
    history,
    completedCount: history.filter(session => session.status === 'completed')
      .length,
    progress: exerciseProgress(history).slice(0, 5),
    refresh,
    busy,
  };
}

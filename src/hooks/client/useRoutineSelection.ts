import { useState } from 'react';
import { useClientStore } from '../../store/clientStore';
import { apiError } from '../../services/clientApi';
export function useRoutineSelection(routineId: string, dayId?: string) {
  const state = useClientStore();
  const [error, setError] = useState('');
  const routine = state.data.routines.find((item) => item.id === routineId);
  const day = routine?.days.find((item) => item.id === dayId);
  return {
    routine,
    day,
    error,
    start: () => {
      if (!routine || !day) {
        return '';
      }
      try {
        return state.start(routine, day);
      } catch (failure) {
        setError(apiError(failure));
        return '';
      }
    },
  };
}

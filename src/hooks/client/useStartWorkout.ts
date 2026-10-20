import { useState } from 'react';
import { useClientStore } from '../../store/clientStore';
import { apiError } from '../../services/clientApi';
import { Routine, RoutineDay } from '../../interfaces/client';

export function useStartWorkout(onStarted: (sessionId: string) => void) {
  const start = useClientStore((state) => state.start);
  const [error, setError] = useState('');
  return {
    error,
    startDay: (routine: Routine, day: RoutineDay) => {
      try {
        const sessionId = start(routine, day);
        if (sessionId) {
          setError('');
          onStarted(sessionId);
        }
      } catch (failure) {
        setError(apiError(failure));
      }
    },
  };
}

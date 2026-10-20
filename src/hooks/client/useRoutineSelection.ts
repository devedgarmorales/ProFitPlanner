import { useClientStore } from '../../store/clientStore';

export function useRoutineSelection(routineId: string) {
  const routine = useClientStore((state) =>
    state.data.routines.find((item) => item.id === routineId)
  );
  return { routine };
}

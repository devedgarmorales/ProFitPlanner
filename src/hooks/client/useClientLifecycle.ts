import { useEffect } from 'react';
import { AppState } from 'react-native';
import { useClientStore } from '../../store/clientStore';
export function useClientLifecycle() {
  useEffect(() => {
    useClientStore.getState().boot();
    const listener = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        useClientStore.getState().refresh();
      } else {
        useClientStore.getState().sync();
      }
    });
    return () => listener.remove();
  }, []);
}

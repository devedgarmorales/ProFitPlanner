import { create } from 'zustand';

interface ToastStore {
    position: 'top' | 'bottom';
    toastConfig: any;
    setToastPosition: (position: 'top' | 'bottom') => void;
    setToastConfig: (config: any) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
    position: 'top', // valor por defecto
    toastConfig: {
        success: {
            backgroundColor: 'green',
            textColor: 'white',
        },
        error: {
            backgroundColor: 'red',
            textColor: 'white',
        },
    },
    setToastPosition: (position) => set({ position }),
    setToastConfig: (config) => set({ toastConfig: config }),
}));

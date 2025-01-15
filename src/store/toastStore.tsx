import { create } from 'zustand';

interface ToastStore {
    position: 'top' | 'bottom';
    toastConfig: any;
    setToastPosition: (position: 'top' | 'bottom') => void;
    setToastConfig: (config: any) => void;
    sizeToast: number;
    setSizeToast: (size: number) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
    position: 'top',
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
    sizeToast: 80,
    setSizeToast: (size) => set({ sizeToast: size }),
}));

import { create } from 'zustand';

interface UpdateTokenState {
    update: boolean;
    updateScreen: () => void;
    stopUpdate: () => void;
}

const useUpdateToken = create<UpdateTokenState>((set) => ({
    update: false,
    updateScreen: () => set({ update: true }),
    stopUpdate: () => set({ update: false }),
}));

export default useUpdateToken;

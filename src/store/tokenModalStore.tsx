import { create } from 'zustand';

interface TokenModalState {
    show: boolean;
    showModal: () => void;
    hideModal: () => void;
}

const useTokenModalStore = create<TokenModalState>((set) => ({
    show: false,
    showModal: () => set({ show: true }),
    hideModal: () => set({ show: false }),
}));

export default useTokenModalStore;

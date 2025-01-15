import { create } from 'zustand';
import { ActionSheetRef } from 'react-native-actions-sheet';

interface ActionSheetLoginStore {
    actionSheetRef: ActionSheetRef | null;
    setActionSheetRef: (ref: ActionSheetRef) => void;
    showActionSheet: () => void;
    hideActionSheet: () => void;
}

export const useActionSheetStore = create<ActionSheetLoginStore>((set) => ({
    actionSheetRef: null,
    setActionSheetRef: (ref) => set({ actionSheetRef: ref }),
    showActionSheet: () =>
        set((state) => {
            state.actionSheetRef?.show();
            return {};
        }),
    hideActionSheet: () =>
        set((state) => {
            state.actionSheetRef?.hide();
            return {};
        }),
}));

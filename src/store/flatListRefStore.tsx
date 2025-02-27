import { create } from "zustand";
import { FlatList } from "react-native";
import { RefObject, createRef } from "react";

interface FlatListStore {
    flatListRef: RefObject<FlatList<any>>;
    setFlatListRef: (ref: RefObject<FlatList<any>>) => void;
}

export const useFlatListStore = create<FlatListStore>((set) => ({
    flatListRef: createRef<FlatList<any>>(),
    setFlatListRef: (ref) => set({ flatListRef: ref }),
}));

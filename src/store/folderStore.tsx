import { create } from 'zustand';

interface FolderState {
    dataFolders: any[];
    setDataFolders: (folders: any[]) => void;
}

export const useFolderStore = create<FolderState>((set) => ({
    dataFolders: [],
    setDataFolders: (folders) => set(() => ({ dataFolders: folders })),
}));

import { create } from "zustand";

interface FileStore {
  isFileDeleted: boolean;
  setIsFileDeleted: (value: boolean) => void;
}

const useFileStore = create<FileStore>((set) => ({
  isFileDeleted: false,
  setIsFileDeleted: (value: boolean) => set({ isFileDeleted: value }),
}));

export default useFileStore;

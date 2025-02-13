import { create } from "zustand";
import { ReactNode } from "react";

type DialogState = {
  isOpen: boolean;
  content: ReactNode;
  openDialog: (content: ReactNode) => void;
  closeDialog: () => void;
};

export const useDialogStore = create<DialogState>((set) => ({
  isOpen: false,
  content: null,
  openDialog: (content) => set({ isOpen: true, content }),
  closeDialog: () => set({ isOpen: false, content: null }),
}));

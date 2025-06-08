import { create } from "zustand";

export const useAppStore = create<Record<string, any>>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  userLoading: 0,
  setUserLoading: (userLoading) => set({ userLoading }),
}));

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PersistedStore {
  showOnboarding: boolean;
  hideOnboarding: () => void;
}

export const usePersistedStore = create(
  persist<PersistedStore>(
    (set) => ({
      showOnboarding: true,
      hideOnboarding: () => set({ showOnboarding: false }),
    }),
    {
      name: `persisted-store`,
    }
  )
);

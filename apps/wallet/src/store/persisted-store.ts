import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PersistedStore {
  showOnboarding: boolean;
  hideOnboarding: () => void;
  setNetwork: (network: string) => void;
  network?: string;
}

export const usePersistedStore = create(
  persist<PersistedStore>(
    (set) => ({
      showOnboarding: true,
      network: 'polygon',
      hideOnboarding: () => set({ showOnboarding: false }),
      setNetwork: (network) => set({ network }),
    }),
    {
      name: `persisted-store`,
    }
  )
);

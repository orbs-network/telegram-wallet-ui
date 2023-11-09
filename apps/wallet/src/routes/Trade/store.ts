import { create } from 'zustand';

interface Store {
  inAmount: string;
  setInAmount: (value?: string) => void;
  inToken?: string;
  outToken?: string;
  setInToken: (inToken?: string) => void;
  setOutToken: (outToken?: string) => void;
}

export const useTradeStore = create<Store>((set) => ({
  inAmount: '',
  setInAmount: (value) => {
    set({ inAmount: value });
  },
  inToken: undefined,
  outToken: undefined,
  setInToken: (inToken) => set({ inToken }),
  setOutToken: (outToken) => set({ outToken }),
}));

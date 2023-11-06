import { useEffect, useRef } from 'react';
import { create } from 'zustand';

interface ButtonProps {
  onClick?: () => void;
  text?: string;
  disabled?: boolean;
  progress?: boolean;
  disableUpdate?: boolean;
}

interface Store extends ButtonProps {
  setButton: (args: ButtonProps) => void;
  resetButton: () => void;
}

export const useMainButtonStore = create<Store>((set) => ({
  onClick: undefined,
  text: undefined,
  disabled: false,
  progress: false,
  setButton: (args: ButtonProps) => set({ ...args }),
  resetButton: () =>
    set({
      onClick: undefined,
      text: undefined,
      disabled: false,
      progress: false,
    } as ButtonProps),
}));

export const useUpdateMainButton = (args: ButtonProps) => {
  const { setButton } = useMainButtonStore();
  const preventButtonStateChange = useRef(false);

  const { disabled, text, onClick, progress, disableUpdate } = args;

  useEffect(() => {
    const handleEvent = () => {
      setButton({
        progress: false,
      });
      preventButtonStateChange.current = true;
    };

    window.addEventListener('popstate', handleEvent);
    return () => window.removeEventListener('popstate', handleEvent);
  }, [setButton]);

  useEffect(() => {
    if (preventButtonStateChange.current) return;

    setButton({
      text: text,
      disabled: disabled,
      progress: progress,
      onClick: () => {
        if (!onClick) {
          preventButtonStateChange.current = true;
        } else {
          Promise.resolve(onClick()).then(() => {            
            preventButtonStateChange.current = true;
          });
        }
      },
    });
  }, [setButton, disabled, onClick, progress, text]);
};

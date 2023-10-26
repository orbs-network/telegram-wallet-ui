import {
  ReactNode,
  useContext,
  useState,
  createContext,
  useCallback,
} from 'react';

interface ButtonArgs {
  onClick: () => void;
  text: string;
  disabled?: boolean;
  progress?: boolean;
}

interface ContextType extends ButtonArgs {
  onSetButton: (args: ButtonArgs) => void;
  resetButton: () => void;
}

const Context = createContext({} as ContextType);

const MainButtonContextProvider = ({ children }: { children: ReactNode }) => {
  const [args, setArgs] = useState({} as ButtonArgs);

  const onSetButton = useCallback(
    (args: ButtonArgs) => {
      setArgs(args);
    },
    [setArgs]
  );

  const resetButton = useCallback(() => {
    setArgs({} as ButtonArgs);
  }, [setArgs]);

  return (
    <Context.Provider value={{ ...args, onSetButton, resetButton }}>
      {children}
    </Context.Provider>
  );
};

const useMainButtonContext = () => useContext(Context);
export { MainButtonContextProvider, useMainButtonContext };

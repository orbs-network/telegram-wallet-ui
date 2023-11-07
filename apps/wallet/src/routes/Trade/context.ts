import { useContext, createContext } from 'react';

interface ContextArgs {
  disableMainButtonUpdate?: boolean;
  setDisableMainButtonUpdate: () => void;
}

export const TradeContext = createContext({} as ContextArgs);
export const useTradeContext = () => useContext(TradeContext);

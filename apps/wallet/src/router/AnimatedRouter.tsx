import React, { useContext, useEffect } from 'react';
import {
  NavigationType,
  Route,
  RouteObject,
  Routes,
  useLocation,
  useMatch,
  useNavigate,
  useNavigationType,
} from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ErrorPage } from '../ErrorPage';
import { ROUTES } from './routes';
import { useCurrentPath } from '../hooks';
import { BackButton, setTwaBg } from '@telegram-wallet-ui/twa-ui-kit';

type ContextType = {
  navigationType: NavigationType;
};

const Context = React.createContext({ navigationType: 'PUSH' } as ContextType);
const AnimatedRouter = ({ routes }: { routes: RouteObject[] }) => {
  const location = useLocation();
  const navigationType = useNavigationType();

  // TODO: must be a better way to match multiple routes
  const isWithdrawSuccess = useMatch(ROUTES.withdrawSuccess);
  const isTradeSuccess = useMatch(ROUTES.tradeSuccess);
  const isTrade = useMatch(ROUTES.trade);
  const isTradeIn = useMatch(ROUTES.tradeInTokenSelect);
  const isTradeOut = useMatch(ROUTES.tradeOutTokenSelect);

  const homePage = location.pathname === ROUTES.root;

  useEffect(() => {
    if (
      isWithdrawSuccess ||
      isTradeSuccess ||
      isTrade ||
      isTradeIn ||
      isTradeOut
    ) {
      setTwaBg(true);
    } else {
      setTwaBg(false);
    }
  }, [
    isTrade,
    isTradeIn,
    isTradeOut,
    isTradeSuccess,
    isWithdrawSuccess,
    location,
  ]);

  return (
    <Context.Provider value={{ navigationType }}>
      <Back />
      <AnimatePresence initial={!homePage}>
        <Routes location={location} key={location.pathname}>
          {routes.map((route) => {
            return (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            );
          })}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </AnimatePresence>
    </Context.Provider>
  );
};

const Back = () => {
  const navigate = useNavigate();

  const currentPath = useCurrentPath();

  if (currentPath === ROUTES.root || currentPath === ROUTES.withdrawSuccess)
    return null;

  return <BackButton onClick={() => navigate(-1)} />;
};

const useAnimatedRouterContext = () => useContext(Context);

export { AnimatedRouter, useAnimatedRouterContext };

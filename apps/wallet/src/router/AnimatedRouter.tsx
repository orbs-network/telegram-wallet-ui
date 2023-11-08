import React, { useContext, useEffect } from 'react';
import {
  NavigationType,
  Route,
  RouteObject,
  Routes,
  matchRoutes,
  useLocation,
  useNavigate,
  useNavigationType,
} from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ErrorPage } from '../ErrorPage';
import { ROUTES } from './routes';
import { useCurrentPath } from '../hooks';
import { BackButton, setTwaBg } from '@telegram-wallet-ui/twa-ui-kit';

const routesToMatch = [
  ROUTES.withdrawAddress,
  ROUTES.withdrawSuccess,
  ROUTES.tradeSuccess,
  ROUTES.trade,
  ROUTES.tradeInTokenSelect,
  ROUTES.tradeOutTokenSelect,
].map((route) => {
  return {
    path: route,
  };
});

type ContextType = {
  navigationType: NavigationType;
};

const Context = React.createContext({ navigationType: 'PUSH' } as ContextType);
const AnimatedRouter = ({ routes }: { routes: RouteObject[] }) => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const match = matchRoutes(routesToMatch, location);

  const homePage = location.pathname === ROUTES.root;

  useEffect(() => {
    if (match) {
      setTwaBg(true);
    } else {
      setTwaBg(false);
    }
  }, [match]);

  useEffect(() => {
    const staticLoader = document.querySelector('.loader-container');
    staticLoader?.parentNode?.removeChild(staticLoader);
  }, []);

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

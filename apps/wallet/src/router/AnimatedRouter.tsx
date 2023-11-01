import React, { useContext, useEffect, useRef } from 'react';
import {
  NavigationType,
  Route,
  RouteObject,
  Routes,
  useLocation,
  useNavigate,
  useNavigationType,
} from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ErrorPage } from '../ErrorPage';
import { BackButton } from '@twa-dev/sdk/react';
import { ROUTES } from './routes';
import { useCurrentPath } from '../hooks';

type ContextType = {
  navigationType: NavigationType;
};

const Context = React.createContext({ navigationType: 'PUSH' } as ContextType);
const AnimatedRouter = ({ routes }: { routes: RouteObject[] }) => {
  const location = useLocation();
  const navigationType = useNavigationType();

  return (
    <Context.Provider value={{ navigationType }}>
      <Back />
      <AnimatePresence>
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

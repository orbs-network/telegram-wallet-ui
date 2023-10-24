import React, {
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  NavigationType,
  Route,
  RouteObject,
  Routes,
  useLocation,
  useNavigationType,
} from 'react-router-dom';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { ErrorPage } from '../ErrorPage';
import { transition } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { colors } from '@telegram-wallet-ui/twa-ui-kit';

type ContextType = {
  navigationType: NavigationType;
};

const Context = React.createContext({ navigationType: 'PUSH' } as ContextType);
const AnimatedRouter = ({ routes }: { routes: RouteObject[] }) => {
  const location = useLocation();
  const navigationType = useNavigationType();

  return (
    <Context.Provider value={{ navigationType }}>
      <AnimatePresence>
        <Routes location={location} key={location.pathname}>
          {routes.map((route) => {
            return (
              <Route
                key={route.path}
                path={route.path}
                element={<AnimatedRoute>{route.element}</AnimatedRoute>}
              />
            );
          })}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </AnimatePresence>
    </Context.Provider>
  );
};

const useAnimatedRouterContext = () => useContext(Context);

const useVariants = () => {
  const { navigationType } = useAnimatedRouterContext();
  return useMemo(() => {
    const isPush = navigationType === 'PUSH';
    const isPop = navigationType === 'POP';

    return {
      enter: {
        x: 0,
        transition,
        transitionEnd: {
          // after animation has finished, reset the position to static
          //   position: 'static',
        },
        // keep top "layer" of animation as a fixed position
        ...(isPush
          ? {
              position: 'fixed',
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
            }
          : {}),
      },
      initial: {
        x: isPush ? '100%' : '-25%',
        transition,
        // keep top "layer" of animation as a fixed position
        ...(isPush
          ? {
              position: 'fixed',
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
            }
          : {}),
      },

      exit: {
        x: isPop ? '100%' : '-10%',
        zIndex: isPop ? 1 : -1,
        transition: {
          ...transition,
          delay: 0,
        },

        // keep top "layer" of animation as a fixed position
        // this will, however, reset the scroll position of the page being dismissed
        ...(isPop
          ? {
              position: 'fixed',
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
            }
          : {}),
      },
    };
  }, [navigationType]);
};

const useHeight = () => {
  const [height, setHeight] = useState(window.innerHeight);
  useEffect(() => {
    const handleResize = () => setHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return height;
};

export const AnimatedRoute = (props: { children: ReactNode }) => {
  const { children } = props;
  const height = useHeight();

  const childVariants = useVariants();

  return (
    <motion.main
      initial="initial"
      animate="enter"
      exit="exit"
      variants={childVariants as Variants}
    >
      <AnimatedRouteContainer style={{ height }}>
        {children}
      </AnimatedRouteContainer>
    </motion.main>
  );
};

const AnimatedRouteContainer = styled('div')({
  backgroundColor: colors.secondary_bg_color,
  paddingBottom: 50,
  overflowY:'auto'
});

export { AnimatedRouter, useAnimatedRouterContext };

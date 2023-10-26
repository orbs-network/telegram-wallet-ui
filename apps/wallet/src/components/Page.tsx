import styled from '@emotion/styled';
import React, { ReactNode, useMemo } from 'react';
import { colors } from '@telegram-wallet-ui/twa-ui-kit';
import { useAnimatedRouterContext } from '../router/AnimatedRouter';
import { motion, Variants } from 'framer-motion';
import Telegram from '@twa-dev/sdk';

const transition = { ease: 'easeInOut', duration: 0.3 };

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

export const Page = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => {
  const childVariants = useVariants();

  return (
    <motion.main
      initial="initial"
      animate="enter"
      exit="exit"
      variants={childVariants as Variants}
      style={{flex:1}}
    >
      <AnimatedRouteContainer className={className}>
        {children}
      </AnimatedRouteContainer>
    </motion.main>
  );
};
const AnimatedRouteContainer = styled('div')({
  backgroundColor: colors.secondary_bg_color,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflowX: 'hidden',
  paddingBottom: !Telegram.initData ? 60 : 0,
});

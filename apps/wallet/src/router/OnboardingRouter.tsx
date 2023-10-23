import { RouteObject } from 'react-router-dom';
import { AnimatedRouter } from './AnimatedRouter';
import { Page1, Page2, Page3 } from '../routes';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Page1 />,
  },
  {
    path: '/2',
    element: <Page2 />,
  },
  {
    path: '/3',
    element: <Page3 />,
  },

];

export const OnboardingRouter = () => {
  return <AnimatedRouter routes={routes} />;
};

import { AnimatedRouter } from './AnimatedRouter';
import { Page1, Page2, Page3 } from '../routes';
import { RouteObject } from 'react-router-dom';
import { ROUTES } from './routes';

const routes: RouteObject[] = [
  {
    path: ROUTES.root,
    element: <Page1 />,
  },
  {
    path: ROUTES.onboardingPage1,
    element: <Page2 />,
  },
  {
    path: ROUTES.onboardingPage2,
    element: <Page3 />,
  },
];

export const OnboardingRouter = () => {
  return <AnimatedRouter routes={routes} />;
};

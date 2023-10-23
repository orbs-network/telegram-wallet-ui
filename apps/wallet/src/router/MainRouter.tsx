import { RouteObject } from 'react-router-dom';
import { AnimatedRouter } from './AnimatedRouter';
import {
  Asset,
  Buy,
  SelectMethod,
  DepositAddress,
  TempUtils,
  Home,
  Trade,
} from '../routes';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/deposit',
    element: <SelectMethod />,
  },
  {
    path: '/deposit/buy',
    element: <Buy />,
  },
  {
    path: '/deposit/crypto',
    element: <DepositAddress />,
  },
  {
    path: '/tempUtils',
    element: <TempUtils />,
  },
  {
    path: '/asset/:assetId',
    element: <Asset />,
  },
  {
    path: '/trade',
    element: <Trade />,
  },
];

export const MainRouter = () => {
  return <AnimatedRouter routes={routes} />;
};

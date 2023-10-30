import { AnimatedRouter } from './AnimatedRouter';
import {
  Asset,
  Buy,
  SelectMethod,
  DepositAddress,
  TempUtils,
  Debug,
  Home,
  Withdraw,
  WithdrawAddress,
  WithdrawAmount,
  WithdrawSuccess,
  WithdrawSummary,
  DepositSelectToken,
  OptimizedTrade,
  TradeReview,
  TradeSuccess,
  Review,
  Success,
  Trade,
} from '../routes';
import { RouteObject } from 'react-router-dom';
import { ROUTES } from './routes';



const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: ROUTES.deposit,
    element: <DepositSelectToken />,
  },
  {
    path: ROUTES.depositSelectMethod,
    element: <SelectMethod />,
  },
  {
    path: ROUTES.depositBuy,
    element: <Buy />,
  },
  {
    path: ROUTES.depositCrypto,
    element: <DepositAddress />,
  },
  {
    path: ROUTES.tempUtils,
    element: <TempUtils />,
  },
  {
    path: ROUTES.asset,
    element: <Asset />,
  },
  {
    path: '/debug',
    element: <Debug />,
  },
  {
    path: ROUTES.withdraw,
    element: <Withdraw />,
  },
  {
    path: ROUTES.withdrawAddress,
    element: <WithdrawAddress />,
  },
  {
    path: ROUTES.withdrawAmount,
    element: <WithdrawAmount />,
  },
  {
    path: ROUTES.withdrawSummary,
    element: <WithdrawSummary />,
  },
  {
    path: ROUTES.withdrawSuccess,
    element: <WithdrawSuccess />,
  },
  {
    path: ROUTES.trade,
    element: <Trade />,
  },
  {
    path: ROUTES.tradeReview,
    element: <TradeReview />,
  },
  {
    path: ROUTES.tradeSuccess,
    element: <TradeSuccess />,
  },
  // {
  //   path: ROUTES.tradeReview,
  //   element: <Review />,
  // },
  // {
  //   path: ROUTES.tradeSuccess,
  //   element: <Success />,
  // },
];

export const MainRouter = () => {
  return <AnimatedRouter routes={routes} />;
};

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
  TradePanel,
  TradeReview,
  TradeSuccess,
  TradeTokenSelect,
  Network,
} from '../routes';
import { RouteObject } from 'react-router-dom';
import { ROUTES } from './routes';
import { Transaction } from '../routes/Transaction';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: ROUTES.deposit,
    element: <SelectMethod />,
  },
  {
    path: ROUTES.depositSelectCoin,
    element: <DepositSelectToken />,
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
    path: ROUTES.networkSelect,
    element: <Network />,
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
    element: <TradePanel />,
  },
  {
    path: ROUTES.tradeInTokenSelect,
    element: <TradeTokenSelect isIn={true} />,
  },
  {
    path: ROUTES.tradeOutTokenSelect,
    element: <TradeTokenSelect />,
  },
  {
    path: ROUTES.tradeReview,
    element: <TradeReview />,
  },
  {
    path: ROUTES.tradeSuccess,
    element: <TradeSuccess />,
  },
  {
    path: ROUTES.transaction,
    element: <Transaction />,
  },
  {
    path: '*',  
    element: <Home />,
  }
];

export const MainRouter = () => {
  return <AnimatedRouter routes={routes} />;
};

import {
  DepositTransactionEvent,
  TradeTransactionEvent,
  WithdrawalTransactionEvent,
} from '../lib/EventsProvider';

export const mockTransactions: (
  | DepositTransactionEvent
  | WithdrawalTransactionEvent
  | TradeTransactionEvent
)[] = [
  {
    id: '0',
    amount: '0.1231445',
    date: new Date('2021-04-07T14:50:00.000Z'),
    direction: 'outgoing',
    status: 'completed',
    type: 'withdrawal',
    token: 'MATIC',
  },
  {
    id: '1',
    amount: '0.12',
    date: new Date('2021-03-07T14:50:00.000Z'),
    direction: 'incoming',
    status: 'completed',
    type: 'deposit',
    token: 'MATIC',
  },
];

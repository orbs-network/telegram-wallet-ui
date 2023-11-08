import { LocalStorageProvider } from './LocalStorageProvider';
import { v1 } from 'uuid';
import { getDebug } from './utils/debug';
import { eventsProvider } from '../config';
import { useEffect, useState } from 'react';

const debug = getDebug('EventsProvider');

type AddedWithdrawalTransactionEvent = {
  token: string;
  amount: string;
  toAddress?: string;
};

type AddedTradeTransactionEvent = {
  inToken: string;
  outToken: string;
  amountIn: string;
  amountOut: string;
  exchangeRate: string;
};

export type TransactionEventDirection = 'incoming' | 'outgoing';

export type TransactionEventStatus = 'completed' | 'pending';

export type TransactionEventType =
  | 'deposit'
  | 'withdrawal'
  | 'trade'
  | 'transfer';

export type TransactionEvent = {
  date: Date;
  status: TransactionEventStatus;
  type: TransactionEventType;
  direction: TransactionEventDirection;
  id: string;
};

export type WithdrawalTransactionEvent = TransactionEvent &
  AddedWithdrawalTransactionEvent & {
    token: string;
    amount: string;
    toAddress: string;
  };

export type TradeTransactionEvent = TransactionEvent & {
  inToken: string;
  outToken: string;
  amountIn: string;
  amountOut: string;
  exchangeRate: string;
};

type AddedDepositTransactionEvent = {
  amount: string;
  token: string;
};

export type DepositTransactionEvent = TransactionEvent &
  AddedDepositTransactionEvent;

export class EventsProvider {
  constructor(private storage: LocalStorageProvider) {
    this.storage.setKeyPrefix('events');
  }

  private addEvent(event: Record<string, any>) {
    this.storage.storeObject(v1(), {
      ...event,
      date: Date.now(),
      status: 'completed',
    });
    this.onUpdate();
  }

  withdrawal(event: AddedWithdrawalTransactionEvent) {
    this.addEvent({ ...event, type: 'withdrawal' });
  }

  trade(event: AddedTradeTransactionEvent) {
    this.addEvent({ ...event, type: 'trade' });
  }

  deposit(event: AddedDepositTransactionEvent) {
    this.addEvent({ ...event, type: 'deposit' });
  }

  events() {
    return Object.entries(this.storage.readAll<TransactionEvent>())
      .map(([id, e]) => {
        e.date = new Date(e.date);
        e.id = id;
        switch (e.type) {
          case 'withdrawal':
            e.direction = 'outgoing';
            break;
          case 'trade':
            e.direction = 'incoming';
            break;
          case 'deposit':
            e.direction = 'incoming';
            break;
          default:
            throw new Error(`Unknown event type: ${e.type}`);
        }
        return e;
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  clear() {
    this.storage.clear();
    this.onUpdate();
  }

  private onUpdate() {
    window.dispatchEvent(new Event('events-provider-update'));
  }
}

export function useEventsProvider() {
  const [events, setEvents] = useState<TransactionEvent[]>(
    eventsProvider.events()
  );

  useEffect(() => {
    const listener = () => {
      setEvents(eventsProvider.events());
    };

    window.addEventListener('events-provider-update', listener);

    return () => {
      window.removeEventListener('events-provider-update', listener);
    };
  }, []);

  return events;
}

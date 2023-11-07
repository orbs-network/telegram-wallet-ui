import { Text, SkeletonText } from '@chakra-ui/react';
import { Card, List } from '@telegram-wallet-ui/twa-ui-kit';
import {
  DepositTransactionEvent,
  TradeTransactionEvent,
  TransactionEvent,
  WithdrawalTransactionEvent,
  useEventsProvider,
} from '../../lib/EventsProvider';
import { useMemo } from 'react';
import { amountUi } from '../../utils/conversion';
import BN from 'bignumber.js';
import { useUserData } from '../../hooks';
import { TransactionHistoryItem } from './TransactionHistoryItem';

const filterTx = (transactions?: TransactionEvent[]) => {
  return transactions?.filter((tx) => {
    switch (tx.type) {
      case 'deposit':
      case 'withdrawal': {
        if ('amount' in tx && tx.amount === '') {
          return false;
        }
        break;
      }
      case 'trade': {
        if (
          ('amountIn' in tx && tx.amountIn === '') ||
          ('amountOut' in tx && tx.amountOut === '')
        ) {
          return false;
        }
        break;
      }
      default: {
        return true;
      }
    }
    return true;
  });
};

type TransactionsProps = {
  tokenFilter?: string;
};

export function TransactionHistory({ tokenFilter }: TransactionsProps) {
  const events = useEventsProvider();
  const { data: userData } = useUserData();

  const transactions = useMemo(() => {
    const filteredTxs = tokenFilter
      ? events.filter((tx) => {
          switch (tx.type) {
            case 'deposit':
            case 'withdrawal': {
              const token = Object.values(userData?.tokens || []).find(
                (t) =>
                  t.address ===
                  (tx as DepositTransactionEvent | WithdrawalTransactionEvent)
                    .token
              );

              if (!token) {
                return false;
              }

              return token.symbol === tokenFilter;
            }
            case 'trade': {
              const tradeTx = tx as TradeTransactionEvent;

              const inToken = Object.values(userData?.tokens || []).find(
                (t) => t.address === tradeTx.inToken
              );

              const outToken = Object.values(userData?.tokens || []).find(
                (t) => t.address === tradeTx.outToken
              );

              if (!inToken || !outToken) {
                return false;
              }

              return (
                inToken?.symbol === tokenFilter ||
                outToken?.symbol === tokenFilter
              );
            }
            default: {
              return false;
            }
          }
        })
      : events;

    const sortedTxs = filteredTxs.sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );

    const mappedTxs = sortedTxs.map((tx) => {
      switch (tx.type) {
        case 'deposit': {
          const dTx = tx as DepositTransactionEvent;

          const token = Object.values(userData?.tokens || []).find(
            (token) => token.address === dTx.token
          );

          return {
            ...dTx,
            token,
            amount: amountUi(token, BN(dTx.amount)),
          };
        }
        case 'withdrawal': {
          const wTx = tx as WithdrawalTransactionEvent;
          const token = Object.values(userData?.tokens || []).find(
            (token) => token.address === wTx.token
          );
          return {
            ...wTx,
            token,
            amount: amountUi(token, BN(wTx.amount)),
          };
        }
        case 'trade': {
          const tradeTx = tx as TradeTransactionEvent;
          const inToken = Object.values(userData?.tokens || []).find(
            (token) => token.address === tradeTx.inToken
          );
          const outToken = Object.values(userData?.tokens || []).find(
            (token) => token.address === tradeTx.outToken
          );
          return {
            ...tradeTx,
            inToken,
            outToken,
            amountIn: amountUi(inToken, BN(tradeTx.amountIn)),
            amountOut: amountUi(outToken, BN(tradeTx.amountOut)),
          };
        }
        default: {
          return tx;
        }
      }
    });

    return filterTx(mappedTxs);
  }, [events, tokenFilter, userData?.tokens]);

  if (!userData) {
    return (
      <Card>
        <SkeletonText />
      </Card>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Card>
        <Text variant="hint">NO TRANSACTIONS</Text>
      </Card>
    );
  }

  return (
    <List mode="select" title="TRANSACTION HISTORY">
      {transactions.map((tx) => {
        return (
          <TransactionHistoryItem
            key={tx.id}
            tx={tx}
            tokenFilter={tokenFilter}
          />
        );
      })}
    </List>
  );
}

import { Avatar, Heading, Box, Text, SkeletonText } from '@chakra-ui/react';
import { Card, ListItem, colors, List } from '@telegram-wallet-ui/twa-ui-kit';
import {
  DepositTransactionEvent,
  TradeTransactionEvent,
  TransactionEvent,
  WithdrawalTransactionEvent,
  useEventsProvider,
} from '../lib/EventsProvider';
import { useMemo } from 'react';
import { amountUi, toUiDisplay } from '../utils/conversion';
import BN from 'bignumber.js';
import { useUserData } from '../hooks';
import { TokenData } from '../types';
import { Link } from 'react-router-dom';
import { formatDateTime } from '../utils/utils';
import { DepositIcon, TradeIcon, WithdrawIcon } from './icons';
import { css } from '@emotion/react';
import _ from 'lodash';

const styles = {
  avatar: css`
    width: 40px;
    height: 40px;
  `,
};

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

export function Transactions({ tokenFilter }: TransactionsProps) {
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
        let StartIcon = null;
        let CardTitle = null;
        let CardData = null;

        switch (tx.type) {
          case 'deposit': {
            const dTx = tx as DepositTransactionEvent & {
              token: TokenData | undefined;
            };
            StartIcon = (
              <Avatar
                css={styles.avatar}
                icon={<DepositIcon />}
                backgroundColor="telegram.500"
              />
            );
            CardTitle = (
              <Heading as="h3" variant="bodyTitle" noOfLines={1}>
                Deposit
              </Heading>
            );
            CardData = (
              <Box
                style={{
                  textAlign: 'right',
                  color:
                    dTx.status === 'pending'
                      ? colors.hint_color
                      : colors.success,
                }}
              >
                <Text noOfLines={1}>
                  +{toUiDisplay(dTx.amount)} {dTx.token?.symbolDisplay}
                </Text>
                <Text fontSize={12}>
                  {dTx.status === 'pending' ? 'Pending' : 'Received'}
                </Text>
              </Box>
            );
            break;
          }
          case 'withdrawal': {
            const wTx = tx as WithdrawalTransactionEvent & {
              token: TokenData;
            };
            StartIcon = <Avatar css={styles.avatar} icon={<WithdrawIcon />} />;
            CardTitle = (
              <Heading as="h3" variant="bodyTitle" noOfLines={1}>
                Withdrawal to {wTx.toAddress.slice(0, 6) + '...'}
              </Heading>
            );
            CardData = (
              <Box
                style={{
                  textAlign: 'right',
                }}
              >
                <Text noOfLines={1}>
                  {/* TODO: seems the amount on withdrawal is not the same format as trade */}
                  {toUiDisplay(wTx.amount)} {wTx.token?.symbolDisplay}
                </Text>
                <Text fontSize={12}>Sent</Text>
              </Box>
            );
            break;
          }
          case 'trade': {
            const tradeTx = tx as TradeTransactionEvent & {
              amountIn: string;
              amountOut: string;
              inToken: TokenData | undefined;
              outToken: TokenData | undefined;
            };

            StartIcon = (
              <Avatar
                css={styles.avatar}
                icon={<TradeIcon />}
                backgroundColor="telegram.500"
              />
            );
            CardTitle = (
              <Heading as="h3" variant="bodyTitle" noOfLines={1}>
                Buy {tradeTx.outToken?.symbolDisplay} with{' '}
                {tradeTx.inToken?.symbolDisplay}
              </Heading>
            );
            const isIn =
              !!tokenFilter && tokenFilter === tradeTx.inToken?.symbol;
            const amount = isIn ? tradeTx.amountIn : tradeTx.amountOut;
            const token = isIn ? tradeTx.inToken : tradeTx.outToken;

            CardData = (
              <Box
                style={{
                  textAlign: 'right',
                  color: isIn ? 'inherit' : colors.success,
                }}
              >
                <Text noOfLines={1}>
                  {!isIn && '+'}
                  {toUiDisplay(amount)} {token?.symbolDisplay ?? ''}
                </Text>
                <Text fontSize={12}>{!isIn ? 'Received' : 'Traded'}</Text>
              </Box>
            );
            break;
          }
          default: {
            StartIcon = <Avatar css={styles.avatar} />;
          }
        }

        return (
          <Link key={tx.id} to={`/transaction/${tx.id}`}>
            <ListItem
              StartIconSlot={StartIcon}
              StartTextSlot={
                <Box>
                  {CardTitle}
                  <Text variant="hint" fontSize="xs">
                    {formatDateTime(tx.date)}
                  </Text>
                </Box>
              }
              EndTextSlot={CardData}
            />
          </Link>
        );
      })}
    </List>
  );
}

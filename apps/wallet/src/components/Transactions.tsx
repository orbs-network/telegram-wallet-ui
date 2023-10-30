import {
  Avatar,
  Heading,
  Box,
  Text,
  Icon,
  SkeletonText,
} from '@chakra-ui/react';
import { Card, ListItem, colors } from '@telegram-wallet-ui/twa-ui-kit';
import { BiSolidDownArrowCircle, BiSolidUpArrowCircle } from 'react-icons/bi';
import { MdSwapHorizontalCircle } from 'react-icons/md';
import {
  DepositTransactionEvent,
  TradeTransactionEvent,
  WithdrawalTransactionEvent,
  useEventsProvider,
} from '../lib/EventsProvider';
import { useMemo } from 'react';
import { amountUi } from '../utils/conversion';
import BN from 'bignumber.js';
import { useUserData } from '../hooks';
import { TokenData } from '../types';
import { Link } from 'react-router-dom';

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
              const inToken = Object.values(userData?.tokens || []).find(
                (t) => t.address === (tx as TradeTransactionEvent).inToken
              );

              const outToken = Object.values(userData?.tokens || []).find(
                (t) => t.address === (tx as TradeTransactionEvent).outToken
              );

              if (!inToken && !outToken) {
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

    return mappedTxs;
  }, [events, tokenFilter, userData?.tokens]);

  if (!userData) {
    return (
      <Card>
        <SkeletonText />
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <Text variant="hint">NO TRANSACTIONS</Text>
      </Card>
    );
  }

  return (
    <Card>
      <Text variant="hint">TRANSACTION HISTORY</Text>
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
                icon={<Icon as={BiSolidDownArrowCircle} />}
                backgroundColor="telegram.500"
              />
            );
            CardTitle = (
              <Heading as="h3" variant="bodyTitle">
                Deposit
              </Heading>
            );
            CardData = (
              <Box
                style={{
                  textAlign: 'right',
                  color: 'green',
                }}
              >
                <Heading as="h3" variant="bodyTitle">
                  +{BN(dTx.amount).toFixed(5)} {dTx.token.symbol.toUpperCase()}
                </Heading>
                <Text fontSize={12}>Received</Text>
              </Box>
            );
            break;
          }
          case 'withdrawal': {
            const wTx = tx as WithdrawalTransactionEvent & {
              token: TokenData;
            };
            StartIcon = <Avatar icon={<Icon as={BiSolidUpArrowCircle} />} />;
            CardTitle = (
              <Heading as="h3" variant="bodyTitle">
                Withdrawal to {wTx.toAddress.slice(0, 8) + '...'}
              </Heading>
            );
            CardData = (
              <Box
                style={{
                  textAlign: 'right',
                }}
              >
                <Heading as="h3" variant="bodyTitle">
                  {/* TODO: seems the amount on withdrawal is not the same format as trade */}
                  {BN(wTx.amount).toFixed(5)} {wTx.token.symbol.toUpperCase()}
                </Heading>
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
                icon={<Icon as={MdSwapHorizontalCircle} />}
                backgroundColor="telegram.500"
              />
            );
            CardTitle = (
              <Heading as="h3" variant="bodyTitle">
                Trade {tradeTx.inToken?.symbol.toUpperCase()} for{' '}
                {tradeTx.outToken?.symbol.toUpperCase()}
              </Heading>
            );
            const isIn = tokenFilter && tokenFilter === tradeTx.inToken?.symbol;
            const amount = isIn ? tradeTx.amountIn : tradeTx.amountOut;
            const token = isIn ? tradeTx.inToken : tradeTx.outToken;
            CardData = (
              <Box
                style={{
                  textAlign: 'right',
                  color: isIn ? 'inherit' : 'green',
                }}
              >
                <Heading as="h3" variant="bodyTitle">
                  {!isIn && '+'}
                  {BN(amount).toFixed(5)} {token.symbol.toUpperCase()}
                </Heading>
                <Text fontSize={12}>{!isIn ? 'Received' : 'Traded'}</Text>
              </Box>
            );
            break;
          }
          default: {
            StartIcon = <Avatar />;
          }
        }

        return (
          <Link
            key={tx.id}
            to={`/transaction/${tx.id}`}
            style={{ color: colors.text_color }}
          >
            <ListItem
              StartIconSlot={StartIcon}
              StartTextSlot={
                <Box>
                  {CardTitle}
                  <Text variant="hint" fontSize={12}>
                    {tx.date.toLocaleString()}
                  </Text>
                </Box>
              }
              EndTextSlot={CardData}
            />
          </Link>
        );
      })}
    </Card>
  );
}

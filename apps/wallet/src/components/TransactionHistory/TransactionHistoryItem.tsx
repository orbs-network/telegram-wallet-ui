import { Avatar, Heading, Box, Text } from '@chakra-ui/react';
import { ListItem, colors } from '@telegram-wallet-ui/twa-ui-kit';

import { useNavigate } from 'react-router-dom';
import {
  TransactionEvent,
  DepositTransactionEvent,
  WithdrawalTransactionEvent,
  TradeTransactionEvent,
} from '../../lib/EventsProvider';
import { formatDateTime } from '../../utils/utils';
import { DepositIcon, WithdrawIcon, TradeIcon } from '../icons';
import { TokenData } from '../../types';
import { css } from '@emotion/react';
import { useMemo } from 'react';
import { TransactionAmount } from './TransactionAmount';

const styles = {
  avatar: css`
    width: 40px;
    height: 40px;
  `,
};

type TransactionHistoryItemProps = {
  tx: TransactionEvent;
  tokenFilter?: string;
};

export function TransactionHistoryItem({
  tx,
  tokenFilter,
}: TransactionHistoryItemProps) {
  const navigate = useNavigate();

  const { StartIcon, CardTitle, CardData } = useMemo(() => {
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
            backgroundColor={colors.button_color}
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
              color: colors.success,
            }}
          >
            <Text noOfLines={1}>
              +<TransactionAmount amount={dTx.amount} />{' '}
              {dTx.token?.symbolDisplay}
            </Text>
            <Text fontSize={12}>Received</Text>
          </Box>
        );
        break;
      }
      case 'withdrawal': {
        const wTx = tx as WithdrawalTransactionEvent & {
          token: TokenData;
        };
        StartIcon = (
          <Avatar
            css={styles.avatar}
            icon={<WithdrawIcon />}
            backgroundColor={colors.button_color}
          />
        );
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
              <TransactionAmount amount={wTx.amount} />{' '}
              {wTx.token?.symbolDisplay}
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
            backgroundColor={colors.button_color}
          />
        );
        CardTitle = (
          <Heading as="h3" variant="bodyTitle" noOfLines={1}>
            Buy {tradeTx.outToken?.symbolDisplay} with{' '}
            {tradeTx.inToken?.symbolDisplay}
          </Heading>
        );
        const isIn = !!tokenFilter && tokenFilter === tradeTx.inToken?.symbol;
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
              <TransactionAmount amount={amount} /> {token?.symbolDisplay ?? ''}
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
    return { StartIcon, CardTitle, CardData };
  }, [tokenFilter, tx]);

  return (
    <ListItem
      key={tx.id}
      onClick={() => navigate(`/transaction/${tx.id}`)}
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
  );
}

import { Avatar, Heading, Box, Text, Icon } from '@chakra-ui/react';
import { Card, ListItem } from '@telegram-wallet-ui/twa-ui-kit';
import { MdSwapHorizontalCircle } from 'react-icons/md';
import {
  DepositTransactionEvent,
  TradeTransactionEvent,
  useEventsProvider,
  WithdrawalTransactionEvent,
} from '../lib/EventsProvider';
import { BiSolidDownArrowCircle, BiSolidUpArrowCircle } from 'react-icons/bi';

export function Transactions2() {
  const events = useEventsProvider();

  if (events.length === 0) {
    return (
      <Card>
        <Text>No transactions</Text>
      </Card>
    );
  }

  return (
    <Card>
      <Text variant="hint">TRANSACTION HISTORY</Text>
      {events.map((tx) => {
        let StartIcon = null;
        let CardTitle = null;
        let CardData = null;

        switch (tx.type) {
          // case 'transfer': {
          //   const userToDisplay = tx.direction === 'incoming' ? tx.from : tx.to;

          //   if (userToDisplay) {
          //     StartIcon = <Avatar src={userToDisplay.avatarUrl} />;
          //     CardTitle = (
          //       <Heading as="h3" variant="bodyTitle">
          //         {userToDisplay.name}
          //       </Heading>
          //     );
          //   }
          //   break;
          // }
          case 'deposit': {
            StartIcon = <Avatar icon={<Icon as={BiSolidDownArrowCircle} />} />;
            CardTitle = (
              <Heading as="h3" variant="bodyTitle">
                Deposit
              </Heading>
            );
            CardData = (
              <Box>
                <Heading as="h3" variant="bodyTitle">
                  +{(tx as DepositTransactionEvent).amount}
                </Heading>
              </Box>
            );
            break;
          }
          case 'withdrawal': {
            StartIcon = <Avatar icon={<Icon as={BiSolidUpArrowCircle} />} />;
            CardTitle = (
              <Heading as="h3" variant="bodyTitle">
                Withdrawal
              </Heading>
            );
            CardData = (
              <Box>
                <Heading as="h3" variant="bodyTitle">
                  -{(tx as WithdrawalTransactionEvent).amount}
                </Heading>
                <Text variant="hint" fontSize={12}>
                  {(tx as WithdrawalTransactionEvent).toAddress.slice(0, 8) +
                    '...'}
                </Text>
              </Box>
            );
            break;
          }
          case 'trade': {
            StartIcon = <Avatar icon={<Icon as={MdSwapHorizontalCircle} />} />;
            CardTitle = (
              <Heading as="h3" variant="bodyTitle">
                Trade
              </Heading>
            );
            const trade = tx as TradeTransactionEvent;
            CardData = (
              <Box>
                <Heading as="h3" variant="bodyTitle">
                  {`+${trade.amountIn} ${trade.inToken.slice(0, 4)}...`}
                </Heading>
              </Box>
            );
            break;
          }
          default: {
            StartIcon = <Avatar />;
          }
        }

        return (
          <ListItem
            key={tx.id}
            StartIconSlot={StartIcon}
            StartTextSlot={
              <Box>
                {CardTitle}
                <Text variant="hint" fontSize={12}>
                  {tx.date.toLocaleString()}
                </Text>
              </Box>
            }
            EndTextSlot={
              <Box
                style={{
                  textAlign: 'right',
                  // color: tx.direction === 'incoming' ? 'green' : 'inherit',
                }}
              >
                {CardData}
                <Text fontSize={12}>
                  {tx.direction === 'incoming' ? 'Received' : 'Sent'}
                </Text>
              </Box>
            }
          />
        );
      })}
    </Card>
  );
}

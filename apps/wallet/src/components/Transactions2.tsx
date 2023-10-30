import { Avatar, Heading, Box, Text, Icon } from '@chakra-ui/react';
import { Card, ListItem } from '@telegram-wallet-ui/twa-ui-kit';
import { MdSwapHorizontalCircle } from 'react-icons/md';
import { useEventsProvider } from '../lib/EventsProvider';
import { BiSolidUpArrowCircle } from 'react-icons/bi';

export function Transactions2() {
  const events = useEventsProvider();

  const sortedTxs = events.sort((a, b) => b.date - a.date);

  if (sortedTxs.length === 0) {
    return (
      <Card>
        <Text>No transactions</Text>
      </Card>
    );
  }

  return (
    <Card>
      <Text variant="hint">TRANSACTION HISTORY</Text>
      {sortedTxs.map((tx) => {
        let StartIcon = null;
        let CardTitle = null;

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
          // case 'deposit': {
          //   StartIcon = <Avatar icon={<Icon as={BiSolidDownArrowCircle} />} />;
          //   CardTitle = (
          //     <Heading as="h3" variant="bodyTitle">
          //       Deposit
          //     </Heading>
          //   );
          //   break;
          // }
          case 'withdrawal': {
            StartIcon = <Avatar icon={<Icon as={BiSolidUpArrowCircle} />} />;
            CardTitle = (
              <Heading as="h3" variant="bodyTitle">
                Withdrawal
              </Heading>
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
            break;
          }
          default: {
            StartIcon = <Avatar />;
          }
        }

        return (
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
            EndTextSlot={
              <Box
                style={{
                  textAlign: 'right',
                  // color: tx.direction === 'incoming' ? 'green' : 'inherit',
                }}
              >
                <Heading as="h3" variant="bodyTitle">
                  {tx.direction === 'incoming' ? '+' : ''}
                  {`${tx.inAmount} ${tx.inToken}`}
                </Heading>
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

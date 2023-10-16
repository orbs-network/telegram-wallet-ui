import {
  Avatar,
  Box,
  Container,
  HStack,
  Heading,
  Icon,
  Text,
  VStack,
} from '@chakra-ui/react';
import {
  Button,
  Card,
  DataDisplayItem,
  IconButtonWithLabel,
} from '@telegram-wallet-ui/twa-ui-kit';
import { BiSolidDownArrowCircle, BiSolidUpArrowCircle } from 'react-icons/bi';
import { MdSwapHorizontalCircle } from 'react-icons/md';
import { FaEthereum } from 'react-icons/fa';

export function App() {
  return (
    <Container size="sm">
      <VStack spacing={4}>
        <HStack justifyContent="center" alignItems="center" spacing={2}>
          <IconButtonWithLabel Icon={BiSolidDownArrowCircle} label="Deposit" />
          <IconButtonWithLabel Icon={BiSolidUpArrowCircle} label="Withdraw" />
          <IconButtonWithLabel Icon={MdSwapHorizontalCircle} label="Trade" />
        </HStack>
        <Card>
          <DataDisplayItem
            StartIconSlot={
              <Avatar
                icon={<Icon as={FaEthereum} fontSize={28} />}
                bgColor="#A7117A"
              />
            }
            StartTextSlot={
              <Box>
                <Heading as="h3" variant="bodyTitle">
                  Ethereum
                </Heading>
                <Text variant="hint">0.003 ETH</Text>
              </Box>
            }
            EndTextSlot={
              <Heading as="h3" variant="bodyTitle">
                $4.63
              </Heading>
            }
          />
        </Card>
        <Button>Click me</Button>
      </VStack>
    </Container>
  );
}

export default App;

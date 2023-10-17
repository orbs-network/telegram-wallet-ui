import {
  Avatar,
  Box,
  Container,
  Divider,
  HStack,
  Heading,
  Icon,
  Text,
  VStack,
} from '@chakra-ui/react';
import {
  Balance,
  Card,
  DataDisplayItem,
  IconButtonWithLabel,
} from '@telegram-wallet-ui/twa-ui-kit';
import {
  BiPlus,
  BiSolidDownArrowCircle,
  BiSolidUpArrowCircle,
} from 'react-icons/bi';
import { MdSwapHorizontalCircle } from 'react-icons/md';
import { PiPolygon } from 'react-icons/pi';
import { Link } from 'react-router-dom';

export function Root() {
  return (
    <Container size="sm" pt={4}>
      <VStack spacing={4}>
        <Balance
          primaryCurrencySymbol="$"
          primaryAmount={4.63}
          label="Total balance"
        />
        <HStack justifyContent="center" alignItems="center" spacing={2}>
          <Link to="/deposit">
            <IconButtonWithLabel
              Icon={BiSolidDownArrowCircle}
              label="Deposit"
            />
          </Link>
          <Link to="/withdraw">
            <IconButtonWithLabel Icon={BiSolidUpArrowCircle} label="Withdraw" />
          </Link>
          <Link to="/trade">
            <IconButtonWithLabel Icon={MdSwapHorizontalCircle} label="Trade" />
          </Link>
        </HStack>
        <Link to="/asset/matic" style={{ width: '100%' }}>
          <Card>
            <DataDisplayItem
              StartIconSlot={
                // TODO: replace with real asset icon - create asset icons in ui kit
                <Avatar
                  icon={<Icon as={PiPolygon} fontSize={28} />}
                  bgColor="#8347E6"
                />
              }
              StartTextSlot={
                <Box>
                  <Heading as="h3" variant="bodyTitle">
                    Polygon
                  </Heading>
                  <Text variant="hint">8.86888 MATIC</Text>
                </Box>
              }
              EndTextSlot={
                <Heading as="h3" variant="bodyTitle">
                  $4.63
                </Heading>
              }
            />
          </Card>
        </Link>
        <Divider variant="thick" width="80%" />
        {/* TODO: wrap Link component with custom styling */}
        <Link to="/assets" style={{ width: '100%' }}>
          <Card>
            <DataDisplayItem
              StartIconSlot={
                <Avatar icon={<Icon as={BiPlus} fontSize="3xl" />} />
              }
              StartTextSlot={
                <Heading as="h3" variant="bodyTitle">
                  Add more assets
                </Heading>
              }
            />
          </Card>
        </Link>
      </VStack>
    </Container>
  );
}

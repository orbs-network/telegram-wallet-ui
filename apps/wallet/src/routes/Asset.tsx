import { Avatar, Container, HStack, Icon, VStack } from '@chakra-ui/react';
import { Balance, IconButtonWithLabel } from '@telegram-wallet-ui/twa-ui-kit';
import { BiSolidDownArrowCircle, BiSolidUpArrowCircle } from 'react-icons/bi';
import { MdSwapHorizontalCircle } from 'react-icons/md';
import { PiPolygon } from 'react-icons/pi';
import { Link, useNavigate } from 'react-router-dom';
import { BackButton } from '@twa-dev/sdk/react';

export function Asset() {
  const navigate = useNavigate();
  return (
    <Container size="sm" pt={4}>
      <BackButton
        onClick={() => {
          navigate(-1);
        }}
      />
      <VStack spacing={4}>
        <Avatar
          icon={<Icon as={PiPolygon} fontSize={28} />}
          bgColor="#8347E6"
        />
        <Balance currencySymbol="$" amount={4.63} label="MATIC" />
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
      </VStack>
    </Container>
  );
}

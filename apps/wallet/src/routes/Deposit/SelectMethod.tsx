import {
  Avatar,
  Box,
  Container,
  Heading,
  Icon,
  VStack,
  Text,
} from '@chakra-ui/react';
import { Card, DataDisplayItem, colors } from '@telegram-wallet-ui/twa-ui-kit';
import { AiOutlineCreditCard } from 'react-icons/ai';
import { BiChevronRight } from 'react-icons/bi';
import { RiApps2Line } from 'react-icons/ri';
import { Link, generatePath } from 'react-router-dom';
import { Page } from '../../components';

import { ROUTES } from '../../router/routes';

export function SelectMethod() {
  return (
    <Page>
      <Container size="sm" pt={4}>
        <VStack spacing={8} alignItems="stretch">
          <Heading as="h1" size="md" textAlign="center">
            How would you like to deposit crypto?
          </Heading>
          <VStack spacing={4} alignItems="stretch">
            <Link to={ROUTES.depositBuy}>
              <Card>
                <DataDisplayItem
                  StartIconSlot={
                    <Avatar
                      icon={<Icon as={AiOutlineCreditCard} />}
                      bgColor={colors.button_color}
                    />
                  }
                  StartTextSlot={
                    <Box>
                      <Heading as="h3" variant="bodyTitle">
                        Bank Card
                      </Heading>
                      <Text variant="hint">
                        Purchase USD stablecoin with a debit/credit card
                      </Text>
                    </Box>
                  }
                  EndIconSlot={<Icon as={BiChevronRight} fontSize="4xl" />}
                />
              </Card>
            </Link>
            <Link
              to={generatePath(ROUTES.depositSelectCoin, { method: 'crypto' })}
            >
              <Card>
                <DataDisplayItem
                  StartIconSlot={
                    <Avatar
                      icon={<Icon as={RiApps2Line} />}
                      bgColor={colors.button_color}
                    />
                  }
                  StartTextSlot={
                    <Box>
                      <Heading as="h3" variant="bodyTitle">
                        External Wallet
                      </Heading>
                      <Text variant="hint">
                        Deposit crypto from any external wallet on any chain
                      </Text>
                    </Box>
                  }
                  EndIconSlot={<Icon as={BiChevronRight} fontSize="4xl" />}
                />
              </Card>
            </Link>
          </VStack>
        </VStack>
      </Container>
    </Page>
  );
}

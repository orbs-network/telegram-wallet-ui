import {
  Avatar,
  Box,
  Container,
  Heading,
  Icon,
  VStack,
  Text,
} from '@chakra-ui/react';
import { css } from '@emotion/react';
import {
  Card,
  DataDisplayItem,
  colors,
  List,
  ListItem,
} from '@telegram-wallet-ui/twa-ui-kit';
import { AiOutlineCreditCard } from 'react-icons/ai';
import { BiChevronRight } from 'react-icons/bi';
import { RiApps2Line } from 'react-icons/ri';
import { Link, generatePath } from 'react-router-dom';
import { Page } from '../../components';

import { ROUTES } from '../../router/routes';

const styles = {
  list: css`
    gap: 10px;
  `
}

export function SelectMethod() {
  return (
    <Page>
      <Container size="sm" pt={4}>
        <VStack spacing={8} alignItems="stretch">
          <Heading as="h1" size="md" textAlign="center">
            How would you like to deposit crypto?
          </Heading>
          <List mode="display" css={styles.list}>
            <Link to={ROUTES.depositBuy}>
              <ListItem
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
                StartIconSlot={
                  <Avatar
                    width="40px"
                    height="40px"
                    icon={<Icon as={AiOutlineCreditCard} />}
                    bgColor={colors.button_color}
                  />
                }
                EndIconSlot={
                  <Icon
                    as={BiChevronRight}
                    color={colors.hint_color}
                    fontSize="4xl"
                  />
                }
              />
            </Link>
            <Link
              to={generatePath(ROUTES.depositSelectCoin, { method: 'crypto' })}
            >
              <ListItem
                StartIconSlot={
                  <Avatar
                    width="40px"
                    height="40px"
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
                EndIconSlot={
                  <Icon
                    color={colors.hint_color}
                    as={BiChevronRight}
                    fontSize="4xl"
                  />
                }
              />
            </Link>
          </List>
        </VStack>
      </Container>
    </Page>
  );
}

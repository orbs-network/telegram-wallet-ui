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
import { colors, List, ListItem } from '@telegram-wallet-ui/twa-ui-kit';
import { AiOutlineCreditCard } from 'react-icons/ai';
import { BiChevronRight } from 'react-icons/bi';
import { RiApps2Line } from 'react-icons/ri';
import { Link, generatePath } from 'react-router-dom';
import { Page, PageHeading } from '../../components';

import { ROUTES } from '../../router/routes';

const styles = {
  list: css`
    gap: 10px;
  `,
  subtitle: css`
    line-height: 1.2;
  `,
};

export function DepositMethods() {
  return (
    <List mode="display" css={styles.list}>
      <Link to={ROUTES.depositBuy}>
        <ListItem
          StartTextSlot={
            <Box>
              <Heading as="h3" variant="bodyTitle" mb={1}>
                Bank Card
              </Heading>
              <Text css={styles.subtitle} variant="hint">
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
      <Link to={generatePath(ROUTES.depositSelectCoin, { method: 'crypto' })}>
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
              <Heading as="h3" variant="bodyTitle" mb={1}>
                External Wallet
              </Heading>
              <Text css={styles.subtitle} variant="hint">
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
  );
}

export function SelectMethod() {
  return (
    <Page>
      <Container size="sm" pt={4}>
        <VStack spacing={8} alignItems="stretch">
          <PageHeading>How would you like to deposit crypto?</PageHeading>
          <DepositMethods />
        </VStack>
      </Container>
    </Page>
  );
}

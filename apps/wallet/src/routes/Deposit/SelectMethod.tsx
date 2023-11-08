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
import { BiChevronRight } from 'react-icons/bi';
import { RiApps2Line } from 'react-icons/ri';
import { Link, generatePath } from 'react-router-dom';
import { Page, PageHeading } from '../../components';
import { BankCardSvg, ExternalWalletSvg } from './svg';
import { ROUTES } from '../../router/routes';

const styles = {
  list: css`
    gap: 10px;
  `,
  subtitle: css`
    line-height: 18px;
    font-size: 14px;
  `,
  title: css`
    font-size: 17px;
    font-weight: 500;
  `,
  listItem: css`
    .chakra-card__body {
      padding-top: 14px;
      padding-bottom: 14px;
    }
  `,
  bankCardAvatar: css`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-clip: border-box;
    background-color: rgba(0, 0, 0, 0);
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: linear-gradient(
      156.88deg,
      rgb(0, 231, 255) 14.96%,
      rgb(0, 122, 255) 85.04%
    );

    svg {
      height: 28px;
      color: white;
    }
  `,
  externalWalletAvatar: css`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-clip: border-box;
    background-color: rgba(0, 0, 0, 0);
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: linear-gradient(
      rgb(167, 173, 185) 0%,
      rgb(135, 139, 150) 100%
    );
    svg {
      height: 28px;
      color: white;
    }
  `,
};

export function DepositMethods() {
  return (
    <List mode="display" css={styles.list}>
      <Link to={ROUTES.depositBuy}>
        <ListItem
          css={styles.listItem}
          StartTextSlot={
            <Box flex={1}>
              <Heading css={styles.title} as="h3" variant="bodyTitle" mb="3px">
                Bank Card
              </Heading>
              <Text css={styles.subtitle} variant="hint">
                Purchase USD stablecoin with a debit/credit card
              </Text>
            </Box>
          }
          StartIconSlot={
            <Box css={styles.bankCardAvatar}>
              <BankCardSvg />
            </Box>
          }
          EndIconSlot={
            <Icon
              as={BiChevronRight}
              color={colors.hint_color}
              fontSize="3xl"
              opacity={0.5}
            />
          }
        />
      </Link>
      <Link to={generatePath(ROUTES.depositSelectCoin, { method: 'crypto' })}>
        <ListItem
          css={styles.listItem}
          StartIconSlot={
            <Box css={styles.externalWalletAvatar}>
              <ExternalWalletSvg />
            </Box>
          }
          StartTextSlot={
            <Box flex={1}>
              <Heading css={styles.title} as="h3" variant="bodyTitle" mb="3px">
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
              fontSize="3xl"
              opacity={0.5}
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
        <PageHeading>How would you like to deposit crypto?</PageHeading>
        <DepositMethods />
      </Container>
    </Page>
  );
}

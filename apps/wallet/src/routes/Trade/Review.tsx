import {
  Avatar,
  Box,
  Button,
  Card,
  Container,
  Heading,
  VStack,
  Text,
} from '@chakra-ui/react';
import { BackButton, MainButton } from '@twa-dev/sdk/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Page } from '../../components';
import { TradeFormSchema } from './schema';
import Twa from '@twa-dev/sdk';
import { ListItem } from '@telegram-wallet-ui/twa-ui-kit';
import { useUserData } from '../../hooks';

export function Review() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { data: userData } = useUserData();
  const { inAmount, inToken, outToken, outAmount } = state as TradeFormSchema;

  const srcToken = userData?.tokens[inToken];
  const dstToken = userData?.tokens[outToken];

  // TODO: continue fetching quote

  return (
    <Page>
      <Container size="sm" pt={4}>
        <BackButton
          onClick={() => {
            navigate(-1);
          }}
        />
        <VStack alignItems="stretch" spacing={8}>
          <Card>
            <VStack alignItems="flex-start" style={{ width: '100%' }}>
              <ListItem
                StartIconSlot={<Avatar src={srcToken?.logoURI} />}
                StartTextSlot={
                  <Box>
                    <Text variant="hint">You pay</Text>
                    <Heading as="h3" variant="bodyTitle">
                      {inAmount} {inToken.toUpperCase()}
                    </Heading>
                  </Box>
                }
              />
              <ListItem
                StartIconSlot={<Avatar src={dstToken?.logoURI} />}
                StartTextSlot={
                  <Box>
                    <Text variant="hint">You receive</Text>
                    <Heading as="h3" variant="bodyTitle">
                      {outAmount} {outToken.toUpperCase()}
                    </Heading>
                  </Box>
                }
              />
            </VStack>
          </Card>

          {!Twa.isVersionAtLeast('6.0.1') && (
            <Button variant="primary" type="submit">
              Trade
            </Button>
          )}
        </VStack>

        <MainButton text="Trade" onClick={() => console.log('trade')} />
      </Container>
    </Page>
  );
}

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
import { Link } from 'react-router-dom';
import { Page } from '../../components';

export function SelectMethod() {


  return (
    <Page>
      <VStack spacing={8} alignItems="stretch">
        <Heading as="h1" size="md" textAlign="center">
          How would you like to deposit crypto?
        </Heading>
        <VStack spacing={4} alignItems="stretch">
          <Link to="/deposit/buy">
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
                    <Text variant="hint">Purchase crypto with a bank card</Text>
                  </Box>
                }
                EndIconSlot={<Icon as={BiChevronRight} fontSize="4xl" />}
              />
            </Card>
          </Link>
          <Link to="/deposit/crypto">
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
                    <Text variant="hint">Receive from external wallet</Text>
                  </Box>
                }
                EndIconSlot={<Icon as={BiChevronRight} fontSize="4xl" />}
              />
            </Card>
          </Link>
        </VStack>
      </VStack>
    </Page>
  );
}

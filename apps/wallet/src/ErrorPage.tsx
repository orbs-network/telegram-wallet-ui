import { Container, Heading, VStack, Text } from '@chakra-ui/react';
import { useRouteError } from 'react-router-dom';

export function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <Container>
      <VStack spacing={4}>
        <Heading as="h1" size="xl">
          Oops!
        </Heading>
        <Text as="p">Sorry, an unexpected error has occurred.</Text>
        <Text as="i">
          {(error as { statusText: string }).statusText || (error as Error).message}
        </Text>
      </VStack>
    </Container>
  );
}

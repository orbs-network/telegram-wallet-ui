import { Container, Heading, VStack, Text } from '@chakra-ui/react';
import { useRouteError } from 'react-router-dom';

type ErrorPageProps = {
  message?: string;
};

export function ErrorPage({ message }: ErrorPageProps) {
  const error = useRouteError();
  console.error(error);

  const errorDetail = error
    ? (error as { statusText?: string }).statusText || (error as Error).message
    : message;

  return (
    <Container>
      <VStack spacing={4}>
        <Heading as="h1" size="xl">
          Oops!
        </Heading>
        <Text as="p">Sorry, an unexpected error has occurred.</Text>
        <Text as="i">{errorDetail}</Text>
      </VStack>
    </Container>
  );
}

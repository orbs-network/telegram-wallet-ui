import { Container, Heading, VStack, Text } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';

type ErrorPageProps = {
  message?: string;
};

export function ErrorPage({ message }: ErrorPageProps) {
  const [debugCounter, setDebugCounter] = useState(0);
  const navigate = useNavigate();

  const error = useRouteError();
  console.error(error);

  const errorDetail = error
    ? (error as { statusText?: string }).statusText || (error as Error).message
    : message;

  useEffect(() => {
    if (debugCounter >= 2) {
      navigate('/debug');
    }
  }, [debugCounter, navigate]);

  return (
    <Container>
      <VStack spacing={4}>
        <Heading
          as="h1"
          size="xl"
          onDoubleClick={() => {
            navigate('/debug');
          }}
          onTouchStart={() => {
            setDebugCounter((val: number) => val + 1);
          }}
        >
          Oops!
        </Heading>
        <Text as="p">Sorry, an unexpected error has occurred.</Text>
        <Text as="i">{errorDetail}</Text>
      </VStack>
    </Container>
  );
}

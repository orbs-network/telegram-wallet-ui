import { Flex, Text } from '@chakra-ui/react';
import styled from '@emotion/styled';
import React from 'react';
import { ImArrowUp } from 'react-icons/im';
import { useParams } from 'react-router-dom';
import { URLParams } from '../../types';
import { makeElipsisAddress } from '../../utils/utils';
import { colors } from '@telegram-wallet-ui/twa-ui-kit';

export const Recipient = () => {
  const { recipient } = useParams<URLParams>();

  return (
    <Flex alignItems="center" gap="10px">
      <RecipientIcon>
        <ImArrowUp />
      </RecipientIcon>
      <Text>
        Send to <strong>{makeElipsisAddress(recipient, 4)}</strong>
      </Text>
    </Flex>
  );
};

const RecipientIcon = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  background: colors.button_color,
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: colors.button_color,
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    border: '3px solid white',
  },

  svg: {
    position: 'relative',
    zIndex: 1,
    color: 'white',
    width: '10px',
  },
});

/* eslint-disable react-hooks/exhaustive-deps */
import { Container } from '@chakra-ui/react';
import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Page, TokensList } from '../../components';
import { useBalances } from '../../hooks';
import { useMainButtonStore } from '../../store/main-button-store';
import { TokenData } from '../../types';
import { useTradeStore } from './store';
import { disabledTokens } from '../../config';
import { balancesAsList } from '../../utils/utils';

export function TradeTokenSelect({ isIn }: { isIn?: boolean }) {
  const { data, dataUpdatedAt } = useBalances();
  const navigate = useNavigate();
  const { setInToken, setOutToken, inToken, outToken } = useTradeStore();
  const { resetButton } = useMainButtonStore();

  useEffect(() => {
    resetButton();
  }, [resetButton]);

  const tokens = useMemo(() => {
    return balancesAsList(data ?? {});
  }, [dataUpdatedAt]);

  const onSelect = (token: TokenData) => {
    navigate(-1);
    if (isIn) {
      setInToken(token.symbol);
    } else {
      setOutToken(token.symbol);
    }
  };

  const selected = isIn ? inToken : outToken;
  const filteredToken = isIn ? outToken : inToken;

  return (
    <Page secondaryBackground>
      <Container size="sm" pt={4}>
        <TokensList
          showMoreBtn={true}
          disabledTokens={disabledTokens}
          selected={selected}
          tokens={tokens.filter((t) => t.symbol !== filteredToken)}
          mode="select"
          onSelect={onSelect}
        />
      </Container>
    </Page>
  );
}

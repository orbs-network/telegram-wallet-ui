import { HStack } from '@chakra-ui/react';
import { IconButtonWithLabel } from '@telegram-wallet-ui/twa-ui-kit';
import { Link, generatePath } from 'react-router-dom';
import { BuyIcon, DepositIcon, TradeIcon, WithdrawIcon } from './icons';
import Twa from '@twa-dev/sdk';
import { ROUTES } from '../router/routes';

function handleClick() {
  if (!Twa.isExpanded) {
    Twa.expand();
  }

  Twa.HapticFeedback.impactOccurred('heavy');
}

type CoinActionMenuProps = {
  tokenSymbol: string;
};

export function CoinActionMenu({ tokenSymbol }: CoinActionMenuProps) {
  const depositPath = generatePath(ROUTES.depositCrypto, {
    assetId: tokenSymbol,
  });

  const buyPath = generatePath(ROUTES.depositBuy, {
    assetId: tokenSymbol,
  });

  const tradePath = `${ROUTES.trade}?inToken=${tokenSymbol}`;

  const withdrawPath = generatePath(ROUTES.withdrawAddress, {
    assetId: tokenSymbol,
  });

  return (
    <HStack justifyContent="center" alignItems="center" spacing={8} pt={2}>
      <Link to={depositPath} onClick={handleClick}>
        <IconButtonWithLabel IconSlot={<DepositIcon />} label="Deposit" />
      </Link>
      <Link to={buyPath} onClick={handleClick}>
        <IconButtonWithLabel IconSlot={<BuyIcon />} label="Buy" />
      </Link>
      <Link to={tradePath} onClick={handleClick}>
        <IconButtonWithLabel IconSlot={<TradeIcon />} label="Trade" />
      </Link>
      <Link to={withdrawPath} onClick={handleClick}>
        <IconButtonWithLabel IconSlot={<WithdrawIcon />} label="Withdraw" />
      </Link>
    </HStack>
  );
}

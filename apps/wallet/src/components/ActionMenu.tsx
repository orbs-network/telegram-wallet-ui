import { HStack } from '@chakra-ui/react';
import { IconButtonWithLabel } from '@telegram-wallet-ui/twa-ui-kit';
import { Link, generatePath } from 'react-router-dom';
import { DepositIcon, TradeIcon, WithdrawIcon } from './icons';
import Twa from '@twa-dev/sdk';
import { ROUTES } from '../router/routes';

function handleClick() {
  if (!Twa.isExpanded) {
    Twa.expand();
  }

  Twa.HapticFeedback.impactOccurred('heavy');
}

type ActionMenuProps = {
  tokenSymbol?: string;
};

export function ActionMenu({ tokenSymbol }: ActionMenuProps) {
  const depositPath = tokenSymbol
    ? generatePath(ROUTES.depositSelectMethod, { assetId: tokenSymbol })
    : ROUTES.deposit;
  const tradePath = tokenSymbol
    ? `${ROUTES.trade}?inToken=${tokenSymbol}`
    : ROUTES.trade;
  const withdrawPath = tokenSymbol
    ? generatePath(ROUTES.withdrawAddress, { assetId: tokenSymbol })
    : ROUTES.withdraw;

  return (
    <HStack justifyContent="center" alignItems="center" spacing={2} pt={2}>
      <Link to={depositPath} onClick={handleClick}>
        <IconButtonWithLabel IconSlot={<DepositIcon />} label="Deposit" />
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

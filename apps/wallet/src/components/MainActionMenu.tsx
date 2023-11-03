import { HStack } from '@chakra-ui/react';
import { IconButtonWithLabel } from '@telegram-wallet-ui/twa-ui-kit';
import { Link } from 'react-router-dom';
import { DepositIcon, TradeIcon, WithdrawIcon } from './icons';
import Twa from '@twa-dev/sdk';
import { ROUTES } from '../router/routes';

function handleClick() {
  if (!Twa.isExpanded) {
    Twa.expand();
  }

  Twa.HapticFeedback.impactOccurred('heavy');
}

export function MainActionMenu() {
  return (
    <HStack justifyContent="center" alignItems="center" spacing={2} pt={2}>
      <Link to={ROUTES.deposit} onClick={handleClick}>
        <IconButtonWithLabel IconSlot={<DepositIcon />} label="Deposit" />
      </Link>
      <Link to={ROUTES.trade} onClick={handleClick}>
        <IconButtonWithLabel IconSlot={<TradeIcon />} label="Trade" />
      </Link>
      <Link to={ROUTES.withdraw} onClick={handleClick}>
        <IconButtonWithLabel IconSlot={<WithdrawIcon />} label="Withdraw" />
      </Link>
    </HStack>
  );
}

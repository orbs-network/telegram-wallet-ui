import { HStack } from '@chakra-ui/react';
import { IconButtonWithLabel, Twa } from '@telegram-wallet-ui/twa-ui-kit';
import { Link, generatePath } from 'react-router-dom';
import { DepositIcon, TradeIcon, WithdrawIcon } from './icons';
import { ROUTES } from '../router/routes';
import { useNavigation } from '../router/hooks';

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
  const depositCryptoPath = useNavigation().depositCryptoPath;
  const depositPath = depositCryptoPath(tokenSymbol);

  const tradePath = `${ROUTES.trade}?inToken=${tokenSymbol}`;

  const withdrawPath = generatePath(ROUTES.withdrawAddress, {
    assetId: tokenSymbol,
  });

  return (
    <HStack justifyContent="center" alignItems="center" spacing={8} pt={2}>
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

import { Avatar } from '@chakra-ui/react';
import { CryptoAsset } from '../../config';
import { cryptoAssets } from './cryptoAssets';

type CryptoAssetIconProps = {
  asset: CryptoAsset;
};

export function CryptoAssetIcon({ asset }: CryptoAssetIconProps) {
  const { Icon, color } = cryptoAssets[asset];
  return <Avatar bgColor={color} icon={Icon} fontSize="2xl" />;
}

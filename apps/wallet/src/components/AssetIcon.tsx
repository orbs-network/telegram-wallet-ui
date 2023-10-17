import { Avatar } from '@chakra-ui/react';
import { Assets } from '../config';
import { cryptoAssets } from './assets';

type AssetIconProps = {
  asset: Assets;
};

export function AssetIcon({ asset }: AssetIconProps) {
  const { Icon, color } = cryptoAssets[asset];
  return <Avatar bgColor={color} icon={Icon} fontSize={28} />;
}

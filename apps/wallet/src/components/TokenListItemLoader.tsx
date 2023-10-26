import { Skeleton, VStack } from '@chakra-ui/react';
import { ListItem } from '@telegram-wallet-ui/twa-ui-kit';



export function TokenListItemLoader() {
  return (
    <ListItem
      StartIconSlot={<Skeleton width="40px" height="40px" borderRadius="50%" />}
      StartTextSlot={
        <VStack alignItems="flex-start" gap="5px">
          <Skeleton width="150px" height="15px" borderRadius="10px" />
          <Skeleton width="50px" height="15px" borderRadius="10px" />
        </VStack>
      }
    />
  );
}

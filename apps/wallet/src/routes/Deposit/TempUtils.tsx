import { useState } from 'react';
import { Fetcher } from '../../utils/fetcher';
import { liqHubProvider, web3Provider } from '../../config';
import { Button } from '@chakra-ui/react';
import { SwapProvider } from '../../lib/SwapProvider';
import { CoinsProvider } from '../../lib/CoinsProvider';
import { getDebug } from '../../lib/utils/debug';

const debug = getDebug('TempUtils');

const USDCFaucet = () => {
  const [address, setAddress] = useState(web3Provider.account.address);

  return (
    <div>
      <h1>USDC FAUCET</h1>
      <div>
        <label>Address&nbsp;</label>
        <input
          style={{ padding: 8, width: 500 }}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <div
          style={{ width: 200 }}
          onClick={async () => {
            Fetcher.get(
              `${
                import.meta.env.VITE_FAUCET_BACKEND_URL
              }/usdc?address=${address}`
            );
          }}
        >
          <Button>Get USDC</Button>
        </div>
      </div>
    </div>
  );
};

const Swapper = () => {
  const coinsProvider = new CoinsProvider(false);
  const swapper = new SwapProvider(coinsProvider, liqHubProvider);

  return (
    <div>
      <h1>Swapper</h1>
      <Button
        onClick={async () => {
          const quote = await swapper.quote({
            inAmount: 1000000,
            inToken: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
            outToken: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          });

          
          debug(quote);

          // Now we display the quote and then:
          // swapper.swap(quote);
        }}
      >
        Quote
      </Button>
    </div>
  );
};

export const TempUtils = () => {
  return (
    <div>
      <USDCFaucet />
      <Swapper />
    </div>
  );
};

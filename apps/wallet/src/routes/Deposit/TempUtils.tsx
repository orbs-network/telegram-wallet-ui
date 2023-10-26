import { useState } from 'react';
import { Fetcher } from '../../utils/fetcher';
import { web3Provider, swapProvider } from '../../config';
import { Button } from '@chakra-ui/react';
import { getDebug } from '../../lib/utils/debug';
import { bn6 } from '@defi.org/web3-candies';
import { useDebounce } from '../../lib/hooks/useDebounce';
import BN from 'bignumber.js';

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
  const [amountOut, setAmountOut] = useState('0');
  const [isAboveMinAmountOut, setAboveMinAmountOut] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const debounced = useDebounce(async (value: string) => {
    return swapProvider.quote({
      inAmount: bn6(value),
      inToken: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      outToken: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    });
  }, 300);

  return (
    <div>
      <h1>Swapper</h1>
      <label>amount in (USD)</label>
      <input
        type="number"
        style={{ padding: 8, width: 500 }}
        onChange={async (e) => {
          setLoading(true);
          try {
            const resp = await debounced(e.target.value);

            console.log(resp.quote.outAmount);
            setAmountOut(resp.quote.outAmount);
            setAboveMinAmountOut(resp.isAboveMin);
          } finally {
            setLoading(false);
          }
        }}
      />
      <br />
      <label>amount out (ETH)</label>
      <div>
        {isLoading ? 'loading...' : BN(amountOut).dividedBy(1e18).toString()}
      </div>
      <label>
        is above amount out:{' '}
        {isLoading ? 'loading...' : isAboveMinAmountOut.toString()}
      </label>
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

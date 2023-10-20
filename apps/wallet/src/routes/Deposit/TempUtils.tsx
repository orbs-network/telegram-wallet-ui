import { useState } from 'react';
import { Fetcher } from '../../utils/fetcher';
import { web3Provider } from '../../config';
import { Button } from '@chakra-ui/react';

export const TempUtils = () => {
  const [address, setAddress] = useState(web3Provider.account.address);
  return (
    <div>
      <div>
        <label>Address&nbsp;</label>
        <input style={{padding: 8, width: 500}} value={address} onChange={(e) => setAddress(e.target.value)} />
        <div
          style={{ width: 200}}
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

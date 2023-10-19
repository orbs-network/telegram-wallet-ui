import { Container } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import { ErrorPage } from '../../ErrorPage';

type Props = {
  walletAddress: string | undefined | null;
};

const apiKey = '4b701a53-ac2f-425f-966d-f6483fe1fe77';

const constructSrcUrl = (walletAddress: string) => {
  const params = new URLSearchParams({
    network: 'polygon',
    cryptoCurrencyCode: 'usdc',
    fiatCurrency: 'USD',
    // defaultFiatAmount: "100",
    hideMenu: 'true',
    disableWalletAddressForm: 'true',
    walletAddress,
  });

  return `https://global-stg.transak.com/?apiKey=${apiKey}&${params.toString()}`;
};

export const Buy = ({ walletAddress }: Props) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (message: {
      source: unknown;
      data: { event_id: string; data: unknown };
    }) => {
      const transakIframe = iframeRef.current?.contentWindow;

      if (message.source !== transakIframe) return;

      console.log('Event ID: ', message?.data?.event_id);
      console.log('Data: ', message?.data?.data);

      if (message?.data?.event_id === 'TRANSAK_ORDER_SUCCESSFUL') {
        console.log('Order Data: ', message?.data?.data);
      }
    };

    window.addEventListener('message', handleMessage);

    // Cleanup the event listener when the component is unmounted
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  if (!walletAddress) return <ErrorPage message="Wallet not created." />;

  const src = constructSrcUrl(walletAddress);
  console.log('src :', src);

  return (
    <Container size="sm" height="100vh">
      <iframe
        ref={iframeRef}
        id="transakIframe"
        title="Transak"
        src={src}
        allow="camera;microphone;payment"
        style={{ height: '100%', width: '100%', border: 'none' }}
      ></iframe>
    </Container>
  );
};

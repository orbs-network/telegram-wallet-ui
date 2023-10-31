import { useEffect, useRef, useState } from 'react';
import { ErrorPage } from '../../ErrorPage';
import { TRANSAK_STAGING_API_KEY, account } from '../../config';
import { Transak } from './transak/constants';
import { MainButton } from '@twa-dev/sdk/react';
import { useNavigate } from 'react-router-dom';
import { Page } from '../../components';

const walletAddress = account?.address;

const constructSrcUrl = (walletAddress: string) => {
  const params = new URLSearchParams({
    network: 'polygon',
    fiatCurrency: 'USD',
    defaultFiatAmount: '30',
    hideMenu: 'true',
    disableWalletAddressForm: 'true',
    walletAddress,
    defaultCryptoCurrency: 'USDC',
  });

  return `https://global-stg.transak.com/?apiKey=${TRANSAK_STAGING_API_KEY}&${params.toString()}`;
};

export const Buy = () => {
  const [showDoneButton, setShowDoneButton] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleMessage = (message: {
      source: unknown;
      data: { event_id: string; data: { id?: string; status?: string } };
    }) => {
      const transakIframe = iframeRef.current?.contentWindow;

      if (message.source !== transakIframe) return;

      if (
        message?.data?.event_id === Transak.Events.TRANSAK_ORDER_CREATED &&
        message.data.data.id
      ) {
        localStorage.setItem('transakOrderId', message.data.data.id);
      }

      switch (message?.data?.data.status) {
        case Transak.OrderStatus.onRamp.COMPLETED:
        case Transak.OrderStatus.onRamp.CANCELLED:
        case Transak.OrderStatus.onRamp.FAILED:
        case Transak.OrderStatus.onRamp.REFUNDED:
        case Transak.OrderStatus.onRamp.EXPIRED:
          localStorage.removeItem('transakOrderId');
          setShowDoneButton(true);
          break;
        default:
          return;
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

  return (
    <Page>
      <iframe
        ref={iframeRef}
        id="transakIframe"
        title="Transak"
        src={src}
        allow="camera;microphone;payment"
        style={{ height: '100%', width: '100%', border: 'none' }}
      ></iframe>
      {showDoneButton && (
        <MainButton text="Done" onClick={() => navigate('/')} />
      )}
    </Page>
  );
};

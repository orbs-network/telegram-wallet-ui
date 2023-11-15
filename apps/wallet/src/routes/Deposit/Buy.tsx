import { MainButton, colors } from '@telegram-wallet-ui/twa-ui-kit';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorPage } from '../../ErrorPage';
import { Page } from '../../components';
import { TRANSAK_API_KEY, TRANSAK_URL, useInitialize } from '../../config';
import { useGetTokenFromList } from '../../hooks';
import { getDebug } from '../../lib/utils/debug';
import { Transak } from './transak/constants';

const debug = getDebug('Buy');

const SYMBOL = 'usdt';

const constructSrcUrl = (walletAddress: string) => {
  const params = new URLSearchParams({
    network: 'polygon',
    walletAddress,
    cryptoCurrencyCode: SYMBOL,
    disableWalletAddressForm: 'true',
    hideMenu: 'true',
    themeColor: colors.button_color,
  });

  return `${TRANSAK_URL}/?apiKey=${TRANSAK_API_KEY}&${params.toString()}`;
};

export const Buy = () => {
  const [showDoneButton, setShowDoneButton] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const navigate = useNavigate();
  const usdtToken = useGetTokenFromList(SYMBOL);

  const config = useInitialize();

  useEffect(() => {
    if (usdtToken) {
      debug('Triggering faucet and permit2');
      config?.faucetProvider.setProofErc20(usdtToken.address);
      config?.permit2Provider.addErc20(usdtToken.address);
    }
  }, [usdtToken, config]);

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
          break;
      }

      // Hook into TRANSAK_WIDGET_CLOSE event to navigate back to Wallet home page upon user successfully purchasing and tapping "Back to App"
      if (message.data.event_id === Transak.Events.TRANSAK_WIDGET_CLOSE) {
        debug("TRANSAK_WIDGET_CLOSE event received. Navigating to '/'");
        navigate('/');
      }
    };

    window.addEventListener('message', handleMessage);

    // Cleanup the event listener when the component is unmounted
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [navigate]);

  return (
    <Page>
      {config?.account.address && (
        <iframe
          ref={iframeRef}
          id="transakIframe"
          title="Transak"
          src={constructSrcUrl(config?.account.address ?? '')}
          allow="camera;microphone;payment"
          style={{
            height: '100%',
            width: '100%',
            border: 'none',
            transform: 'scale(1.0)',
            overflow: 'hidden',
          }}
        ></iframe>
      )}
      {showDoneButton && (
        <MainButton text="Done" onClick={() => navigate('/')} />
      )}
    </Page>
  );
};

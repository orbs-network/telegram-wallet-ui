declare global {
  interface Window {
    Telegram: {
      WebApp: any;
    };
  }
}

window.Telegram = window.Telegram || {};

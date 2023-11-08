declare global {
  interface Window {
    Telegram: {
      WebApp: any;
    };
  }
}

export const Twa = window.Telegram.WebApp;

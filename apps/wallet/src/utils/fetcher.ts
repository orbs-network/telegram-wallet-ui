export class Fetcher {
  static async get<T = unknown>(url: string): Promise<T> {
    const res = await fetch(url);
    return res.json() as Promise<T>;
  }

  static async post<T = unknown>(url: string, body: any): Promise<T> {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return res.json() as Promise<T>;
  }
}

declare global {
  interface Window {
    Telegram: any;
  }
}

export class AuthenticatedTelegramFetcher extends Fetcher {
  static async post<T = unknown>(url: string, body: any): Promise<T> {
    return super.post(url, {
      ...body,
      queryData: window.Telegram?.WebApp.initData,
    });
  }
}

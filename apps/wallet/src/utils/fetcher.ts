export class Fetcher {
  static _handleResponse<T>(res: Response) {
    if (res.ok) {
      return res.json() as Promise<T>;
    }

    throw new Error(res.statusText);
  }

  static async get<T = unknown>(url: string): Promise<T> {
    const res = await fetch(url);
    return this._handleResponse<T>(res);
  }

  static async post<T = unknown>(url: string, body: any, signal?: AbortSignal): Promise<T> {
    const res = await fetch(url,  {
      signal,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      
    });

    return this._handleResponse<T>(res);
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
      // queryData: window.Telegram?.WebApp.initData,
      queryData:
        'query_id=AAF9SbUDAAAAAH1JtQNq4_8C&user=%7B%22id%22%3A62212477%2C%22first_name%22%3A%22shahar%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22mrbonezy%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1697629175&hash=9590293251587e9d290ca1505c50bbba058e1e2ab55d1874d6f19c8210acffb6',
    });
  }
}

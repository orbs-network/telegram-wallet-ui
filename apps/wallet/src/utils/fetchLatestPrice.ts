import { Fetcher } from './fetcher';

const API_URL = 'https://api.coingecko.com/api/v3/simple/price';

// TODO refactor
export function getInitialPrices(): Record<string, number> | undefined {
  const prices = localStorage.getItem('prices');

  if (prices) {
    return JSON.parse(prices);
  }
}

export async function fetchLatestPrices(
  coin: string,
  vsCurrencies = 'usd'
): Promise<Record<string, number> | undefined> {
  try {
    const data = await Fetcher.get<Record<string, { usd: number }>>(
      `${API_URL}?ids=${coin}&vs_currencies=${vsCurrencies}`
    );

    const parsed = Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, v.usd])
    );

    parsed['ton-coin'] = 0;

    localStorage.setItem('prices', JSON.stringify(parsed));

    return parsed;
  } catch (e) {
    // TODO this will allow the app to continue working even if the price fetch fails, but the prices would seem strange
    // discuss with sukh

    return getInitialPrices();
  }
}

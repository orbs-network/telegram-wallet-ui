import { Fetcher } from './fetcher';

const API_URL = 'https://api.coingecko.com/api/v3/simple/price';

/**
 * Fetches the latest price of a coin from the CoinGecko API
 * @see https://www.coingecko.com/en/api/documentation
 * @todo We are currently using CoinGecko's free API, which has a limit of 100 requests per minute.
 * @param coin A (top 10) coin to fetch the latest price of
 * @param vsCurrencies vs currencies to fetch the price in, defaults to USD
 * @returns The latest price of the coin in USD as a float
 */
export async function fetchLatestPrice(
  coin: string,
  vsCurrencies = 'usd'
): Promise<number> {
  try {
    const data = await Fetcher.get<Record<string, { [curr: string]: number }>>(
      `${API_URL}?ids=${coin}&vs_currencies=${vsCurrencies}`
    );

    return data[coin][vsCurrencies];
  } catch (e) {
    // TODO this will allow the app to continue working even if the price fetch fails, but the prices would seem strange
    // discuss with sukh
    return 1;
  }
}

export async function fetchLatestPrices(
  coin: string,
  vsCurrencies = 'usd'
): Promise<
  Record<
    string,
    {usd: number}
  > | undefined
> {
  try {
    const data = await Fetcher.get<Record<string, { usd: number }>>(
      `${API_URL}?ids=${coin}&vs_currencies=${vsCurrencies}`
    );

    return data;
  } catch (e) {
    // TODO this will allow the app to continue working even if the price fetch fails, but the prices would seem strange
    // discuss with sukh
    return undefined;
  }
}

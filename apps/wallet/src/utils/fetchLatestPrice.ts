/**
 * Fetches the latest price of a coin from the CoinGecko API
 * @see https://www.coingecko.com/en/api/documentation
 * @todo We are currently using CoinGecko's free API, which has a limit of 100 requests per minute.
 * @param coin A (top 10) coin to fetch the latest price of
 * @param vsCurrencies vs currencies to fetch the price in, defaults to USD
 * @throws Non200Error if response is a non-200 status code
 * @throws GeneralError if there is a problem with the fetch operation
 * @returns The latest price of the coin in USD as a float
 */
export async function fetchLatestPrice(
  coin: string,
  vsCurrencies = 'usd'
): Promise<number> {
  try {
    const response = await fetch(
      `${API_URL}?ids=${coin}&vs_currencies=${vsCurrencies}`
    );

    if (!response.ok) {
      throw new Non200Error(`${response.status} error: ${response.statusText}`);
    }

    const data: Record<string, { [curr: string]: number }> =
      await response.json();

    return data[coin][vsCurrencies];
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
    throw new GeneralError(
      'There has been a problem with your fetch operation'
    );
  }
}

const API_URL = 'https://api.coingecko.com/api/v3/simple/price';

class GeneralError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GeneralError';
  }
}
class Non200Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Non200Error';
  }
}

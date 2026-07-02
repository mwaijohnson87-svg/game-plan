import type { Asset, AssetType, Country } from '../types';

export interface AssetDefinition {
  id: string;
  symbol: string;
  name: string;
  type: AssetType;
  country: Country;
  exchange: string;
  currency: string;
  yahooSymbol: string;
  fallbackPrice: number;
  fallbackVolume?: number;
  marketCap?: number;
}

const stock = (
  id: string,
  symbol: string,
  name: string,
  country: Country,
  exchange: string,
  currency: string,
  yahooSymbol: string,
  fallbackPrice: number,
  volume = 1000000,
  marketCap?: number
): AssetDefinition => ({
  id,
  symbol,
  name,
  type: 'stock',
  country,
  exchange,
  currency,
  yahooSymbol,
  fallbackPrice,
  fallbackVolume: volume,
  marketCap,
});

export const ASSET_CATALOG: AssetDefinition[] = [
  stock('aapl', 'AAPL', 'Apple Inc.', 'US', 'NASDAQ', 'USD', 'AAPL', 178.72, 52874000, 2.8e12),
  stock('msft', 'MSFT', 'Microsoft Corporation', 'US', 'NASDAQ', 'USD', 'MSFT', 378.91, 21456000, 2.77e12),
  stock('googl', 'GOOGL', 'Alphabet Inc.', 'US', 'NASDAQ', 'USD', 'GOOGL', 141.8, 18765000, 1.75e12),
  stock('amzn', 'AMZN', 'Amazon.com Inc.', 'US', 'NASDAQ', 'USD', 'AMZN', 178.25, 34210000, 1.86e12),
  stock('nvda', 'NVDA', 'NVIDIA Corporation', 'US', 'NASDAQ', 'USD', 'NVDA', 875.28, 45678000, 2.16e12),
  stock('meta', 'META', 'Meta Platforms Inc.', 'US', 'NASDAQ', 'USD', 'META', 505.14, 12876000, 1.29e12),
  stock('tsla', 'TSLA', 'Tesla Inc.', 'US', 'NASDAQ', 'USD', 'TSLA', 248.5, 89456000, 789e9),
  stock('jpm', 'JPM', 'JPMorgan Chase & Co.', 'US', 'NYSE', 'USD', 'JPM', 198.42, 8654000, 578e9),

  stock('safaricom', 'SCOM', 'Safaricom PLC', 'KE', 'NSE', 'KES', 'SCOM.NR', 16.85, 4523000, 678e9),
  stock('equity', 'EQTY', 'Equity Group Holdings', 'KE', 'NSE', 'KES', 'EQTY.NR', 48.5, 1876000, 185e9),
  stock('kcb', 'KCB', 'KCB Group Ltd', 'KE', 'NSE', 'KES', 'KCB.NR', 42.1, 987000, 134e9),
  stock('eabl', 'EABL', 'East African Breweries', 'KE', 'NSE', 'KES', 'EABL.NR', 165, 234000, 130e9),

  stock('dangote', 'DANGCEM', 'Dangote Cement PLC', 'NG', 'NGX', 'NGN', 'DANGCEM.NG', 290.5, 1234000, 4.9e12),
  stock('mtnn', 'MTNN', 'MTN Nigeria Communications', 'NG', 'NGX', 'NGN', 'MTNN.NG', 215, 2456000),
  stock('airtel', 'AIRTEL', 'Airtel Africa PLC', 'NG', 'NGX', 'NGN', 'AIRTELAFRI.NG', 1850, 125000),

  stock('bp', 'BP', 'BP PLC', 'UK', 'LSE', 'GBX', 'BP.L', 523.45, 45678000),
  stock('hsbc', 'HSBA', 'HSBC Holdings PLC', 'UK', 'LSE', 'GBX', 'HSBA.L', 658.2, 32456000),
  stock('shell', 'SHEL', 'Shell PLC', 'UK', 'LSE', 'GBX', 'SHEL.L', 2687, 18765000),

  stock('lvmh', 'MC', 'LVMH Moet Hennessy Louis Vuitton', 'EU', 'Euronext', 'EUR', 'MC.PA', 725.4, 1256000),
  stock('sap', 'SAP', 'SAP SE', 'EU', 'Euronext', 'EUR', 'SAP.DE', 178.32, 2345000),
  stock('abbv', 'ABBV', 'ABB Ltd', 'EU', 'Euronext', 'CHF', 'ABBN.SW', 2923, 876000),
];

export const INDEX_CATALOG = [
  { country: 'US' as Country, name: 'S&P 500', yahooSymbol: '^GSPC' },
  { country: 'US' as Country, name: 'NASDAQ', yahooSymbol: '^IXIC' },
  { country: 'US' as Country, name: 'DOW', yahooSymbol: '^DJI' },
  { country: 'KE' as Country, name: 'NSE 20', yahooSymbol: '^NSE20' },
  { country: 'KE' as Country, name: 'NSE 25', yahooSymbol: '^NSE25' },
  { country: 'NG' as Country, name: 'NGX All-Share', yahooSymbol: '^NGSEINDX' },
  { country: 'UK' as Country, name: 'FTSE 100', yahooSymbol: '^FTSE' },
  { country: 'UK' as Country, name: 'FTSE 250', yahooSymbol: '^FTMC' },
  { country: 'EU' as Country, name: 'CAC 40', yahooSymbol: '^FCHI' },
  { country: 'EU' as Country, name: 'DAX', yahooSymbol: '^GDAXI' },
  { country: 'EU' as Country, name: 'Euro Stoxx 50', yahooSymbol: '^STOXX50E' },
];

export const FOREX_CATALOG = [
  { id: 'eur-usd', baseCurrency: 'EUR', quoteCurrency: 'USD', symbol: 'EUR/USD', yahooSymbol: 'EURUSD=X' },
  { id: 'gbp-usd', baseCurrency: 'GBP', quoteCurrency: 'USD', symbol: 'GBP/USD', yahooSymbol: 'GBPUSD=X' },
  { id: 'usd-kes', baseCurrency: 'USD', quoteCurrency: 'KES', symbol: 'USD/KES', yahooSymbol: 'USDKES=X' },
  { id: 'usd-ngn', baseCurrency: 'USD', quoteCurrency: 'NGN', symbol: 'USD/NGN', yahooSymbol: 'USDNGN=X' },
  { id: 'usd-jpy', baseCurrency: 'USD', quoteCurrency: 'JPY', symbol: 'USD/JPY', yahooSymbol: 'USDJPY=X' },
  { id: 'eur-gbp', baseCurrency: 'EUR', quoteCurrency: 'GBP', symbol: 'EUR/GBP', yahooSymbol: 'EURGBP=X' },
];

export const TBILL_YIELD_SYMBOLS = [
  { id: 'us-4w', country: 'US' as Country, maturity: '4 Weeks', yahooSymbol: '^IRX', parValue: 100, currency: 'USD' },
  { id: 'us-13w', country: 'US' as Country, maturity: '13 Weeks', yahooSymbol: '^IRX', parValue: 100, currency: 'USD' },
  { id: 'us-26w', country: 'US' as Country, maturity: '26 Weeks', yahooSymbol: '^FVX', parValue: 100, currency: 'USD' },
  { id: 'us-52w', country: 'US' as Country, maturity: '52 Weeks', yahooSymbol: '^TNX', parValue: 100, currency: 'USD' },
];

export function getAssetsByCountry(country: Country): AssetDefinition[] {
  return ASSET_CATALOG.filter((a) => a.country === country);
}

export function definitionToAsset(
  def: AssetDefinition,
  price: number,
  change: number,
  changePercent: number,
  volume: number
): Asset {
  return {
    id: def.id,
    symbol: def.symbol,
    name: def.name,
    type: def.type,
    country: def.country,
    exchange: def.exchange,
    price,
    change,
    changePercent,
    volume,
    marketCap: def.marketCap,
    currency: def.currency,
    isActive: true,
  };
}

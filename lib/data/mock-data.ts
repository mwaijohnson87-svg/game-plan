import type { Asset, Country, ForexCurrency, ForexPair, NewsItem, TBill, MarketOverview } from '../types';

export const US_STOCKS: Asset[] = [
  {
    id: 'aapl',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    type: 'stock',
    country: 'US',
    exchange: 'NASDAQ',
    price: 178.72,
    change: 2.34,
    changePercent: 1.33,
    volume: 52874000,
    marketCap: 2.8e12,
    currency: 'USD',
    isActive: true,
  },
  {
    id: 'msft',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    type: 'stock',
    country: 'US',
    exchange: 'NASDAQ',
    price: 378.91,
    change: -1.23,
    changePercent: -0.32,
    volume: 21456000,
    marketCap: 2.77e12,
    currency: 'USD',
    isActive: true,
  },
  {
    id: 'googl',
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    type: 'stock',
    country: 'US',
    exchange: 'NASDAQ',
    price: 141.80,
    change: 0.87,
    changePercent: 0.62,
    volume: 18765000,
    marketCap: 1.75e12,
    currency: 'USD',
    isActive: true,
  },
  {
    id: 'amzn',
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    type: 'stock',
    country: 'US',
    exchange: 'NASDAQ',
    price: 178.25,
    change: 3.45,
    changePercent: 1.97,
    volume: 34210000,
    marketCap: 1.86e12,
    currency: 'USD',
    isActive: true,
  },
  {
    id: 'nvda',
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    type: 'stock',
    country: 'US',
    exchange: 'NASDAQ',
    price: 875.28,
    change: 12.67,
    changePercent: 1.47,
    volume: 45678000,
    marketCap: 2.16e12,
    currency: 'USD',
    isActive: true,
  },
  {
    id: 'meta',
    symbol: 'META',
    name: 'Meta Platforms Inc.',
    type: 'stock',
    country: 'US',
    exchange: 'NASDAQ',
    price: 505.14,
    change: -2.89,
    changePercent: -0.57,
    volume: 12876000,
    marketCap: 1.29e12,
    currency: 'USD',
    isActive: true,
  },
  {
    id: 'tsla',
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    type: 'stock',
    country: 'US',
    exchange: 'NASDAQ',
    price: 248.50,
    change: -5.23,
    changePercent: -2.06,
    volume: 89456000,
    marketCap: 789e9,
    currency: 'USD',
    isActive: true,
  },
  {
    id: 'jpm',
    symbol: 'JPM',
    name: 'JPMorgan Chase & Co.',
    type: 'stock',
    country: 'US',
    exchange: 'NYSE',
    price: 198.42,
    change: 1.12,
    changePercent: 0.57,
    volume: 8654000,
    marketCap: 578e9,
    currency: 'USD',
    isActive: true,
  },
];

export const KE_STOCKS: Asset[] = [
  {
    id: 'safaricom',
    symbol: 'SCOM',
    name: 'Safaricom PLC',
    type: 'stock',
    country: 'KE',
    exchange: 'NSE',
    price: 16.85,
    change: 0.25,
    changePercent: 1.51,
    volume: 4523000,
    marketCap: 678e9,
    currency: 'KES',
    isActive: true,
  },
  {
    id: 'equity',
    symbol: 'EQTY',
    name: 'Equity Group Holdings',
    type: 'stock',
    country: 'KE',
    exchange: 'NSE',
    price: 48.50,
    change: -0.35,
    changePercent: -0.72,
    volume: 1876000,
    marketCap: 185e9,
    currency: 'KES',
    isActive: true,
  },
  {
    id: 'kcb',
    symbol: 'KCB',
    name: 'KCB Group Ltd',
    type: 'stock',
    country: 'KE',
    exchange: 'NSE',
    price: 42.10,
    change: 0.80,
    changePercent: 1.94,
    volume: 987000,
    marketCap: 134e9,
    currency: 'KES',
    isActive: true,
  },
  {
    id: 'eabl',
    symbol: 'EABL',
    name: 'East African Breweries',
    type: 'stock',
    country: 'KE',
    exchange: 'NSE',
    price: 165.00,
    change: 4.50,
    changePercent: 2.81,
    volume: 234000,
    marketCap: 130e9,
    currency: 'KES',
    isActive: true,
  },
];

export const NG_STOCKS: Asset[] = [
  {
    id: 'dangote',
    symbol: 'DANGCEM',
    name: 'Dangote Cement PLC',
    type: 'stock',
    country: 'NG',
    exchange: 'NGX',
    price: 290.50,
    change: 5.20,
    changePercent: 1.82,
    volume: 1234000,
    marketCap: 4.9e12,
    currency: 'NGN',
    isActive: true,
  },
  {
    id: 'mtnn',
    symbol: 'MTNN',
    name: 'MTN Nigeria Communications',
    type: 'stock',
    country: 'NG',
    exchange: 'NGX',
    price: 215.00,
    change: -2.10,
    changePercent: -0.97,
    volume: 2456000,
    currency: 'NGN',
    isActive: true,
  },
  {
    id: 'airtel',
    symbol: 'AIRTEL',
    name: 'Airtel Africa PLC',
    type: 'stock',
    country: 'NG',
    exchange: 'NGX',
    price: 1850.00,
    change: 25.00,
    changePercent: 1.37,
    volume: 125000,
    currency: 'NGN',
    isActive: true,
  },
];

export const UK_STOCKS: Asset[] = [
  {
    id: 'bp',
    symbol: 'BP',
    name: 'BP PLC',
    type: 'stock',
    country: 'UK',
    exchange: 'LSE',
    price: 523.45,
    change: 8.20,
    changePercent: 1.59,
    volume: 45678000,
    currency: 'GBX',
    isActive: true,
  },
  {
    id: 'hsbc',
    symbol: 'HSBA',
    name: 'HSBC Holdings PLC',
    type: 'stock',
    country: 'UK',
    exchange: 'LSE',
    price: 658.20,
    change: -3.40,
    changePercent: -0.51,
    volume: 32456000,
    currency: 'GBX',
    isActive: true,
  },
  {
    id: 'shell',
    symbol: 'SHEL',
    name: 'Shell PLC',
    type: 'stock',
    country: 'UK',
    exchange: 'LSE',
    price: 2687.00,
    change: 12.50,
    changePercent: 0.47,
    volume: 18765000,
    currency: 'GBX',
    isActive: true,
  },
];

export const EU_STOCKS: Asset[] = [
  {
    id: 'lvmh',
    symbol: 'MC',
    name: 'LVMH Moet Hennessy Louis Vuitton',
    type: 'stock',
    country: 'EU',
    exchange: 'Euronext',
    price: 725.40,
    change: 15.60,
    changePercent: 2.20,
    volume: 1256000,
    currency: 'EUR',
    isActive: true,
  },
  {
    id: 'sap',
    symbol: 'SAP',
    name: 'SAP SE',
    type: 'stock',
    country: 'EU',
    exchange: 'Euronext',
    price: 178.32,
    change: 2.15,
    changePercent: 1.22,
    volume: 2345000,
    currency: 'EUR',
    isActive: true,
  },
  {
    id: 'abbv',
    symbol: 'ABBV',
    name: 'ABB Ltd',
    type: 'stock',
    country: 'EU',
    exchange: 'Euronext',
    price: 2923.00,
    change: -18.50,
    changePercent: -0.63,
    volume: 876000,
    currency: 'CHF',
    isActive: true,
  },
];

export const FOREX_CURRENCIES: ForexCurrency[] = [
  { id: 'usd', code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
  { id: 'eur', code: 'EUR', name: 'Euro', flag: '🇪🇺' },
  { id: 'gbp', code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
  { id: 'kes', code: 'KES', name: 'Kenyan Shilling', flag: '🇰🇪' },
  { id: 'ngn', code: 'NGN', name: 'Nigerian Naira', flag: '🇳🇬' },
  { id: 'jpy', code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
];

export const FOREX_PAIRS: ForexPair[] = [
  {
    id: 'eur-usd',
    baseCurrency: 'EUR',
    quoteCurrency: 'USD',
    symbol: 'EUR/USD',
    rate: 1.0847,
    change: 0.0023,
    changePercent: 0.21,
    bid: 1.0845,
    ask: 1.0849,
    spread: 0.0004,
  },
  {
    id: 'gbp-usd',
    baseCurrency: 'GBP',
    quoteCurrency: 'USD',
    symbol: 'GBP/USD',
    rate: 1.2648,
    change: -0.0034,
    changePercent: -0.27,
    bid: 1.2645,
    ask: 1.2651,
    spread: 0.0006,
  },
  {
    id: 'usd-kes',
    baseCurrency: 'USD',
    quoteCurrency: 'KES',
    symbol: 'USD/KES',
    rate: 157.85,
    change: 0.45,
    changePercent: 0.29,
    bid: 157.80,
    ask: 157.90,
    spread: 0.10,
  },
  {
    id: 'usd-ngn',
    baseCurrency: 'USD',
    quoteCurrency: 'NGN',
    symbol: 'USD/NGN',
    rate: 1550.25,
    change: 12.50,
    changePercent: 0.81,
    bid: 1545.00,
    ask: 1555.50,
    spread: 10.50,
  },
  {
    id: 'usd-jpy',
    baseCurrency: 'USD',
    quoteCurrency: 'JPY',
    symbol: 'USD/JPY',
    rate: 154.82,
    change: -0.45,
    changePercent: -0.29,
    bid: 154.80,
    ask: 154.84,
    spread: 0.04,
  },
  {
    id: 'eur-gbp',
    baseCurrency: 'EUR',
    quoteCurrency: 'GBP',
    symbol: 'EUR/GBP',
    rate: 0.8581,
    change: 0.0012,
    changePercent: 0.14,
    bid: 0.8579,
    ask: 0.8583,
    spread: 0.0004,
  },
];

export const TBILLS: TBill[] = [
  { id: 'us-4w', country: 'US', maturity: '4 Weeks', yield: 5.32, price: 99.59, parValue: 100, currency: 'USD' },
  { id: 'us-13w', country: 'US', maturity: '13 Weeks', yield: 5.28, price: 98.71, parValue: 100, currency: 'USD' },
  { id: 'us-26w', country: 'US', maturity: '26 Weeks', yield: 5.18, price: 97.41, parValue: 100, currency: 'USD' },
  { id: 'us-52w', country: 'US', maturity: '52 Weeks', yield: 4.95, price: 95.21, parValue: 100, currency: 'USD' },
  { id: 'ke-91d', country: 'KE', maturity: '91 Days', yield: 16.52, price: 95.89, parValue: 100, currency: 'KES' },
  { id: 'ke-182d', country: 'KE', maturity: '182 Days', yield: 17.12, price: 91.56, parValue: 100, currency: 'KES' },
  { id: 'ke-364d', country: 'KE', maturity: '364 Days', yield: 17.85, price: 84.82, parValue: 100, currency: 'KES' },
];

export const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    category: 'STOCKS',
    headline: 'NVIDIA surges 2% as AI demand drives record quarterly revenues',
    summary: 'NVIDIA reported record earnings as demand for AI chips continues to surge.',
    source: 'Reuters',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    impact: 'high',
    relatedAssets: ['nvda'],
    relatedCountries: ['US'],
  },
  {
    id: '2',
    category: 'FOREX',
    headline: 'USD/KES touches 158 as Central Bank intervenes in forex markets',
    summary: 'The Kenyan shilling weakened against the dollar despite CBK intervention.',
    source: 'Business Daily',
    timestamp: new Date(Date.now() - 32 * 60 * 1000),
    impact: 'medium',
    relatedAssets: ['usd-kes'],
    relatedCountries: ['KE'],
  },
  {
    id: '3',
    category: 'MACRO',
    headline: 'Fed signals potential rate cuts in Q3 as inflation cools',
    summary: 'The Federal Reserve indicated possible rate cuts later this year.',
    source: 'Bloomberg',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    impact: 'high',
    relatedCountries: ['US'],
  },
  {
    id: '4',
    category: 'EARNINGS',
    headline: 'Safaricom profits beat estimates with 12% growth in M-Pesa revenue',
    summary: 'Safaricom delivered strong quarterly results driven by mobile money growth.',
    source: 'Nation',
    timestamp: new Date(Date.now() - 67 * 60 * 1000),
    impact: 'medium',
    relatedAssets: ['safaricom'],
    relatedCountries: ['KE'],
  },
  {
    id: '5',
    category: 'POLICY',
    headline: 'ECB maintains rates as eurozone inflation remains above target',
    summary: 'The European Central Bank kept interest rates steady.',
    source: 'Financial Times',
    timestamp: new Date(Date.now() - 90 * 60 * 1000),
    impact: 'high',
    relatedCountries: ['EU'],
  },
  {
    id: '6',
    category: 'STOCKS',
    headline: 'Dangote Cement hits 52-week high on infrastructure spending outlook',
    summary: 'Nigerian cement giant rallied on government infrastructure commitments.',
    source: 'Punch',
    timestamp: new Date(Date.now() - 120 * 60 * 1000),
    impact: 'medium',
    relatedAssets: ['dangote'],
    relatedCountries: ['NG'],
  },
];

export const COUNTRY_FLAGS: Record<Country, string> = {
  US: '🇺🇸',
  KE: '🇰🇪',
  NG: '🇳🇬',
  UK: '🇬🇧',
  EU: '🇪🇺',
};

export const COUNTRY_NAMES: Record<Country, string> = {
  US: 'United States',
  KE: 'Kenya',
  NG: 'Nigeria',
  UK: 'United Kingdom',
  EU: 'Europe',
};

export const MARKET_OVERVIEWS: MarketOverview[] = [
  {
    country: 'US',
    exchange: 'NYSE/NASDAQ',
    name: 'US Markets',
    flag: '🇺🇸',
    sentiment: 'bullish',
    volume: 45.8e9,
    volumeChange: 12.5,
    topGainers: [],
    topLosers: [],
    indices: [
      { name: 'S&P 500', value: 5234.18, change: 28.45, changePercent: 0.55 },
      { name: 'NASDAQ', value: 16742.39, change: 156.78, changePercent: 0.95 },
      { name: 'DOW', value: 39087.38, change: -45.23, changePercent: -0.12 },
    ],
  },
  {
    country: 'KE',
    exchange: 'NSE',
    name: 'Nairobi Securities Exchange',
    flag: '🇰🇪',
    sentiment: 'bullish',
    volume: 1.2e9,
    volumeChange: 8.3,
    topGainers: [],
    topLosers: [],
    indices: [
      { name: 'NSE 20', value: 1845.32, change: 12.45, changePercent: 0.68 },
      { name: 'NSE 25', value: 3654.78, change: 28.56, changePercent: 0.79 },
    ],
  },
  {
    country: 'NG',
    exchange: 'NGX',
    name: 'Nigerian Exchange',
    flag: '🇳🇬',
    sentiment: 'bearish',
    volume: 8.5e9,
    volumeChange: -5.2,
    topGainers: [],
    topLosers: [],
    indices: [
      { name: 'NGX All-Share', value: 98456.23, change: -456.78, changePercent: -0.46 },
    ],
  },
  {
    country: 'UK',
    exchange: 'LSE',
    name: 'London Stock Exchange',
    flag: '🇬🇧',
    sentiment: 'flat',
    volume: 12.4e9,
    volumeChange: 2.1,
    topGainers: [],
    topLosers: [],
    indices: [
      { name: 'FTSE 100', value: 8167.98, change: 23.45, changePercent: 0.29 },
      { name: 'FTSE 250', value: 20456.78, change: -45.67, changePercent: -0.22 },
    ],
  },
  {
    country: 'EU',
    exchange: 'Euronext',
    name: 'Euronext',
    flag: '🇪🇺',
    sentiment: 'bullish',
    volume: 28.9e9,
    volumeChange: 15.8,
    topGainers: [],
    topLosers: [],
    indices: [
      { name: 'CAC 40', value: 7891.23, change: 56.78, changePercent: 0.72 },
      { name: 'DAX', value: 18456.78, change: 123.45, changePercent: 0.67 },
      { name: 'Euro Stoxx 50', value: 5012.34, change: 34.56, changePercent: 0.69 },
    ],
  },
];

export function getAllAssets(): Asset[] {
  return [...US_STOCKS, ...KE_STOCKS, ...NG_STOCKS, ...UK_STOCKS, ...EU_STOCKS];
}

export function getAssetsByCountry(country: Country): Asset[] {
  switch (country) {
    case 'US':
      return US_STOCKS;
    case 'KE':
      return KE_STOCKS;
    case 'NG':
      return NG_STOCKS;
    case 'UK':
      return UK_STOCKS;
    case 'EU':
      return EU_STOCKS;
    default:
      return [];
  }
}

export function generateMockPriceHistory(days: number): { time: number; open: number; high: number; low: number; close: number; volume: number }[] {
  const now = Math.floor(Date.now() / 1000);
  const daySeconds = 24 * 60 * 60;
  const data = [];
  let price = 150 + Math.random() * 50;

  for (let i = days; i >= 0; i--) {
    const time = now - i * daySeconds;
    const volatility = price * 0.02;
    const change = (Math.random() - 0.5) * volatility * 2;
    price = Math.max(10, price + change);

    const open = price + (Math.random() - 0.5) * volatility;
    const close = price + (Math.random() - 0.5) * volatility;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;
    const volume = Math.floor(500000 + Math.random() * 5000000);

    data.push({
      time,
      open,
      high,
      low,
      close,
      volume,
    });
  }

  return data;
}

export function generateMockOrderBook(price: number) {
  const bids = [];
  const asks = [];
  const spread = price * 0.001;

  for (let i = 0; i < 10; i++) {
    const bidPrice = price - spread * (i + 1);
    const askPrice = price + spread * (i + 1);
    const bidQty = Math.floor(100 + Math.random() * 1000);
    const askQty = Math.floor(100 + Math.random() * 1000);

    bids.push({
      price: parseFloat(bidPrice.toFixed(2)),
      quantity: bidQty,
      total: bidQty * bidPrice,
    });

    asks.push({
      price: parseFloat(askPrice.toFixed(2)),
      quantity: askQty,
      total: askQty * askPrice,
    });
  }

  return {
    bids: bids.reverse(),
    asks,
    spread: parseFloat(spread.toFixed(4)),
    spreadPercent: 0.1,
    lastUpdated: new Date(),
  };
}

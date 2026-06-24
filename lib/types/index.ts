export type Country = 'KE' | 'US' | 'NG' | 'UK' | 'EU';

export type AssetType = 'stock' | 'forex' | 'tbill' | 'bond' | 'etf';

export type OrderType = 'market' | 'limit' | 'stop';

export type OrderSide = 'buy' | 'sell';

export type MarketSentiment = 'bullish' | 'bearish' | 'flat';

export type TimeFrame = '1D' | '1W' | '1M' | '3M' | '1Y';

export type NewsCategory = 'FOREX' | 'STOCKS' | 'MACRO' | 'EARNINGS' | 'POLICY';

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  type: AssetType;
  country: Country;
  exchange: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  currency: string;
  isActive: boolean;
}

export interface Holding {
  id: string;
  assetId: string;
  asset: Asset;
  quantity: number;
  averageCost: number;
  currentPrice: number;
  totalValue: number;
  pnl: number;
  pnlPercent: number;
  openDate: Date;
}

export interface Position {
  id: string;
  assetId: string;
  asset: Asset;
  side: OrderSide;
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  stopLoss?: number;
  takeProfit?: number;
  openDate: Date;
  pnl: number;
  pnlPercent: number;
}

export interface Order {
  id: string;
  assetId: string;
  asset: Asset;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  price?: number;
  stopPrice?: number;
  status: 'pending' | 'filled' | 'cancelled' | 'rejected';
  createdAt: Date;
  filledAt?: Date;
  filledPrice?: number;
  totalCost: number;
}

export interface TradeHistory {
  id: string;
  orderId: string;
  assetId: string;
  asset: Asset;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  price: number;
  totalCost: number;
  pnl?: number;
  executedAt: Date;
}

export interface OrderBookEntry {
  price: number;
  quantity: number;
  total: number;
}

export interface OrderBook {
  assetId: string;
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  spread: number;
  spreadPercent: number;
  lastUpdated: Date;
}

export interface PricePoint {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface PriceHistory {
  assetId: string;
  timeframe: TimeFrame;
  data: PricePoint[];
  lastUpdated: Date;
}

export interface NewsItem {
  id: string;
  category: NewsCategory;
  headline: string;
  summary: string;
  source: string;
  timestamp: Date;
  impact: 'high' | 'medium' | 'low';
  relatedAssets?: string[];
  relatedCountries?: Country[];
}

export interface GameEvent {
  id: string;
  type: 'market_crash' | 'rate_change' | 'earnings_season' | 'ipo' | 'merger' | 'policy_change';
  title: string;
  description: string;
  affectedMarkets: Country[];
  affectedAssets: string[];
  impact: {
    assetId: string;
    priceChange: number;
  volumeMultiplier: number;
  sentiment: MarketSentiment;
  }[];
  startTime: Date;
  endTime: Date;
}

export interface TBill {
  id: string;
  country: Country;
  maturity: string;
  yield: number;
  price: number;
  parValue: number;
  currency: string;
}

export interface ForexCurrency {
  id: string;
  code: string;
  name: string;
  flag: string;
}

export interface ForexPair {
  id: string;
  baseCurrency: string;
  quoteCurrency: string;
  symbol: string;
  rate: number;
  change: number;
  changePercent: number;
  bid: number;
  ask: number;
  spread: number;
}

export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  playerName: string;
  country: Country;
  avatar?: string;
  portfolioValue: number;
  weeklyPnL: number;
  weeklyPnLPercent: number;
  returnRate: number;
  winRate: number;
  totalTrades: number;
}

export interface MarketOverview {
  country: Country;
  exchange: string;
  name: string;
  flag: string;
  sentiment: MarketSentiment;
  volume: number;
  volumeChange: number;
  topGainers: Asset[];
  topLosers: Asset[];
  indices: {
    name: string;
    value: number;
    change: number;
    changePercent: number;
  }[];
}

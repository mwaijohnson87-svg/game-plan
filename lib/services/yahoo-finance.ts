import type { TimeFrame } from '../types';

const YAHOO_BASE = 'https://query1.finance.yahoo.com';
const USER_AGENT = 'Mozilla/5.0 (compatible; CapitalPlay/1.0)';

interface YahooChartMeta {
  currency?: string;
  symbol?: string;
  regularMarketPrice?: number;
  chartPreviousClose?: number;
  previousClose?: number;
  regularMarketVolume?: number;
  regularMarketChange?: number;
  regularMarketChangePercent?: number;
  bid?: number;
  ask?: number;
}

interface YahooChartResult {
  meta?: YahooChartMeta;
  timestamp?: number[];
  indicators?: {
    quote?: Array<{
      open?: number[];
      high?: number[];
      low?: number[];
      close?: number[];
      volume?: number[];
    }>;
  };
}

export interface QuoteSnapshot {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  bid?: number;
  ask?: number;
  currency?: string;
}

export interface ChartPoint {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface YahooNewsItem {
  uuid?: string;
  title: string;
  summary?: string;
  publisher?: string;
  providerPublishTime?: number;
  relatedTickers?: string[];
}

async function yahooFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${YAHOO_BASE}${path}`, {
    headers: { 'User-Agent': USER_AGENT },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Yahoo Finance request failed (${response.status}) for ${path}`);
  }

  return response.json() as Promise<T>;
}

function timeframeParams(timeframe: TimeFrame): { interval: string; range: string } {
  switch (timeframe) {
    case '1D':
      return { interval: '5m', range: '1d' };
    case '1W':
      return { interval: '1h', range: '5d' };
    case '1M':
      return { interval: '1d', range: '1mo' };
    case '3M':
      return { interval: '1d', range: '3mo' };
    case '1Y':
      return { interval: '1d', range: '1y' };
    default:
      return { interval: '1d', range: '1mo' };
  }
}

function quoteFromMeta(meta: YahooChartMeta, fallbackSymbol: string): QuoteSnapshot | null {
  const price = meta.regularMarketPrice;
  if (!price || !Number.isFinite(price)) return null;

  const previousClose = meta.chartPreviousClose ?? meta.previousClose ?? price;
  const change = meta.regularMarketChange ?? price - previousClose;
  const changePercent =
    meta.regularMarketChangePercent ??
    (previousClose !== 0 ? (change / previousClose) * 100 : 0);

  return {
    symbol: meta.symbol ?? fallbackSymbol,
    price,
    change,
    changePercent,
    volume: meta.regularMarketVolume ?? 0,
    bid: meta.bid,
    ask: meta.ask,
    currency: meta.currency,
  };
}

export async function fetchQuote(symbol: string): Promise<QuoteSnapshot | null> {
  const data = await yahooFetch<{ chart?: { result?: YahooChartResult[] } }>(
    `/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=2d`
  );

  const result = data.chart?.result?.[0];
  if (!result?.meta) return null;
  return quoteFromMeta(result.meta, symbol);
}

export async function fetchQuotes(symbols: string[]): Promise<Record<string, QuoteSnapshot>> {
  const quotes: Record<string, QuoteSnapshot> = {};

  await Promise.all(
    symbols.map(async (symbol) => {
      try {
        const quote = await fetchQuote(symbol);
        if (quote) quotes[symbol] = quote;
      } catch (error) {
        console.error(`Failed to fetch quote for ${symbol}:`, error);
      }
    })
  );

  return quotes;
}

export async function fetchChart(
  symbol: string,
  timeframe: TimeFrame
): Promise<{ quote: QuoteSnapshot | null; points: ChartPoint[] }> {
  const { interval, range } = timeframeParams(timeframe);
  const data = await yahooFetch<{ chart?: { result?: YahooChartResult[] } }>(
    `/v8/finance/chart/${encodeURIComponent(symbol)}?interval=${interval}&range=${range}`
  );

  const result = data.chart?.result?.[0];
  if (!result) return { quote: null, points: [] };

  const quote = result.meta ? quoteFromMeta(result.meta, symbol) : null;
  const timestamps = result.timestamp ?? [];
  const series = result.indicators?.quote?.[0];

  if (!series) return { quote, points: [] };

  const points: ChartPoint[] = timestamps
    .map((time, index) => {
      const open = series.open?.[index];
      const high = series.high?.[index];
      const low = series.low?.[index];
      const close = series.close?.[index];
      const volume = series.volume?.[index];

      if (
        open == null ||
        high == null ||
        low == null ||
        close == null ||
        volume == null
      ) {
        return null;
      }

      return { time, open, high, low, close, volume };
    })
    .filter((point): point is ChartPoint => point !== null);

  return { quote, points };
}

export async function fetchMarketNews(symbols: string[]): Promise<YahooNewsItem[]> {
  const query = symbols.slice(0, 8).join(',');
  const data = await yahooFetch<{ news?: YahooNewsItem[] }>(
    `/v2/finance/news?symbols=${encodeURIComponent(query)}`
  );

  return data.news ?? [];
}

export async function fetchTrendingNews(): Promise<YahooNewsItem[]> {
  const data = await yahooFetch<{ news?: YahooNewsItem[] }>(
    '/v1/finance/search?q=markets&newsCount=20'
  );

  return data.news ?? [];
}

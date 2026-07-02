import { useQuery } from '@tanstack/react-query';
import type { Asset, ForexPair, MarketOverview, NewsItem, TBill, TimeFrame, Country } from '@/lib/types';

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export function useMarketQuotes() {
  return useQuery<{ assets: Asset[] }>({
    queryKey: ['market', 'quotes'],
    queryFn: () => fetchJson<{ assets: Asset[] }>('/api/market/quotes'),
    refetchInterval: 60_000,
  });
}

export function usePriceHistory(assetId: string | undefined, timeframe: TimeFrame) {
  return useQuery<{
    points: Array<{ time: number; open: number; high: number; low: number; close: number; volume: number }>;
    quote?: { bid?: number; ask?: number; price: number };
  }>({
    queryKey: ['market', 'history', assetId, timeframe],
    queryFn: () =>
      fetchJson<{
        points: Array<{ time: number; open: number; high: number; low: number; close: number; volume: number }>;
        quote?: { bid?: number; ask?: number; price: number };
      }>(`/api/market/history?assetId=${assetId}&timeframe=${timeframe}`),
    enabled: Boolean(assetId),
    refetchInterval: 60_000,
  });
}

export function useMarketNews() {
  return useQuery<{ news: NewsItem[] }>({
    queryKey: ['market', 'news'],
    queryFn: () => fetchJson<{ news: NewsItem[] }>('/api/market/news'),
    refetchInterval: 5 * 60_000,
  });
}

export function useMarketOverviews() {
  return useQuery<{ overviews: MarketOverview[] }>({
    queryKey: ['market', 'overviews'],
    queryFn: () => fetchJson<{ overviews: MarketOverview[] }>('/api/market/overviews'),
    refetchInterval: 60_000,
  });
}

export function useForexPairs() {
  return useQuery<{ pairs: ForexPair[] }>({
    queryKey: ['market', 'forex'],
    queryFn: () => fetchJson<{ pairs: ForexPair[] }>('/api/market/forex'),
    refetchInterval: 60_000,
  });
}

export function useTreasuryBills() {
  return useQuery<{ tbills: TBill[] }>({
    queryKey: ['market', 'treasury'],
    queryFn: () => fetchJson<{ tbills: TBill[] }>('/api/market/treasury'),
    refetchInterval: 5 * 60_000,
  });
}

export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  playerName: string;
  country: Country;
  portfolioValue: number;
  weeklyPnL: number;
  weeklyPnLPercent: number;
  returnRate: number;
  winRate: number;
  totalTrades: number;
}

export function useLeaderboard() {
  return useQuery<{ entries: LeaderboardEntry[] }>({
    queryKey: ['leaderboard'],
    queryFn: () => fetchJson<{ entries: LeaderboardEntry[] }>('/api/leaderboard'),
    refetchInterval: 60_000,
  });
}

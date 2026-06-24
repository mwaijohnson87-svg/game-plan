import { create } from 'zustand';
import type { Country, Asset, TimeFrame, PriceHistory, OrderBook, NewsItem } from '../types';

interface MarketState {
  selectedCountry: Country;
  selectedAsset: Asset | null;
  selectedTimeframe: TimeFrame;
  priceHistory: PriceHistory | null;
  orderBook: OrderBook | null;
  news: NewsItem[];
  assets: Asset[];

  // Actions
  setSelectedCountry: (country: Country) => void;
  setSelectedAsset: (asset: Asset | null) => void;
  setSelectedTimeframe: (timeframe: TimeFrame) => void;
  setPriceHistory: (history: PriceHistory | null) => void;
  setOrderBook: (book: OrderBook | null) => void;
  setNews: (news: NewsItem[]) => void;
  setAssets: (assets: Asset[]) => void;
  updateAssetPrice: (assetId: string, price: number, change: number, changePercent: number) => void;
}

export const useMarketStore = create<MarketState>((set, get) => ({
  selectedCountry: 'US',
  selectedAsset: null,
  selectedTimeframe: '1D',
  priceHistory: null,
  orderBook: null,
  news: [],
  assets: [],

  setSelectedCountry: (country) => set({ selectedCountry: country }),
  setSelectedAsset: (asset) => set({ selectedAsset: asset }),
  setSelectedTimeframe: (timeframe) => set({ selectedTimeframe: timeframe }),
  setPriceHistory: (history) => set({ priceHistory: history }),
  setOrderBook: (book) => set({ orderBook: book }),
  setNews: (news) => set({ news }),
  setAssets: (assets) => set({ assets }),

  updateAssetPrice: (assetId, price, change, changePercent) =>
    set((state) => ({
      assets: state.assets.map((a) =>
        a.id === assetId
          ? { ...a, price, change, changePercent }
          : a
      ),
      selectedAsset:
        state.selectedAsset?.id === assetId
          ? { ...state.selectedAsset, price, change, changePercent }
          : state.selectedAsset,
    })),
}));

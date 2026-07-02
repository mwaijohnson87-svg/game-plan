import { create } from 'zustand';
import type { Country, Asset, TimeFrame, PriceHistory, OrderBook, NewsItem } from '../types'; 

interface MarketAsset {
  name: string;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
}

interface MarketState {
  // 1. Keep your existing state intact
  selectedCountry: Country;
  selectedAsset: Asset | null;
  selectedTimeframe: TimeFrame;
  priceHistory: PriceHistory | null;
  orderBook: OrderBook | null;
  news: NewsItem[];
  assets: Asset[];

  // Live Kenyan Ticker addition
  kenyanPrices: Record<string, MarketAsset>;
  isLiveLoading: boolean;

  // 2. Keep your existing actions
  setSelectedCountry: (country: Country) => void;
  setSelectedAsset: (asset: Asset | null) => void;
  setSelectedTimeframe: (timeframe: TimeFrame) => void;
  setPriceHistory: (history: PriceHistory | null) => void;
  setOrderBook: (book: OrderBook | null) => void;
  setNews: (news: NewsItem[]) => void;

  // Live API action addition
  fetchLivePrices: () => Promise<void>;
}

export const useMarketStore = create<MarketState>((set) => ({
  // Fallbacks or initial states for your existing setup (adjust defaults if needed)
  selectedCountry: 'KE' as any,
  selectedAsset: null,
  selectedTimeframe: '1D' as any,
  priceHistory: null,
  orderBook: null,
  news: [],
  assets: [],

  // Live Kenyan data initial layout state
  kenyanPrices: {
    "SCOM.NR": { name: "Safaricom PLC", price: 16.85, change: 0.15, changePercent: 0.90, currency: "KES" },
    "KCB.NR": { name: "KCB Group KES", price: 42.50, change: 1.20, changePercent: 2.90, currency: "KES" },
    "EQTY.NR": { name: "Equity Group Holdings", price: 44.00, change: -0.50, changePercent: -1.13, currency: "KES" }
  },
  isLiveLoading: false,

  // Setters for your structural engine features
  setSelectedCountry: (country) => set({ selectedCountry: country }),
  setSelectedAsset: (asset) => set({ selectedAsset: asset }),
  setSelectedTimeframe: (timeframe) => set({ selectedTimeframe: timeframe }),
  setPriceHistory: (history) => set({ priceHistory: history }),
  setOrderBook: (book) => set({ orderBook: book }),
  setNews: (news) => set({ news }),

  // The backend execution hook pulling real data from your API endpoint
  fetchLivePrices: async () => {
    set({ isLiveLoading: true });
    try {
      const response = await fetch('/api/market/quotes');
      if (!response.ok) throw new Error('Market terminal API down');
      const data = await response.json();
      set({ kenyanPrices: data, isLiveLoading: false });
    } catch (error) {
      console.warn("Using local system ticker fallbacks:", error);
      set({ isLiveLoading: false });
    }
  }
}));
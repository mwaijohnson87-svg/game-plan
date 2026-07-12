import { create } from 'zustand';
import type { Holding, Position } from '../types';
import { supabase } from '../supabase';

interface PortfolioState {
  cash: number;
  holdings: Holding[];
  positions: Position[];
  totalValue: number;
  dayPnL: number;
  dayPnLPercent: number;
  totalPnL: number;
  totalPnLPercent: number;

  // Local State Actions
  setCash: (cash: number) => void;
  setHoldings: (holdings: Holding[]) => void;
  setPositions: (positions: Position[]) => void;
  updateTotalValue: () => void;
  updateDayPnL: (pnl: number, percent: number) => void;
  
  // Cloud-Synced Transaction Actions
  addHolding: (holding: Holding) => Promise<void>;
  updateHolding: (id: string, updates: Partial<Holding>) => Promise<void>;
  removeHolding: (id: string) => Promise<void>;
  addPosition: (position: Position) => Promise<void>;
  updatePosition: (id: string, updates: Partial<Position>) => Promise<void>;
  closePosition: (id: string) => Promise<void>;

  // Complete Engine Cloud Synchronization
  fetchPortfolio: () => Promise<void>;
}

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  cash: 100000,
  holdings: [],
  positions: [],
  totalValue: 100000,
  dayPnL: 0,
  dayPnLPercent: 0,
  totalPnL: 0,
  totalPnLPercent: 0,

  setCash: async (cash) => {
    set({ cash });
    get().updateTotalValue();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      // Force the app to use our guest fallback profile if no user exists
      const userId = user?.id || '00000000-0000-0000-0000-000000000000';
      
      await supabase.from('profiles').update({ balance: cash }).eq('id', userId);
    } catch (err) {
      console.error('Error syncing cash balance:', err);
    }
  },

  setHoldings: (holdings) => {
    set({ holdings });
    get().updateTotalValue();
  },

  setPositions: (positions) => {
    set({ positions });
    get().updateTotalValue();
  },

  updateTotalValue: () => {
    const state = get();
    const holdingsValue = state.holdings.reduce((sum, h) => sum + (h.quantity * h.currentPrice), 0);
    const positionsValue = state.positions.reduce((sum, p) => sum + (p.quantity * p.currentPrice), 0);
    set({ totalValue: state.cash + holdingsValue + positionsValue });
  },

  updateDayPnL: (pnl, percent) => set({ dayPnL: pnl, dayPnLPercent: percent }),

  // --- CLOUD-SYNCED HOLDINGS ACTIONS ---
  addHolding: async (holding) => {
    // 1. Optimistic Update UI for extreme speed
    set((state) => ({ holdings: [...state.holdings, holding] }));
    get().updateTotalValue();

    // 2. Persist to Cloud Table
    try {
      const { data: { user } } = await supabase.auth.getUser();
const userId = user?.id || '00000000-0000-0000-0000-000000000000';

const { data } = await supabase.from('portfolios').select('*').eq('user_id', userId);
    } catch (err) {
      console.error('Database failed to insert holding row:', err);
    }
  },

  updateHolding: async (id, updates) => {
    set((state) => ({
      holdings: state.holdings.map((h) => h.id === id ? { ...h, ...updates } : h),
    }));
    get().updateTotalValue();

    try {
      await supabase.from('holdings').update(updates).eq('id', id);
    } catch (err) {
      console.error('Database failed to update holding row:', err);
    }
  },

  removeHolding: async (id) => {
    set((state) => ({ holdings: state.holdings.filter((h) => h.id !== id) }));
    get().updateTotalValue();

    try {
      await supabase.from('holdings').delete().eq('id', id);
    } catch (err) {
      console.error('Database failed to drop holding row:', err);
    }
  },

  // --- CLOUD-SYNCED POSITIONS (LEVERAGED MARGIN TRADES) ---
  addPosition: async (position) => {
    set((state) => ({ positions: [...state.positions, position] }));
    get().updateTotalValue();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.from('positions').insert([{ ...position, user_id: user.id }]);
    } catch (err) {
      console.error('Database failed to spin up position row:', err);
    }
  },

  updatePosition: async (id, updates) => {
    set((state) => ({
      positions: state.positions.map((p) => p.id === id ? { ...p, ...updates } : p),
    }));
    get().updateTotalValue();

    try {
      await supabase.from('positions').update(updates).eq('id', id);
    } catch (err) {
      console.error('Database failed to modify position tracking row:', err);
    }
  },

  closePosition: async (id) => {
    set((state) => ({ positions: state.positions.filter((p) => p.id !== id) }));
    get().updateTotalValue();

    try {
      await supabase.from('positions').delete().eq('id', id);
    } catch (err) {
      console.error('Database failed to close database position row:', err);
    }
  },

  // --- INITIAL COMPONENT INITIALIZATION FETCH ROUTINE ---
  fetchPortfolio: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Execute database pulls simultaneously using a Promise block
      const [profileRes, holdingsRes, positionsRes] = await Promise.all([
        supabase.from('profiles').select('balance').eq('id', user.id).single(),
        supabase.from('holdings').select('*').eq('user_id', user.id),
        supabase.from('positions').select('*').eq('user_id', user.id)
      ]);

      set({
        cash: profileRes.data?.balance ?? 100000,
        holdings: holdingsRes.data ?? [],
        positions: positionsRes.data ?? []
      });

      get().updateTotalValue();
    } catch (err) {
      console.error('Critical initialization error fetching entire state engine:', err);
    }
  }
}));
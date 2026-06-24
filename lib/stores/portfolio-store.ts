import { create } from 'zustand';
import type { Holding, Position } from '../types';

interface PortfolioState {
  cash: number;
  holdings: Holding[];
  positions: Position[];
  totalValue: number;
  dayPnL: number;
  dayPnLPercent: number;
  totalPnL: number;
  totalPnLPercent: number;

  // Actions
  setCash: (cash: number) => void;
  setHoldings: (holdings: Holding[]) => void;
  setPositions: (positions: Position[]) => void;
  updateTotalValue: () => void;
  updateDayPnL: (pnl: number, percent: number) => void;
  addHolding: (holding: Holding) => void;
  updateHolding: (id: string, updates: Partial<Holding>) => void;
  removeHolding: (id: string) => void;
  addPosition: (position: Position) => void;
  updatePosition: (id: string, updates: Partial<Position>) => void;
  closePosition: (id: string) => void;
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

  setCash: (cash) => set({ cash }),
  setHoldings: (holdings) => set({ holdings }),
  setPositions: (positions) => set({ positions }),

  updateTotalValue: () => {
    const state = get();
    const holdingsValue = state.holdings.reduce(
      (sum, h) => h.quantity * h.currentPrice,
      0
    );
    const positionsValue = state.positions.reduce(
      (sum, p) => p.quantity * p.currentPrice,
      0
    );
    set({
      totalValue: state.cash + holdingsValue + positionsValue,
    });
  },

  updateDayPnL: (pnl, percent) => set({ dayPnL: pnl, dayPnLPercent: percent }),

  addHolding: (holding) =>
    set((state) => ({ holdings: [...state.holdings, holding] })),

  updateHolding: (id, updates) =>
    set((state) => ({
      holdings: state.holdings.map((h) =>
        h.id === id ? { ...h, ...updates } : h
      ),
    })),

  removeHolding: (id) =>
    set((state) => ({
      holdings: state.holdings.filter((h) => h.id !== id),
    })),

  addPosition: (position) =>
    set((state) => ({ positions: [...state.positions, position] })),

  updatePosition: (id, updates) =>
    set((state) => ({
      positions: state.positions.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),

  closePosition: (id) =>
    set((state) => ({
      positions: state.positions.filter((p) => p.id !== id),
    })),
}));

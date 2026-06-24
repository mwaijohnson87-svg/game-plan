import { create } from 'zustand';
import type { Order, TradeHistory } from '../types';

interface OrderState {
  pendingOrders: Order[];
  openOrders: Order[];
  tradeHistory: TradeHistory[];
  isSubmitting: boolean;

  // Actions
  addPendingOrder: (order: Order) => void;
  removePendingOrder: (orderId: string) => void;
  fillOrder: (orderId: string, filledPrice: number) => void;
  cancelOrder: (orderId: string) => void;
  setTradeHistory: (history: TradeHistory[]) => void;
  addTradeRecord: (record: TradeHistory) => void;
  setSubmitting: (submitting: boolean) => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  pendingOrders: [],
  openOrders: [],
  tradeHistory: [],
  isSubmitting: false,

  addPendingOrder: (order) =>
    set((state) => ({
      pendingOrders: [...state.pendingOrders, order],
    })),

  removePendingOrder: (orderId) =>
    set((state) => ({
      pendingOrders: state.pendingOrders.filter((o) => o.id !== orderId),
    })),

  fillOrder: (orderId, filledPrice) =>
    set((state) => {
      const order = state.pendingOrders.find((o) => o.id === orderId);
      if (!order) return state;

      const filledOrder: Order = {
        ...order,
        status: 'filled',
        filledAt: new Date(),
        filledPrice,
      };

      return {
        pendingOrders: state.pendingOrders.filter((o) => o.id !== orderId),
        openOrders: [...state.openOrders, filledOrder],
      };
    }),

  cancelOrder: (orderId) =>
    set((state) => ({
      pendingOrders: state.pendingOrders.filter((o) => o.id !== orderId),
    })),

  setTradeHistory: (history) => set({ tradeHistory: history }),

  addTradeRecord: (record) =>
    set((state) => ({
      tradeHistory: [record, ...state.tradeHistory],
    })),

  setSubmitting: (submitting) => set({ isSubmitting: submitting }),
}));

import { create } from 'zustand';
import type { GameEvent, Country } from '../types';

interface GameState {
  weekNumber: number;
  score: number;
  rank: number;
  activeEvents: GameEvent[];
  completedEvents: string[];
  playerCountry: Country;
  playerName: string;

  // Actions
  setWeekNumber: (week: number) => void;
  setScore: (score: number) => void;
  setRank: (rank: number) => void;
  addActiveEvent: (event: GameEvent) => void;
  removeActiveEvent: (eventId: string) => void;
  completeEvent: (eventId: string) => void;
  setPlayerCountry: (country: Country) => void;
  setPlayerName: (name: string) => void;
  incrementScore: (points: number) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  weekNumber: 1,
  score: 0,
  rank: 100,
  activeEvents: [],
  completedEvents: [],
  playerCountry: 'US',
  playerName: 'Player 1',

  setWeekNumber: (week) => set({ weekNumber: week }),
  setScore: (score) => set({ score }),
  setRank: (rank) => set({ rank }),

  addActiveEvent: (event) =>
    set((state) => ({
      activeEvents: [...state.activeEvents, event],
    })),

  removeActiveEvent: (eventId) =>
    set((state) => ({
      activeEvents: state.activeEvents.filter((e) => e.id !== eventId),
    })),

  completeEvent: (eventId) =>
    set((state) => ({
      activeEvents: state.activeEvents.filter((e) => e.id !== eventId),
      completedEvents: [...state.completedEvents, eventId],
    })),

  setPlayerCountry: (country) => set({ playerCountry: country }),
  setPlayerName: (name) => set({ playerName: name }),

  incrementScore: (points) =>
    set((state) => ({ score: state.score + points })),
}));

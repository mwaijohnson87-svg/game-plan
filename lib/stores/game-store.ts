import { create } from 'zustand';
import { supabase } from '../supabase';

interface GameState {
  score: number;
  isLoaded: boolean;
  fetchGameProgress: () => Promise<void>;
  incrementScore: (points: number) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  score: 0,
  isLoaded: false,

  incrementScore: (points) => {
    set((state) => ({ score: state.score + points }));
  },

  fetchGameProgress: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        set({ isLoaded: true });
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('username, score, week_number')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        set({
          score: data.score ?? 0,
          isLoaded: true
        });
      }
    } catch (err) {
      console.error('Error fetching game progress:', err);
      set({ isLoaded: true });
    }
  },
}));
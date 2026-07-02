'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/lib/stores';

export function GameDataProvider({ children }: { children: React.ReactNode }) {
  const fetchGameProgress = useGameStore((s) => s.fetchGameProgress);

  useEffect(() => {
    fetchGameProgress();
  }, [fetchGameProgress]);

  return <>{children}</>;
}

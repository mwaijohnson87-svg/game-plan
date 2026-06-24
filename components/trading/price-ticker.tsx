'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface PriceTickerProps {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  isPositive?: boolean;
  currency?: string;
}

export function PriceTicker({
  symbol,
  price,
  change,
  changePercent,
  isPositive,
  currency = 'USD',
}: PriceTickerProps) {
  const [flash, setFlash] = useState<'gain' | 'loss' | null>(null);
  const isUp = isPositive ?? change >= 0;

  useEffect(() => {
    setFlash(isUp ? 'gain' : 'loss');
    const timeout = setTimeout(() => setFlash(null), 400);
    return () => clearTimeout(timeout);
  }, [price, isUp]);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className={cn('flex flex-col gap-1', flash === 'gain' && 'flash-gain', flash === 'loss' && 'flash-loss')}>
      <div className="text-text-muted text-xs uppercase tracking-wider">{symbol}</div>
      <div className="font-mono text-data-xl font-medium text-text-primary">
        {formatPrice(price)}
      </div>
      <div
        className={cn(
          'inline-flex items-center gap-1 font-mono text-data-sm font-medium',
          isUp ? 'text-primary' : 'text-danger'
        )}
      >
        <span>{isUp ? '↑' : '↓'}</span>
        <span>
          {isUp ? '+' : ''}
          {change.toFixed(2)}
        </span>
        <span
          className={cn(
            'badge',
            isUp ? 'badge-primary' : 'badge-danger'
          )}
        >
          {isUp ? '+' : ''}
          {changePercent.toFixed(2)}%
        </span>
      </div>
    </div>
  );
}

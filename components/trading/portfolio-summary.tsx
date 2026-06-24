'use client';

import { cn } from '@/lib/utils';
import { usePortfolioStore } from '@/lib/stores';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

export function PortfolioSummary() {
  const totalValue = usePortfolioStore((s) => s.totalValue);
  const dayPnL = usePortfolioStore((s) => s.dayPnL);
  const dayPnLPercent = usePortfolioStore((s) => s.dayPnLPercent);
  const cash = usePortfolioStore((s) => s.cash);

  const isPositive = dayPnL >= 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="flex items-center gap-6">
      <div>
        <div className="text-xs text-text-muted mb-0.5">Portfolio Value</div>
        <div className="font-mono text-data-lg font-medium text-text-primary">
          {formatCurrency(totalValue)}
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {isPositive ? (
          <TrendingUp className="w-4 h-4 text-primary" />
        ) : (
          <TrendingDown className="w-4 h-4 text-danger" />
        )}
        <div>
          <div
            className={cn(
              'font-mono text-data-sm font-medium',
              isPositive ? 'text-primary' : 'text-danger'
            )}
          >
            {isPositive ? '+' : ''}
            {formatCurrency(dayPnL)}
          </div>
          <div className="text-xs text-text-muted">
            {isPositive ? '+' : ''}
            {dayPnLPercent.toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 pl-4 border-l border-border">
        <Wallet className="w-4 h-4 text-text-muted" />
        <div>
          <div className="text-xs text-text-muted">Cash</div>
          <div className="font-mono text-data-sm text-text-secondary">
            {formatCurrency(cash)}
          </div>
        </div>
      </div>
    </div>
  );
}

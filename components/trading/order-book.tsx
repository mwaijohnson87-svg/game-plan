'use client';

import { cn } from '@/lib/utils';
import type { OrderBookEntry } from '@/lib/types';

interface OrderBookProps {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  spread: number;
  spreadPercent: number;
}

export function OrderBook({ bids, asks, spread, spreadPercent }: OrderBookProps) {
  const maxBidTotal = Math.max(...bids.map((b) => b.total));
  const maxAskTotal = Math.max(...asks.map((a) => a.total));

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatQuantity = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  };

  return (
    <div className="panel">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-text-primary">Order Book</h3>
        <div className="text-xs text-text-muted">
          Spread: {formatPrice(spread)} ({spreadPercent.toFixed(2)}%)
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Bids */}
        <div>
          <div className="flex justify-between text-xs text-text-muted mb-2">
            <span>Bid</span>
            <span>Qty</span>
          </div>
          <div className="space-y-1">
            {bids.map((bid, i) => (
              <div
                key={i}
                className="relative flex justify-between py-1 px-2 rounded"
              >
                <div
                  className="absolute inset-0 bg-primary/10"
                  style={{ width: `${(bid.total / maxBidTotal) * 100}%` }}
                />
                <span className="relative font-mono text-data-sm text-primary">
                  {formatPrice(bid.price)}
                </span>
                <span className="relative font-mono text-data-sm text-text-secondary">
                  {formatQuantity(bid.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Asks */}
        <div>
          <div className="flex justify-between text-xs text-text-muted mb-2">
            <span>Ask</span>
            <span>Qty</span>
          </div>
          <div className="space-y-1">
            {asks.map((ask, i) => (
              <div
                key={i}
                className="relative flex justify-between py-1 px-2 rounded"
              >
                <div
                  className="absolute inset-0 right-0 bg-danger/10"
                  style={{ width: `${(ask.total / maxAskTotal) * 100}%`, marginLeft: 'auto' }}
                />
                <span className="relative font-mono text-data-sm text-danger">
                  {formatPrice(ask.price)}
                </span>
                <span className="relative font-mono text-data-sm text-text-secondary">
                  {formatQuantity(ask.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

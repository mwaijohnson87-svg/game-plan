'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { Asset, OrderSide, OrderType } from '@/lib/types';
import { usePortfolioStore } from '@/lib/stores';
import { Loader2 } from 'lucide-react';

interface OrderFormProps {
  asset: Asset;
  onSubmit?: (order: {
    side: OrderSide;
    type: OrderType;
    quantity: number;
    price?: number;
    stopPrice?: number;
  }) => Promise<void>;
}

export function OrderForm({ asset, onSubmit }: OrderFormProps) {
  const [side, setSide] = useState<OrderSide>('buy');
  const [orderType, setOrderType] = useState<OrderType>('market');
  const [quantity, setQuantity] = useState('1');
  const [limitPrice, setLimitPrice] = useState(asset.price.toString());
  const [stopPrice, setStopPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cash = usePortfolioStore((s) => s.cash);
  const holdings = usePortfolioStore((s) => s.holdings);

  const holding = holdings.find((h) => h.assetId === asset.id);
  const availableQuantity = holding?.quantity ?? 0;
  const quantityNum = parseFloat(quantity) || 0;

  const estimatedCost = (() => {
    if (orderType === 'market') {
      return quantityNum * asset.price;
    } else if (orderType === 'limit') {
      return quantityNum * (parseFloat(limitPrice) || 0);
    }
    return quantityNum * asset.price;
  })();

  const canSubmit = (() => {
    if (quantityNum <= 0) return false;
    if (side === 'buy' && estimatedCost > cash) return false;
    if (side === 'sell' && quantityNum > availableQuantity) return false;
    if (orderType === 'limit' && !limitPrice) return false;
    if (orderType === 'stop' && !stopPrice) return false;
    return true;
  })();

  useEffect(() => {
    setLimitPrice(asset.price.toString());
  }, [asset.price]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.({
        side,
        type: orderType,
        quantity: quantityNum,
        price: orderType === 'limit' ? parseFloat(limitPrice) : undefined,
        stopPrice: orderType === 'stop' ? parseFloat(stopPrice) : undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="panel">
      <div className="flex rounded-md overflow-hidden mb-4">
        <button
          onClick={() => setSide('buy')}
          className={cn(
            'flex-1 py-2 text-sm font-medium transition-all duration-fast',
            side === 'buy'
              ? 'bg-primary text-background'
              : 'bg-surface-raised text-text-muted hover:text-text-secondary'
          )}
        >
          BUY
        </button>
        <button
          onClick={() => setSide('sell')}
          className={cn(
            'flex-1 py-2 text-sm font-medium transition-all duration-fast',
            side === 'sell'
              ? 'bg-danger text-white'
              : 'bg-surface-raised text-text-muted hover:text-text-secondary'
          )}
        >
          SELL
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-text-muted mb-1.5">Quantity</label>
          <input
            type="number"
            min="1"
            step="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="input"
            placeholder="Enter quantity"
          />
        </div>

        <div>
          <label className="block text-xs text-text-muted mb-1.5">Order Type</label>
          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value as OrderType)}
            className="input cursor-pointer"
          >
            <option value="market">Market</option>
            <option value="limit">Limit</option>
            <option value="stop">Stop</option>
          </select>
        </div>

        {orderType === 'limit' && (
          <div>
            <label className="block text-xs text-text-muted mb-1.5">Limit Price</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                {asset.currency === 'USD' ? '$' : asset.currency}
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={limitPrice}
                onChange={(e) => setLimitPrice(e.target.value)}
                className="input pl-7"
                placeholder="Limit price"
              />
            </div>
          </div>
        )}

        {orderType === 'stop' && (
          <div>
            <label className="block text-xs text-text-muted mb-1.5">Stop Price</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                {asset.currency === 'USD' ? '$' : asset.currency}
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={stopPrice}
                onChange={(e) => setStopPrice(e.target.value)}
                className="input pl-7"
                placeholder="Stop price"
              />
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-border">
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Total Cost</span>
            <span className="font-mono text-text-primary">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: asset.currency,
                minimumFractionDigits: 2,
              }).format(estimatedCost)}
            </span>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-text-muted">Available Balance</span>
            <span className="font-mono text-text-secondary">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
              }).format(cash)}
            </span>
          </div>
          {side === 'sell' && (
            <div className="flex justify-between text-xs mt-1">
              <span className="text-text-muted">Available to Sell</span>
              <span className="font-mono text-text-secondary">{availableQuantity}</span>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className={cn(
            'w-full py-3 rounded-md font-medium transition-all duration-fast',
            side === 'buy'
              ? 'bg-primary text-background hover:opacity-90'
              : 'bg-danger text-white hover:opacity-90',
            (!canSubmit || isSubmitting) && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </span>
          ) : (
            <span>
              {side === 'buy' ? 'Buy' : 'Sell'} {asset.symbol}
            </span>
          )}
        </button>
      </form>
    </div>
  );
}

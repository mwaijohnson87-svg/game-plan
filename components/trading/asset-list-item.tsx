'use client';

import { cn } from '@/lib/utils';
import type { Asset } from '@/lib/types';
import { COUNTRY_FLAGS } from '@/lib/data/constants';

interface AssetListItemProps {
  asset: Asset;
  isSelected?: boolean;
  onClick?: () => void;
}

export function AssetListItem({ asset, isSelected, onClick }: AssetListItemProps) {
  const isPositive = asset.change >= 0;

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: asset.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-fast hover:bg-surface-raised',
        isSelected && 'bg-surface-raised border-l-2 border-primary'
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-lg">{COUNTRY_FLAGS[asset.country]}</span>
          <span className="font-medium text-sm text-text-primary truncate">
            {asset.name}
          </span>
        </div>
        <div className="text-xs text-text-muted mt-0.5">{asset.symbol}</div>
      </div>
      <div className="text-right">
        <div className="font-mono text-data font-medium text-text-primary">
          {formatPrice(asset.price)}
        </div>
        <div
          className={cn(
            'font-mono text-data-sm',
            isPositive ? 'text-primary' : 'text-danger'
          )}
        >
          {isPositive ? '+' : ''}
          {asset.changePercent.toFixed(2)}%
        </div>
      </div>
    </button>
  );
}

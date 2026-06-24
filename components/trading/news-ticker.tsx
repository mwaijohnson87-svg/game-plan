'use client';

import { cn } from '@/lib/utils';
import type { NewsItem, NewsCategory } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

interface NewsTickerProps {
  news: NewsItem[];
}

const CATEGORY_COLORS: Record<NewsCategory, string> = {
  FOREX: 'bg-primary-dim text-primary',
  STOCKS: 'bg-blue-500/15 text-blue-400',
  MACRO: 'bg-amber-dim text-amber',
  EARNINGS: 'bg-purple-500/15 text-purple-400',
  POLICY: 'bg-slate-500/15 text-slate-400',
};

export function NewsTicker({ news }: NewsTickerProps) {
  const doubledNews = [...news, ...news];

  return (
    <div className="bg-surface border-t border-border py-2 overflow-hidden">
      <div className="marquee-container">
        <div className="animate-marquee hover:[animation-play-state:paused] whitespace-nowrap flex gap-8">
          {doubledNews.map((item, index) => (
            <NewsTickerItem key={`${item.id}-${index}`} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

function NewsTickerItem({ item }: { item: NewsItem }) {
  return (
    <div className="inline-flex items-center gap-3 group cursor-pointer">
      <span
        className={cn(
          'badge text-xs shrink-0',
          CATEGORY_COLORS[item.category]
        )}
      >
        {item.category}
      </span>
      <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors line-clamp-1">
        {item.headline}
      </span>
      <span className="text-xs text-text-muted shrink-0">
        {formatDistanceToNow(item.timestamp, { addSuffix: true })}
      </span>
    </div>
  );
}

export function NewsList({ news }: { news: NewsItem[] }) {
  return (
    <div className="panel">
      <h3 className="text-sm font-medium text-text-primary mb-4">Market News</h3>
      <div className="space-y-3">
        {news.map((item) => (
          <div key={item.id} className="pb-3 border-b border-border last:border-0 last:pb-0">
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  'badge text-xs shrink-0 mt-0.5',
                  CATEGORY_COLORS[item.category]
                )}
              >
                {item.category}
              </span>
              <div className="flex-1">
                <div className="text-sm text-text-primary leading-relaxed">
                  {item.headline}
                </div>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-text-muted">
                  <span>{item.source}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(item.timestamp, { addSuffix: true })}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

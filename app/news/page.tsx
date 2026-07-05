'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import { Topbar } from '@/components/layout';
import { MobileNav } from '@/components/layout/mobile-nav';
import { useMarketNews } from '@/lib/hooks/use-market-data';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Newspaper, Filter, TrendingUp, AlertCircle, Info } from 'lucide-react';
import type { NewsCategory, NewsItem } from '@/lib/types';

const CATEGORIES: { id: NewsCategory | 'ALL'; label: string }[] = [
  { id: 'ALL', label: 'All' },
  { id: 'STOCKS', label: 'Stocks' },
  { id: 'FOREX', label: 'Forex' },
  { id: 'MACRO', label: 'Macro' },
  { id: 'EARNINGS', label: 'Earnings' },
  { id: 'POLICY', label: 'Policy' },
];

function getImpactConfig(impact: 'high' | 'medium' | 'low') {
  switch (impact) {
    case 'high':
      return { icon: AlertCircle, color: 'text-danger', bg: 'bg-danger-dim' };
    case 'medium':
      return { icon: TrendingUp, color: 'text-amber', bg: 'bg-amber-dim' };
    case 'low':
      return { icon: Info, color: 'text-text-muted', bg: 'bg-surface-raised' };
  }
}

function getCategoryBadgeClass(category: NewsCategory) {
  switch (category) {
    case 'STOCKS':
      return 'badge-primary';
    case 'FOREX':
      return 'bg-blue-500/15 text-blue-400';
    case 'MACRO':
      return 'badge-amber';
    case 'EARNINGS':
      return 'bg-purple-500/15 text-purple-400';
    case 'POLICY':
      return 'bg-slate-500/15 text-slate-400';
    default:
      return 'bg-surface-raised text-text-muted';
  }
}

function ImpactButton({ impact, activeImpact, onClick }: {
  impact: 'all' | 'high' | 'medium' | 'low';
  activeImpact: string;
  onClick: () => void;
}) {
  const config = impact !== 'all' ? getImpactConfig(impact as 'high' | 'medium' | 'low') : null;
  const IconComponent = config?.icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
        activeImpact === impact
          ? 'bg-surface-raised border border-border text-text-primary'
          : 'text-text-muted hover:text-text-secondary'
      )}
    >
      {IconComponent && <IconComponent className="w-3 h-3" />}
      <span className="capitalize">{impact}</span>
    </button>
  );
}

function NewsCard({ item }: { item: NewsItem }) {
  const config = getImpactConfig(item.impact);
  const Icon = config.icon;

  return (
    <Card className="bg-surface border-border">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className={cn('w-10 h-10 rounded flex items-center justify-center shrink-0', config.bg)}>
            <Icon className={cn('w-5 h-5', config.color)} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={cn('badge', getCategoryBadgeClass(item.category))}>
                {item.category}
              </span>
              <span className={cn('text-xs px-2 py-0.5 rounded', config.bg, config.color)}>
                {item.impact} impact
              </span>
            </div>
            <h3 className="text-sm font-medium text-text-primary">{item.headline}</h3>
            <p className="text-xs text-text-muted mt-1">{item.summary}</p>
            <div className="flex items-center gap-4 mt-3 text-xs text-text-muted">
              <span>{item.source}</span>
              <span>
                {new Date(item.timestamp).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              {item.relatedAssets && item.relatedAssets.length > 0 && (
                <span>Related: {item.relatedAssets.join(', ').toUpperCase()}</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState<NewsCategory | 'ALL'>('ALL');
  const [activeImpact, setActiveImpact] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const { data } = useMarketNews();
  const allNews: NewsItem[] = data?.news ?? [];

  const filteredNews = allNews.filter((item) => {
    if (activeCategory !== 'ALL' && item.category !== activeCategory) return false;
    if (activeImpact !== 'all' && item.impact !== activeImpact) return false;
    return true;
  });

  const criticalNews = allNews.filter((n) => n.impact === 'high').slice(0, 3);

  return (
    <div className="h-screen flex flex-col bg-background">
      <Topbar />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-6 max-w-5xl">
          <h1 className="text-2xl font-semibold text-text-primary mb-6 flex items-center gap-2">
            <Newspaper className="w-6 h-6" />
            Market News & Events
          </h1>

          {criticalNews.length > 0 && (
            <Card className="bg-surface border-danger mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-danger flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Critical Market Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {criticalNews.map((item) => (
                    <div key={item.id} className="p-3 bg-danger-dim rounded-lg">
                      <div className="flex items-start gap-2">
                        <span className="badge badge-danger shrink-0">{item.category}</span>
                        <div className="flex-1">
                          <div className="text-sm text-text-primary">{item.headline}</div>
                          <div className="text-xs text-text-muted mt-1">{item.source}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-text-muted" />
              <span className="text-sm text-text-muted">Category:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                    activeCategory === cat.id
                      ? 'bg-primary text-background'
                      : 'bg-surface-raised text-text-muted hover:text-text-secondary'
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm text-text-muted">Impact:</span>
            <div className="flex gap-2">
              {(['all', 'high', 'medium', 'low'] as const).map((impact) => (
                <ImpactButton
                  key={impact}
                  impact={impact}
                  activeImpact={activeImpact}
                  onClick={() => setActiveImpact(impact)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredNews.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
      <MobileNav />
    </div>
  );
}

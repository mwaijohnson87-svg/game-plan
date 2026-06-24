'use client';

import { useState, useEffect, useRef } from 'react';
import { Topbar } from '@/components/layout';
import { MobileNav } from '@/components/layout/mobile-nav';
import { useMarketStore } from '@/lib/stores';
import { MARKET_OVERVIEWS, COUNTRY_FLAGS, getAllAssets } from '@/lib/data/mock-data';
import type { Country, MarketSentiment, Asset } from '@/lib/types';
import * as topojson from 'topojson-client';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function MarketsPage() {
  const setSelectedCountry = useMarketStore((s) => s.setSelectedCountry);
  const [selectedMarket, setSelectedMarket] = useState<Country | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    setAssets(getAllAssets());
  }, []);

  const getSentimentColor = (sentiment: MarketSentiment) => {
    switch (sentiment) {
      case 'bullish':
        return '#00D4A0';
      case 'bearish':
        return '#FF4D6A';
      case 'flat':
        return '#F59E0B';
    }
  };

  const formatVolume = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const handleMarketClick = (country: Country) => {
    setSelectedMarket(country);
    setSelectedCountry(country);
  };

  const getMarketAssets = (country: Country) => {
    return assets.filter((a) => a.country === country);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Topbar />

      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <h1 className="text-2xl font-semibold text-text-primary mb-6 flex items-center gap-2">
            <Globe className="w-6 h-6" />
            Global Markets
          </h1>

          {/* World Map Heat Map */}
          <Card className="bg-surface border-border mb-6">
            <CardHeader>
              <CardTitle className="text-lg text-text-primary">Market Sentiment Map</CardTitle>
              <p className="text-xs text-text-muted">Click on any market region to see details</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {MARKET_OVERVIEWS.map((market) => (
                  <button
                    key={market.country}
                    onClick={() => handleMarketClick(market.country)}
                    className={cn(
                      'relative p-4 rounded-lg border transition-all duration-fast text-left',
                      selectedMarket === market.country
                        ? 'border-primary bg-primary-dim'
                        : 'border-border bg-surface-raised hover:border-text-muted'
                    )}
                  >
                    <div className="absolute top-2 right-2">
                      <div
                        className="w-3 h-3 rounded-full animate-pulse"
                        style={{ backgroundColor: getSentimentColor(market.sentiment) }}
                      />
                    </div>
                    <div className="text-2xl mb-2">{market.flag}</div>
                    <div className="text-sm font-medium text-text-primary">{market.country}</div>
                    <div className="text-xs text-text-muted">{market.exchange}</div>
                    <div className="mt-2 flex items-center gap-1">
                      {market.sentiment === 'bullish' && <TrendingUp className="w-3 h-3 text-primary" />}
                      {market.sentiment === 'bearish' && <TrendingDown className="w-3 h-3 text-danger" />}
                      {market.sentiment === 'flat' && <Minus className="w-3 h-3 text-amber" />}
                      <span className="text-xs font-mono" style={{ color: getSentimentColor(market.sentiment) }}>
                        {market.indices[0]?.changePercent >= 0 ? '+' : ''}
                        {market.indices[0]?.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Market Indices */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {MARKET_OVERVIEWS.map((market) => (
              <Card key={market.country} className="bg-surface border-border">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{market.flag}</span>
                      <div>
                        <CardTitle className="text-sm text-text-primary">{market.country}</CardTitle>
                        <p className="text-xs text-text-muted">{market.exchange}</p>
                      </div>
                    </div>
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getSentimentColor(market.sentiment) }}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {market.indices.map((index) => (
                      <div key={index.name} className="flex items-center justify-between">
                        <span className="text-xs text-text-muted">{index.name}</span>
                        <div className="text-right">
                          <div className="font-mono text-data-sm text-text-primary">
                            {formatCurrency(index.value)}
                          </div>
                          <div className={`text-xs ${index.change >= 0 ? 'text-primary' : 'text-danger'}`}>
                            {index.change >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Market Details */}
          {selectedMarket && (
            <Card className="bg-surface border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-text-primary flex items-center gap-2">
                    <span>{COUNTRY_FLAGS[selectedMarket]}</span>
                    {selectedMarket} Market Assets
                  </CardTitle>
                  <button
                    onClick={() => setSelectedMarket(null)}
                    className="text-xs text-text-muted hover:text-text-secondary"
                  >
                    Close
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {getMarketAssets(selectedMarket).map((asset) => (
                    <div
                      key={asset.id}
                      className="p-3 bg-surface-raised rounded-lg border border-border"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-medium text-sm text-text-primary">{asset.symbol}</div>
                          <div className="text-xs text-text-muted">{asset.name}</div>
                        </div>
                        <div className={`flex items-center gap-0.5 ${asset.change >= 0 ? 'text-primary' : 'text-danger'}`}>
                          {asset.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          <span className="text-xs font-mono">{asset.changePercent.toFixed(2)}%</span>
                        </div>
                      </div>
                      <div className="font-mono text-data text-text-primary">
                        {formatCurrency(asset.price)}
                      </div>
                      <div className="text-xs text-text-muted mt-1">
                        Vol: {formatVolume(asset.volume)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <MobileNav />
    </div>
  );
}

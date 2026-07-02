'use client';

import { useState, useEffect, useMemo } from 'react';
import { Topbar } from '@/components/layout';
import { MobileNav } from '@/components/layout/mobile-nav';
import {
  CandlestickChart,
  PriceTicker,
  OrderForm,
  AssetListItem,
  OrderBook,
  NewsTicker,
  CountryMarketTab,
} from '@/components/trading';
import { useMarketStore, usePortfolioStore, useOrderStore } from '@/lib/stores';
import { useMarketQuotes, usePriceHistory, useMarketNews } from '@/lib/hooks/use-market-data';
import { buildOrderBookFromQuote } from '@/lib/utils/order-book';
import type { Asset, TimeFrame, OrderSide, OrderType } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function DashboardPage() {
  const selectedCountry = useMarketStore((s) => s.selectedCountry);
  const setSelectedCountry = useMarketStore((s) => s.setSelectedCountry);
  const selectedAsset = useMarketStore((s) => s.selectedAsset);
  const setSelectedAsset = useMarketStore((s) => s.setSelectedAsset);
  const setSelectedTimeframe = useMarketStore((s) => s.setSelectedTimeframe);
  const timeframe = useMarketStore((s) => s.selectedTimeframe);

  const updateCash = usePortfolioStore((s) => s.setCash);
  const addHolding = usePortfolioStore((s) => s.addHolding);
  const holdings = usePortfolioStore((s) => s.holdings);
  const cash = usePortfolioStore((s) => s.cash);

  const addTradeRecord = useOrderStore((s) => s.addTradeRecord);
  const setSubmitting = useOrderStore((s) => s.setSubmitting);

  const { data: quotesData } = useMarketQuotes();
  const { data: newsData } = useMarketNews();
  const { data: historyData } = usePriceHistory(selectedAsset?.id, timeframe);

  const assets: Asset[] = quotesData?.assets ?? [];
  const news = newsData?.news ?? [];
  const priceHistory = historyData?.points ?? [];

  const orderBook = useMemo(() => {
    if (!selectedAsset) return null;
    const quote = historyData?.quote;
    return buildOrderBookFromQuote(
      selectedAsset.id,
      quote?.price ?? selectedAsset.price,
      quote?.bid,
      quote?.ask
    );
  }, [selectedAsset, historyData?.quote]);

  useEffect(() => {
    if (assets.length > 0 && !selectedAsset) {
      setSelectedAsset(assets[0]);
    }
  }, [assets, selectedAsset, setSelectedAsset]);

  useEffect(() => {
    const countryAssets = assets.filter((a) => a.country === selectedCountry);
    if (countryAssets.length > 0) {
      const stillValid = countryAssets.some((a) => a.id === selectedAsset?.id);
      if (!stillValid) {
        setSelectedAsset(countryAssets[0]);
      }
    }
  }, [selectedCountry, assets, selectedAsset, setSelectedAsset]);

  const liveSelectedAsset = useMemo(() => {
    if (!selectedAsset) return null;
    return assets.find((a) => a.id === selectedAsset.id) ?? selectedAsset;
  }, [assets, selectedAsset]);

  const filteredAssets = useMemo(() => {
    return assets.filter((a) => a.country === selectedCountry);
  }, [assets, selectedCountry]);

  const handleTimeframeChange = (tf: TimeFrame) => {
    setSelectedTimeframe(tf);
  };

  const handleCountryChange = (country: any) => {
    setSelectedCountry(country);
  };

  const handleOrderSubmit = async (order: {
    side: OrderSide;
    type: OrderType;
    quantity: number;
    price?: number;
    stopPrice?: number;
  }) => {
    setSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (!liveSelectedAsset) return;

    const price = order.type === 'market' ? liveSelectedAsset.price : order.price || liveSelectedAsset.price;
    const totalCost = order.quantity * price;

    if (order.side === 'buy') {
      updateCash(cash - totalCost);

      addHolding({
        id: `${liveSelectedAsset.id}-${Date.now()}`,
        assetId: liveSelectedAsset.id,
        asset: liveSelectedAsset,
        quantity: order.quantity,
        averageCost: price,
        currentPrice: liveSelectedAsset.price,
        totalValue: order.quantity * liveSelectedAsset.price,
        pnl: 0,
        pnlPercent: 0,
        openDate: new Date(),
      });
    } else {
      const holding = holdings.find((h) => h.assetId === liveSelectedAsset.id);
      if (holding && holding.quantity >= order.quantity) {
        const proceeds = order.quantity * price;
        updateCash(cash + proceeds);
      }
    }

    addTradeRecord({
      id: `trade-${Date.now()}`,
      orderId: `order-${Date.now()}`,
      assetId: liveSelectedAsset.id,
      asset: liveSelectedAsset,
      side: order.side,
      type: order.type,
      quantity: order.quantity,
      price,
      totalCost,
      executedAt: new Date(),
    });

    setSubmitting(false);
  };

  const openPositions = useMemo(() => {
    return holdings.filter((h) => h.quantity > 0);
  }, [holdings]);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Topbar />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[240px_1fr_280px] gap-0 overflow-hidden">
        <div className="hidden lg:flex flex-col bg-surface border-r border-border">
          <CountryMarketTab
            selectedCountry={selectedCountry}
            onCountryChange={handleCountryChange}
          />
          <ScrollArea className="flex-1">
            <div className="divide-y divide-border">
              {filteredAssets.map((asset) => (
                <AssetListItem
                  key={asset.id}
                  asset={asset}
                  isSelected={liveSelectedAsset?.id === asset.id}
                  onClick={() => setSelectedAsset(asset)}
                />
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="flex flex-col bg-background overflow-hidden">
          <div className="p-4 border-b border-border">
            {liveSelectedAsset && (
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-semibold text-text-primary">
                      {liveSelectedAsset.name}
                    </span>
                    <span className="text-sm text-text-muted">{liveSelectedAsset.symbol}</span>
                    <span className="badge bg-surface-raised text-text-secondary">
                      {liveSelectedAsset.exchange}
                    </span>
                  </div>
                  <PriceTicker
                    symbol={liveSelectedAsset.symbol}
                    price={liveSelectedAsset.price}
                    change={liveSelectedAsset.change}
                    changePercent={liveSelectedAsset.changePercent}
                    currency={liveSelectedAsset.currency}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-hidden">
            <CandlestickChart
              data={priceHistory}
              timeframe={timeframe}
              onTimeframeChange={handleTimeframeChange}
            />
          </div>

          {orderBook && liveSelectedAsset && (
            <div className="p-4 border-t border-border">
              <OrderBook
                bids={orderBook.bids}
                asks={orderBook.asks}
                spread={orderBook.spread}
                spreadPercent={orderBook.spreadPercent}
              />
            </div>
          )}
        </div>

        <div className="flex flex-col bg-surface border-l border-border overflow-hidden">
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {liveSelectedAsset && (
                <OrderForm asset={liveSelectedAsset} onSubmit={handleOrderSubmit} />
              )}

              {openPositions.length > 0 && (
                <div className="panel">
                  <h3 className="text-sm font-medium text-text-primary mb-3">
                    Open Positions
                  </h3>
                  <div className="space-y-2">
                    {openPositions.map((position) => (
                      <div
                        key={position.id}
                        className="flex items-center justify-between py-2 px-3 bg-surface-raised rounded"
                      >
                        <div>
                          <div className="font-mono text-data-sm text-text-primary">
                            {position.asset.symbol}
                          </div>
                          <div className="text-xs text-text-muted">
                            {position.quantity} @ {position.averageCost.toFixed(2)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-data-sm text-text-primary">
                            {(position.quantity * position.currentPrice).toFixed(2)}
                          </div>
                          <div
                            className={`text-xs ${
                              position.pnl >= 0 ? 'text-primary' : 'text-danger'
                            }`}
                          >
                            {position.pnl >= 0 ? '+' : ''}
                            {position.pnl.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      <NewsTicker news={news} />

      <MobileNav />
    </div>
  );
}

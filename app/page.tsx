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
import {
  getAllAssets,
  getAssetsByCountry,
  generateMockPriceHistory,
  generateMockOrderBook,
  MOCK_NEWS,
} from '@/lib/data/mock-data';
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

  const [assets, setAssets] = useState<Asset[]>([]);
  const [priceHistory, setPriceHistory] = useState<any[]>([]);
  const [orderBook, setOrderBook] = useState<any>(null);
  const [news] = useState(MOCK_NEWS);

  useEffect(() => {
    const allAssets = getAllAssets();
    setAssets(allAssets);
    if (allAssets.length > 0 && !selectedAsset) {
      setSelectedAsset(allAssets[0]);
    }
  }, []);

  useEffect(() => {
    const countryAssets = getAssetsByCountry(selectedCountry);
    if (countryAssets.length > 0) {
      setSelectedAsset(countryAssets[0]);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedAsset) {
      const days = timeframe === '1D' ? 1 : timeframe === '1W' ? 7 : timeframe === '1M' ? 30 : timeframe === '3M' ? 90 : 365;
      setPriceHistory(generateMockPriceHistory(days));
      setOrderBook(generateMockOrderBook(selectedAsset.price));
    }
  }, [selectedAsset, timeframe]);

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

    if (!selectedAsset) return;

    const price = order.type === 'market' ? selectedAsset.price : order.price || selectedAsset.price;
    const totalCost = order.quantity * price;

    if (order.side === 'buy') {
      updateCash(cash - totalCost);

      addHolding({
        id: `${selectedAsset.id}-${Date.now()}`,
        assetId: selectedAsset.id,
        asset: selectedAsset,
        quantity: order.quantity,
        averageCost: price,
        currentPrice: selectedAsset.price,
        totalValue: order.quantity * selectedAsset.price,
        pnl: 0,
        pnlPercent: 0,
        openDate: new Date(),
      });
    } else {
      const holding = holdings.find((h) => h.assetId === selectedAsset.id);
      if (holding && holding.quantity >= order.quantity) {
        const proceeds = order.quantity * price;
        updateCash(cash + proceeds);
      }
    }

    addTradeRecord({
      id: `trade-${Date.now()}`,
      orderId: `order-${Date.now()}`,
      assetId: selectedAsset.id,
      asset: selectedAsset,
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
        {/* Left Panel - Asset List */}
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
                  isSelected={selectedAsset?.id === asset.id}
                  onClick={() => setSelectedAsset(asset)}
                />
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Center Panel - Chart and Order Book */}
        <div className="flex flex-col bg-background overflow-hidden">
          <div className="p-4 border-b border-border">
            {selectedAsset && (
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-semibold text-text-primary">
                      {selectedAsset.name}
                    </span>
                    <span className="text-sm text-text-muted">{selectedAsset.symbol}</span>
                    <span className="badge bg-surface-raised text-text-secondary">
                      {selectedAsset.exchange}
                    </span>
                  </div>
                  <PriceTicker
                    symbol={selectedAsset.symbol}
                    price={selectedAsset.price}
                    change={selectedAsset.change}
                    changePercent={selectedAsset.changePercent}
                    currency={selectedAsset.currency}
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

          {orderBook && selectedAsset && (
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

        {/* Right Panel - Order Form and Positions */}
        <div className="flex flex-col bg-surface border-l border-border overflow-hidden">
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {selectedAsset && (
                <OrderForm asset={selectedAsset} onSubmit={handleOrderSubmit} />
              )}

              {/* Open Positions */}
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

      {/* Bottom Bar - News Ticker */}
      <NewsTicker news={news} />

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
}

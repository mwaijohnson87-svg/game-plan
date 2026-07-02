'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/lib/stores/game-store';
import { usePortfolioStore } from '@/lib/stores/portfolio-store';
import { useMarketStore } from '@/lib/stores/market-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Wallet, PiggyBank, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';

const formatCurrency = (value: number, currencyCode: string = 'USD') => {
  if (isNaN(value) || value === null || value === undefined) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode || 'USD',
  }).format(value);
};

export default function PortfolioPage() {
  const fetchGameProgress = useGameStore((state) => state.fetchGameProgress);
  const fetchPortfolio = usePortfolioStore((state) => state.fetchPortfolio);
  
  // Market Store Bindings
  const marketPrices = useMarketStore((state) => state.kenyanPrices) ?? {};
  const fetchMarketPrices = useMarketStore((state) => state.fetchLivePrices);

  const totalValue = usePortfolioStore((state) => state.totalValue) ?? 100000;
  const cash = usePortfolioStore((state) => state.cash) ?? 100000;
  const holdings = usePortfolioStore((state) => state.holdings) ?? [];

  useEffect(() => {
    if (typeof fetchGameProgress === 'function') fetchGameProgress();
    if (typeof fetchPortfolio === 'function') fetchPortfolio();
    if (typeof fetchMarketPrices === 'function') fetchMarketPrices();
  }, [fetchGameProgress, fetchPortfolio, fetchMarketPrices]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Portfolio Engine</h2>
          <button 
            onClick={() => fetchMarketPrices()}
            className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-accent"
          >
            <RefreshCw className="h-4 w-4" /> Refresh Prices
          </button>
        </div>
        
        {/* Live Kenyan Ticker Grid Banner */}
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-3">
          {Object.entries(marketPrices).map(([ticker, details]) => (
            <Card key={ticker} className="border-l-4 border-l-primary">
              <CardHeader className="pb-1 pt-3">
                <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider flex justify-between">
                  {ticker} <span>{details.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="text-xl font-mono font-bold">
                  {details.price.toFixed(2)} <span className="text-xs font-sans text-muted-foreground">{details.currency}</span>
                </div>
                <div className={`text-xs font-semibold flex items-center gap-1 ${details.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {details.change >= 0 ? '+' : ''}{details.changePercent.toFixed(2)}%
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Asset Value</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Liquid Cash Balance</CardTitle>
              <PiggyBank className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(cash)}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Open Positions & Holdings</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset</TableHead>
                  <TableHead className="text-right">Market Price</TableHead>
                  <TableHead className="text-right">Total Value</TableHead>
                  <TableHead className="text-right">Net Return</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {holdings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      No active holdings found. Execute a market order to see assets.
                    </TableCell>
                  </TableRow>
                ) : (
                  holdings.map((holding) => {
                    const currentPrice = holding?.currentPrice ?? 0;
                    const quantity = holding?.quantity ?? 0;
                    const pnl = holding?.pnl ?? 0;
                    const assetName = holding?.asset?.name || 'Asset Position';
                    const assetCurrency = holding?.asset?.currency || 'USD';

                    return (
                      <TableRow key={holding.id || Math.random().toString()}>
                        <TableCell className="font-medium">{assetName}</TableCell>
                        <TableCell className="text-right">{formatCurrency(currentPrice, assetCurrency)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(quantity * currentPrice, assetCurrency)}</TableCell>
                        <TableCell className="text-right">
                          <div className={`flex items-center justify-end gap-1 ${pnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {pnl >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                            <span className="font-mono text-xs">{formatCurrency(pnl, assetCurrency)}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
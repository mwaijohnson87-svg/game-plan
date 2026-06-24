'use client';

import { useMemo } from 'react';
import { Topbar } from '@/components/layout';
import { MobileNav } from '@/components/layout/mobile-nav';
import { usePortfolioStore } from '@/lib/stores';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, TrendingDown, Wallet, PiggyBank, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function PortfolioPage() {
  const totalValue = usePortfolioStore((s) => s.totalValue);
  const dayPnL = usePortfolioStore((s) => s.dayPnL);
  const dayPnLPercent = usePortfolioStore((s) => s.dayPnLPercent);
  const cash = usePortfolioStore((s) => s.cash);
  const holdings = usePortfolioStore((s) => s.holdings);

  const investedValue = useMemo(() => {
    return holdings.reduce((sum, h) => h.quantity * h.currentPrice, 0);
  }, [holdings]);

  const totalPnL = useMemo(() => {
    return holdings.reduce((sum, h) => h.pnl, 0);
  }, [holdings]);

  const isPositive = dayPnL >= 0;
  const totalPnLPositive = totalPnL >= 0;

  const formatCurrency = (value: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Topbar />

      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <h1 className="text-2xl font-semibold text-text-primary mb-6">Portfolio</h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-surface border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-text-muted font-normal">Total Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-mono text-data-lg font-medium text-text-primary">
                  {formatCurrency(totalValue)}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-surface border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-text-muted font-normal flex items-center gap-1">
                  {isPositive ? <TrendingUp className="w-3 h-3 text-primary" /> : <TrendingDown className="w-3 h-3 text-danger" />}
                  Day P&L
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`font-mono text-data-lg font-medium ${isPositive ? 'text-primary' : 'text-danger'}`}>
                  {isPositive ? '+' : ''}{formatCurrency(dayPnL)}
                </div>
                <div className={`text-xs ${isPositive ? 'text-primary' : 'text-danger'}`}>
                  {isPositive ? '+' : ''}{dayPnLPercent.toFixed(2)}%
                </div>
              </CardContent>
            </Card>

            <Card className="bg-surface border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-text-muted font-normal flex items-center gap-1">
                  <Wallet className="w-3 h-3" />
                  Cash Available
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-mono text-data-lg font-medium text-text-primary">
                  {formatCurrency(cash)}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-surface border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-text-muted font-normal flex items-center gap-1">
                  <BarChart3 className="w-3 h-3" />
                  Total P&L
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`font-mono text-data-lg font-medium ${totalPnLPositive ? 'text-primary' : 'text-danger'}`}>
                  {totalPnLPositive ? '+' : ''}{formatCurrency(totalPnL)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Holdings Table */}
          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="text-lg text-text-primary">Holdings</CardTitle>
            </CardHeader>
            <CardContent>
              {holdings.length === 0 ? (
                <div className="text-center py-12">
                  <PiggyBank className="w-12 h-12 mx-auto text-text-muted mb-4" />
                  <p className="text-text-muted">No holdings yet. Start trading to build your portfolio!</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-surface-raised">
                      <TableHead className="text-text-muted">Asset</TableHead>
                      <TableHead className="text-text-muted text-right">Quantity</TableHead>
                      <TableHead className="text-text-muted text-right">Avg Cost</TableHead>
                      <TableHead className="text-text-muted text-right">Current</TableHead>
                      <TableHead className="text-text-muted text-right">Value</TableHead>
                      <TableHead className="text-text-muted text-right">P&L</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {holdings.map((holding) => (
                      <TableRow key={holding.id} className="border-border hover:bg-surface-raised">
                        <TableCell>
                          <div>
                            <div className="font-medium text-text-primary">{holding.asset.symbol}</div>
                            <div className="text-xs text-text-muted">{holding.asset.name}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono text-data-sm text-text-primary">
                          {holding.quantity}
                        </TableCell>
                        <TableCell className="text-right font-mono text-data-sm text-text-secondary">
                          {formatCurrency(holding.averageCost, holding.asset.currency)}
                        </TableCell>
                        <TableCell className="text-right font-mono text-data-sm text-text-primary">
                          {formatCurrency(holding.currentPrice, holding.asset.currency)}
                        </TableCell>
                        <TableCell className="text-right font-mono text-data-sm text-text-primary">
                          {formatCurrency(holding.quantity * holding.currentPrice, holding.asset.currency)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className={`flex items-center justify-end gap-1 ${holding.pnl >= 0 ? 'text-primary' : 'text-danger'}`}>
                            {holding.pnl >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            <span className="font-mono text-data-sm">
                              {holding.pnl >= 0 ? '+' : ''}{formatCurrency(holding.pnl)}
                            </span>
                          </div>
                          <div className={`text-xs ${holding.pnl >= 0 ? 'text-primary' : 'text-danger'}`}>
                            {holding.pnlPercent >= 0 ? '+' : ''}{holding.pnlPercent.toFixed(2)}%
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <MobileNav />
    </div>
  );
}

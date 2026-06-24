'use client';

import { useState } from 'react';
import { Topbar } from '@/components/layout';
import { MobileNav } from '@/components/layout/mobile-nav';
import { usePortfolioStore } from '@/lib/stores';
import { TBILLS, COUNTRY_FLAGS } from '@/lib/data/mock-data';
import type { TBill, Country } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Shield, Lock, ChevronDown, ChevronUp } from 'lucide-react';

export default function TreasuryPage() {
  const cash = usePortfolioStore((s) => s.cash);
  const updateCash = usePortfolioStore((s) => s.setCash);

  const [selectedCountry, setSelectedCountry] = useState<Country>('US');
  const [expandedTBill, setExpandedTBill] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1000);

  const filteredTBills = TBILLS.filter((t) => t.country === selectedCountry);

  const formatCurrency = (value: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const handlePurchase = (tbill: TBill) => {
    const cost = (quantity / tbill.parValue) * tbill.price;
    if (cost > cash) {
      alert('Insufficient funds');
      return;
    }

    updateCash(cash - cost);
    alert(`Purchased ${quantity} nominal value of ${tbill.maturity} T-Bill at ${tbill.yield.toFixed(2)}% yield`);
  };

  const countries: Country[] = ['US', 'KE'];

  return (
    <div className="h-screen flex flex-col bg-background">
      <Topbar />

      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-6 max-w-5xl">
          <h1 className="text-2xl font-semibold text-text-primary mb-6 flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Treasury Bills & Bonds
          </h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-surface border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-text-muted font-normal">Available Cash</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-mono text-data-lg font-medium text-text-primary">
                  {formatCurrency(cash)}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-surface border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-text-muted font-normal">Current Yield Range</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-mono text-data-lg font-medium text-primary">
                  {Math.min(...filteredTBills.map(t => t.yield)).toFixed(2)}% - {Math.max(...filteredTBills.map(t => t.yield)).toFixed(2)}%
                </div>
              </CardContent>
            </Card>

            <Card className="bg-surface border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-text-muted font-normal">Risk Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  <span className="text-sm text-primary font-medium">Ultra Low Risk</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Country Selector */}
          <div className="flex gap-2 mb-6">
            {countries.map((country) => (
              <button
                key={country}
                onClick={() => setSelectedCountry(country)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all',
                  selectedCountry === country
                    ? 'bg-primary text-background'
                    : 'bg-surface-raised text-text-muted hover:text-text-secondary'
                )}
              >
                <span>{COUNTRY_FLAGS[country]}</span>
                <span>{country}</span>
              </button>
            ))}
          </div>

          {/* Yield Curve */}
          <Card className="bg-surface border-border mb-6">
            <CardHeader>
              <CardTitle className="text-lg text-text-primary flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Yield Curve - {selectedCountry === 'US' ? 'United States' : 'Kenya'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 flex items-end justify-between gap-4">
                {filteredTBills.map((tbill) => (
                  <div key={tbill.id} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-primary/20 rounded-t relative"
                      style={{ height: `${(tbill.yield / 20) * 150}px` }}
                    >
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-primary rounded-t"
                        style={{ height: `${(tbill.yield / 20) * 150 * 0.6}px` }}
                      />
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-data-sm text-primary">
                        {tbill.yield.toFixed(2)}%
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-text-muted text-center">
                      {tbill.maturity}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* T-Bills List */}
          <div className="space-y-3">
            {filteredTBills.map((tbill) => (
              <Card key={tbill.id} className="bg-surface border-border">
                <CardContent className="p-4">
                  <button
                    onClick={() => setExpandedTBill(expandedTBill === tbill.id ? null : tbill.id)}
                    className="w-full flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-surface-raised rounded flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-primary" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-text-primary">{tbill.maturity} T-Bill</div>
                        <div className="text-xs text-text-muted">{COUNTRY_FLAGS[tbill.country]} {tbill.country}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="font-mono text-data-lg font-medium text-primary">
                          {tbill.yield.toFixed(2)}%
                        </div>
                        <div className="text-xs text-text-muted">Yield</div>
                      </div>
                      {expandedTBill === tbill.id ? (
                        <ChevronUp className="w-5 h-5 text-text-muted" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-text-muted" />
                      )}
                    </div>
                  </button>

                  {expandedTBill === tbill.id && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <div className="text-xs text-text-muted">Price</div>
                          <div className="font-mono text-data-sm text-text-primary">
                            {formatCurrency(tbill.price, tbill.currency)}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-text-muted">Par Value</div>
                          <div className="font-mono text-data-sm text-text-primary">
                            {formatCurrency(tbill.parValue, tbill.currency)}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-text-muted">Annual Return</div>
                          <div className="font-mono text-data-sm text-primary">
                            {((tbill.parValue - tbill.price) / tbill.price * 100).toFixed(2)}%
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-text-muted">Currency</div>
                          <div className="font-mono text-data-sm text-text-primary">
                            {tbill.currency}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-end gap-4">
                        <div className="flex-1">
                          <label className="text-xs text-text-muted block mb-1">Nominal Amount</label>
                          <input
                            type="number"
                            min="100"
                            step="100"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 100)}
                            className="input"
                          />
                        </div>
                        <button
                          onClick={() => handlePurchase(tbill)}
                          className="btn btn-primary"
                        >
                          Purchase
                        </button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <MobileNav />
    </div>
  );
}

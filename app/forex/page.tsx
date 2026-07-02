'use client';

import { useEffect, useState } from 'react';
import { Topbar } from '@/components/layout';
import { MobileNav } from '@/components/layout/mobile-nav';
import { FOREX_CURRENCIES } from '@/lib/data/constants';
import { useForexPairs } from '@/lib/hooks/use-market-data';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins, ArrowUpRight, ArrowDownRight, ArrowRightLeft, RefreshCcw } from 'lucide-react';
import type { ForexCurrency, ForexPair } from '@/lib/types';

export default function ForexPage() {
  const { data } = useForexPairs();
  const forexPairs: ForexPair[] = data?.pairs ?? [];

  const [selectedPair, setSelectedPair] = useState<ForexPair | null>(null);
  const [fromCurrency, setFromCurrency] = useState<ForexCurrency>(FOREX_CURRENCIES[0]);
  const [toCurrency, setToCurrency] = useState<ForexCurrency>(FOREX_CURRENCIES[1]);
  const [fromAmount, setFromAmount] = useState<number>(1000);
  const [toAmount, setToAmount] = useState<number>(0);

  useEffect(() => {
    if (forexPairs.length > 0 && !selectedPair) {
      setSelectedPair(forexPairs[0]);
    }
  }, [forexPairs, selectedPair]);

  const getRate = (from: string, to: string): number => {
    const pair = forexPairs.find(
      (p) =>
        (p.baseCurrency === from && p.quoteCurrency === to) ||
        (p.baseCurrency === to && p.quoteCurrency === from)
    );

    if (!pair) return 1;

    if (pair.baseCurrency === from && pair.quoteCurrency === to) {
      return pair.rate;
    }
    return 1 / pair.rate;
  };

  const convertCurrency = () => {
    const rate = getRate(fromCurrency.code, toCurrency.code);
    setToAmount(fromAmount * rate);
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    setFromAmount(toAmount || fromAmount);
    setToAmount(0);
  };

  const formatRate = (value: number) => {
    if (value > 100) return value.toFixed(2);
    if (value > 1) return value.toFixed(4);
    return value.toFixed(6);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Topbar />

      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <h1 className="text-2xl font-semibold text-text-primary mb-6 flex items-center gap-2">
            <Coins className="w-6 h-6" />
            Foreign Exchange
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-surface border-border">
              <CardHeader>
                <CardTitle className="text-lg text-text-primary flex items-center gap-2">
                  <ArrowRightLeft className="w-5 h-5" />
                  Currency Converter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-text-muted block mb-2">From</label>
                    <div className="flex gap-2">
                      <select
                        value={fromCurrency.code}
                        onChange={(e) =>
                          setFromCurrency(
                            FOREX_CURRENCIES.find((c) => c.code === e.target.value) ||
                              FOREX_CURRENCIES[0]
                          )
                        }
                        className="input flex-1"
                      >
                        {FOREX_CURRENCIES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {c.code} - {c.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={fromAmount}
                        onChange={(e) => setFromAmount(parseFloat(e.target.value) || 0)}
                        className="input w-32"
                      />
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={swapCurrencies}
                      className="p-2 rounded-full bg-surface-raised hover:bg-border transition-colors"
                    >
                      <RefreshCcw className="w-5 h-5 text-text-muted" />
                    </button>
                  </div>

                  <div>
                    <label className="text-xs text-text-muted block mb-2">To</label>
                    <div className="flex gap-2">
                      <select
                        value={toCurrency.code}
                        onChange={(e) =>
                          setToCurrency(
                            FOREX_CURRENCIES.find((c) => c.code === e.target.value) ||
                              FOREX_CURRENCIES[1]
                          )
                        }
                        className="input flex-1"
                      >
                        {FOREX_CURRENCIES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {c.code} - {c.name}
                          </option>
                        ))}
                      </select>
                      <div className="input w-32 bg-surface-raised flex items-center">
                        <span className="font-mono text-data-sm text-text-primary">
                          {toAmount > 0 ? toAmount.toFixed(2) : '—'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button onClick={convertCurrency} className="btn btn-primary w-full">
                      Convert
                    </button>
                  </div>

                  <div className="text-center text-xs text-text-muted">
                    1 {fromCurrency.code} ={' '}
                    {formatRate(getRate(fromCurrency.code, toCurrency.code))} {toCurrency.code}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-surface border-border">
              <CardHeader>
                <CardTitle className="text-lg text-text-primary">Live Forex Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {forexPairs.map((pair) => (
                    <button
                      key={pair.id}
                      onClick={() => setSelectedPair(pair)}
                      className={cn(
                        'w-full p-3 rounded-lg border transition-all text-left',
                        selectedPair?.id === pair.id
                          ? 'border-primary bg-primary-dim'
                          : 'border-border bg-surface-raised hover:border-text-muted'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-mono text-data font-medium text-text-primary">
                            {pair.symbol}
                          </div>
                          <div className="text-xs text-text-muted mt-0.5">
                            Bid: {formatRate(pair.bid)} | Ask: {formatRate(pair.ask)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-data-lg font-medium text-text-primary">
                            {formatRate(pair.rate)}
                          </div>
                          <div
                            className={cn(
                              'flex items-center gap-1 justify-end text-xs',
                              pair.change >= 0 ? 'text-primary' : 'text-danger'
                            )}
                          >
                            {pair.change >= 0 ? (
                              <ArrowUpRight className="w-3 h-3" />
                            ) : (
                              <ArrowDownRight className="w-3 h-3" />
                            )}
                            <span className="font-mono">
                              {pair.change >= 0 ? '+' : ''}
                              {pair.changePercent.toFixed(2)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <MobileNav />
    </div>
  );
}

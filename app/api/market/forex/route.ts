import { NextResponse } from 'next/server';
import { FOREX_CATALOG } from '@/lib/data/asset-catalog';
import { fetchQuote } from '@/lib/services/yahoo-finance';

export async function GET() {
  try {
    const pairs = await Promise.all(
      FOREX_CATALOG.map(async (pair) => {
        const quote = await fetchQuote(pair.yahooSymbol);
        const rate = quote?.price ?? 1;
        const change = quote?.change ?? 0;
        const changePercent = quote?.changePercent ?? 0;
        const spread = rate * 0.0001;
        const bid = quote?.bid ?? rate - spread / 2;
        const ask = quote?.ask ?? rate + spread / 2;

        return {
          id: pair.id,
          baseCurrency: pair.baseCurrency,
          quoteCurrency: pair.quoteCurrency,
          symbol: pair.symbol,
          rate,
          change,
          changePercent,
          bid,
          ask,
          spread: ask - bid,
        };
      })
    );

    return NextResponse.json({ pairs });
  } catch (error) {
    console.error('Failed to fetch forex data:', error);
    return NextResponse.json({ error: 'Failed to fetch forex data' }, { status: 500 });
  }
}

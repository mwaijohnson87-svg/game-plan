import { NextResponse } from 'next/server';
import { TBILL_YIELD_SYMBOLS } from '@/lib/data/asset-catalog';
import { fetchQuote } from '@/lib/services/yahoo-finance';

export async function GET() {
  try {
    const usBills = await Promise.all(
      TBILL_YIELD_SYMBOLS.map(async (bill) => {
        const quote = await fetchQuote(bill.yahooSymbol);
        const yieldValue = quote?.price ?? 5;
        const price = 100 - yieldValue * 0.5;

        return {
          id: bill.id,
          country: bill.country,
          maturity: bill.maturity,
          yield: yieldValue,
          price,
          parValue: bill.parValue,
          currency: bill.currency,
        };
      })
    );

    const keBills = [
      { id: 'ke-91d', country: 'KE', maturity: '91 Days', yield: 16.52, price: 95.89, parValue: 100, currency: 'KES' },
      { id: 'ke-182d', country: 'KE', maturity: '182 Days', yield: 17.12, price: 91.56, parValue: 100, currency: 'KES' },
      { id: 'ke-364d', country: 'KE', maturity: '364 Days', yield: 17.85, price: 84.82, parValue: 100, currency: 'KES' },
    ];

    return NextResponse.json({ tbills: [...usBills, ...keBills] });
  } catch (error) {
    console.error('Failed to fetch treasury data:', error);
    return NextResponse.json({ error: 'Failed to fetch treasury data' }, { status: 500 });
  }
}

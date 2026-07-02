import { NextResponse } from 'next/server';
import type { Country, MarketOverview, MarketSentiment } from '@/lib/types';
import { COUNTRY_FLAGS } from '@/lib/data/constants';
import { ASSET_CATALOG, INDEX_CATALOG } from '@/lib/data/asset-catalog';
import { definitionToAsset } from '@/lib/data/asset-catalog';
import { fetchQuotes } from '@/lib/services/yahoo-finance';

const MARKET_META: Record<
  Country,
  { exchange: string; name: string; volume: number; volumeChange: number }
> = {
  US: { exchange: 'NYSE/NASDAQ', name: 'US Markets', volume: 45.8e9, volumeChange: 12.5 },
  KE: { exchange: 'NSE', name: 'Nairobi Securities Exchange', volume: 1.2e9, volumeChange: 8.3 },
  NG: { exchange: 'NGX', name: 'Nigerian Exchange', volume: 8.5e9, volumeChange: -5.2 },
  UK: { exchange: 'LSE', name: 'London Stock Exchange', volume: 12.4e9, volumeChange: 2.1 },
  EU: { exchange: 'Euronext', name: 'Euronext', volume: 28.9e9, volumeChange: 15.8 },
};

function sentimentFromChange(changePercent: number): MarketSentiment {
  if (changePercent > 0.3) return 'bullish';
  if (changePercent < -0.3) return 'bearish';
  return 'flat';
}

export async function GET() {
  try {
    const assetSymbols = ASSET_CATALOG.map((a) => a.yahooSymbol);
    const indexSymbols = INDEX_CATALOG.map((i) => i.yahooSymbol);
    const quotes = await fetchQuotes([...assetSymbols, ...indexSymbols]);

    const assetsByCountry = (country: Country) => {
      const countryDefs = ASSET_CATALOG.filter((a) => a.country === country);
      return countryDefs
        .map((def) => {
          const quote = quotes[def.yahooSymbol];
          if (!quote) {
            return definitionToAsset(def, def.fallbackPrice, 0, 0, def.fallbackVolume ?? 0);
          }
          return definitionToAsset(
            def,
            quote.price,
            quote.change,
            quote.changePercent,
            quote.volume ?? def.fallbackVolume ?? 0
          );
        })
        .sort((a, b) => b.changePercent - a.changePercent);
    };

    const countries = Object.keys(MARKET_META) as Country[];
    const overviews: MarketOverview[] = countries.map((country) => {
      const countryAssets = assetsByCountry(country);
      const topGainers = countryAssets.filter((a) => a.changePercent > 0).slice(0, 3);
      const topLosers = [...countryAssets]
        .filter((a) => a.changePercent < 0)
        .sort((a, b) => a.changePercent - b.changePercent)
        .slice(0, 3);

      const indices = INDEX_CATALOG
        .filter((index) => index.country === country)
        .map((index) => {
          const quote = quotes[index.yahooSymbol];
          if (!quote) {
            return { name: index.name, value: 0, change: 0, changePercent: 0 };
          }
          return {
            name: index.name,
            value: quote.price,
            change: quote.change,
            changePercent: quote.changePercent,
          };
        });

      const avgChange =
        countryAssets.length > 0
          ? countryAssets.reduce((sum, asset) => sum + asset.changePercent, 0) / countryAssets.length
          : 0;

      return {
        country,
        exchange: MARKET_META[country].exchange,
        name: MARKET_META[country].name,
        flag: COUNTRY_FLAGS[country],
        sentiment: sentimentFromChange(avgChange),
        volume: MARKET_META[country].volume,
        volumeChange: MARKET_META[country].volumeChange,
        topGainers,
        topLosers,
        indices,
      };
    });

    return NextResponse.json({ overviews });
  } catch (error) {
    console.error('Failed to fetch market overviews:', error);
    return NextResponse.json({ error: 'Failed to fetch market overviews' }, { status: 500 });
  }
}

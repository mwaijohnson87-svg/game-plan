import { NextResponse } from 'next/server';
import type { NewsCategory, Country } from '@/lib/types';
import { ASSET_CATALOG } from '@/lib/data/asset-catalog';
import { fetchMarketNews, fetchTrendingNews } from '@/lib/services/yahoo-finance';

function inferCategory(title: string, summary?: string): NewsCategory {
  const text = `${title} ${summary ?? ''}`.toLowerCase();
  if (text.includes('forex') || text.includes('currency') || text.includes('dollar')) return 'FOREX';
  if (text.includes('earnings') || text.includes('revenue') || text.includes('profit')) return 'EARNINGS';
  if (text.includes('fed') || text.includes('ecb') || text.includes('rate') || text.includes('inflation')) return 'POLICY';
  if (text.includes('gdp') || text.includes('economy') || text.includes('macro')) return 'MACRO';
  return 'STOCKS';
}

function inferImpact(title: string): 'high' | 'medium' | 'low' {
  const text = title.toLowerCase();
  if (text.includes('crash') || text.includes('surge') || text.includes('record') || text.includes('fed')) {
    return 'high';
  }
  if (text.includes('rise') || text.includes('fall') || text.includes('gain') || text.includes('drop')) {
    return 'medium';
  }
  return 'low';
}

function mapTickerToAssetId(ticker: string): string | undefined {
  const normalized = ticker.toUpperCase();
  const match = ASSET_CATALOG.find(
    (asset) =>
      asset.yahooSymbol.toUpperCase() === normalized ||
      asset.symbol.toUpperCase() === normalized
  );
  return match?.id;
}

function inferCountries(tickers: string[]): Country[] {
  const countries = new Set<Country>();
  tickers.forEach((ticker) => {
    const assetId = mapTickerToAssetId(ticker);
    if (!assetId) return;
    const asset = ASSET_CATALOG.find((a) => a.id === assetId);
    if (asset) countries.add(asset.country);
  });
  return Array.from(countries);
}

export async function GET() {
  try {
    const symbols = ASSET_CATALOG.map((a) => a.yahooSymbol);
    const newsItems = await fetchMarketNews(symbols);
    const trending = newsItems.length > 0 ? newsItems : await fetchTrendingNews();

    const news = trending.map((item, index) => {
      const relatedTickers = item.relatedTickers ?? [];
      const relatedAssets = relatedTickers
        .map(mapTickerToAssetId)
        .filter((id): id is string => Boolean(id));

      return {
        id: item.uuid ?? `news-${index}`,
        category: inferCategory(item.title, item.summary),
        headline: item.title,
        summary: item.summary ?? item.title,
        source: item.publisher ?? 'Yahoo Finance',
        timestamp: new Date((item.providerPublishTime ?? Date.now() / 1000) * 1000),
        impact: inferImpact(item.title),
        relatedAssets,
        relatedCountries: inferCountries(relatedTickers),
      };
    });

    return NextResponse.json({ news });
  } catch (error) {
    console.error('Failed to fetch market news:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}

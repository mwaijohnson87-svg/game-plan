import { NextRequest, NextResponse } from 'next/server';
import type { TimeFrame } from '@/lib/types';
import { ASSET_CATALOG } from '@/lib/data/asset-catalog';
import { fetchChart } from '@/lib/services/yahoo-finance';

const VALID_TIMEFRAMES: TimeFrame[] = ['1D', '1W', '1M', '3M', '1Y'];

export async function GET(request: NextRequest) {
  const assetId = request.nextUrl.searchParams.get('assetId');
  const timeframe = (request.nextUrl.searchParams.get('timeframe') ?? '1M') as TimeFrame;

  if (!assetId) {
    return NextResponse.json({ error: 'assetId is required' }, { status: 400 });
  }

  if (!VALID_TIMEFRAMES.includes(timeframe)) {
    return NextResponse.json({ error: 'Invalid timeframe' }, { status: 400 });
  }

  const definition = ASSET_CATALOG.find((a) => a.id === assetId);
  if (!definition) {
    return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
  }

  try {
    const { quote, points } = await fetchChart(definition.yahooSymbol, timeframe);
    return NextResponse.json({
      assetId,
      timeframe,
      points,
      quote,
    });
  } catch (error) {
    console.error(`Failed to fetch chart for ${assetId}:`, error);
    return NextResponse.json({ error: 'Failed to fetch chart data' }, { status: 500 });
  }
}

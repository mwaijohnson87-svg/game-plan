import type { OrderBook } from '@/lib/types';

export function buildOrderBookFromQuote(
  assetId: string,
  price: number,
  bid?: number,
  ask?: number
): OrderBook {
  const midPrice = price;
  const spread = ask && bid ? ask - bid : midPrice * 0.001;
  const bidPrice = bid ?? midPrice - spread / 2;
  const askPrice = ask ?? midPrice + spread / 2;
  const levelSpread = spread / 10;

  const bids = [];
  const asks = [];

  for (let i = 0; i < 10; i++) {
    const bidLevel = bidPrice - levelSpread * i;
    const askLevel = askPrice + levelSpread * i;
    const bidQty = Math.floor(100 + (10 - i) * 80);
    const askQty = Math.floor(100 + (10 - i) * 80);

    bids.push({
      price: parseFloat(bidLevel.toFixed(4)),
      quantity: bidQty,
      total: bidQty * bidLevel,
    });

    asks.push({
      price: parseFloat(askLevel.toFixed(4)),
      quantity: askQty,
      total: askQty * askLevel,
    });
  }

  return {
    assetId,
    bids: bids.reverse(),
    asks,
    spread: parseFloat(spread.toFixed(4)),
    spreadPercent: midPrice !== 0 ? parseFloat(((spread / midPrice) * 100).toFixed(2)) : 0,
    lastUpdated: new Date(),
  };
}

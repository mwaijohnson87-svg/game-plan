import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { Country } from '@/lib/types';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, country, portfolio_value, score, week_number, weekly_pnl, weekly_pnl_percent, return_rate, win_rate, total_trades')
      .order('portfolio_value', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Leaderboard fetch error:', error.message);
      return NextResponse.json({ entries: [] });
    }

    const entries = (data ?? []).map((row, index) => ({
      rank: index + 1,
      playerId: row.id,
      playerName: row.username ?? 'Player',
      country: (row.country as Country) ?? 'US',
      portfolioValue: Number(row.portfolio_value ?? row.score ?? 0),
      weeklyPnL: Number(row.weekly_pnl ?? 0),
      weeklyPnLPercent: Number(row.weekly_pnl_percent ?? 0),
      returnRate: Number(row.return_rate ?? 0),
      winRate: Number(row.win_rate ?? 0),
      totalTrades: Number(row.total_trades ?? 0),
    }));

    return NextResponse.json({ entries });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json({ entries: [] });
  }
}

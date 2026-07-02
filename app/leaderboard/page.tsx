'use client';

import { useMemo, useState } from 'react';
import { Topbar } from '@/components/layout';
import { MobileNav } from '@/components/layout/mobile-nav';
import { useGameStore, usePortfolioStore } from '@/lib/stores';
import { COUNTRY_FLAGS } from '@/lib/data/constants';
import { useLeaderboard, type LeaderboardEntry } from '@/lib/hooks/use-market-data';
import { getDevUserId } from '@/lib/supabase';
import type { Country } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Trophy, Medal, Crown, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';

export default function LeaderboardPage() {
  const playerName = useGameStore((s) => s.playerName);
  const playerCountry = useGameStore((s) => s.playerCountry);
  const totalValue = usePortfolioStore((s) => s.totalValue);
  const { data } = useLeaderboard();

  const [activeTab, setActiveTab] = useState<'weekly' | 'all-time'>('weekly');

  const leaderboard: LeaderboardEntry[] = data?.entries ?? [];
  const devUserId = getDevUserId();

  const userEntry = useMemo((): LeaderboardEntry => {
    const existing = leaderboard.find((entry) => entry.playerId === devUserId);
    if (existing) return existing;

    return {
      rank: leaderboard.length + 1,
      playerId: devUserId ?? 'current-user',
      playerName,
      country: playerCountry as Country,
      portfolioValue: totalValue,
      weeklyPnL: 0,
      weeklyPnLPercent: 0,
      returnRate: 0,
      winRate: 0,
      totalTrades: 0,
    };
  }, [leaderboard, devUserId, playerName, playerCountry, totalValue]);

  const displayedEntries =
    activeTab === 'weekly'
      ? [...leaderboard].sort((a, b) => b.weeklyPnLPercent - a.weeklyPnLPercent)
      : leaderboard;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Medal className="w-4 h-4 text-gray-300" />;
      case 3:
        return <Medal className="w-4 h-4 text-amber-600" />;
      default:
        return <span className="font-mono text-data-sm text-text-muted">#{rank}</span>;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Topbar />

      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <h1 className="text-2xl font-semibold text-text-primary mb-6 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-primary" />
            Leaderboard
          </h1>

          {/* Your Rank Card */}
          <Card className="bg-surface border-primary mb-6 border">
            <CardHeader>
              <CardTitle className="text-sm text-text-muted">Your Ranking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary font-mono">#{userEntry.rank}</div>
                    <div className="text-xs text-text-muted mt-1">Global Rank</div>
                  </div>
                  <div className="h-12 w-px bg-border" />
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{COUNTRY_FLAGS[userEntry.country]}</div>
                    <div>
                      <div className="font-medium text-text-primary">{userEntry.playerName}</div>
                      <div className="text-xs text-text-muted">{userEntry.totalTrades} trades this week</div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-data-lg font-medium text-text-primary">
                    {formatCurrency(userEntry.portfolioValue)}
                  </div>
                  <div className="flex items-center gap-1 justify-end mt-1">
                    <TrendingUp className="w-3 h-3 text-primary" />
                    <span className="text-sm text-primary font-mono">
                      +{userEntry.weeklyPnLPercent.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab('weekly')}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-all',
                activeTab === 'weekly'
                  ? 'bg-primary text-background'
                  : 'bg-surface-raised text-text-muted hover:text-text-secondary'
              )}
            >
              This Week
            </button>
            <button
              onClick={() => setActiveTab('all-time')}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-all',
                activeTab === 'all-time'
                  ? 'bg-primary text-background'
                  : 'bg-surface-raised text-text-muted hover:text-text-secondary'
              )}
            >
              All Time
            </button>
          </div>

          {/* Leaderboard Table */}
          <Card className="bg-surface border-border">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-surface-raised">
                    <TableHead className="text-text-muted w-16">Rank</TableHead>
                    <TableHead className="text-text-muted">Player</TableHead>
                    <TableHead className="text-text-muted text-right">Portfolio</TableHead>
                    <TableHead className="text-text-muted text-right">Weekly</TableHead>
                    <TableHead className="text-text-muted text-right hidden md:table-cell">Return</TableHead>
                    <TableHead className="text-text-muted text-right hidden lg:table-cell">Win Rate</TableHead>
                    <TableHead className="text-text-muted text-right hidden lg:table-cell">Trades</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedEntries.map((entry) => (
                    <TableRow
                      key={entry.playerId}
                      className={cn(
                        'border-border hover:bg-surface-raised',
                        entry.rank <= 3 && 'bg-surface-raised/50'
                      )}
                    >
                      <TableCell>
                        <div className="flex items-center justify-center">
                          {getRankIcon(entry.rank)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{COUNTRY_FLAGS[entry.country]}</span>
                          <span className="font-medium text-text-primary">{entry.playerName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="font-mono text-data-sm text-text-primary">
                          {formatCurrency(entry.portfolioValue)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className={cn(
                          'flex items-center gap-1 justify-end',
                          entry.weeklyPnL >= 0 ? 'text-primary' : 'text-danger'
                        )}>
                          {entry.weeklyPnL >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                          <span className="font-mono text-data-sm">
                            {entry.weeklyPnL >= 0 ? '+' : ''}{entry.weeklyPnLPercent.toFixed(1)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right hidden md:table-cell">
                        <span className={cn(
                          'font-mono text-data-sm',
                          entry.returnRate >= 0 ? 'text-primary' : 'text-danger'
                        )}>
                          {entry.returnRate >= 0 ? '+' : ''}{entry.returnRate.toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right hidden lg:table-cell">
                        <span className="font-mono text-data-sm text-text-secondary">
                          {entry.winRate}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right hidden lg:table-cell">
                        <span className="font-mono text-data-sm text-text-muted">
                          {entry.totalTrades}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      <MobileNav />
    </div>
  );
}

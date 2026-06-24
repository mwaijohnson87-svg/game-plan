'use client';

import { useMemo, useState } from 'react';
import { Topbar } from '@/components/layout';
import { MobileNav } from '@/components/layout/mobile-nav';
import { useGameStore, usePortfolioStore } from '@/lib/stores';
import { COUNTRY_FLAGS } from '@/lib/data/mock-data';
import type { Country } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Trophy, Medal, Crown, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  playerId: string;
  playerName: string;
  country: Country;
  portfolioValue: number;
  weeklyPnL: number;
  weeklyPnLPercent: number;
  returnRate: number;
  winRate: number;
  totalTrades: number;
}

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, playerId: '1', playerName: 'AlphaTrader', country: 'US', portfolioValue: 125890, weeklyPnL: 12890, weeklyPnLPercent: 11.4, returnRate: 25.8, winRate: 68, totalTrades: 156 },
  { rank: 2, playerId: '2', playerName: 'NairobiBull', country: 'KE', portfolioValue: 118450, weeklyPnL: 8450, weeklyPnLPercent: 7.7, returnRate: 18.5, winRate: 72, totalTrades: 89 },
  { rank: 3, playerId: '3', playerName: 'LSELegend', country: 'UK', portfolioValue: 112340, weeklyPnL: 6340, weeklyPnLPercent: 5.9, returnRate: 12.3, winRate: 65, totalTrades: 234 },
  { rank: 4, playerId: '4', playerName: 'WallStWolf', country: 'US', portfolioValue: 108900, weeklyPnL: 8900, weeklyPnLPercent: 8.9, returnRate: 8.9, winRate: 61, totalTrades: 312 },
  { rank: 5, playerId: '5', playerName: 'EuroTrader', country: 'EU', portfolioValue: 105250, weeklyPnL: 3250, weeklyPnLPercent: 3.2, returnRate: 5.3, winRate: 58, totalTrades: 178 },
  { rank: 6, playerId: '6', playerName: 'NaijaGrowth', country: 'NG', portfolioValue: 102100, weeklyPnL: 6100, weeklyPnLPercent: 6.4, returnRate: 2.1, winRate: 54, totalTrades: 45 },
  { rank: 7, playerId: '7', playerName: 'TechSavvy', country: 'US', portfolioValue: 98750, weeklyPnL: -1250, weeklyPnLPercent: -1.2, returnRate: -1.2, winRate: 52, totalTrades: 267 },
  { rank: 8, playerId: '8', playerName: 'SafariInvest', country: 'KE', portfolioValue: 95400, weeklyPnL: 8400, weeklyPnLPercent: 9.6, returnRate: -4.6, winRate: 49, totalTrades: 67 },
  { rank: 9, playerId: '9', playerName: 'DiversifiedPro', country: 'EU', portfolioValue: 92100, weeklyPnL: -2900, weeklyPnLPercent: -3.0, returnRate: -7.9, winRate: 47, totalTrades: 189 },
  { rank: 10, playerId: '10', playerName: 'EmergingMarket', country: 'NG', portfolioValue: 88900, weeklyPnL: -4100, weeklyPnLPercent: -4.4, returnRate: -11.1, winRate: 44, totalTrades: 123 },
];

export default function LeaderboardPage() {
  const playerName = useGameStore((s) => s.playerName);
  const playerCountry = useGameStore((s) => s.playerCountry);
  const totalValue = usePortfolioStore((s) => s.totalValue);

  const [activeTab, setActiveTab] = useState<'weekly' | 'all-time'>('weekly');

  const userEntry = useMemo(() => ({
    rank: 48,
    playerId: 'current-user',
    playerName,
    country: playerCountry as Country,
    portfolioValue: totalValue,
    weeklyPnL: 2500,
    weeklyPnLPercent: 2.5,
    returnRate: 5.0,
    winRate: 62,
    totalTrades: 24,
  }), [playerName, playerCountry, totalValue]);

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
                  {MOCK_LEADERBOARD.map((entry) => (
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

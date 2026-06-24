'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { PortfolioSummary } from '@/components/trading';
import { useGameStore } from '@/lib/stores';
import { Layout, Briefcase, Globe, TrendingUp, DollarSign, Coins, Newspaper, HelpCircle, User } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: Layout },
  { href: '/portfolio', label: 'Portfolio', icon: Briefcase },
  { href: '/markets', label: 'Markets', icon: Globe },
  { href: '/leaderboard', label: 'Leaderboard', icon: TrendingUp },
  { href: '/treasury', label: 'Treasury', icon: DollarSign },
  { href: '/forex', label: 'Forex', icon: Coins },
  { href: '/news', label: 'News', icon: Newspaper },
];

export function Topbar() {
  const pathname = usePathname();
  const playerName = useGameStore((s) => s.playerName);
  const weekNumber = useGameStore((s) => s.weekNumber);

  return (
    <div className="h-16 bg-surface border-b border-border flex items-center justify-between px-4">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
            <span className="text-background font-bold text-sm">CP</span>
          </div>
          <span className="text-lg font-semibold text-text-primary tracking-tight">
            CapitalPlay
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-fast',
                  isActive
                    ? 'bg-surface-raised text-text-primary'
                    : 'text-text-muted hover:text-text-secondary hover:bg-surface-raised'
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-4">
          <div className="text-xs text-text-muted">
            Week {weekNumber}
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2 text-sm">
            <span className="text-text-muted">Clock:</span>
            <Clock />
          </div>
        </div>

        <div className="hidden xl:block">
          <PortfolioSummary />
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-surface-raised border border-border flex items-center justify-center">
            <User className="w-4 h-4 text-text-muted" />
          </div>
          <span className="text-sm text-text-primary hidden sm:block">{playerName}</span>
        </div>
      </div>
    </div>
  );
}

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <span className="font-mono text-data-sm text-text-secondary">
      {time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      })}
    </span>
  );
}

import { useEffect, useState } from 'react';

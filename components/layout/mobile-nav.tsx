'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Layout, Briefcase, Globe, TrendingUp, DollarSign, Coins, Newspaper, Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: Layout },
  { href: '/portfolio', label: 'Portfolio', icon: Briefcase },
  { href: '/markets', label: 'Markets', icon: Globe },
  { href: '/leaderboard', label: 'Leaderboard', icon: TrendingUp },
  { href: '/treasury', label: 'Treasury', icon: DollarSign },
  { href: '/forex', label: 'Forex', icon: Coins },
  { href: '/news', label: 'News', icon: Newspaper },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-50 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-background" />
        ) : (
          <Menu className="w-5 h-5 text-background" />
        )}
      </button>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="fixed bottom-20 right-4 bg-surface-raised border border-border rounded-lg shadow-xl overflow-hidden z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex flex-col">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-fast',
                      isActive
                        ? 'bg-primary-dim text-primary'
                        : 'text-text-muted hover:text-text-secondary hover:bg-surface'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

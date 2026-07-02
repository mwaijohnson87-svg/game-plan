'use client';

import { cn } from '@/lib/utils';
import type { Country } from '@/lib/types';
import { COUNTRY_FLAGS, COUNTRY_NAMES } from '@/lib/data/constants';

interface CountryMarketTabProps {
  selectedCountry: Country;
  onCountryChange: (country: Country) => void;
}

const COUNTRIES: Country[] = ['US', 'KE', 'NG', 'UK', 'EU'];

export function CountryMarketTab({
  selectedCountry,
  onCountryChange,
}: CountryMarketTabProps) {
  return (
    <div className="flex gap-2 px-4 py-3 border-b border-border overflow-x-auto">
      {COUNTRIES.map((country) => (
        <button
          key={country}
          onClick={() => onCountryChange(country)}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-fast whitespace-nowrap',
            selectedCountry === country
              ? 'bg-primary text-background'
              : 'bg-surface-raised text-text-muted hover:text-text-secondary'
          )}
        >
          <span>{COUNTRY_FLAGS[country]}</span>
          <span>{country}</span>
        </button>
      ))}
    </div>
  );
}

export function CountryMarketTabsLarge({
  selectedCountry,
  onCountryChange,
}: CountryMarketTabProps) {
  return (
    <div className="flex gap-4 px-4 py-3 border-b border-border overflow-x-auto">
      {COUNTRIES.map((country) => (
        <button
          key={country}
          onClick={() => onCountryChange(country)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-fast whitespace-nowrap',
            selectedCountry === country
              ? 'bg-surface-raised border border-primary text-text-primary'
              : 'text-text-muted hover:text-text-secondary hover:bg-surface-raised'
          )}
        >
          <span className="text-xl">{COUNTRY_FLAGS[country]}</span>
          <span>{COUNTRY_NAMES[country]}</span>
        </button>
      ))}
    </div>
  );
}

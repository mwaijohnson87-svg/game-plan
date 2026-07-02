import type { Country, ForexCurrency } from '../types';

export const COUNTRY_FLAGS: Record<Country, string> = {
  US: '🇺🇸',
  KE: '🇰🇪',
  NG: '🇳🇬',
  UK: '🇬🇧',
  EU: '🇪🇺',
};

export const COUNTRY_NAMES: Record<Country, string> = {
  US: 'United States',
  KE: 'Kenya',
  NG: 'Nigeria',
  UK: 'United Kingdom',
  EU: 'Europe',
};

export const FOREX_CURRENCIES: ForexCurrency[] = [
  { id: 'usd', code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
  { id: 'eur', code: 'EUR', name: 'Euro', flag: '🇪🇺' },
  { id: 'gbp', code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
  { id: 'kes', code: 'KES', name: 'Kenyan Shilling', flag: '🇰🇪' },
  { id: 'ngn', code: 'NGN', name: 'Nigerian Naira', flag: '🇳🇬' },
  { id: 'jpy', code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
];


import { LocationData } from '../types';

// Mock exchange rates for demo purposes (In a real app, you'd fetch from an exchange rate API)
const MOCK_RATES: Record<string, number> = {
  'BDT': 120.0, // Updated to a more current approximate rate
  'INR': 83.5,
  'EUR': 0.92,
  'GBP': 0.79,
  'CAD': 1.37,
  'AUD': 1.52,
  'JPY': 157.0,
  'USD': 1.0
};

const DEFAULT_LOCATION: LocationData = {
  country: 'United States',
  countryCode: 'US',
  currency: 'USD',
  currencySymbol: '$',
  region: 'California',
  ip: '0.0.0.0',
  exchangeRate: 1.0
};

export const detectLocation = async (): Promise<LocationData> => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) throw new Error('Location detection failed');
    
    const data = await response.json();
    const countryCode = data.country_code || 'US';
    
    // Explicit handling for Bangladesh
    let currency = data.currency || 'USD';
    let symbol = '$';

    if (countryCode === 'BD') {
      currency = 'BDT';
      symbol = '৳';
    } else {
      // Attempt to get currency symbol using Intl for other countries
      try {
        symbol = (0).toLocaleString('en-US', {
          style: 'currency',
          currency: currency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).replace(/\d/g, '').trim();
      } catch (e) {
        symbol = data.currency || '$';
      }
    }

    return {
      country: data.country_name || 'Global',
      countryCode: countryCode,
      currency: currency,
      currencySymbol: symbol,
      region: data.region || 'Remote',
      ip: data.ip || '',
      exchangeRate: MOCK_RATES[currency] || 1.0
    };
  } catch (error) {
    console.warn('Geolocation blocked or failed, using defaults.', error);
    return DEFAULT_LOCATION;
  }
};

export const convertPrice = (priceStr: string, rate: number, symbol: string): string => {
  // Extract number from string like "Starts at $500" or "$500"
  const match = priceStr.match(/\$(\d+(?:,\d+)?)/);
  if (!match) return '';
  
  const usdValue = parseFloat(match[1].replace(',', ''));
  const convertedValue = usdValue * rate;
  
  // Custom formatting for Taka
  if (symbol === '৳') {
    return `${symbol}${convertedValue.toLocaleString('en-BD', { maximumFractionDigits: 0 })}`;
  }
  
  return `${symbol}${convertedValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
};

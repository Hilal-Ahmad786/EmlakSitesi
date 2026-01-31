import { NextResponse } from 'next/server';

interface CachedRates {
  rates: Record<string, number>;
  timestamp: number;
}

let cachedRates: CachedRates | null = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  TRY: 36.5,
};

async function fetchLiveRates(): Promise<Record<string, number>> {
  try {
    // Use the free exchangerate.host API (no key required)
    const res = await fetch(
      'https://api.exchangerate.host/latest?base=USD&symbols=EUR,TRY',
      { next: { revalidate: 3600 } }
    );

    if (res.ok) {
      const data = await res.json();
      if (data.success !== false && data.rates) {
        return {
          USD: 1,
          EUR: data.rates.EUR || FALLBACK_RATES.EUR,
          TRY: data.rates.TRY || FALLBACK_RATES.TRY,
        };
      }
    }
  } catch {
    // Try alternative free API
  }

  try {
    const res = await fetch(
      'https://open.er-api.com/v6/latest/USD',
      { next: { revalidate: 3600 } }
    );

    if (res.ok) {
      const data = await res.json();
      if (data.result === 'success' && data.rates) {
        return {
          USD: 1,
          EUR: data.rates.EUR || FALLBACK_RATES.EUR,
          TRY: data.rates.TRY || FALLBACK_RATES.TRY,
        };
      }
    }
  } catch {
    // Fall through to fallback
  }

  return FALLBACK_RATES;
}

export async function GET() {
  const now = Date.now();

  if (cachedRates && now - cachedRates.timestamp < CACHE_DURATION) {
    return NextResponse.json({
      rates: cachedRates.rates,
      cached: true,
      updatedAt: new Date(cachedRates.timestamp).toISOString(),
    });
  }

  const rates = await fetchLiveRates();

  cachedRates = { rates, timestamp: now };

  return NextResponse.json({
    rates,
    cached: false,
    updatedAt: new Date(now).toISOString(),
  });
}

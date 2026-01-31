'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

type Currency = 'EUR' | 'USD' | 'TRY';

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    formatPrice: (priceInUsd: number) => string;
    convertPrice: (priceInUsd: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const FALLBACK_RATES: Record<Currency, number> = {
    USD: 1,
    EUR: 0.92,
    TRY: 36.5,
};

const REFRESH_INTERVAL = 60 * 60 * 1000; // 1 hour

export function CurrencyProvider({ children }: { children: ReactNode }) {
    const [currency, setCurrency] = useState<Currency>('USD');
    const [rates, setRates] = useState<Record<Currency, number>>(FALLBACK_RATES);

    const fetchRates = useCallback(async () => {
        try {
            const res = await fetch('/api/exchange-rates');
            if (res.ok) {
                const data = await res.json();
                if (data.rates) {
                    setRates({
                        USD: data.rates.USD ?? 1,
                        EUR: data.rates.EUR ?? FALLBACK_RATES.EUR,
                        TRY: data.rates.TRY ?? FALLBACK_RATES.TRY,
                    });
                }
            }
        } catch {
            // Keep fallback rates
        }
    }, []);

    useEffect(() => {
        fetchRates();
        const interval = setInterval(fetchRates, REFRESH_INTERVAL);
        return () => clearInterval(interval);
    }, [fetchRates]);

    const convertPrice = (priceInUsd: number) => {
        return priceInUsd * rates[currency];
    };

    const formatPrice = (priceInUsd: number) => {
        const converted = convertPrice(priceInUsd);
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: 0
        }).format(converted);
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, convertPrice }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}

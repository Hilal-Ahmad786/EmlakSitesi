'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Currency = 'EUR' | 'USD' | 'TRY';

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    formatPrice: (price: number) => string;
    convertPrice: (priceInEur: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const RATES = {
    EUR: 1,
    USD: 1.08,
    TRY: 34.50
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
    const [currency, setCurrency] = useState<Currency>('EUR');

    const convertPrice = (priceInEur: number) => {
        return priceInEur * RATES[currency];
    };

    const formatPrice = (priceInEur: number) => {
        const converted = convertPrice(priceInEur);
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

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CompareContextType {
    compareList: string[];
    addToCompare: (id: string) => void;
    removeFromCompare: (id: string) => void;
    isInCompare: (id: string) => boolean;
    clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: ReactNode }) {
    const [compareList, setCompareList] = useState<string[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('compareList');
        if (saved) {
            setCompareList(JSON.parse(saved));
        }
    }, []);

    const saveCompareList = (newList: string[]) => {
        setCompareList(newList);
        localStorage.setItem('compareList', JSON.stringify(newList));
    };

    const addToCompare = (id: string) => {
        if (!compareList.includes(id) && compareList.length < 3) {
            saveCompareList([...compareList, id]);
        }
    };

    const removeFromCompare = (id: string) => {
        saveCompareList(compareList.filter(itemId => itemId !== id));
    };

    const isInCompare = (id: string) => compareList.includes(id);

    const clearCompare = () => {
        saveCompareList([]);
    };

    return (
        <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, isInCompare, clearCompare }}>
            {children}
        </CompareContext.Provider>
    );
}

export function useCompare() {
    const context = useContext(CompareContext);
    if (context === undefined) {
        throw new Error('useCompare must be used within a CompareProvider');
    }
    return context;
}

'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export interface ViewedProperty {
  id: string;
  title: string;
  location: string;
  price: string;
  image: string;
  beds: number;
  baths: number;
  size: number;
  type: 'sale' | 'rent';
  viewedAt: string;
}

interface RecentlyViewedContextType {
  recentlyViewed: ViewedProperty[];
  addToRecentlyViewed: (property: Omit<ViewedProperty, 'viewedAt'>) => void;
  removeFromRecentlyViewed: (id: string) => void;
  clearRecentlyViewed: () => void;
  isRecentlyViewed: (id: string) => boolean;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

const STORAGE_KEY = 'recently-viewed';
const MAX_ITEMS = 12;

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [recentlyViewed, setRecentlyViewed] = useState<ViewedProperty[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRecentlyViewed(JSON.parse(stored));
      }
    } catch (error) {
      console.warn('Failed to load recently viewed:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when list changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(recentlyViewed));
      } catch (error) {
        console.warn('Failed to save recently viewed:', error);
      }
    }
  }, [recentlyViewed, isLoaded]);

  const addToRecentlyViewed = useCallback(
    (property: Omit<ViewedProperty, 'viewedAt'>) => {
      setRecentlyViewed((prev) => {
        // Remove if already exists
        const filtered = prev.filter((p) => p.id !== property.id);
        // Add to beginning with timestamp
        const newItem: ViewedProperty = {
          ...property,
          viewedAt: new Date().toISOString(),
        };
        // Limit to MAX_ITEMS
        return [newItem, ...filtered].slice(0, MAX_ITEMS);
      });
    },
    []
  );

  const removeFromRecentlyViewed = useCallback((id: string) => {
    setRecentlyViewed((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([]);
  }, []);

  const isRecentlyViewed = useCallback(
    (id: string) => recentlyViewed.some((p) => p.id === id),
    [recentlyViewed]
  );

  return (
    <RecentlyViewedContext.Provider
      value={{
        recentlyViewed,
        addToRecentlyViewed,
        removeFromRecentlyViewed,
        clearRecentlyViewed,
        isRecentlyViewed,
      }}
    >
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext);
  if (context === undefined) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return context;
}

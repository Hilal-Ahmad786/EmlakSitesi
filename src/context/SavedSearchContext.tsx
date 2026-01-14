'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export interface SavedSearch {
  id: string;
  name: string;
  filters: {
    location?: string;
    propertyType?: string;
    listingType?: 'sale' | 'rent' | 'both';
    minPrice?: number;
    maxPrice?: number;
    minBeds?: number;
    maxBeds?: number;
    minBaths?: number;
    maxBaths?: number;
    minSize?: number;
    maxSize?: number;
    amenities?: string[];
  };
  createdAt: string;
  lastUsed?: string;
  alertEnabled: boolean;
  alertFrequency: 'instant' | 'daily' | 'weekly';
}

interface SavedSearchContextType {
  savedSearches: SavedSearch[];
  addSearch: (search: Omit<SavedSearch, 'id' | 'createdAt'>) => void;
  updateSearch: (id: string, updates: Partial<SavedSearch>) => void;
  deleteSearch: (id: string) => void;
  getSearch: (id: string) => SavedSearch | undefined;
  toggleAlert: (id: string) => void;
  applySearch: (id: string) => SavedSearch['filters'] | undefined;
}

const SavedSearchContext = createContext<SavedSearchContextType | undefined>(undefined);

const STORAGE_KEY = 'saved-searches';

export function SavedSearchProvider({ children }: { children: ReactNode }) {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedSearches(JSON.parse(stored));
      }
    } catch (error) {
      console.warn('Failed to load saved searches:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when searches change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedSearches));
      } catch (error) {
        console.warn('Failed to save searches:', error);
      }
    }
  }, [savedSearches, isLoaded]);

  const addSearch = useCallback((search: Omit<SavedSearch, 'id' | 'createdAt'>) => {
    const newSearch: SavedSearch = {
      ...search,
      id: `search-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    setSavedSearches((prev) => [newSearch, ...prev]);
  }, []);

  const updateSearch = useCallback((id: string, updates: Partial<SavedSearch>) => {
    setSavedSearches((prev) =>
      prev.map((search) =>
        search.id === id ? { ...search, ...updates } : search
      )
    );
  }, []);

  const deleteSearch = useCallback((id: string) => {
    setSavedSearches((prev) => prev.filter((search) => search.id !== id));
  }, []);

  const getSearch = useCallback(
    (id: string) => savedSearches.find((search) => search.id === id),
    [savedSearches]
  );

  const toggleAlert = useCallback((id: string) => {
    setSavedSearches((prev) =>
      prev.map((search) =>
        search.id === id ? { ...search, alertEnabled: !search.alertEnabled } : search
      )
    );
  }, []);

  const applySearch = useCallback(
    (id: string) => {
      const search = savedSearches.find((s) => s.id === id);
      if (search) {
        updateSearch(id, { lastUsed: new Date().toISOString() });
        return search.filters;
      }
      return undefined;
    },
    [savedSearches, updateSearch]
  );

  return (
    <SavedSearchContext.Provider
      value={{
        savedSearches,
        addSearch,
        updateSearch,
        deleteSearch,
        getSearch,
        toggleAlert,
        applySearch,
      }}
    >
      {children}
    </SavedSearchContext.Provider>
  );
}

export function useSavedSearches() {
  const context = useContext(SavedSearchContext);
  if (context === undefined) {
    throw new Error('useSavedSearches must be used within a SavedSearchProvider');
  }
  return context;
}

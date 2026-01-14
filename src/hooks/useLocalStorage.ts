'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * A hook for syncing state with localStorage
 * @param key - The localStorage key
 * @param initialValue - The initial value if nothing is stored
 * @returns [storedValue, setValue, removeValue]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Get initial value from localStorage or use provided initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when value changes
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Listen for changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.warn(`Error parsing localStorage change for key "${key}":`, error);
        }
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [key]);

  return [storedValue, setValue, removeValue];
}

/**
 * A hook to track recently viewed items
 * @param key - The localStorage key
 * @param maxItems - Maximum number of items to store (default: 10)
 */
export function useRecentItems<T extends { id: string }>(
  key: string,
  maxItems: number = 10
): {
  items: T[];
  addItem: (item: T) => void;
  removeItem: (id: string) => void;
  clearItems: () => void;
} {
  const [items, setItems, removeItems] = useLocalStorage<T[]>(key, []);

  const addItem = useCallback(
    (item: T) => {
      setItems((prev) => {
        // Remove existing item if present
        const filtered = prev.filter((i) => i.id !== item.id);
        // Add to beginning and limit to maxItems
        return [item, ...filtered].slice(0, maxItems);
      });
    },
    [setItems, maxItems]
  );

  const removeItem = useCallback(
    (id: string) => {
      setItems((prev) => prev.filter((item) => item.id !== id));
    },
    [setItems]
  );

  const clearItems = useCallback(() => {
    removeItems();
  }, [removeItems]);

  return { items, addItem, removeItem, clearItems };
}

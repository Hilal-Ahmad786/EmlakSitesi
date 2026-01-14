'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export interface PropertyAlert {
  id: string;
  name: string;
  criteria: {
    locations?: string[];
    propertyTypes?: string[];
    listingType?: 'sale' | 'rent' | 'both';
    minPrice?: number;
    maxPrice?: number;
    minBeds?: number;
    minBaths?: number;
    minSize?: number;
    keywords?: string[];
  };
  frequency: 'instant' | 'daily' | 'weekly';
  isActive: boolean;
  createdAt: string;
  lastTriggered?: string;
  matchCount: number;
}

interface AlertsContextType {
  alerts: PropertyAlert[];
  addAlert: (alert: Omit<PropertyAlert, 'id' | 'createdAt' | 'matchCount'>) => void;
  updateAlert: (id: string, updates: Partial<PropertyAlert>) => void;
  deleteAlert: (id: string) => void;
  getAlert: (id: string) => PropertyAlert | undefined;
  toggleAlert: (id: string) => void;
  activeAlertCount: number;
}

const AlertsContext = createContext<AlertsContextType | undefined>(undefined);

const STORAGE_KEY = 'property-alerts';

export function AlertsProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<PropertyAlert[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setAlerts(JSON.parse(stored));
      }
    } catch (error) {
      console.warn('Failed to load alerts:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when alerts change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
      } catch (error) {
        console.warn('Failed to save alerts:', error);
      }
    }
  }, [alerts, isLoaded]);

  const addAlert = useCallback(
    (alert: Omit<PropertyAlert, 'id' | 'createdAt' | 'matchCount'>) => {
      const newAlert: PropertyAlert = {
        ...alert,
        id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        matchCount: 0,
      };
      setAlerts((prev) => [newAlert, ...prev]);
    },
    []
  );

  const updateAlert = useCallback((id: string, updates: Partial<PropertyAlert>) => {
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === id ? { ...alert, ...updates } : alert))
    );
  }, []);

  const deleteAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  const getAlert = useCallback(
    (id: string) => alerts.find((alert) => alert.id === id),
    [alerts]
  );

  const toggleAlert = useCallback((id: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
      )
    );
  }, []);

  const activeAlertCount = alerts.filter((alert) => alert.isActive).length;

  return (
    <AlertsContext.Provider
      value={{
        alerts,
        addAlert,
        updateAlert,
        deleteAlert,
        getAlert,
        toggleAlert,
        activeAlertCount,
      }}
    >
      {children}
    </AlertsContext.Provider>
  );
}

export function useAlerts() {
  const context = useContext(AlertsContext);
  if (context === undefined) {
    throw new Error('useAlerts must be used within an AlertsProvider');
  }
  return context;
}

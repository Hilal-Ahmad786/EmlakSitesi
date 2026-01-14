'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { analytics } from '@/lib/analytics/events';
import { initWebVitals } from '@/lib/analytics/webVitals';

interface AnalyticsContextValue {
  trackEvent: typeof analytics;
}

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);

interface AnalyticsProviderProps {
  children: ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const pathname = usePathname();

  // Initialize Web Vitals tracking on mount
  useEffect(() => {
    initWebVitals();
  }, []);

  // Track page views on route changes
  useEffect(() => {
    if (pathname) {
      analytics.pageView(pathname, document.title);
    }
  }, [pathname]);

  return (
    <AnalyticsContext.Provider value={{ trackEvent: analytics }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    // Return analytics directly if not in provider (SSR safety)
    return { trackEvent: analytics };
  }
  return context;
}

export default AnalyticsProvider;

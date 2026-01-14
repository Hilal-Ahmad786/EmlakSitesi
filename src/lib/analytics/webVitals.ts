/**
 * Web Vitals tracking utility
 * Tracks Core Web Vitals: LCP, FID, CLS, TTFB, FCP
 */

export interface WebVitalsMetric {
  id: string;
  name: 'LCP' | 'FID' | 'CLS' | 'TTFB' | 'FCP' | 'INP';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  navigationType: string;
}

// Thresholds based on Google's Core Web Vitals
const thresholds = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  TTFB: { good: 800, poor: 1800 },
  FCP: { good: 1800, poor: 3000 },
  INP: { good: 200, poor: 500 },
};

function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = thresholds[name as keyof typeof thresholds];
  if (!threshold) return 'good';

  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

type MetricCallback = (metric: WebVitalsMetric) => void;

let subscribers: MetricCallback[] = [];

export function subscribeToWebVitals(callback: MetricCallback): () => void {
  subscribers.push(callback);
  return () => {
    subscribers = subscribers.filter((cb) => cb !== callback);
  };
}

function reportMetric(metric: WebVitalsMetric) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    const color =
      metric.rating === 'good'
        ? '\x1b[32m' // green
        : metric.rating === 'needs-improvement'
        ? '\x1b[33m' // yellow
        : '\x1b[31m'; // red
    console.log(
      `${color}[Web Vitals] ${metric.name}: ${metric.value.toFixed(2)} (${metric.rating})\x1b[0m`
    );
  }

  // Notify subscribers
  subscribers.forEach((callback) => callback(metric));

  // Send to analytics endpoint (optional)
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
    navigator.sendBeacon?.(
      process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT,
      JSON.stringify({
        type: 'web-vital',
        ...metric,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
      })
    );
  }
}

/**
 * Initialize Web Vitals tracking using native Performance API
 * This implementation uses browser-native APIs and doesn't require the web-vitals package
 */
export function initWebVitals() {
  if (typeof window === 'undefined' || typeof PerformanceObserver === 'undefined') return;

  try {
    // Track LCP (Largest Contentful Paint)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        reportMetric({
          id: `lcp-${Date.now()}`,
          name: 'LCP',
          value: lastEntry.startTime,
          rating: getRating('LCP', lastEntry.startTime),
          delta: lastEntry.startTime,
          navigationType: 'navigate',
        });
      }
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

    // Track FCP (First Contentful Paint)
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcpEntry = entries.find((e) => e.name === 'first-contentful-paint');
      if (fcpEntry) {
        reportMetric({
          id: `fcp-${Date.now()}`,
          name: 'FCP',
          value: fcpEntry.startTime,
          rating: getRating('FCP', fcpEntry.startTime),
          delta: fcpEntry.startTime,
          navigationType: 'navigate',
        });
      }
    });
    fcpObserver.observe({ type: 'paint', buffered: true });

    // Track CLS (Cumulative Layout Shift)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!(entry as any).hadRecentInput) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          clsValue += (entry as any).value;
        }
      }
      reportMetric({
        id: `cls-${Date.now()}`,
        name: 'CLS',
        value: clsValue,
        rating: getRating('CLS', clsValue),
        delta: clsValue,
        navigationType: 'navigate',
      });
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });

    // Track TTFB using Navigation Timing API
    const navEntries = performance.getEntriesByType('navigation');
    if (navEntries.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const navEntry = navEntries[0] as any;
      const ttfb = navEntry.responseStart - navEntry.requestStart;
      reportMetric({
        id: `ttfb-${Date.now()}`,
        name: 'TTFB',
        value: ttfb,
        rating: getRating('TTFB', ttfb),
        delta: ttfb,
        navigationType: navEntry.type || 'navigate',
      });
    }

    // Track FID (First Input Delay)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const firstInput = entries[0];
      if (firstInput) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const delay = (firstInput as any).processingStart - firstInput.startTime;
        reportMetric({
          id: `fid-${Date.now()}`,
          name: 'FID',
          value: delay,
          rating: getRating('FID', delay),
          delta: delay,
          navigationType: 'navigate',
        });
      }
    });
    fidObserver.observe({ type: 'first-input', buffered: true });

  } catch (error) {
    console.warn('Failed to initialize Web Vitals:', error);
  }
}

/**
 * Get performance summary
 */
export function getPerformanceSummary(): Record<string, number> | null {
  if (typeof window === 'undefined') return null;

  const timing = performance.timing;
  if (!timing) return null;

  return {
    // Navigation timing
    dnsLookup: timing.domainLookupEnd - timing.domainLookupStart,
    tcpConnection: timing.connectEnd - timing.connectStart,
    serverResponse: timing.responseEnd - timing.requestStart,
    domParsing: timing.domComplete - timing.domLoading,
    resourceLoading: timing.loadEventStart - timing.domContentLoadedEventEnd,
    totalLoadTime: timing.loadEventEnd - timing.navigationStart,

    // Memory (if available)
    ...(performance as any).memory
      ? {
          usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
          totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        }
      : {},
  };
}

/**
 * Mark a custom performance point
 */
export function markPerformance(name: string) {
  if (typeof performance !== 'undefined') {
    performance.mark(name);
  }
}

/**
 * Measure time between two marks
 */
export function measurePerformance(
  name: string,
  startMark: string,
  endMark: string
): number | null {
  if (typeof performance === 'undefined') return null;

  try {
    performance.measure(name, startMark, endMark);
    const entries = performance.getEntriesByName(name, 'measure');
    return entries.length > 0 ? entries[entries.length - 1].duration : null;
  } catch (error) {
    console.warn('Failed to measure performance:', error);
    return null;
  }
}

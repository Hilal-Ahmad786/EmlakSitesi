'use client';

import { useEffect, useState } from 'react';
import { initWebVitals, subscribeToWebVitals, WebVitalsMetric } from '@/lib/analytics/webVitals';
import { cn } from '@/lib/utils';

interface WebVitalsReporterProps {
  showDebugPanel?: boolean;
}

export function WebVitalsReporter({ showDebugPanel = false }: WebVitalsReporterProps) {
  const [metrics, setMetrics] = useState<Record<string, WebVitalsMetric>>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Initialize web vitals tracking
    initWebVitals();

    // Subscribe to metrics
    const unsubscribe = subscribeToWebVitals((metric) => {
      setMetrics((prev) => ({
        ...prev,
        [metric.name]: metric,
      }));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Only show debug panel in development or when explicitly enabled
  if (!showDebugPanel && process.env.NODE_ENV !== 'development') {
    return null;
  }

  const metricOrder = ['LCP', 'FID', 'CLS', 'TTFB', 'FCP', 'INP'];

  const formatValue = (name: string, value: number): string => {
    if (name === 'CLS') {
      return value.toFixed(3);
    }
    return `${Math.round(value)}ms`;
  };

  const ratingColors = {
    good: 'bg-green-500',
    'needs-improvement': 'bg-yellow-500',
    poor: 'bg-red-500',
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="w-10 h-10 bg-gray-900 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-800 transition-colors"
        title="Toggle Web Vitals"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="w-5 h-5"
        >
          <path d="M12 20V10" />
          <path d="M18 20V4" />
          <path d="M6 20v-4" />
        </svg>
      </button>

      {/* Debug Panel */}
      {isVisible && (
        <div className="absolute bottom-12 right-0 w-72 bg-gray-900 rounded-lg shadow-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-700">
            <h3 className="text-white font-medium text-sm">Web Vitals</h3>
            <p className="text-gray-400 text-xs">Core Web Vitals Metrics</p>
          </div>

          <div className="p-4 space-y-3">
            {metricOrder.map((name) => {
              const metric = metrics[name];
              if (!metric) {
                return (
                  <div key={name} className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">{name}</span>
                    <span className="text-gray-600 text-sm">--</span>
                  </div>
                );
              }

              return (
                <div key={name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn('w-2 h-2 rounded-full', ratingColors[metric.rating])}
                    />
                    <span className="text-gray-300 text-sm">{name}</span>
                  </div>
                  <span
                    className={cn(
                      'text-sm font-mono',
                      metric.rating === 'good' && 'text-green-400',
                      metric.rating === 'needs-improvement' && 'text-yellow-400',
                      metric.rating === 'poor' && 'text-red-400'
                    )}
                  >
                    {formatValue(name, metric.value)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="px-4 py-2 bg-gray-800/50 border-t border-gray-700">
            <p className="text-gray-500 text-xs">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1" />
              Good
              <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 mx-1 ml-3" />
              Needs work
              <span className="inline-block w-2 h-2 rounded-full bg-red-500 mx-1 ml-3" />
              Poor
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

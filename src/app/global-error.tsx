'use client';

import { useEffect } from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console
    console.error('Global error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            {/* Error Icon */}
            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertOctagon size={48} className="text-red-500" />
            </div>

            {/* Error Message */}
            <h1 className="text-3xl font-bold text-white mb-4">
              Critical Error
            </h1>
            <p className="text-gray-400 mb-8">
              A critical error has occurred and the application could not recover.
              Please try refreshing the page.
            </p>

            {/* Retry Button */}
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-8 py-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              <RefreshCw size={20} />
              Reload Application
            </button>

            {/* Error Digest */}
            {error.digest && (
              <p className="mt-8 text-xs text-gray-600 font-mono">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}

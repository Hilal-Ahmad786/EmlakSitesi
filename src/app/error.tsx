'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console in development
    console.error('Application error:', error);

    // In production, you could send this to an error tracking service
    // Example: Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
          <AlertTriangle size={40} className="text-red-500" />
        </div>

        {/* Error Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Something went wrong
        </h1>
        <p className="text-gray-600 mb-6">
          We apologize for the inconvenience. An unexpected error has occurred.
        </p>

        {/* Error Details (Development only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-gray-900 text-left rounded-lg p-4 mb-6 overflow-auto">
            <p className="text-red-400 font-mono text-sm mb-2">{error.name}: {error.message}</p>
            {error.digest && (
              <p className="text-gray-500 font-mono text-xs">Digest: {error.digest}</p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <RefreshCw size={18} />
            Try Again
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Home size={18} />
            Go Home
          </Link>
        </div>

        {/* Back Link */}
        <button
          onClick={() => window.history.back()}
          className="mt-6 text-sm text-gray-500 hover:text-primary transition-colors inline-flex items-center gap-1"
        >
          <ArrowLeft size={14} />
          Go back to previous page
        </button>
      </div>
    </div>
  );
}

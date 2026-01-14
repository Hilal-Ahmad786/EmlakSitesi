import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* 404 Number */}
        <div className="relative mb-8">
          <span className="text-[180px] font-bold text-gray-100 leading-none select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
              <Search size={48} className="text-primary" />
            </div>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-600 mb-8 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
          >
            <Home size={18} />
            Go to Homepage
          </Link>
          <Link
            href="/properties"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors font-medium"
          >
            <Search size={18} />
            Browse Properties
          </Link>
        </div>

        {/* Suggestions */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">You might be looking for:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['Properties', 'Neighborhoods', 'About Us', 'Contact'].map((link) => (
              <Link
                key={link}
                href={`/${link.toLowerCase().replace(' ', '-')}`}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-primary hover:text-primary transition-colors"
              >
                {link}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

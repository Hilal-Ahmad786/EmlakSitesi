'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import {
  Download,
  Calendar,
  TrendingUp,
  MapPin,
  FileText,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MarketReport {
  id: string;
  title: string;
  description: string;
  quarter: string;
  year: number;
  type: 'quarterly' | 'annual' | 'neighborhood' | 'special';
  neighborhoods?: string[];
  downloadUrl: string;
  publishedAt: string;
  thumbnail: string;
}

const mockReports: MarketReport[] = [
  {
    id: '1',
    title: 'Istanbul Real Estate Market Q4 2024',
    description: 'Comprehensive analysis of Istanbul luxury real estate market trends, pricing, and investment opportunities.',
    quarter: 'Q4',
    year: 2024,
    type: 'quarterly',
    downloadUrl: '#',
    publishedAt: '2024-01-15',
    thumbnail: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&h=300&fit=crop',
  },
  {
    id: '2',
    title: 'Bebek & Etiler Neighborhood Guide 2024',
    description: 'In-depth analysis of Bebek and Etiler neighborhoods including price trends, demographics, and lifestyle.',
    quarter: '',
    year: 2024,
    type: 'neighborhood',
    neighborhoods: ['Bebek', 'Etiler'],
    downloadUrl: '#',
    publishedAt: '2024-01-10',
    thumbnail: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=400&h=300&fit=crop',
  },
  {
    id: '3',
    title: 'Annual Market Review 2023',
    description: 'Complete annual review of Istanbul luxury property market with year-over-year comparisons and forecasts.',
    quarter: '',
    year: 2023,
    type: 'annual',
    downloadUrl: '#',
    publishedAt: '2024-01-05',
    thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop',
  },
  {
    id: '4',
    title: 'Investment Opportunities in Emerging Areas',
    description: 'Special report on up-and-coming neighborhoods with high ROI potential for property investors.',
    quarter: '',
    year: 2024,
    type: 'special',
    downloadUrl: '#',
    publishedAt: '2024-01-01',
    thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop',
  },
];

const reportTypeLabels = {
  quarterly: 'Quarterly Report',
  annual: 'Annual Report',
  neighborhood: 'Neighborhood Guide',
  special: 'Special Report',
};

const reportTypeColors = {
  quarterly: 'bg-blue-100 text-blue-700',
  annual: 'bg-purple-100 text-purple-700',
  neighborhood: 'bg-green-100 text-green-700',
  special: 'bg-orange-100 text-orange-700',
};

function ReportCard({ report }: { report: MarketReport }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <img
          src={report.thumbnail}
          alt={report.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className={cn('px-3 py-1 text-xs font-medium rounded-full', reportTypeColors[report.type])}>
            {reportTypeLabels[report.type]}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-semibold text-gray-900 text-lg mb-2">{report.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{report.description}</p>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <Calendar size={14} />
            {new Date(report.publishedAt).toLocaleDateString('en-US', {
              month: 'short',
              year: 'numeric',
            })}
          </span>
          {report.neighborhoods && (
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              {report.neighborhoods.join(', ')}
            </span>
          )}
        </div>

        <a
          href={report.downloadUrl}
          className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Download size={18} />
          Download Report
        </a>
      </div>
    </div>
  );
}

export default function MarketReportsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const [filterType, setFilterType] = useState<string>('all');

  const filteredReports = filterType === 'all'
    ? mockReports
    : mockReports.filter((r) => r.type === filterType);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-white/70 mb-4">
              <TrendingUp size={20} />
              <span>Market Insights</span>
            </div>
            <h1 className="text-4xl font-serif mb-4">Market Reports</h1>
            <p className="text-lg text-white/80">
              Stay informed with our comprehensive market analysis, neighborhood guides,
              and investment insights for Istanbul's luxury real estate market.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <div className="flex items-center gap-4 mb-8">
            <Filter size={20} className="text-gray-500" />
            <div className="flex gap-2 flex-wrap">
              {['all', 'quarterly', 'annual', 'neighborhood', 'special'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                    filterType === type
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  )}
                >
                  {type === 'all' ? 'All Reports' : reportTypeLabels[type as keyof typeof reportTypeLabels]}
                </button>
              ))}
            </div>
          </div>

          {/* Reports Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>

          {filteredReports.length === 0 && (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No reports found for this category.</p>
            </div>
          )}

          {/* Newsletter CTA */}
          <div className="mt-16 bg-gradient-to-r from-primary/5 to-accent-gold/5 rounded-2xl p-8 border border-primary/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Get Reports Delivered to Your Inbox
                </h3>
                <p className="text-gray-600">
                  Subscribe to receive our latest market reports and exclusive insights.
                </p>
              </div>
              <Link
                href="/contact"
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors whitespace-nowrap"
              >
                Subscribe Now
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

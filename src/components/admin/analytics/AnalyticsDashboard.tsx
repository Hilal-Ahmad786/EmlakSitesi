'use client';

import { useState, useEffect } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { AnalyticsStats, TopPropertyCard } from './StatsCards';
import { SimpleLineChart, SimpleBarChart, SimplePieChart, FunnelChart, DateRangePicker } from './ChartComponents';
import { cn } from '@/lib/utils';

// Mock data generator
function generateMockData(range: string) {
  const days = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 365;

  const viewsData = Array.from({ length: Math.min(days, 30) }, (_, i) => ({
    label: new Date(Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: Math.floor(Math.random() * 500) + 100,
  }));

  const leadsData = [
    { label: 'Inquiry', value: Math.floor(Math.random() * 100) + 50 },
    { label: 'Viewing Scheduled', value: Math.floor(Math.random() * 50) + 20 },
    { label: 'Offer Made', value: Math.floor(Math.random() * 20) + 5 },
    { label: 'Closed', value: Math.floor(Math.random() * 10) + 2 },
  ];

  const sourceData = [
    { label: 'Website', value: 45, color: '#1a2b4b' },
    { label: 'Social Media', value: 25, color: '#c5a059' },
    { label: 'Referrals', value: 15, color: '#22c55e' },
    { label: 'Direct', value: 10, color: '#3b82f6' },
    { label: 'Other', value: 5, color: '#9ca3af' },
  ];

  const neighborhoodData = [
    { label: 'Bebek', value: Math.floor(Math.random() * 200) + 100 },
    { label: 'Nişantaşı', value: Math.floor(Math.random() * 180) + 80 },
    { label: 'Galata', value: Math.floor(Math.random() * 150) + 60 },
    { label: 'Sarıyer', value: Math.floor(Math.random() * 120) + 40 },
    { label: 'Levent', value: Math.floor(Math.random() * 100) + 30 },
  ];

  const funnelData = [
    { label: 'Page Views', value: 10000 + Math.floor(Math.random() * 5000), color: '#1a2b4b' },
    { label: 'Property Views', value: 3000 + Math.floor(Math.random() * 1000), color: '#2d4a6f' },
    { label: 'Inquiries', value: 500 + Math.floor(Math.random() * 200), color: '#4a6fa5' },
    { label: 'Viewings', value: 100 + Math.floor(Math.random() * 50), color: '#6b8cba' },
    { label: 'Offers', value: 20 + Math.floor(Math.random() * 10), color: '#8ca7cf' },
  ];

  const topProperties = [
    {
      id: '1',
      title: 'Luxury Bosphorus Villa',
      location: 'Bebek, Istanbul',
      views: Math.floor(Math.random() * 1000) + 500,
      leads: Math.floor(Math.random() * 20) + 5,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=100&h=100&fit=crop',
    },
    {
      id: '2',
      title: 'Historic Galata Apartment',
      location: 'Galata, Istanbul',
      views: Math.floor(Math.random() * 800) + 400,
      leads: Math.floor(Math.random() * 15) + 3,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=100&h=100&fit=crop',
    },
    {
      id: '3',
      title: 'Modern Levent Penthouse',
      location: 'Levent, Istanbul',
      views: Math.floor(Math.random() * 600) + 300,
      leads: Math.floor(Math.random() * 12) + 2,
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=100&h=100&fit=crop',
    },
    {
      id: '4',
      title: 'Seaside Sarıyer Mansion',
      location: 'Sarıyer, Istanbul',
      views: Math.floor(Math.random() * 500) + 200,
      leads: Math.floor(Math.random() * 10) + 1,
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=100&h=100&fit=crop',
    },
    {
      id: '5',
      title: 'Nişantaşı Designer Flat',
      location: 'Nişantaşı, Istanbul',
      views: Math.floor(Math.random() * 400) + 150,
      leads: Math.floor(Math.random() * 8) + 1,
      image: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=100&h=100&fit=crop',
    },
  ];

  const stats = {
    totalViews: viewsData.reduce((sum, d) => sum + d.value, 0),
    totalViewsChange: Math.floor(Math.random() * 30) - 10,
    totalLeads: leadsData.reduce((sum, d) => sum + d.value, 0),
    totalLeadsChange: Math.floor(Math.random() * 25) - 5,
    activeListings: 45 + Math.floor(Math.random() * 20),
    activeListingsChange: Math.floor(Math.random() * 15) - 5,
    conversionRate: 2.5 + Math.random() * 2,
    conversionRateChange: Math.floor(Math.random() * 10) - 3,
  };

  return {
    viewsData,
    leadsData,
    sourceData,
    neighborhoodData,
    funnelData,
    topProperties,
    stats: {
      ...stats,
      conversionRate: Number(stats.conversionRate.toFixed(1)),
    },
  };
}

interface AnalyticsDashboardProps {
  locale: string;
}

export function AnalyticsDashboard({ locale }: AnalyticsDashboardProps) {
  const [dateRange, setDateRange] = useState('30d');
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<ReturnType<typeof generateMockData> | null>(null);

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    const timer = setTimeout(() => {
      setData(generateMockData(dateRange));
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [dateRange]);

  const handleExport = () => {
    if (!data) return;

    const csvContent = [
      ['Metric', 'Value', 'Change'],
      ['Total Views', data.stats.totalViews, `${data.stats.totalViewsChange}%`],
      ['Total Leads', data.stats.totalLeads, `${data.stats.totalLeadsChange}%`],
      ['Active Listings', data.stats.activeListings, `${data.stats.activeListingsChange}%`],
      ['Conversion Rate', `${data.stats.conversionRate}%`, `${data.stats.conversionRateChange}%`],
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setData(generateMockData(dateRange));
      setIsLoading(false);
    }, 500);
  };

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-64 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-500 mt-1">Track your property performance and leads</p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          <button
            onClick={handleRefresh}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw size={20} className={cn('text-gray-600', isLoading && 'animate-spin')} />
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <AnalyticsStats stats={data.stats} />

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleLineChart
          data={data.viewsData}
          title="Property Views Over Time"
          color="#1a2b4b"
          height={250}
        />
        <FunnelChart
          data={data.funnelData}
          title="Lead Conversion Funnel"
        />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimplePieChart
          data={data.sourceData}
          title="Traffic Sources"
        />
        <SimpleBarChart
          data={data.neighborhoodData}
          title="Views by Neighborhood"
          color="#c5a059"
        />
      </div>

      {/* Top Properties */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Top Performing Properties</h3>
        <div className="space-y-3">
          {data.topProperties.map((property, index) => (
            <TopPropertyCard key={property.id} property={property} rank={index + 1} />
          ))}
        </div>
      </div>
    </div>
  );
}

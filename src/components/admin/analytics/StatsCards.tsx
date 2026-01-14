'use client';

import { TrendingUp, TrendingDown, Eye, Users, Home, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  iconBg?: string;
}

function StatCard({ title, value, change, changeLabel, icon, iconBg = 'bg-primary/10' }: StatCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {isPositive && <TrendingUp size={14} className="text-green-500" />}
              {isNegative && <TrendingDown size={14} className="text-red-500" />}
              <span
                className={cn(
                  'text-sm font-medium',
                  isPositive && 'text-green-600',
                  isNegative && 'text-red-600',
                  !isPositive && !isNegative && 'text-gray-500'
                )}
              >
                {isPositive && '+'}
                {change}%
              </span>
              {changeLabel && (
                <span className="text-sm text-gray-400">{changeLabel}</span>
              )}
            </div>
          )}
        </div>
        <div className={cn('p-3 rounded-lg', iconBg)}>{icon}</div>
      </div>
    </div>
  );
}

interface AnalyticsStatsProps {
  stats: {
    totalViews: number;
    totalViewsChange: number;
    totalLeads: number;
    totalLeadsChange: number;
    activeListings: number;
    activeListingsChange: number;
    conversionRate: number;
    conversionRateChange: number;
  };
}

export function AnalyticsStats({ stats }: AnalyticsStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Views"
        value={stats.totalViews.toLocaleString()}
        change={stats.totalViewsChange}
        changeLabel="vs last month"
        icon={<Eye size={24} className="text-primary" />}
        iconBg="bg-primary/10"
      />
      <StatCard
        title="Total Leads"
        value={stats.totalLeads.toLocaleString()}
        change={stats.totalLeadsChange}
        changeLabel="vs last month"
        icon={<Users size={24} className="text-green-600" />}
        iconBg="bg-green-100"
      />
      <StatCard
        title="Active Listings"
        value={stats.activeListings}
        change={stats.activeListingsChange}
        changeLabel="vs last month"
        icon={<Home size={24} className="text-blue-600" />}
        iconBg="bg-blue-100"
      />
      <StatCard
        title="Conversion Rate"
        value={`${stats.conversionRate}%`}
        change={stats.conversionRateChange}
        changeLabel="vs last month"
        icon={<MessageSquare size={24} className="text-purple-600" />}
        iconBg="bg-purple-100"
      />
    </div>
  );
}

interface TopPropertyCardProps {
  property: {
    id: string;
    title: string;
    location: string;
    views: number;
    leads: number;
    image?: string;
  };
  rank: number;
}

export function TopPropertyCard({ property, rank }: TopPropertyCardProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
        {rank}
      </div>
      <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-gray-200 overflow-hidden">
        {property.image ? (
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Home size={24} className="text-gray-400" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{property.title}</p>
        <p className="text-sm text-gray-500">{property.location}</p>
      </div>
      <div className="text-right">
        <p className="font-semibold text-gray-900">{property.views.toLocaleString()}</p>
        <p className="text-xs text-gray-500">views</p>
      </div>
      <div className="text-right">
        <p className="font-semibold text-green-600">{property.leads}</p>
        <p className="text-xs text-gray-500">leads</p>
      </div>
    </div>
  );
}

'use client';

import { useTranslations } from 'next-intl';
import { Heart, Search, Bell, Calendar, Eye, TrendingUp } from 'lucide-react';
import { useFavorites } from '@/context/FavoritesContext';
import { useSavedSearches } from '@/context/SavedSearchContext';
import { useAlerts } from '@/context/AlertsContext';
import { useAppointments } from '@/context/AppointmentsContext';
import { useRecentlyViewed } from '@/context/RecentlyViewedContext';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  trend?: number;
  color: 'primary' | 'gold' | 'green' | 'purple';
}

function StatCard({ icon, label, value, trend, color }: StatCardProps) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    gold: 'bg-accent-gold/10 text-accent-gold',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="bg-white rounded-xl border border-border p-6">
      <div className="flex items-start justify-between">
        <div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center',
            colorClasses[color]
          )}
        >
          {icon}
        </div>
        {trend !== undefined && (
          <div
            className={cn(
              'flex items-center gap-1 text-sm font-medium',
              trend >= 0 ? 'text-green-600' : 'text-red-500'
            )}
          >
            <TrendingUp
              size={14}
              className={trend < 0 ? 'rotate-180' : ''}
            />
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{label}</p>
      </div>
    </div>
  );
}

export function DashboardStats() {
  const t = useTranslations('Dashboard');
  const { favorites } = useFavorites();
  const { savedSearches } = useSavedSearches();
  const { activeAlertCount } = useAlerts();
  const { upcomingAppointments } = useAppointments();
  const { recentlyViewed } = useRecentlyViewed();

  const stats = [
    {
      icon: <Heart size={24} />,
      label: t('stats.savedProperties'),
      value: favorites.length,
      color: 'primary' as const,
    },
    {
      icon: <Search size={24} />,
      label: t('stats.savedSearches'),
      value: savedSearches.length,
      color: 'gold' as const,
    },
    {
      icon: <Bell size={24} />,
      label: t('stats.activeAlerts'),
      value: activeAlertCount,
      color: 'green' as const,
    },
    {
      icon: <Calendar size={24} />,
      label: t('stats.upcomingViewings'),
      value: upcomingAppointments.length,
      color: 'purple' as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}

export function RecentActivityStats() {
  const t = useTranslations('Dashboard');
  const { recentlyViewed } = useRecentlyViewed();

  return (
    <div className="bg-white rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{t('recentActivity')}</h3>
        <Eye size={20} className="text-gray-400" />
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">{t('propertiesViewed')}</span>
          <span className="font-medium text-gray-900">
            {recentlyViewed.length}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">{t('lastViewed')}</span>
          <span className="font-medium text-gray-900">
            {recentlyViewed.length > 0
              ? new Date(recentlyViewed[0].viewedAt).toLocaleDateString()
              : '-'}
          </span>
        </div>
      </div>
    </div>
  );
}

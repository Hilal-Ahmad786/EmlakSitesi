'use client';

import { useTranslations } from 'next-intl';
import { DashboardSidebar } from '@/components/features/dashboard/DashboardSidebar';
import { DashboardStats } from '@/components/features/dashboard/DashboardStats';
import { RecentlyViewed } from '@/components/features/dashboard/RecentlyViewed';
import { useFavorites } from '@/context/FavoritesContext';
import { useAppointments } from '@/context/AppointmentsContext';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/Button';
import {
  ArrowRight,
  Heart,
  Calendar,
  Bell,
  Search,
  Home,
} from 'lucide-react';

// Mock properties data
const mockProperties = [
  {
    id: '1',
    title: 'Historic Yalı Mansion on the Bosphorus',
    location: 'Bebek, Istanbul',
    price: '€12,500,000',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2700&auto=format&fit=crop',
    beds: 6,
    baths: 5,
    size: 450,
    type: 'sale' as const,
  },
  {
    id: '2',
    title: 'Luxury Penthouse with Galata View',
    location: 'Galata, Istanbul',
    price: '€2,850,000',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2700&auto=format&fit=crop',
    beds: 3,
    baths: 2,
    size: 180,
    type: 'sale' as const,
  },
];

export default function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const t = useTranslations('Dashboard');

  // We need to handle the async params differently in client components
  // For now, we'll extract locale from the URL or use a default
  const locale = 'en'; // This would come from params in a proper setup

  const { favorites } = useFavorites();
  const { upcomingAppointments } = useAppointments();

  const quickActions = [
    {
      icon: Search,
      label: t('quickActions.newSearch'),
      href: '/properties',
      color: 'bg-primary',
    },
    {
      icon: Heart,
      label: t('quickActions.viewFavorites'),
      href: '/dashboard/favorites',
      color: 'bg-accent-gold',
    },
    {
      icon: Bell,
      label: t('quickActions.manageAlerts'),
      href: '/dashboard/alerts',
      color: 'bg-green-600',
    },
    {
      icon: Calendar,
      label: t('quickActions.viewAppointments'),
      href: '/dashboard/appointments',
      color: 'bg-purple-600',
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Header */}
      <div className="bg-primary-dark text-white py-12 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-3xl md:text-4xl mb-2">
            {t('title')}
          </h1>
          <p className="text-gray-300">{t('subtitle')}</p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <DashboardSidebar locale={locale} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Stats */}
            <DashboardStats />

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="bg-white rounded-xl border border-border p-4 hover:shadow-md transition-shadow group"
                  >
                    <div
                      className={`w-10 h-10 rounded-lg ${action.color} text-white flex items-center justify-center mb-3`}
                    >
                      <Icon size={20} />
                    </div>
                    <p className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors">
                      {action.label}
                    </p>
                  </Link>
                );
              })}
            </div>

            {/* Upcoming Appointments */}
            {upcomingAppointments.length > 0 && (
              <div className="bg-white rounded-xl border border-border overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <h3 className="font-semibold text-gray-900">
                    {t('upcomingAppointments')}
                  </h3>
                  <Link
                    href="/dashboard/appointments"
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    {t('viewAll')}
                    <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="divide-y divide-border">
                  {upcomingAppointments.slice(0, 3).map((apt) => (
                    <div
                      key={apt.id}
                      className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={apt.propertyImage}
                          alt={apt.propertyTitle}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {apt.propertyTitle}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(apt.date).toLocaleDateString()} at {apt.time}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          apt.status === 'confirmed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recently Viewed */}
            <RecentlyViewed limit={5} />

            {/* Saved Properties Preview */}
            {favorites.length > 0 && (
              <div className="bg-white rounded-xl border border-border overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <h3 className="font-semibold text-gray-900">
                    {t('savedProperties')}
                  </h3>
                  <Link
                    href="/dashboard/favorites"
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    {t('viewAll')}
                    <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockProperties
                    .filter((p) => favorites.includes(p.id))
                    .slice(0, 2)
                    .map((property) => (
                      <Link
                        key={property.id}
                        href={`/properties/${property.id}`}
                        className="flex gap-3 p-3 rounded-lg border border-border hover:shadow-md transition-shadow"
                      >
                        <div className="w-20 h-16 rounded overflow-hidden flex-shrink-0">
                          <img
                            src={property.image}
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">
                            {property.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {property.location}
                          </p>
                          <p className="text-sm font-semibold text-accent-gold mt-1">
                            {property.price}
                          </p>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {favorites.length === 0 &&
              upcomingAppointments.length === 0 && (
                <div className="bg-gradient-to-r from-primary to-primary-dark rounded-xl p-8 text-center text-white">
                  <Home size={48} className="mx-auto mb-4 opacity-80" />
                  <h3 className="text-xl font-semibold mb-2">
                    {t('getStarted')}
                  </h3>
                  <p className="text-white/70 mb-6 max-w-md mx-auto">
                    {t('getStartedDesc')}
                  </p>
                  <Link href="/properties">
                    <Button variant="secondary" size="lg">
                      {t('exploreProperties')}
                    </Button>
                  </Link>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

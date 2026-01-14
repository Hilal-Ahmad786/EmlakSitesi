'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { DashboardSidebar } from '@/components/features/dashboard/DashboardSidebar';
import { useSavedSearches, SavedSearch } from '@/context/SavedSearchContext';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/Button';
import {
  Search,
  Trash2,
  Bell,
  BellOff,
  ExternalLink,
  MoreVertical,
  Calendar,
  MapPin,
  Home,
  DollarSign,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SavedSearchesPage() {
  const t = useTranslations('Dashboard');
  const { savedSearches, deleteSearch, toggleAlert } = useSavedSearches();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const locale = 'en';

  const formatFilters = (search: SavedSearch) => {
    const parts: string[] = [];

    if (search.filters.location) {
      parts.push(search.filters.location);
    }
    if (search.filters.propertyType) {
      parts.push(search.filters.propertyType);
    }
    if (search.filters.minPrice || search.filters.maxPrice) {
      const min = search.filters.minPrice
        ? `€${(search.filters.minPrice / 1000).toFixed(0)}k`
        : '€0';
      const max = search.filters.maxPrice
        ? `€${(search.filters.maxPrice / 1000).toFixed(0)}k`
        : 'No max';
      parts.push(`${min} - ${max}`);
    }
    if (search.filters.minBeds) {
      parts.push(`${search.filters.minBeds}+ beds`);
    }

    return parts.length > 0 ? parts.join(' • ') : 'All properties';
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Header */}
      <div className="bg-primary-dark text-white py-12 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-3xl md:text-4xl mb-2">
            {t('searches.title')}
          </h1>
          <p className="text-gray-300">{t('searches.subtitle')}</p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <DashboardSidebar locale={locale} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Searches List */}
            {savedSearches.length > 0 ? (
              <div className="space-y-4">
                {savedSearches.map((search) => (
                  <div
                    key={search.id}
                    className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900 text-lg">
                              {search.name}
                            </h3>
                            {search.alertEnabled && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                                <Bell size={10} />
                                {search.alertFrequency}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-500 text-sm mb-4">
                            {formatFilters(search)}
                          </p>

                          {/* Filter Tags */}
                          <div className="flex flex-wrap gap-2">
                            {search.filters.location && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                <MapPin size={12} />
                                {search.filters.location}
                              </span>
                            )}
                            {search.filters.propertyType && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                <Home size={12} />
                                {search.filters.propertyType}
                              </span>
                            )}
                            {(search.filters.minPrice ||
                              search.filters.maxPrice) && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                <DollarSign size={12} />
                                Price range
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="relative">
                          <button
                            onClick={() =>
                              setOpenMenuId(
                                openMenuId === search.id ? null : search.id
                              )
                            }
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
                          >
                            <MoreVertical size={18} />
                          </button>

                          {openMenuId === search.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-border py-1 z-10">
                              <button
                                onClick={() => {
                                  toggleAlert(search.id);
                                  setOpenMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                {search.alertEnabled ? (
                                  <>
                                    <BellOff size={16} />
                                    Disable alerts
                                  </>
                                ) : (
                                  <>
                                    <Bell size={16} />
                                    Enable alerts
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => {
                                  deleteSearch(search.id);
                                  setOpenMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <Trash2 size={16} />
                                Delete search
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-t border-border">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar size={12} />
                        Created {new Date(search.createdAt).toLocaleDateString()}
                      </span>
                      <Link
                        href={`/properties?search=${search.id}`}
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        View results
                        <ExternalLink size={14} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-xl border border-border p-12 text-center">
                <Search size={64} className="mx-auto text-gray-300 mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t('searches.empty')}
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  {t('searches.emptyDesc')}
                </p>
                <Link href="/properties">
                  <Button size="lg">{t('searches.startSearching')}</Button>
                </Link>
              </div>
            )}

            {/* Tip Card */}
            <div className="bg-gradient-to-r from-primary/5 to-accent-gold/5 rounded-xl border border-primary/20 p-6">
              <h4 className="font-semibold text-gray-900 mb-2">
                {t('searches.tip')}
              </h4>
              <p className="text-sm text-gray-600">
                {t('searches.tipDesc')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

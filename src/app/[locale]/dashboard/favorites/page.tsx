'use client';

import { useTranslations } from 'next-intl';
import { DashboardSidebar } from '@/components/features/dashboard/DashboardSidebar';
import { PropertyCard } from '@/components/ui/PropertyCard';
import { useFavorites } from '@/context/FavoritesContext';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/Button';
import { Heart, Trash2 } from 'lucide-react';

// Mock properties - in production, fetch from API based on favorite IDs
const allProperties = [
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
    isNew: true,
    isFeatured: true,
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
    isNew: true,
  },
  {
    id: '3',
    title: 'Modern Apartment in Nişantaşı',
    location: 'Nişantaşı, Istanbul',
    price: '€1,200,000',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2700&auto=format&fit=crop',
    beds: 2,
    baths: 2,
    size: 120,
    type: 'sale' as const,
  },
  {
    id: '4',
    title: 'Seaside Villa in Sarıyer',
    location: 'Sarıyer, Istanbul',
    price: '€4,500,000',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2700&auto=format&fit=crop',
    beds: 5,
    baths: 4,
    size: 350,
    type: 'sale' as const,
    isFeatured: true,
  },
  {
    id: '5',
    title: 'Renovated Historic Apartment',
    location: 'Cihangir, Istanbul',
    price: '€850,000',
    image: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?q=80&w=2700&auto=format&fit=crop',
    beds: 2,
    baths: 1,
    size: 95,
    type: 'sale' as const,
  },
  {
    id: '6',
    title: 'Exclusive Bosphorus View Residence',
    location: 'Arnavutköy, Istanbul',
    price: '€3,200,000',
    image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=2700&auto=format&fit=crop',
    beds: 4,
    baths: 3,
    size: 220,
    type: 'sale' as const,
    isFeatured: true,
  },
];

export default function FavoritesPage() {
  const t = useTranslations('Dashboard');
  const { favorites, toggleFavorite } = useFavorites();
  const locale = 'en';

  const savedProperties = allProperties.filter((p) =>
    favorites.includes(p.id)
  );

  const handleClearAll = () => {
    favorites.forEach((id) => toggleFavorite(id));
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Header */}
      <div className="bg-primary-dark text-white py-12 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-3xl md:text-4xl mb-2">
            {t('favorites.title')}
          </h1>
          <p className="text-gray-300">{t('favorites.subtitle')}</p>
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
            {/* Header */}
            {savedProperties.length > 0 && (
              <div className="flex items-center justify-between">
                <p className="text-gray-600">
                  {t('favorites.count', { count: savedProperties.length })}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={16} className="mr-2" />
                  {t('favorites.clearAll')}
                </Button>
              </div>
            )}

            {/* Properties Grid */}
            {savedProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {savedProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-xl border border-border p-12 text-center">
                <Heart size={64} className="mx-auto text-gray-300 mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t('favorites.empty')}
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  {t('favorites.emptyDesc')}
                </p>
                <Link href="/properties">
                  <Button size="lg">{t('favorites.browseProperties')}</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

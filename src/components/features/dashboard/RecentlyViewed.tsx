'use client';

import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Clock, X, Trash2, MapPin, Bed, Bath, Ruler } from 'lucide-react';
import { useRecentlyViewed, ViewedProperty } from '@/context/RecentlyViewedContext';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface RecentlyViewedProps {
  limit?: number;
  showClearAll?: boolean;
}

export function RecentlyViewed({ limit, showClearAll = true }: RecentlyViewedProps) {
  const t = useTranslations('Dashboard');
  const { recentlyViewed, removeFromRecentlyViewed, clearRecentlyViewed } =
    useRecentlyViewed();

  const displayItems = limit ? recentlyViewed.slice(0, limit) : recentlyViewed;

  if (recentlyViewed.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-border p-8 text-center">
        <Clock size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t('noRecentlyViewed')}
        </h3>
        <p className="text-gray-500 mb-4">{t('noRecentlyViewedDesc')}</p>
        <Link href="/properties">
          <Button>{t('browseProperties')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Clock size={20} className="text-gray-400" />
          <h3 className="font-semibold text-gray-900">{t('recentlyViewed')}</h3>
          <span className="text-sm text-gray-500">({recentlyViewed.length})</span>
        </div>
        {showClearAll && recentlyViewed.length > 0 && (
          <button
            onClick={clearRecentlyViewed}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            <Trash2 size={14} />
            {t('clearAll')}
          </button>
        )}
      </div>

      {/* List */}
      <div className="divide-y divide-border">
        {displayItems.map((property) => (
          <RecentlyViewedItem
            key={property.id}
            property={property}
            onRemove={() => removeFromRecentlyViewed(property.id)}
          />
        ))}
      </div>

      {/* View All Link */}
      {limit && recentlyViewed.length > limit && (
        <div className="p-4 border-t border-border bg-gray-50">
          <Link
            href="/dashboard"
            className="text-sm text-primary hover:underline font-medium"
          >
            {t('viewAll', { count: recentlyViewed.length })}
          </Link>
        </div>
      )}
    </div>
  );
}

interface RecentlyViewedItemProps {
  property: ViewedProperty;
  onRemove: () => void;
}

function RecentlyViewedItem({ property, onRemove }: RecentlyViewedItemProps) {
  const t = useTranslations('Dashboard');

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return t('justNow');
    if (diffInSeconds < 3600)
      return t('minutesAgo', { count: Math.floor(diffInSeconds / 60) });
    if (diffInSeconds < 86400)
      return t('hoursAgo', { count: Math.floor(diffInSeconds / 3600) });
    return t('daysAgo', { count: Math.floor(diffInSeconds / 86400) });
  };

  return (
    <div className="flex gap-4 p-4 hover:bg-gray-50 transition-colors group">
      {/* Image */}
      <Link
        href={`/properties/${property.id}`}
        className="relative w-24 h-20 rounded-lg overflow-hidden flex-shrink-0"
      >
        <Image
          src={property.image}
          alt={property.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-1 left-1">
          <span
            className={cn(
              'px-1.5 py-0.5 text-[10px] font-semibold rounded uppercase',
              property.type === 'sale'
                ? 'bg-primary text-white'
                : 'bg-accent-gold text-white'
            )}
          >
            {property.type === 'sale' ? 'Sale' : 'Rent'}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/properties/${property.id}`}
          className="block hover:text-primary transition-colors"
        >
          <h4 className="font-medium text-gray-900 truncate">{property.title}</h4>
        </Link>
        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
          <MapPin size={12} />
          {property.location}
        </p>
        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Bed size={12} />
            {property.beds}
          </span>
          <span className="flex items-center gap-1">
            <Bath size={12} />
            {property.baths}
          </span>
          <span className="flex items-center gap-1">
            <Ruler size={12} />
            {property.size} m²
          </span>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={(e) => {
            e.preventDefault();
            onRemove();
          }}
          className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all rounded"
        >
          <X size={16} />
        </button>
        <div className="text-right">
          <p className="font-semibold text-accent-gold">{property.price}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {timeAgo(property.viewedAt)}
          </p>
        </div>
      </div>
    </div>
  );
}

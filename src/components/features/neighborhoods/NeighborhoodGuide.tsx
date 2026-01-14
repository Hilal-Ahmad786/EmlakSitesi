'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  GraduationCap,
  Utensils,
  Bus,
  TreePine,
  Stethoscope,
  ShoppingBag,
  Dumbbell,
  Coffee,
  MapPin,
  ChevronDown,
  ChevronUp,
  Star,
  Clock,
  TrendingUp,
  Home,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Amenity {
  id: string;
  name: string;
  type: string;
  distance: string;
  rating?: number;
  walkTime?: string;
}

interface NeighborhoodData {
  walkabilityScore: number;
  transitScore: number;
  safetyScore: number;
  averagePrice: number;
  priceChange: number;
  amenities: {
    schools: Amenity[];
    restaurants: Amenity[];
    transport: Amenity[];
    parks: Amenity[];
    healthcare: Amenity[];
    shopping: Amenity[];
    fitness: Amenity[];
  };
}

interface NeighborhoodGuideProps {
  neighborhoodName: string;
  data: NeighborhoodData;
  className?: string;
}

const categoryIcons = {
  schools: GraduationCap,
  restaurants: Utensils,
  transport: Bus,
  parks: TreePine,
  healthcare: Stethoscope,
  shopping: ShoppingBag,
  fitness: Dumbbell,
};

const categoryColors = {
  schools: 'bg-blue-100 text-blue-600',
  restaurants: 'bg-orange-100 text-orange-600',
  transport: 'bg-green-100 text-green-600',
  parks: 'bg-emerald-100 text-emerald-600',
  healthcare: 'bg-red-100 text-red-600',
  shopping: 'bg-purple-100 text-purple-600',
  fitness: 'bg-pink-100 text-pink-600',
};

function ScoreMeter({
  score,
  label,
  description,
}: {
  score: number;
  label: string;
  description: string;
}) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Walker's Paradise";
    if (score >= 70) return 'Very Walkable';
    if (score >= 50) return 'Somewhat Walkable';
    if (score >= 25) return 'Car-Dependent';
    return 'Almost All Errands Require a Car';
  };

  return (
    <div className="bg-white rounded-xl border border-border p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className={cn('text-2xl font-bold', getScoreColor(score))}>
          {score}
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
        <div
          className={cn('h-full rounded-full transition-all', {
            'bg-green-500': score >= 80,
            'bg-yellow-500': score >= 60 && score < 80,
            'bg-orange-500': score >= 40 && score < 60,
            'bg-red-500': score < 40,
          })}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="text-xs text-gray-500">{description || getScoreLabel(score)}</p>
    </div>
  );
}

function AmenityCard({ amenity }: { amenity: Amenity }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 text-sm truncate">
          {amenity.name}
        </p>
        <p className="text-xs text-gray-500">{amenity.type}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <MapPin size={10} />
          {amenity.distance}
        </div>
        {amenity.walkTime && (
          <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
            <Clock size={10} />
            {amenity.walkTime}
          </div>
        )}
      </div>
      {amenity.rating && (
        <div className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
          <Star size={10} className="fill-yellow-500" />
          {amenity.rating}
        </div>
      )}
    </div>
  );
}

export function NeighborhoodGuide({
  neighborhoodName,
  data,
  className,
}: NeighborhoodGuideProps) {
  const t = useTranslations('Neighborhood');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(
    'restaurants'
  );

  const categories = [
    { id: 'schools', label: t('categories.schools') },
    { id: 'restaurants', label: t('categories.restaurants') },
    { id: 'transport', label: t('categories.transport') },
    { id: 'parks', label: t('categories.parks') },
    { id: 'healthcare', label: t('categories.healthcare') },
    { id: 'shopping', label: t('categories.shopping') },
    { id: 'fitness', label: t('categories.fitness') },
  ];

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `€${(price / 1000000).toFixed(1)}M`;
    }
    return `€${(price / 1000).toFixed(0)}K`;
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl text-primary">
            {t('guideTitle', { name: neighborhoodName })}
          </h2>
          <p className="text-gray-500 text-sm mt-1">{t('guideSubtitle')}</p>
        </div>
      </div>

      {/* Scores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ScoreMeter
          score={data.walkabilityScore}
          label={t('walkability')}
          description={t('walkabilityDesc')}
        />
        <ScoreMeter
          score={data.transitScore}
          label={t('transit')}
          description={t('transitDesc')}
        />
        <ScoreMeter
          score={data.safetyScore}
          label={t('safety')}
          description={t('safetyDesc')}
        />
      </div>

      {/* Market Stats */}
      <div className="bg-gradient-to-r from-primary/5 to-accent-gold/5 rounded-xl border border-primary/10 p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Home size={20} className="text-primary" />
          {t('marketStats')}
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">{t('avgPrice')}</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatPrice(data.averagePrice)}
            </p>
            <p className="text-xs text-gray-400">{t('perSqm')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">{t('priceChange')}</p>
            <div className="flex items-center gap-2">
              <p
                className={cn(
                  'text-2xl font-bold',
                  data.priceChange >= 0 ? 'text-green-600' : 'text-red-600'
                )}
              >
                {data.priceChange >= 0 ? '+' : ''}
                {data.priceChange}%
              </p>
              <TrendingUp
                size={20}
                className={cn(
                  data.priceChange >= 0 ? 'text-green-600' : 'text-red-600 rotate-180'
                )}
              />
            </div>
            <p className="text-xs text-gray-400">{t('yearOverYear')}</p>
          </div>
        </div>
      </div>

      {/* Amenities by Category */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <h3 className="font-semibold text-gray-900 p-4 border-b border-border">
          {t('nearbyAmenities')}
        </h3>

        <div className="divide-y divide-border">
          {categories.map((category) => {
            const Icon =
              categoryIcons[category.id as keyof typeof categoryIcons];
            const colorClass =
              categoryColors[category.id as keyof typeof categoryColors];
            const amenities =
              data.amenities[category.id as keyof typeof data.amenities] || [];
            const isExpanded = expandedCategory === category.id;

            return (
              <div key={category.id}>
                <button
                  onClick={() =>
                    setExpandedCategory(isExpanded ? null : category.id)
                  }
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center',
                        colorClass
                      )}
                    >
                      <Icon size={20} />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">
                        {category.label}
                      </p>
                      <p className="text-sm text-gray-500">
                        {t('amenityCount', { count: amenities.length })}
                      </p>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp size={20} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-400" />
                  )}
                </button>

                {isExpanded && amenities.length > 0 && (
                  <div className="px-4 pb-4 space-y-2">
                    {amenities.map((amenity) => (
                      <AmenityCard key={amenity.id} amenity={amenity} />
                    ))}
                  </div>
                )}

                {isExpanded && amenities.length === 0 && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-gray-500 text-center py-4">
                      {t('noAmenities')}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Lifestyle Description */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Coffee size={20} className="text-accent-gold" />
          {t('lifestyle')}
        </h3>
        <p className="text-gray-600 leading-relaxed">{t('lifestyleDesc')}</p>
      </div>
    </div>
  );
}

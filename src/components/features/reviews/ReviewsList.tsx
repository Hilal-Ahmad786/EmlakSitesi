'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown, Star } from 'lucide-react';
import { ReviewCard, Review } from './ReviewCard';
import { StarRating } from './StarRating';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface ReviewsListProps {
  reviews: Review[];
  showSummary?: boolean;
  showFilters?: boolean;
  className?: string;
}

export function ReviewsList({
  reviews,
  showSummary = true,
  showFilters = true,
  className,
}: ReviewsListProps) {
  const t = useTranslations('Reviews');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'rating' | 'helpful'>('recent');
  const [showAll, setShowAll] = useState(false);

  // Calculate summary stats
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => Math.floor(r.rating) === rating).length,
    percentage:
      totalReviews > 0
        ? (reviews.filter((r) => Math.floor(r.rating) === rating).length /
            totalReviews) *
          100
        : 0,
  }));

  // Filter and sort reviews
  let filteredReviews = filterRating
    ? reviews.filter((r) => Math.floor(r.rating) === filterRating)
    : reviews;

  filteredReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'helpful':
        return (b.helpful || 0) - (a.helpful || 0);
      case 'recent':
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  const displayedReviews = showAll
    ? filteredReviews
    : filteredReviews.slice(0, 5);

  if (reviews.length === 0) {
    return (
      <div className={cn('text-center py-12', className)}>
        <Star size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t('noReviews')}
        </h3>
        <p className="text-gray-500">{t('beFirst')}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Summary Section */}
      {showSummary && (
        <div className="bg-white rounded-xl border border-border p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Overall Rating */}
            <div className="text-center md:text-left md:border-r md:border-border md:pr-6">
              <p className="text-5xl font-bold text-gray-900">
                {averageRating.toFixed(1)}
              </p>
              <StarRating rating={averageRating} size="lg" className="mt-2 justify-center md:justify-start" />
              <p className="text-sm text-gray-500 mt-2">
                {t('basedOn', { count: totalReviews })}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="flex-1">
              {ratingDistribution.map((item) => (
                <button
                  key={item.rating}
                  onClick={() =>
                    setFilterRating(
                      filterRating === item.rating ? null : item.rating
                    )
                  }
                  className={cn(
                    'flex items-center gap-3 w-full py-1 rounded transition-colors',
                    filterRating === item.rating
                      ? 'bg-primary/5'
                      : 'hover:bg-gray-50'
                  )}
                >
                  <span className="text-sm text-gray-600 w-8">
                    {item.rating}★
                  </span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full transition-all"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-8">
                    {item.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {filterRating
              ? t('showingRating', { rating: filterRating, count: filteredReviews.length })
              : t('showingAll', { count: filteredReviews.length })}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">{t('sortBy')}</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="recent">{t('mostRecent')}</option>
              <option value="rating">{t('highestRating')}</option>
              <option value="helpful">{t('mostHelpful')}</option>
            </select>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {displayedReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Show More Button */}
      {filteredReviews.length > 5 && !showAll && (
        <div className="text-center mt-6">
          <Button
            variant="outline"
            onClick={() => setShowAll(true)}
            className="min-w-[200px]"
          >
            {t('showMore', { count: filteredReviews.length - 5 })}
            <ChevronDown size={16} className="ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}

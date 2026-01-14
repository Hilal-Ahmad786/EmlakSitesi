'use client';

import { useTranslations } from 'next-intl';
import { Quote, ThumbsUp, Calendar } from 'lucide-react';
import { StarRating } from './StarRating';
import { cn } from '@/lib/utils';

export interface Review {
  id: string;
  author: {
    name: string;
    avatar?: string;
    location?: string;
  };
  rating: number;
  title?: string;
  content: string;
  date: string;
  helpful?: number;
  verified?: boolean;
}

interface ReviewCardProps {
  review: Review;
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
}

export function ReviewCard({ review, variant = 'default', className }: ReviewCardProps) {
  const t = useTranslations('Reviews');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (variant === 'compact') {
    return (
      <div className={cn('bg-white p-4 rounded-lg border border-border', className)}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
            {review.author.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 text-sm truncate">
              {review.author.name}
            </p>
            <StarRating rating={review.rating} size="sm" />
          </div>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">{review.content}</p>
      </div>
    );
  }

  if (variant === 'featured') {
    return (
      <div
        className={cn(
          'bg-gradient-to-br from-primary/5 to-accent-gold/5 p-8 rounded-xl border border-primary/10',
          className
        )}
      >
        <Quote size={32} className="text-primary/20 mb-4" />
        <p className="text-lg text-gray-700 italic leading-relaxed mb-6">
          &quot;{review.content}&quot;
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {review.author.avatar ? (
              <img
                src={review.author.avatar}
                alt={review.author.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                {review.author.name.charAt(0)}
              </div>
            )}
            <div>
              <p className="font-semibold text-gray-900">{review.author.name}</p>
              {review.author.location && (
                <p className="text-sm text-gray-500">{review.author.location}</p>
              )}
            </div>
          </div>
          <StarRating rating={review.rating} size="lg" />
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn('bg-white p-6 rounded-xl border border-border', className)}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {review.author.avatar ? (
            <img
              src={review.author.avatar}
              alt={review.author.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
              {review.author.name.charAt(0)}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-gray-900">{review.author.name}</p>
              {review.verified && (
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  {t('verified')}
                </span>
              )}
            </div>
            {review.author.location && (
              <p className="text-sm text-gray-500">{review.author.location}</p>
            )}
          </div>
        </div>
        <StarRating rating={review.rating} />
      </div>

      {/* Content */}
      {review.title && (
        <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
      )}
      <p className="text-gray-600 leading-relaxed">{review.content}</p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <Calendar size={14} />
          {formatDate(review.date)}
        </div>
        {review.helpful !== undefined && (
          <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary transition-colors">
            <ThumbsUp size={14} />
            {t('helpful', { count: review.helpful })}
          </button>
        )}
      </div>
    </div>
  );
}

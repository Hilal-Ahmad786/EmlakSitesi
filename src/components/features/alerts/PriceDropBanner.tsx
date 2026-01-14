'use client';

import { TrendingDown, Bell, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PriceDropBannerProps {
  propertyId: string;
  originalPrice: number;
  currentPrice: number;
  currency?: string;
  onDismiss?: () => void;
  className?: string;
}

function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export function PriceDropBanner({
  propertyId,
  originalPrice,
  currentPrice,
  currency = 'EUR',
  onDismiss,
  className,
}: PriceDropBannerProps) {
  const priceDrop = originalPrice - currentPrice;
  const percentageDrop = ((priceDrop / originalPrice) * 100).toFixed(0);

  if (currentPrice >= originalPrice) return null;

  return (
    <div
      className={cn(
        'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
          <TrendingDown size={20} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-green-800">
            Price Reduced by {percentageDrop}%!
          </p>
          <p className="text-sm text-green-600">
            <span className="line-through text-gray-400">
              {formatPrice(originalPrice, currency)}
            </span>
            {' → '}
            <span className="font-medium">{formatPrice(currentPrice, currency)}</span>
            <span className="ml-2 text-green-700">
              (Save {formatPrice(priceDrop, currency)})
            </span>
          </p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 text-green-600 hover:text-green-800 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

interface PriceDropBadgeProps {
  percentageDrop: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PriceDropBadge({ percentageDrop, size = 'md', className }: PriceDropBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 bg-green-500 text-white font-medium rounded-full',
        sizeClasses[size],
        className
      )}
    >
      <TrendingDown size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} />
      {percentageDrop}% OFF
    </span>
  );
}

interface PriceAlertButtonProps {
  propertyId: string;
  isSubscribed?: boolean;
  onSubscribe?: () => void;
  onUnsubscribe?: () => void;
  className?: string;
}

export function PriceAlertButton({
  propertyId,
  isSubscribed = false,
  onSubscribe,
  onUnsubscribe,
  className,
}: PriceAlertButtonProps) {
  const handleClick = () => {
    if (isSubscribed) {
      onUnsubscribe?.();
    } else {
      onSubscribe?.();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
        isSubscribed
          ? 'bg-primary/10 text-primary'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        className
      )}
    >
      <Bell size={18} className={isSubscribed ? 'fill-current' : ''} />
      <span className="text-sm font-medium">
        {isSubscribed ? 'Alert Set' : 'Get Price Alerts'}
      </span>
    </button>
  );
}

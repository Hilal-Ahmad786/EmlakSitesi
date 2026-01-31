'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Star, MapPin, Bed, Bath, Square, ChevronRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

// We reuse the transformed property type or a similar shape
interface FeaturedProperty {
  id: string;
  title: string;
  location: string;
  price: string; // The service returns formatted string, but we might want raw if we reformat. Service returns formatted.
  rawPrice?: number; // Optional if we want to pass it
  currency?: string;
  bedrooms: number;
  bathrooms: number;
  size: number;
  images: string[];
  description?: string;
  featuredUntil?: string; // Optional
}

interface PropertyOfTheWeekProps {
  className?: string;
  property?: FeaturedProperty | null;
}

export function PropertyOfTheWeek({ className, property }: PropertyOfTheWeekProps) {
  const t = useTranslations('PropertyOfTheWeek');

  if (!property) return null;

  // We can default to a date if featuredUntil is missing, or hide countdown
  // For demo, let's keep the countdown effect using a dynamic date
  const [featuredUntil] = useState(() => {
    return property.featuredUntil || new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();
  });

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0 });

  function getTimeRemaining(endDate: string): { days: number; hours: number; minutes: number } {
    const total = new Date(endDate).getTime() - Date.now();
    return {
      days: Math.max(0, Math.floor(total / (1000 * 60 * 60 * 24))),
      hours: Math.max(0, Math.floor((total / (1000 * 60 * 60)) % 24)),
      minutes: Math.max(0, Math.floor((total / (1000 * 60)) % 60)),
    };
  }

  // Set mounted state and initial time on client only (avoids hydration mismatch)
  useEffect(() => {
    setIsMounted(true);
    setTimeRemaining(getTimeRemaining(featuredUntil));
  }, [featuredUntil]);

  // Update countdown every minute
  useEffect(() => {
    if (!isMounted) return;

    const timer = setInterval(() => {
      setTimeRemaining(getTimeRemaining(featuredUntil));
    }, 60000);

    return () => clearInterval(timer);
  }, [featuredUntil, isMounted]);

  // Auto-rotate images
  useEffect(() => {
    if (!property.images || property.images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [property.images?.length]);

  const images = property.images && property.images.length > 0 ? property.images : ['/images/placeholder-property.jpg'];

  return (
    <section className={cn('py-16 bg-gradient-to-b from-gray-50 to-white', className)}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-accent-gold mb-2">
              <Star size={20} className="fill-current" />
              <span className="font-medium">{t('badge')}</span>
            </div>
            <h2 className="text-3xl font-serif text-primary">{t('title')}</h2>
          </div>

          {/* Countdown */}
          <div className="hidden md:flex items-center gap-4 bg-primary/5 rounded-lg px-6 py-3">
            <Clock size={20} className="text-primary" />
            <div className="flex items-center gap-3">
              <div className="text-center">
                <span className="text-2xl font-bold text-primary">{timeRemaining.days}</span>
                <p className="text-xs text-gray-500">{t('countdown.days')}</p>
              </div>
              <span className="text-primary">:</span>
              <div className="text-center">
                <span className="text-2xl font-bold text-primary">{timeRemaining.hours}</span>
                <p className="text-xs text-gray-500">{t('countdown.hours')}</p>
              </div>
              <span className="text-primary">:</span>
              <div className="text-center">
                <span className="text-2xl font-bold text-primary">{timeRemaining.minutes}</span>
                <p className="text-xs text-gray-500">{t('countdown.mins')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Property Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image Gallery */}
            <div className="relative h-80 lg:h-auto">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={cn(
                    'absolute inset-0 transition-opacity duration-500',
                    index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                  )}
                >
                  <img
                    src={image}
                    alt={`${property.title} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}

              {/* Featured Badge */}
              <div className="absolute top-4 left-4 px-4 py-2 bg-accent-gold text-white font-medium rounded-full flex items-center gap-2">
                <Star size={16} className="fill-current" />
                {t('title')}
              </div>

              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={cn(
                      'w-2 h-2 rounded-full transition-all',
                      index === currentImageIndex
                        ? 'bg-white w-8'
                        : 'bg-white/50 hover:bg-white/75'
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-2xl font-serif text-primary mb-2">
                    {property.title}
                  </h3>
                  <div className="flex items-center gap-1 text-gray-500">
                    <MapPin size={16} />
                    <span>{property.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">
                    {property.price}
                  </p>
                </div>
              </div>

              <p className="text-gray-600 mb-6 line-clamp-3">{property.description || t('noDescription')}</p>

              {/* Property Features */}
              <div className="flex items-center gap-6 py-6 border-y border-gray-100">
                <div className="flex items-center gap-2">
                  <Bed size={20} className="text-primary" />
                  <span className="font-medium">{property.bedrooms}</span>
                  <span className="text-gray-500 text-sm">{t('features.beds')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath size={20} className="text-primary" />
                  <span className="font-medium">{property.bathrooms}</span>
                  <span className="text-gray-500 text-sm">{t('features.baths')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Square size={20} className="text-primary" />
                  <span className="font-medium">{property.size}</span>
                  <span className="text-gray-500 text-sm">m²</span>
                </div>
              </div>

              {/* CTA */}
              <div className="flex items-center gap-4 mt-6">
                <Link
                  href={`/properties/${property.id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
                >
                  {t('viewProperty')}
                  <ChevronRight size={18} />
                </Link>
                <Link
                  href="/contact"
                  className="flex-1 flex items-center justify-center px-6 py-3 border border-primary text-primary font-medium rounded-lg hover:bg-primary/5 transition-colors"
                >
                  {t('scheduleViewing')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

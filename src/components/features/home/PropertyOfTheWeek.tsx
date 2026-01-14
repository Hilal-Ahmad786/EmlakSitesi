'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, MapPin, Bed, Bath, Square, ChevronRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeaturedProperty {
  id: string;
  title: string;
  location: string;
  price: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  size: number;
  images: string[];
  description: string;
  featuredUntil: string;
}

// Mock featured property
const mockFeaturedProperty: FeaturedProperty = {
  id: 'featured-1',
  title: 'Exclusive Bosphorus Waterfront Villa',
  location: 'Bebek, Istanbul',
  price: 5500000,
  currency: 'EUR',
  bedrooms: 6,
  bathrooms: 5,
  size: 650,
  images: [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
  ],
  description: 'A rare opportunity to own this magnificent waterfront villa with breathtaking Bosphorus views. Features include private dock, infinity pool, and landscaped gardens.',
  featuredUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
};

function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

function getTimeRemaining(endDate: string): { days: number; hours: number; minutes: number } {
  const total = new Date(endDate).getTime() - Date.now();
  return {
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / (1000 * 60)) % 60),
  };
}

interface PropertyOfTheWeekProps {
  className?: string;
}

export function PropertyOfTheWeek({ className }: PropertyOfTheWeekProps) {
  const [property] = useState<FeaturedProperty>(mockFeaturedProperty);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining(property.featuredUntil));

  // Update countdown every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(getTimeRemaining(property.featuredUntil));
    }, 60000);

    return () => clearInterval(timer);
  }, [property.featuredUntil]);

  // Auto-rotate images
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [property.images.length]);

  return (
    <section className={cn('py-16 bg-gradient-to-b from-gray-50 to-white', className)}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-accent-gold mb-2">
              <Star size={20} className="fill-current" />
              <span className="font-medium">Featured Property</span>
            </div>
            <h2 className="text-3xl font-serif text-primary">Property of the Week</h2>
          </div>

          {/* Countdown */}
          <div className="hidden md:flex items-center gap-4 bg-primary/5 rounded-lg px-6 py-3">
            <Clock size={20} className="text-primary" />
            <div className="flex items-center gap-3">
              <div className="text-center">
                <span className="text-2xl font-bold text-primary">{timeRemaining.days}</span>
                <p className="text-xs text-gray-500">Days</p>
              </div>
              <span className="text-primary">:</span>
              <div className="text-center">
                <span className="text-2xl font-bold text-primary">{timeRemaining.hours}</span>
                <p className="text-xs text-gray-500">Hours</p>
              </div>
              <span className="text-primary">:</span>
              <div className="text-center">
                <span className="text-2xl font-bold text-primary">{timeRemaining.minutes}</span>
                <p className="text-xs text-gray-500">Mins</p>
              </div>
            </div>
          </div>
        </div>

        {/* Property Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image Gallery */}
            <div className="relative h-80 lg:h-auto">
              {property.images.map((image, index) => (
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
                Property of the Week
              </div>

              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {property.images.map((_, index) => (
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
                    {formatPrice(property.price, property.currency)}
                  </p>
                </div>
              </div>

              <p className="text-gray-600 mb-6">{property.description}</p>

              {/* Property Features */}
              <div className="flex items-center gap-6 py-6 border-y border-gray-100">
                <div className="flex items-center gap-2">
                  <Bed size={20} className="text-primary" />
                  <span className="font-medium">{property.bedrooms}</span>
                  <span className="text-gray-500 text-sm">Beds</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath size={20} className="text-primary" />
                  <span className="font-medium">{property.bathrooms}</span>
                  <span className="text-gray-500 text-sm">Baths</span>
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
                  View Property
                  <ChevronRight size={18} />
                </Link>
                <Link
                  href="/contact"
                  className="flex-1 flex items-center justify-center px-6 py-3 border border-primary text-primary font-medium rounded-lg hover:bg-primary/5 transition-colors"
                >
                  Schedule Viewing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

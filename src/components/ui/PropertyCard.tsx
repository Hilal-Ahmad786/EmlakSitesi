'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useCurrency } from '@/context/CurrencyContext';
import { FavoriteButton } from '@/components/features/tools/FavoriteButton';
import { CompareButton } from '@/components/features/tools/CompareButton';
import { Bed, Bath, Ruler, MapPin, ArrowRight } from 'lucide-react';

interface PropertyCardProps {
    property: {
        id: string;
        title: string;
        location: string;
        price: string;
        image: string;
        beds: number;
        baths: number;
        size: number;
        type: 'sale' | 'rent';
        isNew?: boolean;
        isFeatured?: boolean;
    };
}

export function PropertyCard({ property }: PropertyCardProps) {
    const t = useTranslations('LatestProperties.badges');
    const { formatPrice } = useCurrency();

    // Parse price string to number (removing non-numeric chars)
    const priceValue = parseInt(property.price.replace(/[^0-9]/g, ''));

    return (
        <Link
            href={`/properties/${property.id}`}
            className="group bg-white rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 border border-border/30 hover:border-accent-gold/30 block"
        >
            {/* Image Container */}
            <div className="relative h-64 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${property.image})` }}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Gold accent line on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-10" />

                {/* Action buttons */}
                <div
                    className="absolute top-4 right-4 z-10 flex flex-col gap-2"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                >
                    <FavoriteButton propertyId={property.id} />
                    <CompareButton propertyId={property.id} />
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="bg-primary/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider">
                        {t(property.type)}
                    </span>
                    {property.isNew && (
                        <span className="bg-accent-gold text-white text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider">
                            {t('new')}
                        </span>
                    )}
                </div>

                {/* Price on image */}
                <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white font-serif text-2xl font-medium drop-shadow-lg">
                        {formatPrice(priceValue)}
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Location with icon */}
                <p className="text-accent-gold text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                    <MapPin size={12} />
                    {property.location}
                </p>

                {/* Title */}
                <h3 className="font-serif text-xl text-primary mb-4 line-clamp-2 group-hover:text-accent-gold transition-colors duration-300">
                    {property.title}
                </h3>

                {/* Features with gold-tinted icons */}
                <div className="flex items-center gap-6 text-text-secondary text-sm pt-4 border-t border-border/50">
                    <div className="flex items-center gap-1.5">
                        <Bed size={16} className="text-accent-gold/70" />
                        <span>{property.beds}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Bath size={16} className="text-accent-gold/70" />
                        <span>{property.baths}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Ruler size={16} className="text-accent-gold/70" />
                        <span>{property.size} m²</span>
                    </div>

                    {/* View arrow on hover */}
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ArrowRight size={18} className="text-accent-gold" />
                    </div>
                </div>
            </div>
        </Link>
    );
}

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useCurrency } from '@/context/CurrencyContext';
import { FavoriteButton } from '@/components/features/tools/FavoriteButton';
import { CompareButton } from '@/components/features/tools/CompareButton';
import { Bed, Bath, Ruler, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';

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
            className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-border/50 block"
        >
            {/* Image Container */}
            <div className="relative h-64 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${property.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

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

                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {t(property.type)}
                    </span>
                    {property.isNew && (
                        <span className="bg-accent-gold text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            {t('new')}
                        </span>
                    )}
                </div>

                {/* Price Overlay (Mobile/Compact) */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded text-primary font-bold md:hidden">
                    {formatPrice(priceValue)}
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <p className="text-accent-gold text-sm font-medium uppercase tracking-wide">
                        {property.location}
                    </p>
                    <p className="text-xl font-bold text-primary hidden md:block">
                        {formatPrice(priceValue)}
                    </p>
                </div>

                <h3 className="font-serif text-xl text-primary mb-4 line-clamp-2 group-hover:text-accent-gold transition-colors">
                    {property.title}
                </h3>

                {/* Features */}
                <div className="flex items-center gap-4 text-text-secondary text-sm mb-6 border-t border-border pt-4">
                    <div className="flex items-center gap-1">
                        <Bed size={16} />
                        <span>{property.beds}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Bath size={16} />
                        <span>{property.baths}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Ruler size={16} />
                        <span>{property.size} m²</span>
                    </div>
                </div>

                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                    View Details
                </Button>
            </div>
        </Link>
    );
}

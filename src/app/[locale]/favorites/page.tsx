'use client';

import { useTranslations } from 'next-intl';
import { useFavorites } from '@/context/FavoritesContext';
import { PropertyCard } from '@/components/ui/PropertyCard';
import { Button } from '@/components/ui/Button';
import { Link } from '@/i18n/routing';
import { Heart } from 'lucide-react';

// Mock Data (Ideally this would come from an API based on IDs)
const allProperties = [
    {
        id: '1',
        title: 'Historic Yalı Mansion on the Bosphorus',
        location: 'Bebek, Istanbul',
        price: '€12,500,000',
        image: 'https://images.unsplash.com/photo-1600596542815-2495db969cf7?q=80&w=2675&auto=format&fit=crop',
        beds: 6,
        baths: 5,
        size: 450,
        type: 'sale' as const,
        isNew: true,
        isFeatured: true
    },
    {
        id: '2',
        title: 'Luxury Penthouse with Galata View',
        location: 'Galata, Istanbul',
        price: '€2,850,000',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2670&auto=format&fit=crop',
        beds: 3,
        baths: 2,
        size: 180,
        type: 'sale' as const,
        isNew: true
    },
    {
        id: '3',
        title: 'Modern Apartment in Nişantaşı',
        location: 'Nişantaşı, Istanbul',
        price: '€1,200,000',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2670&auto=format&fit=crop',
        beds: 2,
        baths: 2,
        size: 120,
        type: 'sale' as const
    },
    {
        id: '4',
        title: 'Seaside Villa in Sarıyer',
        location: 'Sarıyer, Istanbul',
        price: '€4,500,000',
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2653&auto=format&fit=crop',
        beds: 5,
        baths: 4,
        size: 350,
        type: 'sale' as const
    },
    {
        id: '5',
        title: 'Renovated Historic Apartment',
        location: 'Cihangir, Istanbul',
        price: '€850,000',
        image: 'https://images.unsplash.com/photo-1502005229762-cf1e2da0c542?q=80&w=2700&auto=format&fit=crop',
        beds: 2,
        baths: 1,
        size: 95,
        type: 'sale' as const
    },
    {
        id: '6',
        title: 'Exclusive Bosphorus View Residence',
        location: 'Arnavutköy, Istanbul',
        price: '€3,200,000',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2700&auto=format&fit=crop',
        beds: 4,
        baths: 3,
        size: 220,
        type: 'sale' as const,
        isFeatured: true
    }
];

export default function FavoritesPage() {
    const t = useTranslations('Tools.favorites');
    const { favorites } = useFavorites();

    const savedProperties = allProperties.filter(p => favorites.includes(p.id));

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="bg-primary-dark text-white py-12 mb-12">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-white/10 rounded-full">
                            <Heart size={24} className="text-accent-gold" />
                        </div>
                        <h1 className="font-serif text-3xl md:text-4xl">{t('title')}</h1>
                    </div>
                    <p className="text-gray-300 text-lg">{t('subtitle')}</p>
                </div>
            </div>

            <div className="container mx-auto px-4">
                {savedProperties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {savedProperties.map((property) => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-lg border border-border">
                        <div className="w-16 h-16 bg-background-alt rounded-full flex items-center justify-center mx-auto mb-4 text-text-secondary">
                            <Heart size={32} />
                        </div>
                        <h3 className="font-serif text-xl text-primary mb-2">{t('empty')}</h3>
                        <p className="text-text-secondary mb-6">
                            Start exploring our properties and save your favorites here.
                        </p>
                        <Link href="/properties">
                            <Button>{t('browse')}</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

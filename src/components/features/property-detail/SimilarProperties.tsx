'use client';

import { useTranslations } from 'next-intl';
import { PropertyCard } from '@/components/ui/PropertyCard';

// Mock Data (Ideally fetched based on current property tags/location)
const similarProperties = [
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

export function SimilarProperties() {
    const t = useTranslations('PropertyDetail');

    return (
        <div className="mt-20 border-t border-border pt-12">
            <h2 className="font-serif text-3xl text-primary mb-8">{t('similar')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {similarProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                ))}
            </div>
        </div>
    );
}

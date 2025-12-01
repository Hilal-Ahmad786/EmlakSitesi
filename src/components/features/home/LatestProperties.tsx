'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { PropertyCard } from '@/components/ui/PropertyCard';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

// Mock Data
const properties = [
    {
        id: '1',
        title: 'Historic Yalı Mansion on the Bosphorus',
        location: 'Bebek, Istanbul',
        price: '€12,500,000',
        image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?q=80&w=2675&auto=format&fit=crop',
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
        image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?q=80&w=2670&auto=format&fit=crop',
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
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2670&auto=format&fit=crop',
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
        image: 'https://images.unsplash.com/photo-1622587853578-dd1bf9608d26?q=80&w=2653&auto=format&fit=crop',
        beds: 5,
        baths: 4,
        size: 350,
        type: 'sale' as const
    }
];

export function LatestProperties() {
    const t = useTranslations('LatestProperties');

    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="font-serif text-3xl md:text-4xl text-primary mb-2">
                            {t('title')}
                        </h2>
                        <div className="h-1 w-20 bg-accent-gold" />
                    </div>

                    <Link href="/properties" className="hidden md:block">
                        <Button variant="ghost" className="gap-2 group">
                            {t('viewAll')}
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {properties.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <Link href="/properties">
                        <Button variant="outline" className="w-full">
                            {t('viewAll')}
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}

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
        title: '7 Storey Historical Building in Pera',
        location: 'Pera, Istanbul',
        price: '€2,500,000',
        image: '/images/home/property-1.jpg',
        beds: 7,
        baths: 5,
        size: 450,
        type: 'sale' as const,
        isNew: true,
        isFeatured: true
    },
    {
        id: '2',
        title: '6 Storey Historical Atlas Apartments',
        location: 'Asmalımescit, Istanbul',
        price: '€6,500,000',
        image: '/images/home/property-2.jpg',
        beds: 12,
        baths: 10,
        size: 800,
        type: 'sale' as const,
        isNew: true
    },
    {
        id: '3',
        title: '3+1 Apartment in Historical Pamuk Apt',
        location: 'Nişantaşı, Istanbul',
        price: '€1,300,000',
        image: '/images/home/property-3.jpg',
        beds: 3,
        baths: 2,
        size: 140,
        type: 'sale' as const
    },
    {
        id: '4',
        title: 'Historical Building with Bosphorus View',
        location: 'Galata, Istanbul',
        price: '€3,500,000',
        image: '/images/home/property-4.jpg',
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

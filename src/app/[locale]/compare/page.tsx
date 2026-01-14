'use client';

import { useTranslations } from 'next-intl';
import { useCompare } from '@/context/CompareContext';
import { Button } from '@/components/ui/Button';
import { Link } from '@/i18n/routing';
import { ArrowRightLeft } from 'lucide-react';
import { ComparisonTable } from '@/components/features/compare/ComparisonTable';

// Mock Data (Ideally this would come from an API based on IDs)
const allProperties = [
    {
        id: '1',
        title: 'Historic Yalı Mansion on the Bosphorus',
        location: 'Bebek, Istanbul',
        price: '€12,500,000',
        priceValue: 12500000,
        image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2675&auto=format&fit=crop',
        beds: 6,
        baths: 5,
        size: 450,
        type: 'sale' as const,
        propertyType: 'Mansion',
        yearBuilt: 1905,
        parking: 4,
        amenities: ['pool', 'garden', 'security']
    },
    {
        id: '2',
        title: 'Luxury Penthouse with Galata View',
        location: 'Galata, Istanbul',
        price: '€2,850,000',
        priceValue: 2850000,
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2670&auto=format&fit=crop',
        beds: 3,
        baths: 2,
        size: 180,
        type: 'sale' as const,
        propertyType: 'Penthouse',
        yearBuilt: 2020,
        parking: 2,
        amenities: ['gym', 'security']
    },
    {
        id: '3',
        title: 'Modern Apartment in Nişantaşı',
        location: 'Nişantaşı, Istanbul',
        price: '€1,200,000',
        priceValue: 1200000,
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2670&auto=format&fit=crop',
        beds: 2,
        baths: 2,
        size: 120,
        type: 'sale' as const,
        propertyType: 'Apartment',
        yearBuilt: 2018,
        parking: 1,
        amenities: ['gym', 'security']
    },
    {
        id: '4',
        title: 'Seaside Villa in Sarıyer',
        location: 'Sarıyer, Istanbul',
        price: '€4,500,000',
        priceValue: 4500000,
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2653&auto=format&fit=crop',
        beds: 5,
        baths: 4,
        size: 350,
        type: 'sale' as const,
        propertyType: 'Villa',
        yearBuilt: 2015,
        parking: 3,
        amenities: ['pool', 'garden', 'security']
    },
    {
        id: '5',
        title: 'Renovated Historic Apartment',
        location: 'Cihangir, Istanbul',
        price: '€850,000',
        priceValue: 850000,
        image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=2660&auto=format&fit=crop',
        beds: 2,
        baths: 1,
        size: 95,
        type: 'sale' as const,
        propertyType: 'Apartment',
        yearBuilt: 1920,
        parking: 0,
        amenities: []
    },
    {
        id: '6',
        title: 'Exclusive Bosphorus View Residence',
        location: 'Arnavutköy, Istanbul',
        price: '€3,200,000',
        priceValue: 3200000,
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2700&auto=format&fit=crop',
        beds: 4,
        baths: 3,
        size: 220,
        type: 'sale' as const,
        propertyType: 'Residence',
        yearBuilt: 2019,
        parking: 2,
        amenities: ['pool', 'gym', 'garden', 'security']
    }
];

export default function ComparePage() {
    const t = useTranslations('Tools.compare');
    const { compareList } = useCompare();

    const selectedProperties = allProperties.filter(p => compareList.includes(p.id));

    if (selectedProperties.length === 0) {
        return (
            <div className="min-h-screen bg-background pb-20">
                <div className="bg-primary-dark text-white py-12 mb-12">
                    <div className="container mx-auto px-4">
                        <h1 className="font-serif text-3xl md:text-4xl mb-4">{t('title')}</h1>
                        <p className="text-gray-300 text-lg max-w-2xl">{t('subtitle')}</p>
                    </div>
                </div>
                <div className="container mx-auto px-4 text-center py-20">
                    <div className="w-16 h-16 bg-background-alt rounded-full flex items-center justify-center mx-auto mb-4 text-text-secondary">
                        <ArrowRightLeft size={32} />
                    </div>
                    <h3 className="font-serif text-xl text-primary mb-2">{t('empty')}</h3>
                    <p className="text-text-secondary mb-6">
                        Select properties to compare their features side by side.
                    </p>
                    <Link href="/properties">
                        <Button>{t('add')}</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="bg-primary-dark text-white py-12 mb-12">
                <div className="container mx-auto px-4">
                    <h1 className="font-serif text-3xl md:text-4xl mb-4">{t('title')}</h1>
                    <p className="text-gray-300 text-lg max-w-2xl">{t('subtitle')}</p>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <ComparisonTable properties={selectedProperties} />
            </div>
        </div>
    );
}

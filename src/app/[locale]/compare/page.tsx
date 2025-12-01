'use client';

import { useTranslations } from 'next-intl';
import { useCompare } from '@/context/CompareContext';
import { useCurrency } from '@/context/CurrencyContext';
import { Button } from '@/components/ui/Button';
import { Link } from '@/i18n/routing';
import { ArrowRightLeft, Check, X, Bed, Bath, Ruler, MapPin } from 'lucide-react';

// Mock Data (Ideally this would come from an API based on IDs)
const allProperties = [
    {
        id: '1',
        title: 'Historic Yalı Mansion on the Bosphorus',
        location: 'Bebek, Istanbul',
        price: 12500000,
        image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2675&auto=format&fit=crop',
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
        price: 2850000,
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
        price: 1200000,
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
        price: 4500000,
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
        price: 850000,
        image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=2660&auto=format&fit=crop',
        beds: 2,
        baths: 1,
        size: 95,
        type: 'sale' as const
    },
    {
        id: '6',
        title: 'Exclusive Bosphorus View Residence',
        location: 'Arnavutköy, Istanbul',
        price: 3200000,
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2700&auto=format&fit=crop',
        beds: 4,
        baths: 3,
        size: 220,
        type: 'sale' as const,
        isFeatured: true
    }
];

export default function ComparePage() {
    const t = useTranslations('Tools.compare');
    const { compareList, removeFromCompare } = useCompare();
    const { formatPrice } = useCurrency();

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

            <div className="container mx-auto px-4 overflow-x-auto">
                <div className="min-w-[800px]">
                    <div className="grid grid-cols-4 gap-4 border-b border-border pb-4 mb-4">
                        <div className="font-bold text-primary p-4">Features</div>
                        {selectedProperties.map(property => (
                            <div key={property.id} className="relative">
                                <button
                                    onClick={() => removeFromCompare(property.id)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                >
                                    <X size={14} />
                                </button>
                                <div
                                    className="h-48 w-full bg-cover bg-center rounded-lg mb-4"
                                    style={{ backgroundImage: `url(${property.image})` }}
                                />
                                <h3 className="font-bold text-primary mb-1">{property.title}</h3>
                                <p className="text-accent-gold font-bold">{formatPrice(property.price)}</p>
                            </div>
                        ))}
                        {/* Fill empty slots */}
                        {[...Array(3 - selectedProperties.length)].map((_, i) => (
                            <div key={`empty-${i}`} className="bg-background-alt rounded-lg flex items-center justify-center border-2 border-dashed border-border h-full min-h-[300px]">
                                <Link href="/properties">
                                    <Button variant="outline">{t('add')}</Button>
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* Comparison Rows */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-4 gap-4 p-4 bg-white rounded-lg shadow-sm">
                            <div className="font-medium text-text-secondary flex items-center gap-2">
                                <MapPin size={18} /> {t('features.location')}
                            </div>
                            {selectedProperties.map(property => (
                                <div key={property.id} className="text-primary">{property.location}</div>
                            ))}
                        </div>

                        <div className="grid grid-cols-4 gap-4 p-4 bg-white rounded-lg shadow-sm">
                            <div className="font-medium text-text-secondary flex items-center gap-2">
                                <Bed size={18} /> {t('features.beds')}
                            </div>
                            {selectedProperties.map(property => (
                                <div key={property.id} className="text-primary">{property.beds}</div>
                            ))}
                        </div>

                        <div className="grid grid-cols-4 gap-4 p-4 bg-white rounded-lg shadow-sm">
                            <div className="font-medium text-text-secondary flex items-center gap-2">
                                <Bath size={18} /> {t('features.baths')}
                            </div>
                            {selectedProperties.map(property => (
                                <div key={property.id} className="text-primary">{property.baths}</div>
                            ))}
                        </div>

                        <div className="grid grid-cols-4 gap-4 p-4 bg-white rounded-lg shadow-sm">
                            <div className="font-medium text-text-secondary flex items-center gap-2">
                                <Ruler size={18} /> {t('features.size')}
                            </div>
                            {selectedProperties.map(property => (
                                <div key={property.id} className="text-primary">{property.size} m²</div>
                            ))}
                        </div>

                        <div className="grid grid-cols-4 gap-4 p-4 bg-white rounded-lg shadow-sm">
                            <div className="font-medium text-text-secondary">
                                {t('features.type')}
                            </div>
                            {selectedProperties.map(property => (
                                <div key={property.id} className="text-primary capitalize">{property.type}</div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

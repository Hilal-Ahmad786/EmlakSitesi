'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { FilterSidebar } from '@/components/features/properties/FilterSidebar';
import { PropertyGrid } from '@/components/features/properties/PropertyGrid';
import { Button } from '@/components/ui/Button';
import { LayoutGrid, Map as MapIcon } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamic import for MapView to avoid SSR issues
const MapView = dynamic(() => import('@/components/features/properties/MapView'), {
    ssr: false,
    loading: () => <div className="h-[600px] w-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">Loading Map...</div>
});

// Mock Data with Coordinates
const properties = [
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
        isFeatured: true,
        lat: 41.0766,
        lng: 29.0433
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
        isNew: true,
        lat: 41.0256,
        lng: 28.9744
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
        type: 'sale' as const,
        lat: 41.0522,
        lng: 28.9922
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
        type: 'sale' as const,
        lat: 41.1667,
        lng: 29.0500
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
        type: 'sale' as const,
        lat: 41.0311,
        lng: 28.9833
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
        isFeatured: true,
        lat: 41.0681,
        lng: 29.0431
    }
];

export default function PropertiesPage() {
    const t = useTranslations('Search.filters');
    const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="bg-primary-dark text-white py-12 mb-8">
                <div className="container mx-auto px-4">
                    <h1 className="font-serif text-3xl md:text-4xl mb-4">Properties</h1>
                    <p className="text-gray-300 max-w-2xl">
                        Discover our curated selection of luxury properties in Istanbul&apos;s most prestigious neighborhoods.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Filters */}
                    <div className="lg:col-span-1">
                        <FilterSidebar />
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {/* View Toggle */}
                        <div className="flex justify-end mb-6 gap-2">
                            <Button
                                variant={viewMode === 'grid' ? 'primary' : 'outline'}
                                size="sm"
                                onClick={() => setViewMode('grid')}
                                className="flex items-center gap-2"
                            >
                                <LayoutGrid size={16} />
                                {t('view.grid')}
                            </Button>
                            <Button
                                variant={viewMode === 'map' ? 'primary' : 'outline'}
                                size="sm"
                                onClick={() => setViewMode('map')}
                                className="flex items-center gap-2"
                            >
                                <MapIcon size={16} />
                                {t('view.map')}
                            </Button>
                        </div>

                        {viewMode === 'grid' ? (
                            <PropertyGrid properties={properties} />
                        ) : (
                            <MapView properties={properties} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

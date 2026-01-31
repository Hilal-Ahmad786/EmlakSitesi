'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { FilterSidebar } from '@/components/features/properties/FilterSidebar';
import { PropertyGrid } from '@/components/features/properties/PropertyGrid';
import { Button } from '@/components/ui/Button';
import { LayoutGrid, Map as MapIcon } from 'lucide-react';
import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('@/components/features/properties/MapView'), {
    ssr: false,
    loading: () => <div className="h-[600px] w-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">Loading Map...</div>
});

interface PropertyContentProps {
    initialProperties: any[]; // We can refine this type if shared
}

export function PropertyContent({ initialProperties }: PropertyContentProps) {
    const t = useTranslations('Search.filters');
    const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
    const [properties] = useState(initialProperties);

    return (
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
    );
}

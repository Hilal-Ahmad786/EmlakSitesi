'use client';

import { PropertyCard } from '@/components/ui/PropertyCard';

interface Property {
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
    lat?: number;
    lng?: number;
}

interface PropertyGridProps {
    properties?: Property[];
}

export function PropertyGrid({ properties = [] }: PropertyGridProps) {
    if (!properties || properties.length === 0) {
        return <div className="text-center py-10 text-gray-500">No properties found.</div>;
    }
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
            ))}
        </div>
    );
}

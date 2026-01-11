'use client';

import { useTranslations } from 'next-intl';
import { ImageGallery } from '@/components/features/property-detail/ImageGallery';
import { PropertyInfo } from '@/components/features/property-detail/PropertyInfo';

import { MortgageCalculator } from '@/components/features/tools/MortgageCalculator';
import { SimilarProperties } from '@/components/features/property-detail/SimilarProperties';
import { ShareButtons } from '@/components/features/property-detail/ShareButtons';
import { PropertyVideo } from '@/components/features/property-detail/PropertyVideo';
import { MapPin } from 'lucide-react';

// Mock Data
const property = {
    id: '1',
    title: 'Historic Yalı Mansion on the Bosphorus',
    location: 'Bebek, Istanbul',
    price: '€12,500,000',
    images: [
        'https://images.unsplash.com/photo-1527838832700-5059252407fa?q=80&w=2675&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2653&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2670&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2574&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2574&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=2670&auto=format&fit=crop'
    ],
    specs: {
        beds: 6,
        baths: 5,
        size: 450,
        type: 'Mansion',
        status: 'For Sale',
        built: 1905
    },
    description: `Experience the epitome of Istanbul luxury in this breathtaking historic Yalı mansion located directly on the Bosphorus waterfront in the prestigious Bebek neighborhood. 

  Originally built in 1905 and meticulously restored, this property seamlessly blends Ottoman architectural heritage with modern amenities. The mansion features high ceilings, original woodwork, and panoramic views of the Bosphorus from almost every room.
  
  The property includes a private dock, a lush garden sanctuary, and separate staff quarters. It represents a rare opportunity to own a piece of Istanbul's history while enjoying a lifestyle of unparalleled elegance.`,
    features: [
        'Direct Bosphorus Access',
        'Private Dock',
        'Historic Architecture',
        'Smart Home System',
        'Private Garden',
        'Staff Quarters',
        'Security System',
        'Underfloor Heating',
        'Central Air Conditioning',
        'Parking for 4 Cars'
    ]
};

export default function PropertyDetailPage() {
    const t = useTranslations('PropertyDetail');

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-4">
                        <div>
                            <h1 className="font-serif text-3xl md:text-4xl text-primary mb-2">
                                {property.title}
                            </h1>
                            <div className="flex items-center gap-2 text-text-secondary">
                                <MapPin size={18} />
                                <span>{property.location}</span>
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-primary">
                            {property.price}
                        </div>
                    </div>
                </div>

                {/* Gallery */}
                <div className="mb-12">
                    <ImageGallery images={property.images} />
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Info */}
                    <div className="lg:col-span-2">
                        <PropertyInfo
                            specs={property.specs}
                            features={property.features}
                            description={property.description}
                        />

                        <PropertyVideo
                            videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ" // Mock URL
                            coverImage={property.images[0]}
                        />

                        <ShareButtons title={property.title} />
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-8">
                        <MortgageCalculator propertyPrice={12500000} />

                    </div>
                </div>

                {/* Similar Properties */}
                <SimilarProperties />
            </div>
        </div>
    );
}

'use client';

import { useTranslations } from 'next-intl';
import { PropertyGrid } from '@/components/features/properties/PropertyGrid';
import { NeighborhoodGuide } from '@/components/features/neighborhoods/NeighborhoodGuide';
import { MapPin, Coffee, School, TreePine } from 'lucide-react';

// Mock Data
const neighborhoodData = {
    name: 'Bebek',
    description: `Bebek is one of Istanbul's most affluent and picturesque neighborhoods, located on the European shores of the Bosphorus. Known for its deep, sheltered bay and sweeping views, it has been a favorite retreat for the Ottoman aristocracy for centuries.

  Today, Bebek retains its exclusive atmosphere with a vibrant social scene. The waterfront promenade is lined with high-end cafes, restaurants, and boutiques, making it a popular destination for locals and visitors alike. The neighborhood offers a perfect blend of historic charm and modern luxury living.`,
    highlights: [
        { icon: Coffee, title: 'Lifestyle', desc: 'Trendy cafes and fine dining' },
        { icon: School, title: 'Education', desc: 'Prestigious international schools' },
        { icon: TreePine, title: 'Nature', desc: 'Bebek Park and waterfront promenade' },
        { icon: MapPin, title: 'Location', desc: 'Prime Bosphorus location' }
    ],
    image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?q=80&w=2598&auto=format&fit=crop'
};

// Neighborhood Guide Data
const neighborhoodGuideData = {
    walkabilityScore: 85,
    transitScore: 78,
    safetyScore: 92,
    averagePrice: 15000,
    priceChange: 12.5,
    amenities: {
        schools: [
            { id: '1', name: 'Robert College', type: 'International School', distance: '1.2 km', rating: 4.9, walkTime: '15 min' },
            { id: '2', name: 'Boğaziçi University', type: 'University', distance: '0.8 km', rating: 4.8, walkTime: '10 min' },
        ],
        restaurants: [
            { id: '1', name: 'Bebek Balıkçı', type: 'Seafood Restaurant', distance: '200 m', rating: 4.7, walkTime: '3 min' },
            { id: '2', name: 'Mangerie Bebek', type: 'International Cuisine', distance: '150 m', rating: 4.6, walkTime: '2 min' },
            { id: '3', name: 'Bebek Kahve', type: 'Café', distance: '100 m', rating: 4.5, walkTime: '1 min' },
        ],
        transport: [
            { id: '1', name: 'Bebek Bus Stop', type: 'Bus Station', distance: '100 m', walkTime: '1 min' },
            { id: '2', name: 'Bebek Ferry Terminal', type: 'Ferry Pier', distance: '300 m', walkTime: '4 min' },
        ],
        parks: [
            { id: '1', name: 'Bebek Park', type: 'Public Park', distance: '50 m', rating: 4.6, walkTime: '1 min' },
            { id: '2', name: 'Bebek Sahili', type: 'Waterfront Promenade', distance: '100 m', rating: 4.8, walkTime: '1 min' },
        ],
        healthcare: [
            { id: '1', name: 'Acıbadem Hospital', type: 'Private Hospital', distance: '2.5 km', rating: 4.7 },
            { id: '2', name: 'Bebek Medical Center', type: 'Clinic', distance: '400 m', walkTime: '5 min' },
        ],
        shopping: [
            { id: '1', name: 'Bebek Shops', type: 'Boutiques', distance: '100 m', walkTime: '1 min' },
            { id: '2', name: 'Akmerkez Mall', type: 'Shopping Mall', distance: '3 km' },
        ],
        fitness: [
            { id: '1', name: 'Bebek Gym', type: 'Fitness Center', distance: '300 m', rating: 4.4, walkTime: '4 min' },
            { id: '2', name: 'Bebek Running Track', type: 'Outdoor Fitness', distance: '200 m', walkTime: '3 min' },
        ],
    }
};

export default function NeighborhoodDetailPage({ params }: { params: { slug: string } }) {
    const t = useTranslations('Neighborhoods.detail');

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Hero */}
            <div className="relative h-[60vh] min-h-[400px]">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${neighborhoodData.image})` }}
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <h1 className="font-serif text-5xl md:text-7xl text-white font-light">
                        {neighborhoodData.name}
                    </h1>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-20 relative z-10">
                <div className="bg-white rounded-lg shadow-xl p-8 md:p-12 mb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2">
                            <h2 className="font-serif text-3xl text-primary mb-6">
                                {t('about', { name: neighborhoodData.name })}
                            </h2>
                            <div className="prose prose-lg text-text-secondary whitespace-pre-line">
                                {neighborhoodData.description}
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <h3 className="font-serif text-xl text-primary mb-6">
                                {t('highlights')}
                            </h3>
                            <div className="space-y-6">
                                {neighborhoodData.highlights.map((item, index) => (
                                    <div key={index} className="flex items-start gap-4">
                                        <div className="p-3 bg-background-alt rounded-full text-accent-gold">
                                            <item.icon size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-primary">{item.title}</h4>
                                            <p className="text-sm text-text-secondary">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Neighborhood Guide */}
                <div className="mb-12">
                    <NeighborhoodGuide neighborhoodName={neighborhoodData.name} data={neighborhoodGuideData} />
                </div>

                {/* Properties */}
                <div className="mb-12">
                    <h2 className="font-serif text-3xl text-primary mb-8 text-center">
                        {t('properties', { name: neighborhoodData.name })}
                    </h2>
                    <PropertyGrid properties={[
                        {
                            id: '1',
                            title: 'Historic Yalı Mansion on the Bosphorus',
                            location: 'Bebek, Istanbul',
                            price: '€12,500,000',
                            image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2675&auto=format&fit=crop',
                            beds: 6,
                            baths: 5,
                            size: 450,
                            type: 'sale' as const,
                            isNew: true,
                            isFeatured: true
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
                    ]} />
                </div>
            </div>
        </div>
    );
}

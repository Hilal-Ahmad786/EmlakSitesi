'use client';

import { useTranslations } from 'next-intl';
import { PropertyGrid } from '@/components/features/properties/PropertyGrid';
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

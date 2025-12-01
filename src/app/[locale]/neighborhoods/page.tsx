'use client';

import { useTranslations } from 'next-intl';
import { NeighborhoodCard } from '@/components/features/neighborhoods/NeighborhoodCard';

const neighborhoods = [
    {
        id: '1',
        name: 'Bebek',
        slug: 'bebek',
        description: 'The crown jewel of the Bosphorus, known for its historic mansions, trendy cafes, and vibrant promenade.',
        image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?q=80&w=2598&auto=format&fit=crop'
    },
    {
        id: '2',
        name: 'Galata',
        slug: 'galata',
        description: 'A historic district blending Genoese heritage with modern art, culture, and stunning Golden Horn views.',
        image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?q=80&w=2670&auto=format&fit=crop'
    },
    {
        id: '3',
        name: 'Nişantaşı',
        slug: 'nisantasi',
        description: 'Istanbul\'s fashion and luxury center, home to designer boutiques, fine dining, and elegant apartments.',
        image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=2660&auto=format&fit=crop'
    },
    {
        id: '4',
        name: 'Sarıyer',
        slug: 'sariyer',
        description: 'Where the Bosphorus meets the Black Sea, offering a peaceful retreat with lush nature and seafood restaurants.',
        image: 'https://images.unsplash.com/photo-1622587853578-dd1bf9608d26?q=80&w=2671&auto=format&fit=crop'
    },
    {
        id: '5',
        name: 'Kandilli',
        slug: 'kandilli',
        description: 'A serene Asian-side neighborhood famous for its historic observatory and traditional Bosphorus lifestyle.',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2700&auto=format&fit=crop'
    },
    {
        id: '6',
        name: 'Cihangir',
        slug: 'cihangir',
        description: 'A bohemian enclave popular with artists and expats, featuring antique shops and panoramic city views.',
        image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=2660&auto=format&fit=crop'
    }
];

export default function NeighborhoodsPage() {
    const t = useTranslations('Neighborhoods');

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="bg-primary-dark text-white py-20 mb-12">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="font-serif text-4xl md:text-5xl mb-4">{t('title')}</h1>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">{t('subtitle')}</p>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {neighborhoods.map((neighborhood) => (
                        <NeighborhoodCard key={neighborhood.id} neighborhood={neighborhood} />
                    ))}
                </div>
            </div>
        </div>
    );
}

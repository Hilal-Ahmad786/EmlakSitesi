'use client';

import { Link } from '@/i18n/routing';
import { ArrowRight } from 'lucide-react';

interface NeighborhoodCardProps {
    neighborhood: {
        id: string;
        name: string;
        description: string;
        image: string;
        slug: string;
    };
}

export function NeighborhoodCard({ neighborhood }: NeighborhoodCardProps) {
    return (
        <Link
            href={`/neighborhoods/${neighborhood.slug}`}
            className="group relative h-[400px] rounded-lg overflow-hidden block"
        >
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${neighborhood.image})` }}
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />

            <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <h3 className="font-serif text-3xl text-white mb-2">{neighborhood.name}</h3>
                <p className="text-gray-200 mb-6 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    {neighborhood.description}
                </p>
                <div className="flex items-center gap-2 text-accent-gold font-medium opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-100">
                    Explore Neighborhood <ArrowRight size={16} />
                </div>
            </div>
        </Link>
    );
}

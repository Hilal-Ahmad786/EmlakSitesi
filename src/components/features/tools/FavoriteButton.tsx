'use client';

import { useFavorites } from '@/context/FavoritesContext';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MouseEvent } from 'react';

interface FavoriteButtonProps {
    propertyId: string;
    className?: string;
}

export function FavoriteButton({ propertyId, className }: FavoriteButtonProps) {
    const { isFavorite, toggleFavorite } = useFavorites();
    const active = isFavorite(propertyId);

    const handleClick = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(propertyId);
    };

    return (
        <button
            onClick={handleClick}
            className={cn(
                "p-2 rounded-full transition-all duration-300 shadow-sm hover:scale-110",
                active
                    ? "bg-red-50 text-red-500"
                    : "bg-white/90 text-gray-600 hover:text-red-500",
                className
            )}
        >
            <Heart
                size={20}
                className={cn("transition-all", active && "fill-current")}
            />
        </button>
    );
}

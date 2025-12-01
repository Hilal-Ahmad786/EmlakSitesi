'use client';

import { useCompare } from '@/context/CompareContext';
import { ArrowRightLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MouseEvent } from 'react';
import { useTranslations } from 'next-intl';

interface CompareButtonProps {
    propertyId: string;
    className?: string;
    showLabel?: boolean;
}

export function CompareButton({ propertyId, className, showLabel = false }: CompareButtonProps) {
    const { isInCompare, addToCompare, removeFromCompare, compareList } = useCompare();
    const t = useTranslations('Tools.compare');
    const active = isInCompare(propertyId);

    const handleClick = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (active) {
            removeFromCompare(propertyId);
        } else {
            if (compareList.length < 3) {
                addToCompare(propertyId);
            } else {
                alert("You can compare up to 3 properties.");
            }
        }
    };

    return (
        <button
            onClick={handleClick}
            className={cn(
                "p-2 rounded-full transition-all duration-300 shadow-sm hover:scale-110 flex items-center gap-2",
                active
                    ? "bg-primary text-white"
                    : "bg-white/90 text-gray-600 hover:text-primary",
                className
            )}
            title={t('add')}
        >
            <ArrowRightLeft size={18} />
            {showLabel && <span className="text-xs font-medium">{active ? t('remove') : t('add')}</span>}
        </button>
    );
}

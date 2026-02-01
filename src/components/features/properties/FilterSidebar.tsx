'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface FilterSidebarProps {
    className?: string;
    isOpen?: boolean;
    onClose?: () => void;
}

export function FilterSidebar({ className, isOpen, onClose }: FilterSidebarProps) {
    const t = useTranslations('Properties.filters');
    const [priceRange, setPriceRange] = useState([0, 5000000]);

    return (
        <div className={cn(
            "bg-white p-6 rounded-lg shadow-sm border border-border h-fit",
            "fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:w-full md:inset-auto md:z-auto",
            isOpen ? "translate-x-0" : "-translate-x-full",
            className
        )}>
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif text-xl text-primary flex items-center gap-2">
                    <SlidersHorizontal size={20} />
                    {t('title')}
                </h3>
                <button onClick={onClose} className="md:hidden text-text-secondary hover:text-primary">
                    <X size={24} />
                </button>
            </div>

            <div className="space-y-6">
                {/* Location */}
                <div>
                    <Select
                        label={t('location')}
                        options={[
                            { value: '', label: t('allLocations') },
                            { value: 'bebek', label: 'Bebek' },
                            { value: 'galata', label: 'Galata' },
                            { value: 'nisantasi', label: 'Nişantaşı' },
                            { value: 'sariyer', label: 'Sarıyer' },
                        ]}
                    />
                </div>

                {/* Property Type */}
                <div>
                    <Select
                        label={t('type')}
                        options={[
                            { value: '', label: t('allTypes') },
                            { value: 'apartment', label: 'Apartment' },
                            { value: 'villa', label: 'Villa' },
                            { value: 'yali', label: 'Yalı' },
                            { value: 'penthouse', label: 'Penthouse' },
                        ]}
                    />
                </div>

                {/* Price Range */}
                <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                        {t('priceRange')}
                    </label>
                    <div className="flex gap-2 items-center">
                        <Input
                            type="number"
                            placeholder={t('min')}
                            className="w-full"
                        />
                        <span className="text-text-secondary">-</span>
                        <Input
                            type="number"
                            placeholder={t('max')}
                            className="w-full"
                        />
                    </div>
                </div>

                {/* Bedrooms */}
                <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                        {t('bedrooms')}
                    </label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, '5+'].map((num) => (
                            <button
                                key={num}
                                className="w-10 h-10 rounded-full border border-border hover:border-primary hover:text-primary transition-colors text-sm font-medium"
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="pt-4 flex flex-col gap-3">
                    <Button className="w-full">
                        {t('apply')}
                    </Button>
                    <Button variant="ghost" className="w-full">
                        {t('reset')}
                    </Button>
                </div>
            </div>
        </div>
    );
}

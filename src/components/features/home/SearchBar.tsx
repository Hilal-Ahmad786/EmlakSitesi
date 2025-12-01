'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SearchBar() {
    const t = useTranslations('Search');
    const [activeTab, setActiveTab] = useState<'buy' | 'rent'>('buy');

    return (
        <div className="relative -mt-8 z-30 container mx-auto px-4">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-5xl mx-auto">
                {/* Tabs */}
                <div className="flex gap-4 mb-6 border-b border-border">
                    <button
                        onClick={() => setActiveTab('buy')}
                        className={cn(
                            "pb-2 text-sm font-medium transition-colors relative",
                            activeTab === 'buy' ? "text-primary" : "text-text-secondary hover:text-primary"
                        )}
                    >
                        {t('tabs.buy')}
                        {activeTab === 'buy' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('rent')}
                        className={cn(
                            "pb-2 text-sm font-medium transition-colors relative",
                            activeTab === 'rent' ? "text-primary" : "text-text-secondary hover:text-primary"
                        )}
                    >
                        {t('tabs.rent')}
                        {activeTab === 'rent' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                        )}
                    </button>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-1">
                        <Input
                            placeholder={t('placeholder')}
                            label={t('filters.location')}
                        />
                    </div>

                    <div className="md:col-span-1">
                        <Select
                            label={t('filters.type')}
                            options={[
                                { value: '', label: 'All Types' },
                                { value: 'apartment', label: 'Apartment' },
                                { value: 'villa', label: 'Villa' },
                                { value: 'yali', label: 'Yalı' },
                            ]}
                        />
                    </div>

                    <div className="md:col-span-1">
                        <Select
                            label={t('filters.price')}
                            options={[
                                { value: '', label: 'Any Price' },
                                { value: '0-500000', label: 'Up to €500k' },
                                { value: '500000-1000000', label: '€500k - €1M' },
                                { value: '1000000+', label: '€1M+' },
                            ]}
                        />
                    </div>

                    <div className="md:col-span-1">
                        <Button className="w-full h-10 gap-2">
                            <Search size={18} />
                            {t('filters.search')}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

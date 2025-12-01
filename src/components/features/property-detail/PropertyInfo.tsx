'use client';

import { useTranslations } from 'next-intl';
import { Bed, Bath, Ruler, Home, Calendar, CheckCircle2 } from 'lucide-react';

interface PropertyInfoProps {
    specs: {
        beds: number;
        baths: number;
        size: number;
        type: string;
        status: string;
        built: number;
    };
    features: string[];
    description: string;
}

export function PropertyInfo({ specs, features, description }: PropertyInfoProps) {
    const t = useTranslations('PropertyDetail');

    const specItems = [
        { label: 'bedrooms', value: specs.beds, icon: Bed },
        { label: 'bathrooms', value: specs.baths, icon: Bath },
        { label: 'size', value: `${specs.size} m²`, icon: Ruler },
        { label: 'type', value: specs.type, icon: Home },
        { label: 'status', value: specs.status, icon: CheckCircle2 },
        { label: 'built', value: specs.built, icon: Calendar },
    ];

    return (
        <div className="space-y-12">
            {/* Specs Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {specItems.map((item) => (
                    <div key={item.label} className="flex items-center gap-3 p-4 bg-background-alt rounded-lg">
                        <item.icon className="text-accent-gold h-6 w-6" />
                        <div>
                            <p className="text-sm text-text-secondary">{t(`specs.${item.label}` as any)}</p>
                            <p className="font-medium text-primary">{item.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Description */}
            <div>
                <h2 className="font-serif text-2xl text-primary mb-4">{t('description')}</h2>
                <div className="prose prose-gray max-w-none">
                    <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                        {description}
                    </p>
                </div>
            </div>

            {/* Features */}
            <div>
                <h2 className="font-serif text-2xl text-primary mb-6">{t('features')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <CheckCircle2 size={18} className="text-accent-gold flex-shrink-0" />
                            <span className="text-text-secondary">{feature}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

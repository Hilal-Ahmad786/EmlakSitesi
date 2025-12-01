'use client';

import { useTranslations } from 'next-intl';
import { TrendingUp, Scale, Building2, Globe } from 'lucide-react';

export default function ServicesPage() {
    const t = useTranslations('Services');

    const services = [
        {
            id: 'consultancy',
            icon: TrendingUp
        },
        {
            id: 'citizenship',
            icon: Globe
        },
        {
            id: 'management',
            icon: Building2
        },
        {
            id: 'legal',
            icon: Scale
        }
    ];

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="bg-primary-dark text-white py-20 mb-12">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="font-serif text-4xl md:text-5xl mb-4">{t('title')}</h1>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">{t('subtitle')}</p>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className="bg-white p-8 rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow"
                        >
                            <div className="w-12 h-12 bg-background-alt rounded-lg flex items-center justify-center text-accent-gold mb-6">
                                <service.icon size={24} />
                            </div>
                            <h3 className="font-serif text-2xl text-primary mb-4">
                                {t(`items.${service.id}.title` as any)}
                            </h3>
                            <p className="text-text-secondary leading-relaxed">
                                {t(`items.${service.id}.desc` as any)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

'use client';

import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export function PromoMosaic() {
    const t = useTranslations('PromoMosaic');

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    {/* Text Content */}
                    <div className="text-center lg:text-left">
                        <span className="text-accent-gold uppercase tracking-widest text-sm font-semibold mb-6 block">
                            MAISON D'ORIENT
                        </span>
                        <h2 className="font-serif text-4xl lg:text-5xl text-primary mb-8 leading-tight">
                            {t('title')}
                        </h2>
                        <div className="w-24 h-px bg-gray-300 mx-auto lg:mx-0 mb-10" />

                        <p className="text-text-secondary text-lg leading-relaxed mb-8">
                            {t('description1')}
                        </p>

                        <p className="text-text-secondary text-lg leading-relaxed mb-10">
                            {t('description2')}
                        </p>

                        <div className="grid grid-cols-1 gap-6 mt-12">
                            <div className="relative h-72 rounded-xl overflow-hidden group cursor-pointer shadow-lg">
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                    style={{ backgroundImage: 'url(/images/home/collection-cihangir.jpg)' }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:via-black/30 transition-all" />
                                <div className="absolute bottom-0 left-0 p-8">
                                    <h3 className="text-white font-serif text-2xl font-medium tracking-wide">{t('sellRent')}</h3>
                                    <div className="mt-4 flex items-center gap-2 text-white/80 group-hover:text-white transition-colors">
                                        <span className="text-sm font-semibold uppercase tracking-wider">{t('moreInfo')}</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Image Grid */}
                    <div className="grid grid-cols-1 gap-8">
                        <div className="relative h-[340px] rounded-xl overflow-hidden group cursor-pointer shadow-lg transform translate-y-8 lg:translate-y-0">
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                style={{ backgroundImage: 'url(/images/home/hero-3.jpg)' }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:via-black/30 transition-all" />
                            <div className="absolute bottom-8 left-8">
                                <h3 className="text-white font-serif text-3xl font-medium tracking-wide mb-2">{t('overseas')}</h3>
                                <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">{t('discoverGlobal')}</p>
                            </div>
                        </div>
                        <div className="relative h-[340px] rounded-xl overflow-hidden group cursor-pointer shadow-lg transform -translate-y-8 lg:-translate-y-0">
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                style={{ backgroundImage: 'url(/images/home/hero-4.jpg)' }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:via-black/30 transition-all" />
                            <div className="absolute bottom-8 left-8">
                                <h3 className="text-white font-serif text-3xl font-medium tracking-wide mb-2">{t('buyRent')}</h3>
                                <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">{t('findDreamHome')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const slides = [
    {
        id: 1,
        image: '/images/home/hero-1.jpg',
    },
    {
        id: 2,
        image: '/images/home/hero-2.jpg',
    },
    {
        id: 3,
        image: '/images/home/hero-3.jpg',
    },
    {
        id: 4,
        image: '/images/home/hero-4.jpg',
    },
    {
        id: 5,
        image: '/images/home/hero-5.jpg',
    }
];

export function HeroSlider() {
    const t = useTranslations('Search');
    const router = useRouter();
    const [currentSlide, setCurrentSlide] = useState(0);

    // Search State
    const [location, setLocation] = useState('');
    const [propertyType, setPropertyType] = useState('');
    const [status, setStatus] = useState('sale'); // Default to sale

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    const handleSearch = () => {
        const params = new URLSearchParams();
        params.append('status', status);
        if (location.trim()) params.append('location', location.trim());
        if (propertyType) params.append('type', propertyType);
        router.push(`/properties?${params.toString()}`);
    };

    return (
        <div className="relative h-[80vh] min-h-[600px] w-full overflow-hidden bg-primary-dark group">
            {/* Slides */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
                    className="absolute inset-0"
                >
                    {/* Gradient Overlay - Lighter for this design to show more image */}
                    <div className="absolute inset-0 bg-black/20 z-10" />

                    {/* Image */}
                    <motion.div
                        initial={{ scale: 1 }}
                        animate={{ scale: 1.05 }}
                        transition={{ duration: 6, ease: "linear" }}
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
                    />
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 text-white/60 hover:text-white hover:bg-black/20 rounded-full transition-all opacity-0 group-hover:opacity-100"
            >
                <ChevronLeft size={40} strokeWidth={1.5} />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 text-white/60 hover:text-white hover:bg-black/20 rounded-full transition-all opacity-0 group-hover:opacity-100"
            >
                <ChevronRight size={40} strokeWidth={1.5} />
            </button>

            {/* Bottom Search Bar */}
            <div className="absolute bottom-0 left-0 right-0 z-30 pb-20 pt-10 px-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="container mx-auto max-w-5xl">
                    <div className="flex flex-col md:flex-row bg-white rounded shadow-2xl overflow-hidden divide-y md:divide-y-0 md:divide-x divide-gray-200">
                        {/* Location (SEMT) */}
                        <div className="flex-1 p-4 bg-white/95">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                                {t('filters.location')}
                            </label>
                            <input
                                type="text"
                                placeholder={t('placeholder')}
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full text-gray-900 placeholder-gray-400 focus:outline-none font-medium"
                            />
                        </div>

                        {/* Type (MULK TIPI) */}
                        <div className="flex-1 p-4 bg-white/95">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                                {t('filters.type')}
                            </label>
                            <select
                                value={propertyType}
                                onChange={(e) => setPropertyType(e.target.value)}
                                className="w-full text-gray-900 focus:outline-none font-medium bg-transparent cursor-pointer"
                            >
                                <option value="">{t('options.all')}</option>
                                <option value="apartment">{t('options.apartment')}</option>
                                <option value="villa">{t('options.villa')}</option>
                                <option value="yali">{t('options.yali')}</option>
                            </select>
                        </div>

                        {/* Status (DURUM) */}
                        <div className="flex-1 p-4 bg-white/95">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                                {t('filters.search')}
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full text-gray-900 focus:outline-none font-medium bg-transparent cursor-pointer"
                            >
                                <option value="sale">{t('options.sale')}</option>
                                <option value="rent">{t('options.rent')}</option>
                            </select>
                        </div>

                        {/* Search Button (ARAMA) */}
                        <button
                            onClick={handleSearch}
                            className="bg-black text-white px-8 py-4 flex items-center justify-center gap-2 hover:bg-accent-gold transition-colors duration-300 font-medium uppercase tracking-wider text-sm whitespace-nowrap"
                        >
                            <Search size={18} />
                            {t('filters.search')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

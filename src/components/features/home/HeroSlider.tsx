'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

const slides = [
    {
        id: 1,
        image: '/images/home/hero-1.jpg',
        title: 'Experience Bosphorus Luxury',
        subtitle: 'Exclusive waterfront mansions in the heart of Istanbul'
    },
    {
        id: 2,
        image: '/images/home/hero-2.jpg',
        title: 'Modern Living in Nisantasi',
        subtitle: 'Contemporary apartments in Istanbul\'s fashion district'
    },
    {
        id: 3,
        image: '/images/home/hero-3.jpg',
        title: 'Historic Charm in Galata',
        subtitle: 'Restored penthouses with panoramic city views'
    },
    {
        id: 4,
        image: '/images/home/hero-4.jpg',
        title: 'Investment Opportunities',
        subtitle: 'Prime real estate with high ROI potential'
    },
    {
        id: 5,
        image: '/images/home/hero-5.jpg',
        title: 'Elite Bosphorus Villas',
        subtitle: 'Private residences with breathtaking sea views'
    }
];

export function HeroSlider() {
    const t = useTranslations('Hero');
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    const scrollToContent = () => {
        window.scrollTo({ top: window.innerHeight - 100, behavior: 'smooth' });
    };

    return (
        <div className="relative h-screen w-full overflow-hidden bg-primary-dark">
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
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/70 via-primary-dark/40 to-primary-dark/80 z-10" />

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

            {/* Content */}
            <div className="absolute inset-0 z-20 flex items-center justify-center text-center px-4">
                <div className="max-w-5xl">
                    {/* Decorative element */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="w-20 h-px bg-accent-gold mx-auto mb-8"
                    />

                    <motion.h1
                        key={`title-${currentSlide}`}
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                        className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6 tracking-tight"
                    >
                        {t(`slides.${slides[currentSlide].id}.title` as any)}
                    </motion.h1>

                    <motion.p
                        key={`subtitle-${currentSlide}`}
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                        className="text-lg md:text-xl lg:text-2xl text-gray-200 mb-10 font-light max-w-2xl mx-auto"
                    >
                        {t(`slides.${slides[currentSlide].id}.subtitle` as any)}
                    </motion.p>

                    <motion.div
                        key={`cta-${currentSlide}`}
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <Link href="/properties">
                            <Button size="lg" variant="secondary" className="min-w-[180px]">
                                {t('cta')}
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button
                                size="lg"
                                variant="outline"
                                className="min-w-[180px] text-white border-white/50 hover:bg-white/10 hover:border-white"
                            >
                                {t('ctaSecondary')}
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 p-3 text-white/40 hover:text-white transition-all duration-300 hover:bg-white/10 rounded-full"
                aria-label="Previous slide"
            >
                <ChevronLeft size={40} strokeWidth={1.5} />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 p-3 text-white/40 hover:text-white transition-all duration-300 hover:bg-white/10 rounded-full"
                aria-label="Next slide"
            >
                <ChevronRight size={40} strokeWidth={1.5} />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className="group relative"
                        aria-label={`Go to slide ${index + 1}`}
                    >
                        <span
                            className={`block h-1 rounded-full transition-all duration-500 ${
                                index === currentSlide
                                    ? 'w-10 bg-accent-gold'
                                    : 'w-3 bg-white/40 group-hover:bg-white/60'
                            }`}
                        />
                    </button>
                ))}
            </div>

            {/* Scroll Indicator */}
            <motion.button
                onClick={scrollToContent}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 text-white/60 hover:text-white transition-colors flex flex-col items-center gap-2 group"
            >
                <span className="text-xs uppercase tracking-widest font-medium">Scroll</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <ChevronDown size={24} className="group-hover:text-accent-gold transition-colors" />
                </motion.div>
            </motion.button>

            {/* Corner Accent */}
            <div className="absolute bottom-0 left-0 w-32 h-32 z-20 pointer-events-none">
                <div className="absolute bottom-8 left-8 w-16 h-px bg-accent-gold/50" />
                <div className="absolute bottom-8 left-8 w-px h-16 bg-accent-gold/50" />
            </div>
            <div className="absolute bottom-0 right-0 w-32 h-32 z-20 pointer-events-none">
                <div className="absolute bottom-8 right-8 w-16 h-px bg-accent-gold/50" />
                <div className="absolute bottom-8 right-8 w-px h-16 bg-accent-gold/50" />
            </div>
        </div>
    );
}

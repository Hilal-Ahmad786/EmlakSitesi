'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Collection {
    id: string;
    title: { en: string; tr: string };
    image: string | null;
    link: string;
    propertyCount: number;
    slug: string;
}

// Fallback collections for when API is not available
const fallbackCollections: Collection[] = [
    {
        id: 'mansions',
        title: { en: 'Waterfront Mansions', tr: 'Su Kenarı Köşkleri' },
        image: '/images/home/collection-mansions.jpg',
        link: '/properties?type=yali',
        propertyCount: 12,
        slug: 'waterfront-mansions'
    },
    {
        id: 'galata',
        title: { en: 'Historic Apartments', tr: 'Tarihi Daireler' },
        image: '/images/home/collection-galata.jpg',
        link: '/properties?view=galata',
        propertyCount: 8,
        slug: 'historic-apartments'
    },
    {
        id: 'bosphorus',
        title: { en: 'Modern Penthouses', tr: 'Modern Çatı Katları' },
        image: '/images/home/collection-bosphorus.jpg',
        link: '/properties?view=bosphorus',
        propertyCount: 15,
        slug: 'modern-penthouses'
    },
    {
        id: 'investment',
        title: { en: 'Investment Properties', tr: 'Yatırımlık Mülkler' },
        image: '/images/home/collection-investment.jpg',
        link: '/properties?type=investment',
        propertyCount: 10,
        slug: 'investment-properties'
    },
    {
        id: 'cihangir',
        title: { en: 'Historic Cihangir Buildings', tr: 'Tarihi Cihangir Binaları' },
        image: '/images/home/collection-cihangir.jpg',
        link: '/properties?view=cihangir',
        propertyCount: 5,
        slug: 'cihangir-buildings'
    },
    {
        id: 'levent',
        title: { en: 'Luxury Levent Villas', tr: 'Lüks Levent Villaları' },
        image: '/images/home/collection-levent.jpg',
        link: '/properties?view=levent',
        propertyCount: 3,
        slug: 'levent-villas'
    }
];

export function FeaturedCollections() {
    const t = useTranslations('FeaturedCollections');
    const locale = useLocale();
    const [collections, setCollections] = useState<Collection[]>(fallbackCollections);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchCollections() {
            try {
                const response = await fetch('/api/collections?limit=10&featured=true');
                if (response.ok) {
                    const data = await response.json();
                    if (data.collections && data.collections.length > 0) {
                        setCollections(data.collections);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch collections:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchCollections();
    }, []);

    const getTitle = (collection: Collection) => {
        if (typeof collection.title === 'object') {
            return collection.title[locale as keyof typeof collection.title] || collection.title.en;
        }
        return collection.title;
    };

    return (
        <section className="py-20 bg-background-alt">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="font-serif text-3xl md:text-4xl text-primary mb-4">
                        {t('title')}
                    </h2>
                    <p className="text-text-secondary text-lg">
                        {t('subtitle')}
                    </p>
                </div>

                <div className="relative px-12">
                    {/* Navigation Buttons */}
                    <button
                        className="collections-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-white rounded-full shadow-lg text-primary hover:text-accent-gold hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Previous"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        className="collections-next absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-white rounded-full shadow-lg text-primary hover:text-accent-gold hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Next"
                    >
                        <ChevronRight size={24} />
                    </button>

                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={24}
                        slidesPerView={1}
                        navigation={{
                            prevEl: '.collections-prev',
                            nextEl: '.collections-next',
                        }}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true,
                        }}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                            1280: { slidesPerView: 4 },
                        }}
                        className="collections-swiper !pb-12"
                    >
                        {collections.map((collection, index) => (
                            <SwiperSlide key={collection.id}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Link
                                        href={collection.link}
                                        className="group relative h-[400px] overflow-hidden rounded-lg block"
                                    >
                                        <div
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                            style={{
                                                backgroundImage: `url(${collection.image || '/images/placeholder-collection.jpg'})`
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                            <h3 className="font-serif text-2xl mb-2">
                                                {getTitle(collection)}
                                            </h3>
                                            <p className="text-white/70 text-sm mb-2">
                                                {collection.propertyCount} {t('properties')}
                                            </p>
                                            <div className="h-1 w-12 bg-accent-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                                        </div>
                                    </Link>
                                </motion.div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
}

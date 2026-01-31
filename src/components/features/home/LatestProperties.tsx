'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { PropertyCard } from '@/components/ui/PropertyCard';
import { Button } from '@/components/ui/Button';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Property {
    id: string;
    title: string;
    location: string;
    price: string;
    image: string;
    beds: number;
    baths: number;
    size: number;
    type: 'sale' | 'rent';
    isNew?: boolean;
    isFeatured?: boolean;
}

interface LatestPropertiesProps {
    properties: Property[];
}

export function LatestProperties({ properties = [] }: LatestPropertiesProps) {
    const t = useTranslations('LatestProperties');

    // If no real properties, show empty state or nothing (user preference was "everything real")
    if (!properties || properties.length === 0) {
        return null; // Don't show the section if no data
    }

    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="font-serif text-3xl md:text-4xl text-primary mb-2">
                            {t('title')}
                        </h2>
                        <div className="h-1 w-20 bg-accent-gold" />
                    </div>

                    <Link href="/properties" className="hidden md:block">
                        <Button variant="ghost" className="gap-2 group">
                            {t('viewAll')}
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>

                <div className="relative px-12">
                    {/* Navigation Buttons */}
                    <button
                        className="latest-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-white rounded-full shadow-lg text-primary hover:text-accent-gold hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Previous"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        className="latest-next absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-white rounded-full shadow-lg text-primary hover:text-accent-gold hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Next"
                    >
                        <ChevronRight size={24} />
                    </button>

                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={32}
                        slidesPerView={1}
                        navigation={{
                            prevEl: '.latest-prev',
                            nextEl: '.latest-next',
                        }}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true,
                        }}
                        autoplay={{
                            delay: 6000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        breakpoints={{
                            640: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        className="latest-swiper !pb-12"
                    >
                        {properties.map((property) => (
                            <SwiperSlide key={property.id}>
                                <PropertyCard property={property} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Link href="/properties">
                        <Button variant="outline" className="w-full">
                            {t('viewAll')}
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}

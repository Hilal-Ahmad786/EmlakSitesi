'use client';

import { useState, useEffect } from 'react';
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

// Fallback properties for when API is not available
const fallbackProperties: Property[] = [
    {
        id: '1',
        title: '7 Storey Historical Building in Pera',
        location: 'Pera, Istanbul',
        price: '€2,500,000',
        image: '/images/home/property-1.jpg',
        beds: 7,
        baths: 5,
        size: 450,
        type: 'sale',
        isNew: true,
        isFeatured: true
    },
    {
        id: '2',
        title: '6 Storey Historical Atlas Apartments',
        location: 'Asmalımescit, Istanbul',
        price: '€6,500,000',
        image: '/images/home/property-2.jpg',
        beds: 12,
        baths: 10,
        size: 800,
        type: 'sale',
        isNew: true
    },
    {
        id: '3',
        title: '3+1 Apartment in Historical Pamuk Apt',
        location: 'Nişantaşı, Istanbul',
        price: '€1,300,000',
        image: '/images/home/property-3.jpg',
        beds: 3,
        baths: 2,
        size: 140,
        type: 'sale'
    },
    {
        id: '4',
        title: 'Historical Building with Bosphorus View',
        location: 'Galata, Istanbul',
        price: '€3,500,000',
        image: '/images/home/property-4.jpg',
        beds: 5,
        baths: 4,
        size: 350,
        type: 'sale'
    },
    {
        id: '5',
        title: 'Luxury Penthouse in Bebek',
        location: 'Bebek, Istanbul',
        price: '€4,200,000',
        image: '/images/home/property-5.jpg',
        beds: 4,
        baths: 3,
        size: 280,
        type: 'sale',
        isNew: true
    },
    {
        id: '6',
        title: 'Modern Villa in Etiler',
        location: 'Etiler, Istanbul',
        price: '€5,800,000',
        image: '/images/home/property-6.jpg',
        beds: 6,
        baths: 5,
        size: 520,
        type: 'sale',
        isFeatured: true
    }
];

export function LatestProperties() {
    const t = useTranslations('LatestProperties');
    const [properties, setProperties] = useState<Property[]>(fallbackProperties);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchProperties() {
            try {
                const response = await fetch('/api/properties?limit=10&sort=newest');
                if (response.ok) {
                    const data = await response.json();
                    if (data.properties && data.properties.length > 0) {
                        // Transform API data to match component interface
                        const transformed = data.properties.map((p: any) => ({
                            id: p.id,
                            title: typeof p.title === 'object' ? p.title.en : p.title,
                            location: `${p.neighborhood}, ${p.city}`,
                            price: `€${p.price.toLocaleString()}`,
                            image: p.images?.[0]?.url || '/images/placeholder-property.jpg',
                            beds: p.bedrooms,
                            baths: p.bathrooms,
                            size: p.size,
                            type: p.listingType === 'RENT' ? 'rent' : 'sale',
                            isNew: p.isNew,
                            isFeatured: p.isFeatured
                        }));
                        setProperties(transformed);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch properties:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchProperties();
    }, []);

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

'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';

const collections = [
    {
        id: 'mansions',
        title: 'Waterfront Mansions',
        image: '/images/home/collection-mansions.jpg', // Scraped from Maison d'Orient
        count: 12,
        link: '/properties?type=yali'
    },
    {
        id: 'galata',
        title: 'Historic Apartments',
        image: '/images/home/collection-galata.jpg', // Scraped from Maison d'Orient
        count: 8,
        link: '/properties?view=galata'
    },
    {
        id: 'bosphorus',
        title: 'Modern Penthouses',
        image: '/images/home/collection-bosphorus.jpg', // Scraped from Maison d'Orient
        count: 15,
        link: '/properties?view=bosphorus'
    },
    {
        id: 'investment',
        title: 'Investment Properties',
        image: '/images/home/collection-investment.jpg', // Scraped from Maison d'Orient
        link: '/properties?type=investment',
        count: 10
    },
    {
        id: 'cihangir',
        title: 'Historic Cihangir Buildings',
        image: '/images/home/collection-cihangir.jpg', // Scraped from Maison d'Orient
        link: '/properties?view=cihangir',
        count: 5
    },
    {
        id: 'levent',
        title: 'Luxury Levent Villas',
        image: '/images/home/collection-levent.jpg', // Scraped from Maison d'Orient
        link: '/properties?view=levent',
        count: 3
    }
];

export function FeaturedCollections() {
    const t = useTranslations('FeaturedCollections');

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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {collections.map((collection, index) => (
                        <Link
                            key={collection.id}
                            href={collection.link}
                            className="group relative h-[400px] overflow-hidden rounded-lg block"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="h-full w-full"
                            >
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                    style={{ backgroundImage: `url(${collection.image})` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="font-serif text-2xl mb-2">
                                        {t(`items.${collection.id}` as any)}
                                    </h3>
                                    <div className="h-1 w-12 bg-accent-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

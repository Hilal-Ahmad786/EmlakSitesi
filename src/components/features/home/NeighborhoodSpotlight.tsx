'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';

const neighborhoods = [
    {
        id: 'bebek',
        name: 'Bebek',
        image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?q=80&w=2598&auto=format&fit=crop', // JxbWRPkMFT8 -> using reliable Bosphorus image
        propertyCount: 45
    },
    {
        id: 'nisantasi',
        name: 'Nişantaşı',
        image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=2660&auto=format&fit=crop', // PyFzygP2eNg -> using reliable city/luxury image
        propertyCount: 32
    },
    {
        id: 'galata',
        name: 'Galata',
        image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?q=80&w=2670&auto=format&fit=crop', // 2gxniwtyytg -> using reliable Galata/Istanbul image
        propertyCount: 28
    },
    {
        id: 'sariyer',
        name: 'Sarıyer',
        image: 'https://images.unsplash.com/photo-1622587853578-dd1bf9608d26?q=80&w=2671&auto=format&fit=crop', // KtOid0FLjqU -> using reliable villa image
        propertyCount: 56
    }
];

export function NeighborhoodSpotlight() {
    const t = useTranslations('NeighborhoodSpotlight');

    return (
        <section className="py-20 bg-primary-dark text-white overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="font-serif text-3xl md:text-4xl mb-4">
                        {t('title')}
                    </h2>
                    <div className="h-1 w-24 bg-accent-gold mx-auto" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {neighborhoods.map((neighborhood, index) => (
                        <Link
                            key={neighborhood.id}
                            href={`/neighborhoods/${neighborhood.id}`}
                            className="group relative h-[500px] overflow-hidden rounded-lg block"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="h-full w-full"
                            >
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                    style={{ backgroundImage: `url(${neighborhood.image})` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />

                                <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="font-serif text-2xl mb-2 text-accent-gold">
                                        {t(`items.${neighborhood.id}.name` as any)}
                                    </h3>
                                    <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 transform translate-y-2 group-hover:translate-y-0">
                                        {t(`items.${neighborhood.id}.desc` as any)}
                                    </p>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

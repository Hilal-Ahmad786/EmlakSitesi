'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';

interface NeighborhoodData {
    id: string;
    name: string;
    image: string;
    propertyCount: number;
}

interface NeighborhoodSpotlightProps {
    neighborhoods?: NeighborhoodData[];
}

export function NeighborhoodSpotlight({ neighborhoods = [] }: NeighborhoodSpotlightProps) {
    const t = useTranslations('NeighborhoodSpotlight');

    if (neighborhoods.length === 0) return null;

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
                                        {neighborhood.name}
                                    </h3>
                                    <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 transform translate-y-2 group-hover:translate-y-0">
                                        {neighborhood.propertyCount} {neighborhood.propertyCount === 1 ? 'property' : 'properties'}
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

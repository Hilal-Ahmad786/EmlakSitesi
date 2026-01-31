'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';

interface Collection {
    id: string;
    title: string;
    image: string;
    link: string;
}

interface FeaturedCollectionsProps {
    collections: Collection[];
}

export function FeaturedCollections({ collections = [] }: FeaturedCollectionsProps) {
    const t = useTranslations('FeaturedCollections');

    // If no collections, we might want to hide or show empty.
    if (!collections || collections.length === 0) {
        return null;
    }

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10">
                    <h2 className="font-serif text-3xl md:text-4xl text-primary mb-4">
                        {t('title')}
                    </h2>
                    <p className="text-text-secondary">
                        {t('subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {collections.map((item, index) => (
                        <Link
                            key={item.id}
                            href={item.link}
                            className="group relative h-[450px] overflow-hidden rounded-lg block"
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
                                    style={{ backgroundImage: `url(${item.image})` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                                <div className="absolute bottom-6 left-6 right-6">
                                    <h3 className="font-serif text-2xl text-white mb-2 drop-shadow-md">
                                        {item.title}
                                    </h3>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

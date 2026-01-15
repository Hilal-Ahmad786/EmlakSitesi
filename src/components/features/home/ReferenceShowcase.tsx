'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

// Selected references to display on homepage
const references = [
    { id: 1, logo: "https://www.maison-dorient.com/image/catalog/references/nestle_597_1592049406.webp" },
    { id: 2, logo: "https://www.maison-dorient.com/image/catalog/references/medina-turgul-ddb_588_1589984041.webp" },
    { id: 3, logo: "https://www.maison-dorient.com/image/catalog/references/belgium.webp" },
];

export function ReferenceShowcase() {
    const t = useTranslations('ReferenceShowcase');

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-left mb-16 pl-4">
                    <h2 className="font-serif text-3xl md:text-3xl text-primary inline-block uppercase tracking-widest text-[#5C5C5C]">
                        HAKKIMIZDA - {t('title').toUpperCase()}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                    {references.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.98 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15 }}
                            className="bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] rounded-sm overflow-hidden group hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] transition-shadow duration-300 relative aspect-[3/4] cursor-pointer"
                        >
                            {/* The Image IS the card content */}
                            <div className="w-full h-full relative">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={item.logo}
                                    alt="Reference Document"
                                    // "cover the whole card" - using object-fill or cover to ensure it fills neatly
                                    // Assuming these are document scans, we want them to fill the 'paper'
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                {/* Overlay for slight depth/texture if needed, or hover effect */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

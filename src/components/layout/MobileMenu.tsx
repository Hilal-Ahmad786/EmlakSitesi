'use client';

import { useState } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Menu, X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from '@/i18n/routing';

export function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const t = useTranslations('Navigation');
    const pathname = usePathname();
    const router = useRouter();

    const toggleMenu = () => setIsOpen(!isOpen);

    const menuItems = [
        { href: '/', label: t('home') },
        { href: '/properties', label: t('properties') },
        { href: '/neighborhoods', label: t('neighborhoods') },
        { href: '/about', label: t('about') },
        { href: '/services', label: t('services') },
        { href: '/blog', label: t('blog') },
        { href: '/contact', label: t('contact') },
    ];

    const handleLanguageChange = (locale: string) => {
        router.replace(pathname, { locale });
        setIsOpen(false);
    };

    return (
        <div className="md:hidden">
            <button onClick={toggleMenu} className="p-2 text-primary">
                <Menu size={24} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed inset-0 bg-white z-50 flex flex-col"
                    >
                        <div className="flex justify-between items-center p-4 border-b border-border">
                            <span className="font-serif text-xl font-bold text-primary">Maison d'Orient</span>
                            <button onClick={toggleMenu} className="p-2 text-primary">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-grow overflow-y-auto py-8 px-6">
                            <nav className="flex flex-col gap-6">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="text-2xl font-serif text-primary hover:text-accent-gold transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>

                            <div className="mt-12 border-t border-border pt-8">
                                <div className="flex items-center gap-2 mb-4 text-text-secondary">
                                    <Globe size={20} />
                                    <span>Language</span>
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => handleLanguageChange('en')}
                                        className="px-4 py-2 border border-border rounded hover:bg-primary hover:text-white transition-colors"
                                    >
                                        English
                                    </button>
                                    <button
                                        onClick={() => handleLanguageChange('tr')}
                                        className="px-4 py-2 border border-border rounded hover:bg-primary hover:text-white transition-colors"
                                    >
                                        Türkçe
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

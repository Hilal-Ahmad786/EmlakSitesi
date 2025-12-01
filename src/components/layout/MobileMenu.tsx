'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Menu, X, Globe, ChevronRight, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from '@/i18n/routing';
import { CurrencySwitcher } from '@/components/features/tools/CurrencySwitcher';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const t = useTranslations('Navigation');
    const tTools = useTranslations('Tools');
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

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
            <button onClick={toggleMenu} className="p-2 text-primary hover:text-accent-gold transition-colors">
                <Menu size={24} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                            onClick={toggleMenu}
                        />

                        {/* Menu Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white z-50 flex flex-col shadow-2xl h-screen h-dvh"
                            style={{ backgroundColor: '#ffffff' }}
                        >
                            {/* Header */}
                            <div className="flex justify-between items-center p-6 border-b border-border">
                                <span className="font-serif text-2xl font-bold text-primary">Maison d'Orient</span>
                                <button onClick={toggleMenu} className="p-2 text-primary hover:text-accent-gold transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-grow overflow-y-auto py-6 px-6">
                                <nav className="flex flex-col gap-2">
                                    {menuItems.map((item, index) => (
                                        <motion.div
                                            key={item.href}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 + 0.1 }}
                                        >
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    "flex items-center justify-between text-lg font-serif py-3 border-b border-border/40 transition-colors",
                                                    pathname === item.href
                                                        ? 'text-accent-gold'
                                                        : 'text-primary hover:text-accent-gold'
                                                )}
                                                onClick={() => setIsOpen(false)}
                                            >
                                                {item.label}
                                                <ChevronRight size={16} className="opacity-30" />
                                            </Link>
                                        </motion.div>
                                    ))}
                                </nav>

                                <div className="mt-8 space-y-6">
                                    {/* Currency */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                                            {tTools('currency.label')}
                                        </label>
                                        <CurrencySwitcher className="w-full" />
                                    </div>

                                    {/* Language */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-text-secondary uppercase tracking-wider text-xs font-bold">
                                            <Globe size={14} />
                                            <span>Language</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => handleLanguageChange('en')}
                                                className={cn(
                                                    "px-4 py-2.5 border rounded-lg transition-all text-center font-medium text-sm",
                                                    pathname.startsWith('/en') || !pathname.startsWith('/tr') // Simple check, ideally use locale hook
                                                        ? "bg-primary text-white border-primary"
                                                        : "border-border hover:border-primary text-text-secondary"
                                                )}
                                            >
                                                English
                                            </button>
                                            <button
                                                onClick={() => handleLanguageChange('tr')}
                                                className={cn(
                                                    "px-4 py-2.5 border rounded-lg transition-all text-center font-medium text-sm",
                                                    pathname.startsWith('/tr')
                                                        ? "bg-primary text-white border-primary"
                                                        : "border-border hover:border-primary text-text-secondary"
                                                )}
                                            >
                                                Türkçe
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer CTA */}
                            <div className="p-6 border-t border-border bg-background-alt/50">
                                <Link href="/contact" onClick={() => setIsOpen(false)}>
                                    <Button variant="primary" className="w-full justify-center gap-2" size="lg">
                                        <Phone size={18} />
                                        {t('contact')}
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

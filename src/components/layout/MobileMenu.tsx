'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { Menu, X, Globe, ChevronRight, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from '@/i18n/routing';
import { CurrencySwitcher } from '@/components/features/tools/CurrencySwitcher';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface MobileMenuProps {
    isScrolled?: boolean;
    isHomepage?: boolean;
}

export function MobileMenu({ isScrolled = true, isHomepage = false }: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const t = useTranslations('Navigation');
    const tTools = useTranslations('Tools');
    const pathname = usePathname();
    const router = useRouter();
    const locale = useLocale();

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

    const handleLanguageChange = (newLocale: string) => {
        router.replace(pathname, { locale: newLocale });
        setIsOpen(false);
    };

    return (
        <div className="md:hidden">
            {/* Hamburger button with dynamic color */}
            <button
                onClick={toggleMenu}
                className={cn(
                    "p-2 rounded-lg transition-all duration-300",
                    isScrolled || !isHomepage
                        ? "text-primary hover:text-accent-gold hover:bg-primary/5"
                        : "text-white hover:text-white hover:bg-white/10"
                )}
            >
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
                            className="fixed inset-0 bg-primary-dark/60 z-40 backdrop-blur-sm"
                            onClick={toggleMenu}
                        />

                        {/* Menu Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white z-50 flex flex-col shadow-luxury h-screen h-dvh"
                        >
                            {/* Header with gold accent */}
                            <div className="relative flex justify-between items-center p-6 border-b border-border">
                                <div className="flex items-center gap-3">
                                    <div className="w-px h-6 bg-gradient-to-b from-transparent via-accent-gold to-transparent" />
                                    <span className="font-serif text-xl font-bold text-primary">
                                        <span className="text-accent-gold">M</span>aison d&apos;Orient
                                    </span>
                                </div>
                                <button
                                    onClick={toggleMenu}
                                    className="p-2 rounded-lg text-primary hover:text-accent-gold hover:bg-primary/5 transition-all"
                                >
                                    <X size={24} />
                                </button>
                                {/* Gold accent line */}
                                <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-accent-gold/50 via-accent-gold/20 to-transparent" />
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-grow overflow-y-auto py-6 px-6">
                                <nav className="flex flex-col gap-1">
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
                                                    "group flex items-center justify-between text-lg font-medium py-3.5 px-3 rounded-lg transition-all duration-300",
                                                    pathname === item.href
                                                        ? 'text-accent-gold bg-accent-gold/5'
                                                        : 'text-primary hover:text-accent-gold hover:bg-primary/5'
                                                )}
                                                onClick={() => setIsOpen(false)}
                                            >
                                                <span className="font-serif">{item.label}</span>
                                                <ChevronRight
                                                    size={16}
                                                    className={cn(
                                                        "transition-all duration-300",
                                                        pathname === item.href
                                                            ? "opacity-100 text-accent-gold"
                                                            : "opacity-30 group-hover:opacity-100 group-hover:translate-x-1"
                                                    )}
                                                />
                                            </Link>
                                        </motion.div>
                                    ))}
                                </nav>

                                <div className="mt-8 space-y-6">
                                    {/* Divider */}
                                    <div className="h-px bg-gradient-to-r from-border via-border to-transparent" />

                                    {/* Currency */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2">
                                            <span className="w-4 h-px bg-accent-gold" />
                                            {tTools('currency.label')}
                                        </label>
                                        <CurrencySwitcher className="w-full" />
                                    </div>

                                    {/* Language */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-text-secondary uppercase tracking-wider text-xs font-bold">
                                            <span className="w-4 h-px bg-accent-gold" />
                                            <Globe size={14} />
                                            <span>Language</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => handleLanguageChange('en')}
                                                className={cn(
                                                    "px-4 py-3 border-2 rounded-xl transition-all text-center font-medium text-sm",
                                                    locale === 'en'
                                                        ? "bg-primary text-white border-primary shadow-md"
                                                        : "border-border hover:border-accent-gold text-text-secondary hover:text-primary"
                                                )}
                                            >
                                                English
                                            </button>
                                            <button
                                                onClick={() => handleLanguageChange('tr')}
                                                className={cn(
                                                    "px-4 py-3 border-2 rounded-xl transition-all text-center font-medium text-sm",
                                                    locale === 'tr'
                                                        ? "bg-primary text-white border-primary shadow-md"
                                                        : "border-border hover:border-accent-gold text-text-secondary hover:text-primary"
                                                )}
                                            >
                                                Turkce
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer CTA with gold accent */}
                            <div className="p-6 border-t border-border bg-background-alt/50">
                                <Link href="/contact" onClick={() => setIsOpen(false)}>
                                    <Button variant="secondary" className="w-full justify-center gap-2" size="lg">
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

'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { CurrencySwitcher } from '@/components/features/tools/CurrencySwitcher';
import { SearchAutocomplete } from '@/components/features/search/SearchAutocomplete';
import { MobileMenu } from '@/components/layout/MobileMenu';
import {
    Globe,
    Phone,
    Mail,
    MapPin,
    ChevronDown,
    Search,
    X
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header() {
    const t = useTranslations('Navigation');
    const pathname = usePathname();
    const router = useRouter();
    const locale = useLocale();

    const [isScrolled, setIsScrolled] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 80);
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleLanguage = () => {
        const newLocale = locale === 'en' ? 'tr' : 'en';
        router.replace(pathname, { locale: newLocale });
    };

    const navLinks = [
        { href: '/', label: t('home') },
        { href: '/properties', label: t('properties') },
        { href: '/neighborhoods', label: t('neighborhoods') },
        { href: '/services', label: t('services') },
        { href: '/blog', label: t('blog') },
        { href: '/contact', label: t('contact') },
    ];

    const isHomepage = pathname === '/' || pathname === '';
    const showTransparent = isHomepage && !isScrolled;

    return (
        <>
            {/* Top Bar - Hidden on scroll */}
            <div
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
                    showTransparent
                        ? "bg-primary-dark/80 backdrop-blur-sm"
                        : "bg-primary-dark",
                    isScrolled ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
                )}
            >
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="h-10 flex items-center justify-between text-sm">
                        {/* Left - Contact Info */}
                        <div className="hidden md:flex items-center gap-6 text-gray-300">
                            <a
                                href="tel:+905324610574"
                                className="flex items-center gap-2 hover:text-accent-gold transition-colors"
                            >
                                <Phone size={14} />
                                <span>+90 532 461 05 74</span>
                            </a>
                            <a
                                href="mailto:info@maison-dorient.com"
                                className="flex items-center gap-2 hover:text-accent-gold transition-colors"
                            >
                                <Mail size={14} />
                                <span>info@maison-dorient.com</span>
                            </a>
                        </div>

                        {/* Center - Location (visible on larger screens) */}
                        <div className="hidden lg:flex items-center gap-2 text-gray-400">
                            <MapPin size={14} className="text-accent-gold" />
                            <span>Beyoglu, Istanbul</span>
                        </div>

                        {/* Right - Language & Currency */}
                        <div className="flex items-center gap-4 ml-auto">
                            <CurrencySwitcher />
                            <div className="w-px h-4 bg-gray-600" />
                            <button
                                onClick={toggleLanguage}
                                className="flex items-center gap-1.5 text-gray-300 hover:text-accent-gold transition-colors"
                            >
                                <Globe size={14} />
                                <span className="uppercase font-medium">{locale}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <header
                className={cn(
                    "fixed z-50 w-full transition-all duration-500 ease-out",
                    isScrolled
                        ? "top-0 bg-white shadow-lg"
                        : showTransparent
                            ? "top-10 bg-transparent"
                            : "top-10 bg-white shadow-md"
                )}
            >
                {/* Gold accent line at top when scrolled */}
                <div
                    className={cn(
                        "absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-accent-gold via-accent-gold to-accent-goldLight transition-opacity duration-300",
                        isScrolled ? "opacity-100" : "opacity-0"
                    )}
                />

                <div className="container mx-auto px-4 lg:px-8">
                    <div className="h-20 flex items-center justify-between gap-8">
                        {/* Logo */}
                        <Logo
                            variant={showTransparent ? 'light' : 'dark'}
                            isScrolled={isScrolled}
                            className="flex-shrink-0"
                        />

                        {/* Desktop Navigation - Centered */}
                        <nav className="hidden lg:flex items-center justify-center flex-1">
                            <div className="flex items-center gap-1">
                                {navLinks.map((link) => {
                                    const isActive = pathname === link.href;
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={cn(
                                                "relative px-4 py-2 text-sm font-medium tracking-wide transition-all duration-300 rounded-lg group",
                                                showTransparent
                                                    ? "text-white/90 hover:text-white"
                                                    : "text-primary hover:text-accent-gold",
                                                isActive && "text-accent-gold"
                                            )}
                                        >
                                            {link.label}
                                            {/* Animated underline */}
                                            <span
                                                className={cn(
                                                    "absolute bottom-1 left-4 right-4 h-0.5 bg-accent-gold rounded-full transition-transform duration-300 origin-left",
                                                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                                                )}
                                            />
                                        </Link>
                                    );
                                })}
                            </div>
                        </nav>

                        {/* Right Actions */}
                        <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
                            {/* Search Toggle */}
                            <button
                                onClick={() => setShowSearch(!showSearch)}
                                className={cn(
                                    "p-2.5 rounded-full transition-all duration-300",
                                    showTransparent
                                        ? "text-white/90 hover:text-white hover:bg-white/10"
                                        : "text-primary hover:text-accent-gold hover:bg-primary/5",
                                    showSearch && "bg-accent-gold/10 text-accent-gold"
                                )}
                            >
                                {showSearch ? <X size={20} /> : <Search size={20} />}
                            </button>

                            {/* Divider */}
                            <div className={cn(
                                "w-px h-8 transition-colors duration-300",
                                showTransparent ? "bg-white/20" : "bg-border"
                            )} />

                            {/* CTA Button */}
                            <Link href="/contact">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="gap-2 shadow-md hover:shadow-lg"
                                >
                                    <Phone size={16} />
                                    <span className="hidden xl:inline">{t('contact')}</span>
                                </Button>
                            </Link>
                        </div>

                        {/* Tablet Navigation (md to lg) */}
                        <nav className="hidden md:flex lg:hidden items-center gap-4">
                            {navLinks.slice(0, 4).map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "text-sm font-medium transition-colors",
                                        showTransparent
                                            ? "text-white/90 hover:text-white"
                                            : "text-primary hover:text-accent-gold",
                                        pathname === link.href && "text-accent-gold"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Mobile Menu */}
                        <MobileMenu isScrolled={isScrolled} isHomepage={isHomepage} />
                    </div>
                </div>

                {/* Search Dropdown */}
                <div
                    className={cn(
                        "absolute top-full left-0 right-0 bg-white border-t border-border shadow-lg transition-all duration-300 overflow-hidden",
                        showSearch ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
                    )}
                >
                    <div className="container mx-auto px-4 lg:px-8 py-4">
                        <SearchAutocomplete className="max-w-2xl mx-auto" />
                    </div>
                </div>

                {/* Bottom gold line */}
                <div
                    className={cn(
                        "absolute bottom-0 left-0 right-0 h-px transition-opacity duration-300",
                        "bg-gradient-to-r from-transparent via-accent-gold/40 to-transparent",
                        isScrolled ? "opacity-100" : "opacity-0"
                    )}
                />
            </header>
        </>
    );
}

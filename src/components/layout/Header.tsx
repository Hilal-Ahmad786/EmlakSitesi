'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { CurrencySwitcher } from '@/components/features/tools/CurrencySwitcher';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { Menu, X, Globe, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header() {
    const t = useTranslations('Navigation');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const navLinks = [
        { href: '/', label: t('home') },
        { href: '/properties', label: t('properties') },
        { href: '/neighborhoods', label: t('neighborhoods') },
        { href: '/services', label: t('services') },
        { href: '/blog', label: t('blog') },
        { href: '/contact', label: t('contact') },
    ];

    const switchLocale = (locale: string) => {
        router.replace(pathname, { locale });
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                <Logo />

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium text-text-primary hover:text-accent-gold transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <CurrencySwitcher />
                    <div className="flex items-center gap-2 text-primary hover:text-accent-gold transition-colors cursor-pointer">
                        <Globe size={20} />
                        <span className="text-sm font-medium">EN</span>
                    </div>
                    <Link href="/contact">
                        <Button variant="primary" size="sm">
                            {t('contact')}
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu */}
                <MobileMenu />
            </div>
        </header>
    );
}

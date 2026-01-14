'use client';

import { useState } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import {
    Facebook,
    Instagram,
    Linkedin,
    Twitter,
    MapPin,
    Phone,
    Mail,
    ChevronRight,
    Send
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Footer() {
    const t = useTranslations('Footer');
    const tNav = useTranslations('Navigation');
    const [email, setEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setIsSubscribed(true);
            setEmail('');
            setTimeout(() => setIsSubscribed(false), 3000);
        }
    };

    const socialLinks = [
        { icon: Instagram, href: '#', label: 'Instagram' },
        { icon: Facebook, href: '#', label: 'Facebook' },
        { icon: Linkedin, href: '#', label: 'LinkedIn' },
        { icon: Twitter, href: '#', label: 'Twitter' },
    ];

    const quickLinks = [
        { href: '/properties', label: t('quickLinks.properties') },
        { href: '/neighborhoods', label: t('quickLinks.neighborhoods') },
        { href: '/services', label: t('quickLinks.services') },
        { href: '/blog', label: t('quickLinks.blog') },
        { href: '/contact', label: t('quickLinks.contact') },
    ];

    const collections = [
        { href: '/properties?type=yali', label: t('collections.yali') },
        { href: '/properties?type=historic', label: t('collections.historic') },
        { href: '/properties?type=penthouse', label: t('collections.penthouse') },
        { href: '/properties?type=investment', label: t('collections.investment') },
    ];

    return (
        <footer className="bg-gradient-to-b from-primary-dark to-[#0a1525]">
            {/* Newsletter Section */}
            <div className="border-b border-white/10">
                <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-20">
                    <div className="max-w-2xl mx-auto text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent-gold/10 border border-accent-gold/20 rounded-full mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent-gold animate-pulse" />
                            <span className="text-accent-gold text-sm font-medium tracking-wider uppercase">
                                {t('newsletter.badge')}
                            </span>
                        </div>

                        <h3 className="font-serif text-3xl lg:text-4xl text-white mb-4">
                            {t('newsletter.title')}
                        </h3>
                        <p className="text-gray-400 mb-8 text-lg">
                            {t('newsletter.subtitle')}
                        </p>

                        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <div className="relative flex-1">
                                <input
                                    type="email"
                                    placeholder={t('newsletter.placeholder')}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-12 px-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-accent-gold focus:ring-2 focus:ring-accent-gold/20 transition-all"
                                />
                            </div>
                            <Button
                                type="submit"
                                variant="secondary"
                                className="h-12 px-6 whitespace-nowrap"
                            >
                                <Send size={16} className="mr-2" />
                                {t('newsletter.subscribe')}
                            </Button>
                        </form>

                        {isSubscribed && (
                            <p className="text-accent-gold mt-4 animate-fade-in">
                                Thank you for subscribing!
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="container mx-auto px-4 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                    {/* Brand Column */}
                    <div className="lg:col-span-1">
                        <Logo variant="light" className="mb-6" />
                        <p className="text-gray-400 text-sm leading-relaxed mb-8">
                            {t('brand.description')}
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-gray-400 hover:text-accent-gold hover:border-accent-gold transition-all duration-300"
                                >
                                    <social.icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-serif text-lg text-white mb-6 flex items-center gap-3">
                            <span className="w-8 h-px bg-accent-gold" />
                            {t('quickLinks.title')}
                        </h4>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="group text-gray-400 hover:text-accent-gold transition-colors text-sm flex items-center gap-2"
                                    >
                                        <ChevronRight
                                            size={14}
                                            className="opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-accent-gold"
                                        />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Collections */}
                    <div>
                        <h4 className="font-serif text-lg text-white mb-6 flex items-center gap-3">
                            <span className="w-8 h-px bg-accent-gold" />
                            {t('collections.title')}
                        </h4>
                        <ul className="space-y-3">
                            {collections.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="group text-gray-400 hover:text-accent-gold transition-colors text-sm flex items-center gap-2"
                                    >
                                        <ChevronRight
                                            size={14}
                                            className="opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-accent-gold"
                                        />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-serif text-lg text-white mb-6 flex items-center gap-3">
                            <span className="w-8 h-px bg-accent-gold" />
                            {t('contact.title')}
                        </h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-gray-400">
                                <MapPin className="h-5 w-5 text-accent-gold mt-0.5 flex-shrink-0" />
                                <span className="text-sm leading-relaxed">
                                    {t('contact.address')}
                                </span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400">
                                <Phone className="h-5 w-5 text-accent-gold flex-shrink-0" />
                                <div className="text-sm space-y-1">
                                    <a
                                        href="tel:+905324610574"
                                        className="hover:text-accent-gold transition-colors block"
                                    >
                                        +90 532 461 05 74
                                    </a>
                                    <a
                                        href="tel:+902122451516"
                                        className="hover:text-accent-gold transition-colors block"
                                    >
                                        +90 212 245 15 16
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400">
                                <Mail className="h-5 w-5 text-accent-gold flex-shrink-0" />
                                <a
                                    href="mailto:info@maison-dorient.com"
                                    className="text-sm hover:text-accent-gold transition-colors"
                                >
                                    info@maison-dorient.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10">
                <div className="container mx-auto px-4 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-500 text-sm">
                            &copy; {new Date().getFullYear()} Maison d&apos;Orient. {t('copyright')}
                        </p>
                        <div className="flex items-center gap-6 text-sm">
                            <Link
                                href="/privacy"
                                className="text-gray-500 hover:text-accent-gold transition-colors"
                            >
                                {t('privacy')}
                            </Link>
                            <span className="text-gray-700">|</span>
                            <Link
                                href="/terms"
                                className="text-gray-500 hover:text-accent-gold transition-colors"
                            >
                                {t('terms')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

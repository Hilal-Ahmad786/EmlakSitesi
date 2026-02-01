import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ['en', 'tr'],

    // Used when no locale matches
    defaultLocale: 'tr',

    // Prefix for the default locale (optional, defaults to true)
    // as-needed: /properties (tr) vs /en/properties (en)
    localePrefix: 'as-needed',

    pathnames: {
        '/': '/',
        '/neighborhoods': {
            en: '/neighborhoods',
            tr: '/mahalleler'
        },
        '/properties': {
            en: '/properties',
            tr: '/emlaklar'
        },
        '/about': {
            en: '/about',
            tr: '/hakkimizda'
        },
        '/contact': {
            en: '/contact',
            tr: '/iletisim'
        },
        '/services': {
            en: '/services',
            tr: '/hizmetler'
        },
        '/blog': {
            en: '/blog',
            tr: '/blog'
        }
    }
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
    createNavigation(routing);

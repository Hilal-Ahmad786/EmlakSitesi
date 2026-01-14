'use client';

import { usePathname } from 'next/navigation';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { cn } from '@/lib/utils';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.includes('/admin');

    // Extract locale from pathname (e.g., /en/properties -> en, /properties -> default)
    const pathParts = pathname?.split('/').filter(Boolean) || [];
    const locale = pathParts[0];
    const pageSlug = pathParts[1] || '';

    // Check if we're on the homepage (no page slug after locale, or just locale)
    const isHomepage = !pageSlug || pageSlug === '';

    return (
        <>
            {!isAdmin && <Header />}
            <main
                className={cn(
                    "flex-grow",
                    // Don't add padding on homepage - hero goes under header
                    // Add padding on other pages
                    !isAdmin && !isHomepage && "pt-[120px]"
                )}
            >
                {children}
            </main>
            {!isAdmin && <Footer />}
        </>
    );
}

'use client';

import { usePathname } from 'next/navigation';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.includes('/admin');

    return (
        <>
            {!isAdmin && <Header />}
            <main className="flex-grow">
                {children}
            </main>
            {!isAdmin && <Footer />}
        </>
    );
}

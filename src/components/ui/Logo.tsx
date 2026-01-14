'use client';

import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';

interface LogoProps {
    className?: string;
    variant?: 'dark' | 'light' | 'auto';
    isScrolled?: boolean;
}

export function Logo({ className, variant = 'dark', isScrolled = true }: LogoProps) {
    // Determine text color based on variant and scroll state
    const getTextColor = () => {
        if (variant === 'light') return 'text-white';
        if (variant === 'dark') return 'text-primary';
        // 'auto' variant changes based on scroll
        return isScrolled ? 'text-primary' : 'text-white';
    };

    return (
        <Link href="/" className={cn('flex items-center gap-3 group', className)}>
            {/* Decorative gold line */}
            <div className="hidden md:block w-px h-8 bg-gradient-to-b from-transparent via-accent-gold to-transparent opacity-60" />

            <div className={cn(
                "font-serif text-2xl font-bold tracking-tight transition-colors duration-300",
                getTextColor()
            )}>
                <span className="text-accent-gold">M</span>aison d&apos;Orient
            </div>
        </Link>
    );
}

import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';

interface LogoProps {
    className?: string;
    variant?: 'dark' | 'light';
}

export function Logo({ className, variant = 'dark' }: LogoProps) {
    return (
        <Link href="/" className={cn('flex items-center gap-2', className)}>
            <div className={cn(
                "font-serif text-2xl font-bold tracking-tight",
                variant === 'dark' ? "text-primary" : "text-white"
            )}>
                Maison d&apos;Orient
            </div>
        </Link>
    );
}

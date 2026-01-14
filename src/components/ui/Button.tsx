import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'luxury';
    size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    // Base styles
                    'inline-flex items-center justify-center font-medium transition-all duration-300',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                    'disabled:opacity-50 disabled:pointer-events-none',
                    'active:scale-[0.98]',

                    // Variants
                    {
                        // Primary - Navy with subtle shadow
                        'bg-primary text-white hover:bg-primary-light shadow-sm hover:shadow-md rounded-lg':
                            variant === 'primary',

                        // Secondary - Gold gradient
                        'bg-gradient-to-r from-accent-gold to-[#c9a050] text-white hover:from-[#c9a050] hover:to-accent-gold shadow-sm hover:shadow-lg rounded-lg':
                            variant === 'secondary',

                        // Outline - Navy border with hover fill
                        'border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-lg':
                            variant === 'outline',

                        // Ghost - Subtle hover
                        'text-primary hover:bg-primary/5 hover:text-accent-gold rounded-lg':
                            variant === 'ghost',

                        // Luxury - Gold bordered elegant style
                        'border border-accent-gold/40 text-primary bg-transparent hover:border-accent-gold hover:bg-accent-gold/5 rounded-lg':
                            variant === 'luxury',
                    },

                    // Sizes with refined proportions
                    {
                        'h-9 px-4 text-sm': size === 'sm',
                        'h-11 px-6 text-sm': size === 'md',
                        'h-13 px-8 text-base': size === 'lg',
                    },

                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';

export { Button };

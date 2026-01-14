import { InputHTMLAttributes, forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, icon, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-primary mb-2 tracking-wide">
                        {label}
                    </label>
                )}
                <div className="relative group">
                    {icon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-accent-gold transition-colors duration-300 pointer-events-none">
                            {icon}
                        </div>
                    )}
                    <input
                        type={type}
                        className={cn(
                            // Base
                            "flex h-12 w-full rounded-xl border bg-white px-4 py-3",
                            "text-sm text-primary placeholder:text-text-muted",

                            // Focus states with gold accent
                            "focus:outline-none focus:ring-2 focus:ring-accent-gold/20 focus:border-accent-gold",
                            "transition-all duration-300",

                            // Border
                            "border-border hover:border-primary/30",

                            // Disabled
                            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",

                            // Icon padding
                            icon && "pl-12",

                            // Error state
                            error && "border-error focus:ring-error/20 focus:border-error",

                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="mt-2 text-xs text-error flex items-center gap-1.5">
                        <AlertCircle size={12} />
                        {error}
                    </p>
                )}
            </div>
        );
    }
);
Input.displayName = "Input";

export { Input };

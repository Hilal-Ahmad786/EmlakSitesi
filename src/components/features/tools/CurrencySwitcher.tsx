'use client';

import { useCurrency } from '@/context/CurrencyContext';
import { Select } from '@/components/ui/Select';
import { useTranslations } from 'next-intl';

interface CurrencySwitcherProps {
    className?: string;
}

export function CurrencySwitcher({ className }: CurrencySwitcherProps) {
    const { currency, setCurrency } = useCurrency();
    const t = useTranslations('Tools.currency');

    return (
        <div className={className || "w-32"}>
            <Select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as any)}
                options={[
                    { value: 'EUR', label: '€ EUR' },
                    { value: 'USD', label: '$ USD' },
                    { value: 'TRY', label: '₺ TRY' },
                ]}
            />
        </div>
    );
}

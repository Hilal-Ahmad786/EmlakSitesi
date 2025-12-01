'use client';

import { useCurrency } from '@/context/CurrencyContext';
import { Select } from '@/components/ui/Select';
import { useTranslations } from 'next-intl';

export function CurrencySwitcher() {
    const { currency, setCurrency } = useCurrency();
    const t = useTranslations('Tools.currency');

    return (
        <div className="w-32">
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

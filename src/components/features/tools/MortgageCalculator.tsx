'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useCurrency } from '@/context/CurrencyContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Calculator } from 'lucide-react';

interface MortgageCalculatorProps {
    propertyPrice: number; // in EUR
}

export function MortgageCalculator({ propertyPrice }: MortgageCalculatorProps) {
    const t = useTranslations('Tools.mortgage');
    const { currency, formatPrice, convertPrice } = useCurrency();

    const [deposit, setDeposit] = useState(propertyPrice * 0.2); // Default 20%
    const [rate, setRate] = useState(3.5);
    const [years, setYears] = useState(15);
    const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);

    const calculateMortgage = () => {
        const principal = propertyPrice - deposit;
        const monthlyRate = rate / 100 / 12;
        const numberOfPayments = years * 12;

        const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

        setMonthlyPayment(payment);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
            <div className="flex items-center gap-2 mb-6 text-primary">
                <Calculator size={24} />
                <h3 className="font-serif text-xl">{t('title')}</h3>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                        {t('price')} ({currency})
                    </label>
                    <div className="p-3 bg-background-alt rounded-md text-text-primary font-medium">
                        {formatPrice(propertyPrice)}
                    </div>
                </div>

                <Input
                    label={t('deposit')}
                    type="number"
                    value={convertPrice(deposit)}
                    onChange={(e) => setDeposit(Number(e.target.value) / (convertPrice(1)))} // Convert back to EUR for state
                />

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label={t('rate')}
                        type="number"
                        value={rate}
                        onChange={(e) => setRate(Number(e.target.value))}
                    />
                    <Input
                        label={t('years')}
                        type="number"
                        value={years}
                        onChange={(e) => setYears(Number(e.target.value))}
                    />
                </div>

                <Button onClick={calculateMortgage} className="w-full">
                    {t('calculate')}
                </Button>

                {monthlyPayment && (
                    <div className="mt-6 p-4 bg-primary-light/10 rounded-lg text-center">
                        <p className="text-sm text-text-secondary mb-1">{t('result')}</p>
                        <p className="text-2xl font-bold text-primary">
                            {formatPrice(monthlyPayment)}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

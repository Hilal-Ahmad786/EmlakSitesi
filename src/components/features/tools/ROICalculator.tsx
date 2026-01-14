'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Percent,
  Calendar,
  PiggyBank,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useCurrency } from '@/context/CurrencyContext';
import { cn } from '@/lib/utils';

interface ROICalculatorProps {
  initialPrice?: number;
  className?: string;
}

interface YearlyProjection {
  year: number;
  propertyValue: number;
  rentalIncome: number;
  totalExpenses: number;
  netIncome: number;
  cumulativeIncome: number;
  totalReturn: number;
  roi: number;
}

export function ROICalculator({ initialPrice = 0, className }: ROICalculatorProps) {
  const t = useTranslations('Tools.roi');
  const { formatPrice, convertPrice, currency } = useCurrency();

  // Form state
  const [purchasePrice, setPurchasePrice] = useState(initialPrice || 1000000);
  const [downPayment, setDownPayment] = useState(20);
  const [monthlyRent, setMonthlyRent] = useState(5000);
  const [annualAppreciation, setAnnualAppreciation] = useState(5);
  const [annualExpenses, setAnnualExpenses] = useState(10000);
  const [vacancyRate, setVacancyRate] = useState(5);
  const [projectionYears, setProjectionYears] = useState(5);

  // Advanced settings toggle
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Calculations
  const calculations = useMemo(() => {
    const downPaymentAmount = (purchasePrice * downPayment) / 100;
    const loanAmount = purchasePrice - downPaymentAmount;
    const grossAnnualRent = monthlyRent * 12;
    const effectiveAnnualRent = grossAnnualRent * (1 - vacancyRate / 100);
    const netOperatingIncome = effectiveAnnualRent - annualExpenses;
    const capRate = (netOperatingIncome / purchasePrice) * 100;
    const cashOnCashReturn = (netOperatingIncome / downPaymentAmount) * 100;
    const grossRentMultiplier = purchasePrice / grossAnnualRent;

    // Yearly projections
    const projections: YearlyProjection[] = [];
    let cumulativeIncome = 0;

    for (let year = 1; year <= projectionYears; year++) {
      const propertyValue =
        purchasePrice * Math.pow(1 + annualAppreciation / 100, year);
      const yearlyRent = effectiveAnnualRent * Math.pow(1.03, year - 1); // 3% rent increase
      const yearlyExpenses = annualExpenses * Math.pow(1.02, year - 1); // 2% expense increase
      const netIncome = yearlyRent - yearlyExpenses;
      cumulativeIncome += netIncome;
      const appreciation = propertyValue - purchasePrice;
      const totalReturn = cumulativeIncome + appreciation;
      const roi = (totalReturn / downPaymentAmount) * 100;

      projections.push({
        year,
        propertyValue,
        rentalIncome: yearlyRent,
        totalExpenses: yearlyExpenses,
        netIncome,
        cumulativeIncome,
        totalReturn,
        roi,
      });
    }

    return {
      downPaymentAmount,
      loanAmount,
      grossAnnualRent,
      effectiveAnnualRent,
      netOperatingIncome,
      capRate,
      cashOnCashReturn,
      grossRentMultiplier,
      projections,
    };
  }, [
    purchasePrice,
    downPayment,
    monthlyRent,
    annualAppreciation,
    annualExpenses,
    vacancyRate,
    projectionYears,
  ]);

  const MetricCard = ({
    icon: Icon,
    label,
    value,
    subtext,
    highlight = false,
  }: {
    icon: React.ElementType;
    label: string;
    value: string;
    subtext?: string;
    highlight?: boolean;
  }) => (
    <div
      className={cn(
        'p-4 rounded-lg',
        highlight ? 'bg-primary text-white' : 'bg-gray-50'
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon size={18} className={highlight ? 'text-white/70' : 'text-primary'} />
        <span
          className={cn(
            'text-sm font-medium',
            highlight ? 'text-white/70' : 'text-gray-500'
          )}
        >
          {label}
        </span>
      </div>
      <p className={cn('text-xl font-bold', highlight ? 'text-white' : 'text-gray-900')}>
        {value}
      </p>
      {subtext && (
        <p className={cn('text-xs mt-1', highlight ? 'text-white/60' : 'text-gray-400')}>
          {subtext}
        </p>
      )}
    </div>
  );

  return (
    <div className={cn('bg-white rounded-xl border border-border overflow-hidden', className)}>
      {/* Header */}
      <div className="p-6 border-b border-border bg-gradient-to-r from-primary/5 to-accent-gold/5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Calculator size={24} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{t('title')}</h3>
            <p className="text-sm text-gray-500">{t('subtitle')}</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-6 space-y-6">
        {/* Basic Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={t('purchasePrice')}
            type="number"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(Number(e.target.value))}
            icon={<DollarSign size={16} />}
          />
          <Input
            label={t('downPayment')}
            type="number"
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            icon={<Percent size={16} />}
          />
          <Input
            label={t('monthlyRent')}
            type="number"
            value={monthlyRent}
            onChange={(e) => setMonthlyRent(Number(e.target.value))}
            icon={<PiggyBank size={16} />}
          />
          <Input
            label={t('annualAppreciation')}
            type="number"
            value={annualAppreciation}
            onChange={(e) => setAnnualAppreciation(Number(e.target.value))}
            icon={<TrendingUp size={16} />}
          />
        </div>

        {/* Advanced Settings */}
        <div>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm text-primary hover:underline"
          >
            {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {t('advancedSettings')}
          </button>

          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Input
                label={t('annualExpenses')}
                type="number"
                value={annualExpenses}
                onChange={(e) => setAnnualExpenses(Number(e.target.value))}
              />
              <Input
                label={t('vacancyRate')}
                type="number"
                value={vacancyRate}
                onChange={(e) => setVacancyRate(Number(e.target.value))}
              />
              <Input
                label={t('projectionYears')}
                type="number"
                value={projectionYears}
                onChange={(e) => setProjectionYears(Number(e.target.value))}
                min={1}
                max={30}
              />
            </div>
          )}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            icon={Percent}
            label={t('capRate')}
            value={`${calculations.capRate.toFixed(2)}%`}
            subtext={t('capRateDesc')}
          />
          <MetricCard
            icon={TrendingUp}
            label={t('cashOnCash')}
            value={`${calculations.cashOnCashReturn.toFixed(2)}%`}
            subtext={t('cashOnCashDesc')}
            highlight
          />
          <MetricCard
            icon={DollarSign}
            label={t('netOperatingIncome')}
            value={formatPrice(convertPrice(calculations.netOperatingIncome))}
            subtext={t('perYear')}
          />
          <MetricCard
            icon={Calendar}
            label={t('grossRentMultiplier')}
            value={calculations.grossRentMultiplier.toFixed(1)}
            subtext={t('years')}
          />
        </div>

        {/* Projection Table */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h4 className="font-semibold text-gray-900">{t('projectionTitle')}</h4>
            <div className="group relative">
              <Info size={14} className="text-gray-400 cursor-help" />
              <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
                {t('projectionInfo')}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left font-medium text-gray-500">
                    {t('table.year')}
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">
                    {t('table.propertyValue')}
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">
                    {t('table.netIncome')}
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">
                    {t('table.totalReturn')}
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">
                    {t('table.roi')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {calculations.projections.map((proj) => (
                  <tr key={proj.year} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {t('yearNumber', { year: proj.year })}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {formatPrice(convertPrice(proj.propertyValue))}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {formatPrice(convertPrice(proj.netIncome))}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-green-600">
                      {formatPrice(convertPrice(proj.totalReturn))}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={cn(
                          'px-2 py-1 rounded-full text-xs font-semibold',
                          proj.roi >= 50
                            ? 'bg-green-100 text-green-700'
                            : proj.roi >= 20
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        )}
                      >
                        {proj.roi.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="p-4 bg-gradient-to-r from-primary to-primary-dark rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">{t('totalReturnAfter', { years: projectionYears })}</p>
              <p className="text-2xl font-bold mt-1">
                {formatPrice(
                  convertPrice(
                    calculations.projections[projectionYears - 1]?.totalReturn || 0
                  )
                )}
              </p>
            </div>
            <div className="text-right">
              <p className="text-white/70 text-sm">{t('totalROI')}</p>
              <p className="text-2xl font-bold mt-1">
                {(calculations.projections[projectionYears - 1]?.roi || 0).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-gray-400 text-center">
          {t('disclaimer')}
        </p>
      </div>
    </div>
  );
}

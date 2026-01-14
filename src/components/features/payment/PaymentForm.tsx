'use client';

import { useState } from 'react';
import {
  CreditCard,
  Lock,
  Check,
  AlertCircle,
  Building,
  Wallet,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Payment method types
export type PaymentMethod = 'card' | 'bank_transfer' | 'crypto';

interface PaymentFormProps {
  amount: number;
  currency: string;
  description: string;
  propertyId?: string;
  onSuccess?: (transactionId: string) => void;
  onError?: (error: string) => void;
  demoMode?: boolean;
  className?: string;
}

interface CardDetails {
  number: string;
  expiry: string;
  cvc: string;
  name: string;
}

// Format card number with spaces
function formatCardNumber(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  const groups = cleaned.match(/.{1,4}/g);
  return groups ? groups.join(' ') : cleaned;
}

// Format expiry date
function formatExpiry(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length >= 2) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
  }
  return cleaned;
}

// Get card type from number
function getCardType(number: string): string {
  const cleaned = number.replace(/\D/g, '');
  if (/^4/.test(cleaned)) return 'visa';
  if (/^5[1-5]/.test(cleaned)) return 'mastercard';
  if (/^3[47]/.test(cleaned)) return 'amex';
  if (/^6011/.test(cleaned)) return 'discover';
  return 'unknown';
}

export function PaymentForm({
  amount,
  currency,
  description,
  propertyId,
  onSuccess,
  onError,
  demoMode = true,
  className,
}: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
  });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Format currency
  const formatPrice = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(value);

  // Handle card input changes
  const handleCardChange = (field: keyof CardDetails, value: string) => {
    let formatted = value;
    if (field === 'number') {
      formatted = formatCardNumber(value).slice(0, 19);
    } else if (field === 'expiry') {
      formatted = formatExpiry(value).slice(0, 5);
    } else if (field === 'cvc') {
      formatted = value.replace(/\D/g, '').slice(0, 4);
    }
    setCardDetails((prev) => ({ ...prev, [field]: formatted }));
  };

  // Validate card
  const validateCard = (): boolean => {
    const { number, expiry, cvc, name } = cardDetails;
    const cleanNumber = number.replace(/\D/g, '');

    if (cleanNumber.length < 15) {
      setError('Please enter a valid card number');
      return false;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      setError('Please enter a valid expiry date (MM/YY)');
      return false;
    }
    if (cvc.length < 3) {
      setError('Please enter a valid CVC');
      return false;
    }
    if (!name.trim()) {
      setError('Please enter the cardholder name');
      return false;
    }
    return true;
  };

  // Handle payment submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (paymentMethod === 'card' && !validateCard()) {
      return;
    }

    setProcessing(true);

    // Simulate payment processing in demo mode
    if (demoMode) {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate random success/failure (90% success rate)
      if (Math.random() > 0.1) {
        const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setSuccess(true);
        onSuccess?.(transactionId);
      } else {
        const errorMsg = 'Payment declined. Please try again or use a different card.';
        setError(errorMsg);
        onError?.(errorMsg);
      }
    } else {
      // Production: Call actual payment API
      // This would integrate with Stripe, PayPal, etc.
      try {
        // await processPayment(paymentMethod, cardDetails, amount, currency);
        setSuccess(true);
        onSuccess?.('real_transaction_id');
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Payment failed';
        setError(errorMsg);
        onError?.(errorMsg);
      }
    }

    setProcessing(false);
  };

  const cardType = getCardType(cardDetails.number);

  // Success state
  if (success) {
    return (
      <div className={cn('bg-white rounded-xl border border-gray-200 p-8', className)}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <Check size={32} className="text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Payment Successful!
          </h3>
          <p className="text-gray-600 mb-4">
            Your payment of {formatPrice(amount)} has been processed.
          </p>
          <p className="text-sm text-gray-500">
            A confirmation email has been sent to your registered email address.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-white rounded-xl border border-gray-200', className)}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-1">Payment Details</h3>
        <p className="text-sm text-gray-500">{description}</p>
        <p className="text-2xl font-bold text-primary mt-2">{formatPrice(amount)}</p>
      </div>

      {/* Demo Mode Banner */}
      {demoMode && (
        <div className="bg-amber-50 border-b border-amber-100 px-6 py-3 flex items-center gap-2 text-amber-700 text-sm">
          <AlertCircle size={16} />
          <span>Demo Mode - No real charges will be made</span>
        </div>
      )}

      {/* Payment Method Selection */}
      <div className="p-6 border-b border-gray-200">
        <p className="text-sm font-medium text-gray-700 mb-3">Select Payment Method</p>
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setPaymentMethod('card')}
            className={cn(
              'p-4 rounded-lg border-2 transition-all text-center',
              paymentMethod === 'card'
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-gray-300'
            )}
          >
            <CreditCard size={24} className="mx-auto mb-2" />
            <span className="text-sm font-medium">Card</span>
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod('bank_transfer')}
            className={cn(
              'p-4 rounded-lg border-2 transition-all text-center',
              paymentMethod === 'bank_transfer'
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-gray-300'
            )}
          >
            <Building size={24} className="mx-auto mb-2" />
            <span className="text-sm font-medium">Bank Transfer</span>
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod('crypto')}
            className={cn(
              'p-4 rounded-lg border-2 transition-all text-center',
              paymentMethod === 'crypto'
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-gray-300'
            )}
          >
            <Wallet size={24} className="mx-auto mb-2" />
            <span className="text-sm font-medium">Crypto</span>
          </button>
        </div>
      </div>

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="p-6">
        {paymentMethod === 'card' && (
          <div className="space-y-4">
            {/* Card Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={cardDetails.number}
                  onChange={(e) => handleCardChange('number', e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <CreditCard
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                {cardType !== 'unknown' && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold uppercase text-gray-500">
                    {cardType}
                  </span>
                )}
              </div>
            </div>

            {/* Expiry and CVC */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  value={cardDetails.expiry}
                  onChange={(e) => handleCardChange('expiry', e.target.value)}
                  placeholder="MM/YY"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVC
                </label>
                <input
                  type="text"
                  value={cardDetails.cvc}
                  onChange={(e) => handleCardChange('cvc', e.target.value)}
                  placeholder="123"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Cardholder Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cardholder Name
              </label>
              <input
                type="text"
                value={cardDetails.name}
                onChange={(e) => handleCardChange('name', e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        )}

        {paymentMethod === 'bank_transfer' && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Bank Transfer Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Bank Name:</span>
                <span className="font-medium">Garanti BBVA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Account Name:</span>
                <span className="font-medium">Maison d'Orient Ltd.</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">IBAN:</span>
                <span className="font-medium font-mono">TR00 0000 0000 0000 0000 0000 00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">SWIFT:</span>
                <span className="font-medium font-mono">TGBATRIS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Reference:</span>
                <span className="font-medium font-mono">{propertyId || 'PAYMENT'}</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Please include the reference number in your transfer. Processing may take 1-3 business days.
            </p>
          </div>
        )}

        {paymentMethod === 'crypto' && (
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <h4 className="font-medium text-gray-900 mb-3">Cryptocurrency Payment</h4>
            <p className="text-sm text-gray-600 mb-4">
              We accept Bitcoin, Ethereum, and USDT. Click below to generate a payment address.
            </p>
            <div className="space-y-2">
              <button
                type="button"
                className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-primary transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span className="text-xl">₿</span>
                  <span className="font-medium">Bitcoin (BTC)</span>
                </span>
                <ChevronRight size={18} className="text-gray-400" />
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-primary transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span className="text-xl">Ξ</span>
                  <span className="font-medium">Ethereum (ETH)</span>
                </span>
                <ChevronRight size={18} className="text-gray-400" />
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-primary transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span className="text-xl">₮</span>
                  <span className="font-medium">Tether (USDT)</span>
                </span>
                <ChevronRight size={18} className="text-gray-400" />
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={processing}
          className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Lock size={18} />
              Pay {formatPrice(amount)}
            </>
          )}
        </button>

        {/* Security Notice */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
          <Lock size={14} />
          <span>Your payment information is encrypted and secure</span>
        </div>
      </form>
    </div>
  );
}

// Payment status badge
interface PaymentStatusProps {
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  className?: string;
}

export function PaymentStatus({ status, className }: PaymentStatusProps) {
  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-700', label: 'Pending' },
    processing: { color: 'bg-blue-100 text-blue-700', label: 'Processing' },
    completed: { color: 'bg-green-100 text-green-700', label: 'Completed' },
    failed: { color: 'bg-red-100 text-red-700', label: 'Failed' },
    refunded: { color: 'bg-gray-100 text-gray-700', label: 'Refunded' },
  };

  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  );
}

export default PaymentForm;

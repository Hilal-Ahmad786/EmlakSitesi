'use client';

import { useState, useEffect } from 'react';
import { X, Mail, Gift, CheckCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NewsletterPopupProps {
  delay?: number; // Delay in ms before showing
  showOnExitIntent?: boolean;
}

export function NewsletterPopup({ delay = 10000, showOnExitIntent = true }: NewsletterPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [preferences, setPreferences] = useState({
    newListings: true,
    priceDrops: true,
    marketReports: false,
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  useEffect(() => {
    // Check if already subscribed or dismissed recently
    const dismissed = localStorage.getItem('newsletter_popup_dismissed');
    const subscribed = localStorage.getItem('newsletter_subscribed');

    if (subscribed) return;

    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      // Don't show for 7 days after dismissal
      if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
        return;
      }
    }

    // Show after delay
    const delayTimer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    // Exit intent detection
    const handleExitIntent = (e: MouseEvent) => {
      if (showOnExitIntent && e.clientY < 10 && !isVisible) {
        setIsVisible(true);
      }
    };

    document.addEventListener('mouseout', handleExitIntent);

    return () => {
      clearTimeout(delayTimer);
      document.removeEventListener('mouseout', handleExitIntent);
    };
  }, [delay, showOnExitIntent, isVisible]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('newsletter_popup_dismissed', Date.now().toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Store subscription
    localStorage.setItem('newsletter_subscribed', 'true');
    localStorage.setItem('newsletter_email', email);
    localStorage.setItem('newsletter_preferences', JSON.stringify(preferences));

    setStatus('success');

    // Close after success
    setTimeout(() => {
      setIsVisible(false);
    }, 2000);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-up">
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X size={20} />
        </button>

        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-primary to-accent-gold p-6 text-white text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
            <Gift size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Don't Miss Out!</h2>
          <p className="text-white/80">
            Subscribe to receive exclusive property alerts and market insights
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {status === 'success' ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Welcome aboard!
              </h3>
              <p className="text-gray-500">
                You'll receive your first newsletter soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What interests you?
                </label>
                <div className="space-y-2">
                  {[
                    { key: 'newListings', label: 'New Property Listings' },
                    { key: 'priceDrops', label: 'Price Drop Alerts' },
                    { key: 'marketReports', label: 'Market Reports & Insights' },
                  ].map((pref) => (
                    <label
                      key={pref.key}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={preferences[pref.key as keyof typeof preferences]}
                        onChange={(e) =>
                          setPreferences({
                            ...preferences,
                            [pref.key]: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-primary rounded focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700">{pref.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  'Subscribe Now'
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                By subscribing, you agree to receive marketing emails. Unsubscribe anytime.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

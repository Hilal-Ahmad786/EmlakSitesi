'use client';

import { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { cn } from '@/lib/utils';

export function InstallPrompt() {
  const { isInstallable, isInstalled, install } = usePWA();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has dismissed before
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      // Show again after 7 days
      if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
        setIsDismissed(true);
      }
    }

    // Delay showing the prompt
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  const handleInstall = async () => {
    const success = await install();
    if (success) {
      setIsDismissed(true);
    }
  };

  if (!isInstallable || isInstalled || isDismissed || !isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 animate-slide-up">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Smartphone size={24} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-gray-900">Install App</h3>
                <button
                  onClick={handleDismiss}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Install Maison d'Orient for quick access and offline browsing
              </p>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleDismiss}
              className="flex-1 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Not now
            </button>
            <button
              onClick={handleInstall}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
            >
              <Download size={16} />
              Install
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OfflineBanner() {
  const { isOnline } = usePWA();
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
    }
  }, [isOnline]);

  if (isOnline && !wasOffline) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed top-0 left-0 right-0 z-50 px-4 py-2 text-center text-sm font-medium transition-colors duration-300',
        isOnline
          ? 'bg-green-500 text-white'
          : 'bg-yellow-500 text-yellow-900'
      )}
    >
      {isOnline ? (
        <>You're back online!</>
      ) : (
        <>You're offline. Some features may be limited.</>
      )}
    </div>
  );
}

export function UpdatePrompt() {
  const { isUpdateAvailable, applyUpdate } = usePWA();

  if (!isUpdateAvailable) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50">
      <div className="bg-blue-600 text-white rounded-xl shadow-2xl p-4">
        <h3 className="font-semibold mb-2">Update Available</h3>
        <p className="text-sm text-blue-100 mb-4">
          A new version of the app is available. Update to get the latest features.
        </p>
        <button
          onClick={applyUpdate}
          className="w-full px-4 py-2 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
        >
          Update Now
        </button>
      </div>
    </div>
  );
}

'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

interface GoogleAnalyticsProps {
  measurementId: string;
  debugMode?: boolean;
}

// Inner component that uses useSearchParams
function GoogleAnalyticsInner({
  measurementId,
  debugMode = false,
}: GoogleAnalyticsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!measurementId) return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');

    // Track page view on route change
    const gtag = (window as unknown as { gtag?: Function }).gtag;
    if (typeof gtag === 'function') {
      gtag('config', measurementId, {
        page_path: url,
        debug_mode: debugMode,
      });
    }
  }, [pathname, searchParams, measurementId, debugMode]);

  return null;
}

export function GoogleAnalytics({
  measurementId,
  debugMode = false,
}: GoogleAnalyticsProps) {
  if (!measurementId) {
    console.warn('Google Analytics: No measurement ID provided');
    return null;
  }

  return (
    <>
      {/* Google Analytics Script */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}'${debugMode ? ", { debug_mode: true }" : ""});
          `,
        }}
      />

      {/* Page view tracker */}
      <Suspense fallback={null}>
        <GoogleAnalyticsInner measurementId={measurementId} debugMode={debugMode} />
      </Suspense>
    </>
  );
}

// Google Analytics 4 Enhanced Ecommerce events for real estate
export const ga4Events = {
  // View property listing
  viewItemList: (properties: Array<{ id: string; name: string; price: number }>) => {
    const gtag = (window as unknown as { gtag?: Function }).gtag;
    if (typeof gtag !== 'function') return;

    gtag('event', 'view_item_list', {
      item_list_id: 'properties',
      item_list_name: 'Property Listings',
      items: properties.map((p, index) => ({
        item_id: p.id,
        item_name: p.name,
        price: p.price,
        index,
        item_category: 'property',
      })),
    });
  },

  // View single property
  viewItem: (property: {
    id: string;
    name: string;
    price: number;
    category?: string;
    location?: string;
  }) => {
    const gtag = (window as unknown as { gtag?: Function }).gtag;
    if (typeof gtag !== 'function') return;

    gtag('event', 'view_item', {
      currency: 'EUR',
      value: property.price,
      items: [
        {
          item_id: property.id,
          item_name: property.name,
          price: property.price,
          item_category: property.category || 'property',
          item_category2: property.location,
        },
      ],
    });
  },

  // Add to favorites (wishlist)
  addToWishlist: (property: {
    id: string;
    name: string;
    price: number;
  }) => {
    const gtag = (window as unknown as { gtag?: Function }).gtag;
    if (typeof gtag !== 'function') return;

    gtag('event', 'add_to_wishlist', {
      currency: 'EUR',
      value: property.price,
      items: [
        {
          item_id: property.id,
          item_name: property.name,
          price: property.price,
          item_category: 'property',
        },
      ],
    });
  },

  // Generate lead
  generateLead: (value?: number, currency = 'EUR') => {
    const gtag = (window as unknown as { gtag?: Function }).gtag;
    if (typeof gtag !== 'function') return;

    gtag('event', 'generate_lead', {
      currency,
      value: value || 0,
    });
  },

  // Sign up
  signUp: (method: string) => {
    const gtag = (window as unknown as { gtag?: Function }).gtag;
    if (typeof gtag !== 'function') return;

    gtag('event', 'sign_up', { method });
  },

  // Login
  login: (method: string) => {
    const gtag = (window as unknown as { gtag?: Function }).gtag;
    if (typeof gtag !== 'function') return;

    gtag('event', 'login', { method });
  },

  // Search
  search: (searchTerm: string) => {
    const gtag = (window as unknown as { gtag?: Function }).gtag;
    if (typeof gtag !== 'function') return;

    gtag('event', 'search', { search_term: searchTerm });
  },

  // Share
  share: (method: string, contentType: string, itemId: string) => {
    const gtag = (window as unknown as { gtag?: Function }).gtag;
    if (typeof gtag !== 'function') return;

    gtag('event', 'share', {
      method,
      content_type: contentType,
      item_id: itemId,
    });
  },

  // Custom event
  custom: (eventName: string, params?: Record<string, unknown>) => {
    const gtag = (window as unknown as { gtag?: Function }).gtag;
    if (typeof gtag !== 'function') return;

    gtag('event', eventName, params);
  },
};

export default GoogleAnalytics;

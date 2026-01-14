'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

interface MetaPixelProps {
  pixelId: string;
  autoTrackPageViews?: boolean;
}

// Inner component that uses useSearchParams
function MetaPixelPageTracker({ pixelId }: { pixelId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pixelId) return;

    // Track page view on route change
    const fbq = (window as unknown as { fbq?: Function }).fbq;
    if (typeof fbq === 'function') {
      fbq('track', 'PageView');
    }
  }, [pathname, searchParams, pixelId]);

  return null;
}

export function MetaPixel({ pixelId, autoTrackPageViews = true }: MetaPixelProps) {
  if (!pixelId) {
    console.warn('Meta Pixel: No pixel ID provided');
    return null;
  }

  return (
    <>
      {/* Meta Pixel Base Code */}
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
          `,
        }}
      />

      {/* NoScript fallback */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>

      {/* Page view tracker for route changes */}
      {autoTrackPageViews && (
        <Suspense fallback={null}>
          <MetaPixelPageTracker pixelId={pixelId} />
        </Suspense>
      )}
    </>
  );
}

// Meta Pixel Standard Events for Real Estate
export const metaPixelEvents = {
  // Standard Events
  pageView: () => {
    const fbq = (window as unknown as { fbq?: Function }).fbq;
    if (typeof fbq === 'function') {
      fbq('track', 'PageView');
    }
  },

  // View property content
  viewContent: (params: {
    content_name?: string;
    content_category?: string;
    content_ids?: string[];
    content_type?: string;
    value?: number;
    currency?: string;
  }) => {
    const fbq = (window as unknown as { fbq?: Function }).fbq;
    if (typeof fbq === 'function') {
      fbq('track', 'ViewContent', {
        content_type: 'property',
        currency: 'EUR',
        ...params,
      });
    }
  },

  // Search for properties
  search: (searchString: string, filters?: Record<string, unknown>) => {
    const fbq = (window as unknown as { fbq?: Function }).fbq;
    if (typeof fbq === 'function') {
      fbq('track', 'Search', {
        search_string: searchString,
        content_type: 'property',
        ...filters,
      });
    }
  },

  // Add property to wishlist/favorites
  addToWishlist: (params: {
    content_name?: string;
    content_category?: string;
    content_ids?: string[];
    value?: number;
    currency?: string;
  }) => {
    const fbq = (window as unknown as { fbq?: Function }).fbq;
    if (typeof fbq === 'function') {
      fbq('track', 'AddToWishlist', {
        content_type: 'property',
        currency: 'EUR',
        ...params,
      });
    }
  },

  // Lead generated (contact form, inquiry, etc.)
  lead: (params?: {
    content_name?: string;
    content_category?: string;
    value?: number;
    currency?: string;
  }) => {
    const fbq = (window as unknown as { fbq?: Function }).fbq;
    if (typeof fbq === 'function') {
      fbq('track', 'Lead', {
        currency: 'EUR',
        ...params,
      });
    }
  },

  // Schedule a viewing/appointment
  schedule: (params?: {
    content_name?: string;
    content_ids?: string[];
  }) => {
    const fbq = (window as unknown as { fbq?: Function }).fbq;
    if (typeof fbq === 'function') {
      fbq('track', 'Schedule', params);
    }
  },

  // Contact button click
  contact: () => {
    const fbq = (window as unknown as { fbq?: Function }).fbq;
    if (typeof fbq === 'function') {
      fbq('track', 'Contact');
    }
  },

  // Newsletter subscribe
  subscribe: (params?: {
    value?: number;
    currency?: string;
    predicted_ltv?: number;
  }) => {
    const fbq = (window as unknown as { fbq?: Function }).fbq;
    if (typeof fbq === 'function') {
      fbq('track', 'Subscribe', params);
    }
  },

  // Complete registration
  completeRegistration: (params?: {
    content_name?: string;
    status?: string;
    value?: number;
    currency?: string;
  }) => {
    const fbq = (window as unknown as { fbq?: Function }).fbq;
    if (typeof fbq === 'function') {
      fbq('track', 'CompleteRegistration', params);
    }
  },

  // Find location (map interaction)
  findLocation: () => {
    const fbq = (window as unknown as { fbq?: Function }).fbq;
    if (typeof fbq === 'function') {
      fbq('track', 'FindLocation');
    }
  },

  // Custom Events
  custom: (eventName: string, params?: Record<string, unknown>) => {
    const fbq = (window as unknown as { fbq?: Function }).fbq;
    if (typeof fbq === 'function') {
      fbq('trackCustom', eventName, params);
    }
  },

  // Real estate specific custom events
  virtualTourView: (propertyId: string, propertyName?: string) => {
    const fbq = (window as unknown as { fbq?: Function }).fbq;
    if (typeof fbq === 'function') {
      fbq('trackCustom', 'VirtualTourView', {
        property_id: propertyId,
        property_name: propertyName,
      });
    }
  },

  propertyCompare: (propertyIds: string[]) => {
    const fbq = (window as unknown as { fbq?: Function }).fbq;
    if (typeof fbq === 'function') {
      fbq('trackCustom', 'PropertyCompare', {
        property_ids: propertyIds,
        property_count: propertyIds.length,
      });
    }
  },

  mortgageCalculation: (params: {
    property_price?: number;
    loan_amount?: number;
    monthly_payment?: number;
  }) => {
    const fbq = (window as unknown as { fbq?: Function }).fbq;
    if (typeof fbq === 'function') {
      fbq('trackCustom', 'MortgageCalculation', params);
    }
  },

  documentRequest: (propertyId: string, documentTypes: string[]) => {
    const fbq = (window as unknown as { fbq?: Function }).fbq;
    if (typeof fbq === 'function') {
      fbq('trackCustom', 'DocumentRequest', {
        property_id: propertyId,
        document_types: documentTypes,
      });
    }
  },

  shareProperty: (propertyId: string, platform: string) => {
    const fbq = (window as unknown as { fbq?: Function }).fbq;
    if (typeof fbq === 'function') {
      fbq('trackCustom', 'ShareProperty', {
        property_id: propertyId,
        share_platform: platform,
      });
    }
  },

  referralInvite: (method: string) => {
    const fbq = (window as unknown as { fbq?: Function }).fbq;
    if (typeof fbq === 'function') {
      fbq('trackCustom', 'ReferralInvite', { method });
    }
  },
};

export default MetaPixel;

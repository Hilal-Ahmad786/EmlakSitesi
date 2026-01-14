'use client';

import { createContext, useContext, useCallback, ReactNode } from 'react';
import { GoogleAnalytics, ga4Events } from './GoogleAnalytics';
import { MetaPixel, metaPixelEvents } from './MetaPixel';
import analytics, { PropertyEventData, SearchEventData } from '@/lib/analytics/events';

interface AnalyticsConfig {
  googleAnalytics?: {
    measurementId: string;
    debugMode?: boolean;
  };
  metaPixel?: {
    pixelId: string;
    autoTrackPageViews?: boolean;
  };
  enabled?: boolean;
}

interface AnalyticsContextValue {
  config: AnalyticsConfig;
  track: typeof analytics;
  ga4: typeof ga4Events;
  meta: typeof metaPixelEvents;
  // Convenience methods
  trackPropertyView: (property: PropertyEventData) => void;
  trackSearch: (searchData: SearchEventData) => void;
  trackFavorite: (property: PropertyEventData) => void;
  trackLead: (formType: string, propertyId?: string) => void;
  trackAppointment: (propertyId: string) => void;
  trackShare: (propertyId: string, platform: string) => void;
}

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);

interface AnalyticsProviderProps {
  children: ReactNode;
  config: AnalyticsConfig;
}

export function AnalyticsProvider({ children, config }: AnalyticsProviderProps) {
  const { enabled = true } = config;

  // Convenience method: Track property view
  const trackPropertyView = useCallback(
    (property: PropertyEventData) => {
      if (!enabled) return;

      // Track in our unified system
      analytics.viewProperty(property);

      // GA4 enhanced ecommerce
      ga4Events.viewItem({
        id: property.property_id,
        name: property.property_title || '',
        price: property.property_price || 0,
        category: property.property_type,
        location: property.property_location,
      });

      // Meta Pixel
      metaPixelEvents.viewContent({
        content_ids: [property.property_id],
        content_name: property.property_title,
        content_category: property.property_type,
        value: property.property_price,
        currency: property.property_currency || 'EUR',
      });
    },
    [enabled]
  );

  // Convenience method: Track search
  const trackSearch = useCallback(
    (searchData: SearchEventData) => {
      if (!enabled) return;

      analytics.searchProperties(searchData);

      if (searchData.search_query) {
        ga4Events.search(searchData.search_query);
        metaPixelEvents.search(searchData.search_query, searchData.filters);
      }
    },
    [enabled]
  );

  // Convenience method: Track favorite
  const trackFavorite = useCallback(
    (property: PropertyEventData) => {
      if (!enabled) return;

      analytics.favoriteProperty(property);

      ga4Events.addToWishlist({
        id: property.property_id,
        name: property.property_title || '',
        price: property.property_price || 0,
      });

      metaPixelEvents.addToWishlist({
        content_ids: [property.property_id],
        content_name: property.property_title,
        value: property.property_price,
        currency: property.property_currency || 'EUR',
      });
    },
    [enabled]
  );

  // Convenience method: Track lead
  const trackLead = useCallback(
    (formType: string, propertyId?: string) => {
      if (!enabled) return;

      analytics.submitContactForm({
        form_type: formType as 'contact' | 'inquiry' | 'appointment' | 'document_request',
        property_id: propertyId,
      });

      ga4Events.generateLead();
      metaPixelEvents.lead({
        content_category: formType,
      });
    },
    [enabled]
  );

  // Convenience method: Track appointment
  const trackAppointment = useCallback(
    (propertyId: string) => {
      if (!enabled) return;

      analytics.requestAppointment(propertyId, 'viewing');
      metaPixelEvents.schedule({ content_ids: [propertyId] });
    },
    [enabled]
  );

  // Convenience method: Track share
  const trackShare = useCallback(
    (propertyId: string, platform: string) => {
      if (!enabled) return;

      analytics.shareProperty(
        { property_id: propertyId },
        platform
      );

      ga4Events.share(platform, 'property', propertyId);
      metaPixelEvents.shareProperty(propertyId, platform);
    },
    [enabled]
  );

  const contextValue: AnalyticsContextValue = {
    config,
    track: analytics,
    ga4: ga4Events,
    meta: metaPixelEvents,
    trackPropertyView,
    trackSearch,
    trackFavorite,
    trackLead,
    trackAppointment,
    trackShare,
  };

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {/* Render analytics scripts */}
      {enabled && config.googleAnalytics?.measurementId && (
        <GoogleAnalytics
          measurementId={config.googleAnalytics.measurementId}
          debugMode={config.googleAnalytics.debugMode}
        />
      )}
      {enabled && config.metaPixel?.pixelId && (
        <MetaPixel
          pixelId={config.metaPixel.pixelId}
          autoTrackPageViews={config.metaPixel.autoTrackPageViews}
        />
      )}
      {children}
    </AnalyticsContext.Provider>
  );
}

// Hook to use analytics
export function useAnalytics(): AnalyticsContextValue {
  const context = useContext(AnalyticsContext);

  if (!context) {
    // Return a no-op version if not inside provider
    return {
      config: { enabled: false },
      track: analytics,
      ga4: ga4Events,
      meta: metaPixelEvents,
      trackPropertyView: () => {},
      trackSearch: () => {},
      trackFavorite: () => {},
      trackLead: () => {},
      trackAppointment: () => {},
      trackShare: () => {},
    };
  }

  return context;
}

// Export for convenience
export { analytics, ga4Events, metaPixelEvents };

export default AnalyticsProvider;

'use client';

// Analytics event types
export type AnalyticsEventName =
  | 'page_view'
  | 'property_view'
  | 'property_search'
  | 'property_favorite'
  | 'property_compare'
  | 'property_share'
  | 'contact_form_submit'
  | 'newsletter_signup'
  | 'appointment_request'
  | 'mortgage_calculator_use'
  | 'roi_calculator_use'
  | 'virtual_tour_view'
  | 'document_request'
  | 'phone_click'
  | 'whatsapp_click'
  | 'email_click'
  | 'lead_generated'
  | 'sign_up'
  | 'login';

export interface PropertyEventData {
  property_id: string;
  property_title?: string;
  property_type?: string;
  property_price?: number;
  property_currency?: string;
  property_location?: string;
  property_bedrooms?: number;
  property_bathrooms?: number;
}

export interface SearchEventData {
  search_query?: string;
  filters?: {
    property_type?: string;
    min_price?: number;
    max_price?: number;
    bedrooms?: number;
    location?: string;
  };
  results_count?: number;
}

export interface ContactEventData {
  form_type: 'contact' | 'inquiry' | 'appointment' | 'document_request';
  property_id?: string;
  contact_method?: 'form' | 'phone' | 'whatsapp' | 'email';
}

export interface CalculatorEventData {
  calculator_type: 'mortgage' | 'roi';
  property_price?: number;
  loan_amount?: number;
  interest_rate?: number;
}

// Generic event data type
export type AnalyticsEventData =
  | PropertyEventData
  | SearchEventData
  | ContactEventData
  | CalculatorEventData
  | Record<string, unknown>;

// Check if we're in browser
const isBrowser = typeof window !== 'undefined';

// Google Analytics 4 event tracking
export function trackGA4Event(
  eventName: AnalyticsEventName | string,
  eventData?: AnalyticsEventData
): void {
  if (!isBrowser) return;

  const gtag = (window as unknown as { gtag?: Function }).gtag;
  if (typeof gtag === 'function') {
    gtag('event', eventName, eventData);
  }
}

// Meta Pixel event tracking
export function trackMetaEvent(
  eventName: string,
  eventData?: Record<string, unknown>
): void {
  if (!isBrowser) return;

  const fbq = (window as unknown as { fbq?: Function }).fbq;
  if (typeof fbq === 'function') {
    if (eventData) {
      fbq('track', eventName, eventData);
    } else {
      fbq('track', eventName);
    }
  }
}

// Custom Meta Pixel events
export function trackMetaCustomEvent(
  eventName: string,
  eventData?: Record<string, unknown>
): void {
  if (!isBrowser) return;

  const fbq = (window as unknown as { fbq?: Function }).fbq;
  if (typeof fbq === 'function') {
    if (eventData) {
      fbq('trackCustom', eventName, eventData);
    } else {
      fbq('trackCustom', eventName);
    }
  }
}

// Combined tracking - sends to both GA4 and Meta
export function trackEvent(
  eventName: AnalyticsEventName | string,
  eventData?: AnalyticsEventData,
  options?: {
    ga4?: boolean;
    meta?: boolean;
    metaEventName?: string; // Optional different name for Meta
  }
): void {
  const { ga4 = true, meta = true, metaEventName } = options || {};

  if (ga4) {
    trackGA4Event(eventName, eventData);
  }

  if (meta) {
    // Map common events to Meta standard events
    const metaEvent = metaEventName || mapToMetaEvent(eventName);
    const metaData = mapToMetaData(eventName, eventData);

    if (isStandardMetaEvent(metaEvent)) {
      trackMetaEvent(metaEvent, metaData);
    } else {
      trackMetaCustomEvent(metaEvent, metaData);
    }
  }
}

// Map our events to Meta standard events
function mapToMetaEvent(eventName: string): string {
  const mapping: Record<string, string> = {
    'page_view': 'PageView',
    'property_view': 'ViewContent',
    'property_search': 'Search',
    'property_favorite': 'AddToWishlist',
    'contact_form_submit': 'Lead',
    'newsletter_signup': 'Subscribe',
    'appointment_request': 'Schedule',
    'lead_generated': 'Lead',
    'sign_up': 'CompleteRegistration',
  };

  return mapping[eventName] || eventName;
}

// Map event data to Meta format
function mapToMetaData(
  eventName: string,
  eventData?: AnalyticsEventData
): Record<string, unknown> | undefined {
  if (!eventData) return undefined;

  // Map property view to ViewContent format
  if (eventName === 'property_view' && 'property_id' in eventData) {
    const data = eventData as PropertyEventData;
    return {
      content_type: 'property',
      content_ids: [data.property_id],
      content_name: data.property_title,
      value: data.property_price,
      currency: data.property_currency || 'EUR',
    };
  }

  // Map search to Search format
  if (eventName === 'property_search' && 'search_query' in eventData) {
    const data = eventData as SearchEventData;
    return {
      search_string: data.search_query,
      content_type: 'property',
    };
  }

  return eventData as Record<string, unknown>;
}

// Check if event is a standard Meta event
function isStandardMetaEvent(eventName: string): boolean {
  const standardEvents = [
    'PageView',
    'ViewContent',
    'Search',
    'AddToCart',
    'AddToWishlist',
    'InitiateCheckout',
    'AddPaymentInfo',
    'Purchase',
    'Lead',
    'CompleteRegistration',
    'Contact',
    'CustomizeProduct',
    'Donate',
    'FindLocation',
    'Schedule',
    'StartTrial',
    'SubmitApplication',
    'Subscribe',
  ];

  return standardEvents.includes(eventName);
}

// Convenience functions for common events
export const analytics = {
  // Page views
  pageView: (pagePath: string, pageTitle?: string) => {
    trackEvent('page_view', { page_path: pagePath, page_title: pageTitle });
  },

  // Property events
  viewProperty: (property: PropertyEventData) => {
    trackEvent('property_view', property);
  },

  searchProperties: (searchData: SearchEventData) => {
    trackEvent('property_search', searchData);
  },

  favoriteProperty: (property: PropertyEventData) => {
    trackEvent('property_favorite', property);
  },

  compareProperties: (propertyIds: string[]) => {
    trackEvent('property_compare', { property_ids: propertyIds });
  },

  shareProperty: (property: PropertyEventData, platform: string) => {
    trackEvent('property_share', { ...property, share_platform: platform });
  },

  // Contact events
  submitContactForm: (data: ContactEventData) => {
    trackEvent('contact_form_submit', data);
  },

  signupNewsletter: (email: string, preferences?: string[]) => {
    trackEvent('newsletter_signup', { email_provided: true, preferences });
  },

  requestAppointment: (propertyId: string, appointmentType: string) => {
    trackEvent('appointment_request', {
      property_id: propertyId,
      appointment_type: appointmentType
    });
  },

  // Tool usage
  useMortgageCalculator: (data: CalculatorEventData) => {
    trackEvent('mortgage_calculator_use', data);
  },

  useROICalculator: (data: CalculatorEventData) => {
    trackEvent('roi_calculator_use', data);
  },

  // Virtual tour
  viewVirtualTour: (property: PropertyEventData) => {
    trackEvent('virtual_tour_view', property);
  },

  // Document request
  requestDocument: (propertyId: string, documentTypes: string[]) => {
    trackEvent('document_request', {
      property_id: propertyId,
      document_types: documentTypes
    });
  },

  // Click events
  clickPhone: (phoneNumber: string, context?: string) => {
    trackEvent('phone_click', { phone_number: phoneNumber, context });
  },

  clickWhatsApp: (phoneNumber: string, context?: string) => {
    trackEvent('whatsapp_click', { phone_number: phoneNumber, context });
  },

  clickEmail: (email: string, context?: string) => {
    trackEvent('email_click', { email, context });
  },

  // Auth events
  signUp: (method: string) => {
    trackEvent('sign_up', { method });
  },

  login: (method: string) => {
    trackEvent('login', { method });
  },
};

export default analytics;

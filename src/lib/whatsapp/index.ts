// WhatsApp Business API Integration Types and Utilities
// Note: This is a client-side helper. Server-side API calls require the WhatsApp Business API.

export interface WhatsAppConfig {
  businessPhone: string;
  businessName: string;
  catalogId?: string;
  welcomeMessage?: string;
}

export interface WhatsAppMessage {
  to: string;
  type: 'text' | 'template' | 'interactive';
  text?: {
    body: string;
  };
  template?: {
    name: string;
    language: {
      code: string;
    };
    components?: Array<{
      type: string;
      parameters: Array<{
        type: string;
        text?: string;
        image?: { link: string };
      }>;
    }>;
  };
}

// Generate WhatsApp click-to-chat URL
export function generateWhatsAppUrl(
  phoneNumber: string,
  message?: string
): string {
  const formattedPhone = phoneNumber.replace(/\D/g, '');
  const baseUrl = `https://wa.me/${formattedPhone}`;

  if (message) {
    return `${baseUrl}?text=${encodeURIComponent(message)}`;
  }

  return baseUrl;
}

// Generate WhatsApp API URL (for backend integration)
export function generateApiUrl(
  phoneNumber: string,
  message: string,
  apiVersion = 'v17.0'
): string {
  const formattedPhone = phoneNumber.replace(/\D/g, '');
  return `https://graph.facebook.com/${apiVersion}/${formattedPhone}/messages`;
}

// Format phone number for WhatsApp (requires country code)
export function formatPhoneForWhatsApp(
  phone: string,
  defaultCountryCode = '90' // Turkey
): string {
  // Remove all non-digit characters
  let digits = phone.replace(/\D/g, '');

  // If starts with 0, remove it and add country code
  if (digits.startsWith('0')) {
    digits = defaultCountryCode + digits.slice(1);
  }

  // If doesn't have country code (less than 10 digits or doesn't start with country code)
  if (digits.length <= 10) {
    digits = defaultCountryCode + digits;
  }

  return digits;
}

// Pre-defined message templates for real estate
export const messageTemplates = {
  // Property inquiry template
  propertyInquiry: (params: {
    propertyTitle: string;
    propertyId: string;
    propertyUrl: string;
  }) => `
Merhaba!

"${params.propertyTitle}" (Ref: ${params.propertyId}) mülkü hakkında bilgi almak istiyorum.

${params.propertyUrl}

Teşekkürler!
`.trim(),

  // Viewing request template
  viewingRequest: (params: {
    propertyTitle: string;
    preferredDate?: string;
    preferredTime?: string;
  }) => `
Merhaba!

"${params.propertyTitle}" mülkü için görüşme randevusu almak istiyorum.
${params.preferredDate ? `Tercih ettiğim tarih: ${params.preferredDate}` : ''}
${params.preferredTime ? `Tercih ettiğim saat: ${params.preferredTime}` : ''}

Lütfen uygun zamanları paylaşır mısınız?

Teşekkürler!
`.trim(),

  // Price negotiation template
  priceNegotiation: (params: {
    propertyTitle: string;
    currentPrice: string;
  }) => `
Merhaba!

"${params.propertyTitle}" mülkü ile ilgileniyorum.
Listelenen fiyat: ${params.currentPrice}

Fiyat ve ödeme seçenekleri hakkında görüşebilir miyiz?

Teşekkürler!
`.trim(),

  // Investment inquiry template
  investmentInquiry: (params: {
    budget: string;
    preferredAreas: string[];
    investmentType: 'rental' | 'resale' | 'both';
  }) => `
Merhaba!

Yatırım amaçlı mülk arıyorum.

Bütçe: ${params.budget}
Tercih edilen bölgeler: ${params.preferredAreas.join(', ')}
Yatırım türü: ${params.investmentType === 'rental' ? 'Kira getirisi' : params.investmentType === 'resale' ? 'Değer artışı' : 'Her ikisi'}

Uygun seçenekleri paylaşır mısınız?

Teşekkürler!
`.trim(),

  // Document request template
  documentRequest: (params: {
    propertyTitle: string;
    documents: string[];
  }) => `
Merhaba!

"${params.propertyTitle}" mülkü için aşağıdaki belgeleri talep ediyorum:
${params.documents.map((d) => `- ${d}`).join('\n')}

Teşekkürler!
`.trim(),

  // General greeting
  generalGreeting: () => `
Merhaba!

Maison d'Orient ile ilgileniyorum. Yardımcı olabilir misiniz?
`.trim(),

  // Follow-up template
  followUp: (params: { previousInquiryDate: string; propertyTitle?: string }) => `
Merhaba!

${params.previousInquiryDate} tarihinde ${params.propertyTitle ? `"${params.propertyTitle}" mülkü hakkında` : ''} görüşmüştük.

Bir gelişme var mı acaba?

Teşekkürler!
`.trim(),
};

// Tracking helper for WhatsApp clicks
export function trackWhatsAppClick(
  type: 'inquiry' | 'share' | 'support',
  propertyId?: string
): void {
  // This can be integrated with your analytics
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('whatsapp_click', {
      detail: { type, propertyId, timestamp: Date.now() },
    });
    window.dispatchEvent(event);

    // Also send to dataLayer if available (for GTM)
    const dataLayer = (window as unknown as { dataLayer?: unknown[] }).dataLayer;
    if (dataLayer) {
      dataLayer.push({
        event: 'whatsapp_click',
        whatsapp_click_type: type,
        property_id: propertyId,
      });
    }
  }
}

// Business hours check (Turkey timezone)
export function isBusinessHours(): boolean {
  const now = new Date();
  // Convert to Turkey time (UTC+3)
  const turkeyTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Istanbul' }));
  const hours = turkeyTime.getHours();
  const day = turkeyTime.getDay();

  // Business hours: Monday-Friday 9:00-18:00, Saturday 10:00-15:00
  if (day === 0) return false; // Sunday
  if (day === 6) return hours >= 10 && hours < 15; // Saturday
  return hours >= 9 && hours < 18; // Weekdays
}

// Get response time message based on business hours
export function getResponseTimeMessage(): string {
  if (isBusinessHours()) {
    return 'Typically replies within minutes';
  }
  return 'We will respond during business hours';
}

export default {
  generateWhatsAppUrl,
  formatPhoneForWhatsApp,
  messageTemplates,
  trackWhatsAppClick,
  isBusinessHours,
  getResponseTimeMessage,
};

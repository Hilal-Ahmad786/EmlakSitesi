// ============================================================================
// ADMIN PANEL UTILITY FUNCTIONS
// ============================================================================

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Classname utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generate slug from text
export function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[üÜ]/g, 'u')
    .replace(/[öÖ]/g, 'o')
    .replace(/[şŞ]/g, 's')
    .replace(/[çÇ]/g, 'c')
    .replace(/[ğĞ]/g, 'g')
    .replace(/[ıİ]/g, 'i')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// Format currency
export function formatCurrency(
  amount: number,
  currency: string = 'EUR',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format date
export function formatDate(
  date: Date | string,
  locale: string = 'en-US',
  options?: Intl.DateTimeFormatOptions
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  };
  return new Date(date).toLocaleDateString(locale, defaultOptions);
}

// Format date with time
export function formatDateTime(
  date: Date | string,
  locale: string = 'en-US'
): string {
  return new Date(date).toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Relative time (e.g., "2 hours ago")
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return formatDate(date);
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Get initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Status badge colors
export const statusColors: Record<string, { bg: string; text: string }> = {
  // Property Status
  DRAFT: { bg: 'bg-gray-100', text: 'text-gray-700' },
  PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  PUBLISHED: { bg: 'bg-green-100', text: 'text-green-700' },
  SOLD: { bg: 'bg-blue-100', text: 'text-blue-700' },
  RENTED: { bg: 'bg-purple-100', text: 'text-purple-700' },
  ARCHIVED: { bg: 'bg-red-100', text: 'text-red-700' },
  
  // Lead Status
  NEW: { bg: 'bg-blue-100', text: 'text-blue-700' },
  CONTACTED: { bg: 'bg-cyan-100', text: 'text-cyan-700' },
  QUALIFIED: { bg: 'bg-indigo-100', text: 'text-indigo-700' },
  VIEWING_SCHEDULED: { bg: 'bg-violet-100', text: 'text-violet-700' },
  NEGOTIATING: { bg: 'bg-amber-100', text: 'text-amber-700' },
  CLOSED_WON: { bg: 'bg-green-100', text: 'text-green-700' },
  CLOSED_LOST: { bg: 'bg-red-100', text: 'text-red-700' },
  
  // User Status
  ACTIVE: { bg: 'bg-green-100', text: 'text-green-700' },
  INACTIVE: { bg: 'bg-gray-100', text: 'text-gray-700' },
  SUSPENDED: { bg: 'bg-red-100', text: 'text-red-700' },
};

// Priority colors
export const priorityColors: Record<string, { bg: string; text: string }> = {
  LOW: { bg: 'bg-gray-100', text: 'text-gray-700' },
  MEDIUM: { bg: 'bg-blue-100', text: 'text-blue-700' },
  HIGH: { bg: 'bg-orange-100', text: 'text-orange-700' },
  URGENT: { bg: 'bg-red-100', text: 'text-red-700' },
};

// Role labels
export const roleLabels: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  AGENT: 'Agent',
  EDITOR: 'Editor',
};

// Property type labels
export const propertyTypeLabels: Record<string, string> = {
  APARTMENT: 'Apartment',
  VILLA: 'Villa',
  YALI: 'Yalı',
  PENTHOUSE: 'Penthouse',
  DUPLEX: 'Duplex',
  OFFICE: 'Office',
  RETAIL: 'Retail',
  LAND: 'Land',
  BUILDING: 'Building',
  OTHER: 'Other',
};

// Listing type labels
export const listingTypeLabels: Record<string, string> = {
  SALE: 'For Sale',
  RENT: 'For Rent',
  BOTH: 'Sale & Rent',
};

// Lead source labels
export const leadSourceLabels: Record<string, string> = {
  WEBSITE: 'Website',
  PHONE: 'Phone',
  EMAIL: 'Email',
  REFERRAL: 'Referral',
  SOCIAL_MEDIA: 'Social Media',
  WALK_IN: 'Walk-in',
  OTHER: 'Other',
};

// Lead status labels
export const leadStatusLabels: Record<string, string> = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  QUALIFIED: 'Qualified',
  VIEWING_SCHEDULED: 'Viewing Scheduled',
  NEGOTIATING: 'Negotiating',
  CLOSED_WON: 'Closed (Won)',
  CLOSED_LOST: 'Closed (Lost)',
  ARCHIVED: 'Archived',
};

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone (Turkish format)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+90|0)?[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Deep clone object
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// Check if object is empty
export function isEmpty(obj: object): boolean {
  return Object.keys(obj).length === 0;
}

// Get nested value from object
export function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

// Build query string from params
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  
  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

// Parse query string to object
export function parseQueryString(queryString: string): Record<string, string> {
  const params = new URLSearchParams(queryString);
  const result: Record<string, string> = {};
  
  params.forEach((value, key) => {
    result[key] = value;
  });
  
  return result;
}

// Generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// SEO helpers
export function generateMetaTitle(title: string, siteName: string = "Maison d'Orient"): string {
  return `${title} | ${siteName}`;
}

export function generateMetaDescription(text: string, maxLength: number = 160): string {
  const cleanText = text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  return truncateText(cleanText, maxLength);
}

// Schema.org generator for property
export function generatePropertySchema(property: any): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title?.en || property.title,
    description: property.description?.en || property.description,
    url: `https://maison-dorient.com/properties/${property.slug}`,
    datePosted: property.publishedAt || property.createdAt,
    image: property.images?.[0]?.url,
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: property.currency,
      availability: property.status === 'PUBLISHED' ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.address,
      addressLocality: property.neighborhood,
      addressRegion: property.city,
      addressCountry: property.country,
    },
    geo: property.latitude && property.longitude ? {
      '@type': 'GeoCoordinates',
      latitude: property.latitude,
      longitude: property.longitude,
    } : undefined,
    numberOfRooms: property.bedrooms,
    floorSize: {
      '@type': 'QuantitativeValue',
      value: property.size,
      unitCode: 'MTK', // Square meters
    },
  };
}

// Permission checker
export function hasPermission(userRole: string, requiredRole: string): boolean {
  const roleHierarchy = ['EDITOR', 'AGENT', 'MANAGER', 'ADMIN', 'SUPER_ADMIN'];
  const userRoleIndex = roleHierarchy.indexOf(userRole);
  const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);
  
  return userRoleIndex >= requiredRoleIndex;
}

// Export data as CSV
export function exportToCsv(data: any[], filename: string): void {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value || '');
        return `"${stringValue.replace(/"/g, '""')}"`;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
}

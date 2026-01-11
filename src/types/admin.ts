// ============================================================================
// ADMIN PANEL TYPE DEFINITIONS
// ============================================================================

// User Types
export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'AGENT' | 'EDITOR';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export interface CreateUserInput {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: UserRole;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  phone?: string;
  role?: UserRole;
  status?: UserStatus;
  avatar?: string;
}

// Property Types
export type PropertyType = 'APARTMENT' | 'VILLA' | 'YALI' | 'PENTHOUSE' | 'DUPLEX' | 'OFFICE' | 'RETAIL' | 'LAND' | 'BUILDING' | 'OTHER';
export type ListingType = 'SALE' | 'RENT' | 'BOTH';
export type PropertyStatus = 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'SOLD' | 'RENTED' | 'ARCHIVED';

export interface LocalizedString {
  en: string;
  tr: string;
}

export interface LocalizedArray {
  en: string[];
  tr: string[];
}

export interface PropertyImage {
  id: string;
  propertyId: string;
  url: string;
  publicId?: string;
  alt?: LocalizedString;
  caption?: LocalizedString;
  order: number;
  isPrimary: boolean;
  width?: number;
  height?: number;
}

export interface PropertySeo {
  id: string;
  propertyId: string;
  metaTitle?: LocalizedString;
  metaDescription?: LocalizedString;
  keywords?: LocalizedArray;
  canonicalUrl?: string;
  ogImage?: string;
  noIndex: boolean;
  noFollow: boolean;
  schemaMarkup?: Record<string, any>;
}

export interface Property {
  id: string;
  title: LocalizedString;
  slug: string;
  description: LocalizedString;
  shortDescription?: LocalizedString;
  address: string;
  neighborhood: string;
  neighborhoodId?: string;
  neighborhoodRef?: Neighborhood; // Added
  district?: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  price: number;
  currency: string;
  pricePerSqm?: number;
  propertyType: PropertyType;
  listingType: ListingType;
  status: PropertyStatus;
  bedrooms: number;
  bathrooms: number;
  size: number;
  landSize?: number;
  floors?: number;
  floor?: number;
  yearBuilt?: number;
  features?: string[];
  amenities?: string[];
  images: PropertyImage[];
  videoUrl?: string;
  virtualTourUrl?: string;
  seo?: PropertySeo;
  isFeatured: boolean;
  isNew: boolean;
  isExclusive: boolean;
  showPrice: boolean;
  viewCount: number;
  inquiryCount: number;
  agentId?: string;
  agent?: User;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface CreatePropertyInput {
  title: LocalizedString;
  slug?: string;
  description: LocalizedString;
  shortDescription?: LocalizedString;
  address: string;
  neighborhood: string;
  neighborhoodId?: string;
  district?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  price: number;
  currency?: string;
  pricePerSqm?: number; // Added
  propertyType: PropertyType;
  listingType: ListingType;
  status?: PropertyStatus;
  bedrooms: number;
  bathrooms: number;
  size: number;
  landSize?: number;
  floors?: number;
  floor?: number;
  yearBuilt?: number;
  features?: string[];
  amenities?: string[];
  videoUrl?: string;
  virtualTourUrl?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  isExclusive?: boolean;
  showPrice?: boolean;
  agentId?: string;
  images?: Partial<PropertyImage>[];
  seo?: Partial<PropertySeo>; // Added
}

export interface UpdatePropertyInput extends Partial<CreatePropertyInput> {
  id: string;
}

// Neighborhood Types
export interface NeighborhoodHighlight {
  icon: string;
  title: LocalizedString;
  description: LocalizedString;
}

export interface NeighborhoodSeo {
  id: string;
  neighborhoodId: string;
  metaTitle?: LocalizedString;
  metaDescription?: LocalizedString;
  keywords?: LocalizedArray;
  canonicalUrl?: string;
  ogImage?: string;
  noIndex: boolean;
}

export interface Neighborhood {
  id: string;
  name: LocalizedString;
  slug: string;
  description?: LocalizedString;
  shortDescription?: LocalizedString;
  district?: string;
  city: string;
  latitude?: number;
  longitude?: number;
  image?: string;
  images?: string[];
  highlights?: NeighborhoodHighlight[];
  lifestyle?: LocalizedString;
  seo?: NeighborhoodSeo;
  propertyCount: number;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// Blog Types
export type PostStatus = 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'ARCHIVED';

export interface BlogPostSeo {
  id: string;
  postId: string;
  metaTitle?: LocalizedString;
  metaDescription?: LocalizedString;
  keywords?: LocalizedArray;
  canonicalUrl?: string;
  ogImage?: string;
  noIndex: boolean;
}

export interface BlogPost {
  id: string;
  title: LocalizedString;
  slug: string;
  excerpt?: LocalizedString;
  content: LocalizedString;
  featuredImage?: string;
  images?: string[];
  category?: string;
  tags?: string[];
  authorId: string;
  author?: User;
  seo?: BlogPostSeo;
  status: PostStatus;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

// Lead Types
export type LeadSource = 'WEBSITE' | 'PHONE' | 'EMAIL' | 'REFERRAL' | 'SOCIAL_MEDIA' | 'WALK_IN' | 'OTHER';
export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'VIEWING_SCHEDULED' | 'NEGOTIATING' | 'CLOSED_WON' | 'CLOSED_LOST' | 'ARCHIVED';
export type LeadPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface LeadNote {
  text: string;
  date: string;
  userId: string;
  userName?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  source: LeadSource;
  propertyId?: string;
  property?: Property;
  assignedToId?: string;
  assignedTo?: User;
  status: LeadStatus;
  priority: LeadPriority;
  notes?: LeadNote[];
  followUpDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
}

// SEO Types
export interface GlobalSeo {
  id: string;
  page: string;
  metaTitle?: LocalizedString;
  metaDescription?: LocalizedString;
  keywords?: LocalizedArray;
  ogTitle?: LocalizedString;
  ogDescription?: LocalizedString;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: LocalizedString;
  twitterDescription?: LocalizedString;
  twitterImage?: string;
  canonicalUrl?: string;
  robots?: string;
  schemaMarkup?: Record<string, any>;
  updatedAt: Date;
}

export interface Redirect {
  id: string;
  source: string;
  destination: string;
  type: 301 | 302;
  isActive: boolean;
  createdAt: Date;
}

export interface SitemapConfig {
  id: string;
  entityType: string;
  changefreq: string;
  priority: number;
  isEnabled: boolean;
  updatedAt: Date;
}

// Media Types
export interface Media {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  publicId?: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  alt?: LocalizedString;
  folder?: string;
  tags?: string[];
  uploadedById?: string;
  createdAt: Date;
}

// Settings Types
export interface Setting {
  id: string;
  key: string;
  value: any;
  group: string;
  updatedAt: Date;
}

export interface CompanySettings {
  name: string;
  logo: string;
  favicon: string;
  description: LocalizedString;
}

export interface ContactSettings {
  address: string;
  phone: string[];
  email: string;
  workingHours: LocalizedString;
  googleMapsUrl?: string;
  latitude?: number;
  longitude?: number;
}

export interface SocialSettings {
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
  whatsapp?: string;
}

export interface AnalyticsSettings {
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
  facebookPixelId?: string;
  hotjarId?: string;
}

// Activity Log Types
export interface ActivityLog {
  id: string;
  userId?: string;
  user?: User;
  action: string;
  entityType: string;
  entityId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

// Dashboard Stats Types
export interface DashboardStats {
  totalProperties: number;
  publishedProperties: number;
  totalLeads: number;
  newLeads: number;
  totalViews: number;
  totalInquiries: number;
  recentActivities: ActivityLog[];
  propertyByStatus: Record<PropertyStatus, number>;
  leadsByStatus: Record<LeadStatus, number>;
  topProperties: Property[];
  recentLeads: Lead[];
}

// Pagination Types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Filter Types
export interface PropertyFilters extends PaginationParams {
  status?: PropertyStatus;
  propertyType?: PropertyType;
  listingType?: ListingType;
  neighborhood?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  isFeatured?: boolean;
  search?: string;
}

export interface LeadFilters extends PaginationParams {
  status?: LeadStatus;
  priority?: LeadPriority;
  source?: LeadSource;
  assignedToId?: string;
  propertyId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export type PropertyFormData = CreatePropertyInput;
export type GlobalSeoSettings = GlobalSeo;

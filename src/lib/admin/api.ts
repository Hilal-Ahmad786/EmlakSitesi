// ============================================================================
// ADMIN PANEL API CLIENT
// ============================================================================

import type {
  Property, CreatePropertyInput, UpdatePropertyInput, PropertyFilters,
  Neighborhood, BlogPost, Lead, LeadFilters, User, CreateUserInput, UpdateUserInput,
  GlobalSeo, Redirect, Media, Setting, DashboardStats, PaginatedResponse, ApiResponse
} from '@/types/admin';

const API_BASE = '/api/admin';

// Generic fetch wrapper with error handling
// Generic fetch wrapper with error handling - MOCKED VERSION
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  // SIMULATE NETWORK DELAY
  await new Promise(resolve => setTimeout(resolve, 600));

  console.log(`[MOCK API] ${options?.method || 'GET'} ${endpoint}`);

  // MOCK ROUTING
  if (endpoint.includes('/analytics/dashboard')) {
    return {
      totalProperties: 12,
      activeProperties: 8,
      totalLeads: 45,
      totalViews: 1250,
      recentLeads: 5,
    } as any;
  }

  if (endpoint.includes('/properties') && !options?.method) {
    if (endpoint.includes('/properties/')) {
      // Single property
      return DUMMY_PROPERTIES[0] as any;
    }
    // List
    return {
      data: DUMMY_PROPERTIES,
      pagination: {
        page: 1,
        limit: 10,
        total: DUMMY_PROPERTIES.length,
        totalPages: 1
      }
    } as any;
  }

  if (endpoint.includes('/auth/me')) {
    return {
      id: 'dummy-admin',
      name: 'Dummy Admin',
      email: 'admin@test.com',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE'
    } as any;
  }

  // Default fallback for any other GET/list
  if (!options?.method || options.method === 'GET') {
    return { data: [], pagination: { total: 0 } } as any;
  }

  // Default success for mutations
  return {} as T;
}

const DUMMY_PROPERTIES = [
  {
    id: '1',
    title: { en: 'Luxury Bosphorus Villa', tr: 'Lüks Boğaz Villası' },
    slug: { en: 'luxury-bosphorus-villa', tr: 'luks-bogaz-villasi' },
    price: 5000000,
    currency: 'USD',
    status: 'PUBLISHED',
    type: 'VILLA',
    location: { city: 'Istanbul', district: 'Besiktas' },
    featuredImage: { url: 'https://images.unsplash.com/photo-1600596542815-9ad4dc7553e8?auto=format&fit=crop&w=800&q=80' },
    createdAt: new Date().toISOString(),
    views: 120,
    isFeatured: true
  },
  {
    id: '2',
    title: { en: 'Modern Apartment in Sisli', tr: 'Şişli Modern Daire' },
    slug: { en: 'modern-apartment-sisli', tr: 'sisli-modern-daire' },
    price: 450000,
    currency: 'USD',
    status: 'DRAFT',
    type: 'APARTMENT',
    location: { city: 'Istanbul', district: 'Sisli' },
    featuredImage: { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80' },
    createdAt: new Date().toISOString(),
    views: 45,
    isFeatured: false
  }
];

// ============================================================================
// DASHBOARD
// ============================================================================

export const dashboardApi = {
  getStats: () => fetchApi<DashboardStats>('/analytics/dashboard'),

  getRecentActivities: (limit?: number) =>
    fetchApi<any[]>(`/analytics/activities${limit ? `?limit=${limit}` : ''}`),

  getPropertyStats: () => fetchApi<any>('/analytics/properties'),

  getLeadStats: () => fetchApi<any>('/analytics/leads'),
};

// ============================================================================
// PROPERTIES
// ============================================================================

export const propertiesApi = {
  getAll: (filters?: PropertyFilters) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    return fetchApi<PaginatedResponse<Property>>(`/properties?${params.toString()}`);
  },

  getById: (id: string) => fetchApi<Property>(`/properties/${id}`),

  create: (data: CreatePropertyInput) =>
    fetchApi<Property>('/properties', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<UpdatePropertyInput>) =>
    fetchApi<Property>(`/properties/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchApi<void>(`/properties/${id}`, {
      method: 'DELETE',
    }),

  bulkDelete: (ids: string[]) =>
    fetchApi<void>('/properties/bulk-delete', {
      method: 'POST',
      body: JSON.stringify({ ids }),
    }),

  bulkStatusUpdate: (ids: string[], status: string) =>
    fetchApi<void>('/properties/bulk-status', {
      method: 'POST',
      body: JSON.stringify({ ids, status }),
    }),

  uploadImages: (propertyId: string, formData: FormData) =>
    fetch(`${API_BASE}/properties/${propertyId}/images`, {
      method: 'POST',
      body: formData,
    }).then(res => res.json()),

  deleteImage: (propertyId: string, imageId: string) =>
    fetchApi<void>(`/properties/${propertyId}/images/${imageId}`, {
      method: 'DELETE',
    }),

  reorderImages: (propertyId: string, imageIds: string[]) =>
    fetchApi<void>(`/properties/${propertyId}/images/reorder`, {
      method: 'POST',
      body: JSON.stringify({ imageIds }),
    }),

  updateSeo: (propertyId: string, seoData: any) =>
    fetchApi<any>(`/properties/${propertyId}/seo`, {
      method: 'PUT',
      body: JSON.stringify(seoData),
    }),

  // Aliases for compatibility
  get: (id: string) => fetchApi<Property>(`/properties/${id}`),
  list: (filters?: PropertyFilters) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    return fetchApi<PaginatedResponse<Property>>(`/properties?${params.toString()}`);
  },
};

// ============================================================================
// NEIGHBORHOODS
// ============================================================================

export const neighborhoodsApi = {
  getAll: (params?: { isActive?: boolean; isFeatured?: boolean }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, String(value));
      });
    }
    return fetchApi<Neighborhood[]>(`/neighborhoods?${searchParams.toString()}`);
  },

  getById: (id: string) => fetchApi<Neighborhood>(`/neighborhoods/${id}`),
  // Alias
  get: (id: string) => fetchApi<Neighborhood>(`/neighborhoods/${id}`),

  create: (data: Partial<Neighborhood>) =>
    fetchApi<Neighborhood>('/neighborhoods', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  // ...
  // ...
};

// ... lines omitted ...

export const seoApi = {
  // Global SEO
  getGlobalSeo: () => fetchApi<GlobalSeo[]>('/seo/global'),
  // Alias
  getGlobal: () => fetchApi<GlobalSeo>('/seo/global'), // Note: specific usage in page expects GlobalSeo, api implies GlobalSeo[]?

  getPageSeo: (page: string) => fetchApi<GlobalSeo>(`/seo/global/${page}`),

  updatePageSeo: (page: string, data: Partial<GlobalSeo>) =>
    fetchApi<GlobalSeo>(`/seo/global/${page}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  // Alias
  updateGlobal: (data: Partial<GlobalSeo>) =>
    fetchApi<GlobalSeo>('/seo/global', { // Assuming page.tsx calls updateGlobal without 'page' arg?
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Redirects
  getRedirects: () => fetchApi<Redirect[]>('/seo/redirects'),

  createRedirect: (data: Partial<Redirect>) =>
    fetchApi<Redirect>('/seo/redirects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateRedirect: (id: string, data: Partial<Redirect>) =>
    fetchApi<Redirect>(`/seo/redirects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteRedirect: (id: string) =>
    fetchApi<void>(`/seo/redirects/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({}), // DELETE usually doesn't have body but just in case
    }),

  // Sitemap
  getSitemapConfig: () => fetchApi<any[]>('/seo/sitemap'),
  // Alias
  getSitemap: () => fetchApi<any[]>('/seo/sitemap'),

  updateSitemapConfig: (entityType: string, data: any) =>
    fetchApi<any>(`/seo/sitemap/${entityType}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  // Alias
  updateSitemap: (data: any) => // Page likely calls updateSitemap with config object
    fetchApi<any>(`/seo/sitemap`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  regenerateSitemap: () =>
    fetchApi<void>('/seo/sitemap/regenerate', {
      method: 'POST',
    }),

  // Robots.txt
  getRobotsTxt: () => fetchApi<{ content: string }>('/seo/robots'),

  updateRobotsTxt: (content: string) =>
    fetchApi<void>('/seo/robots', {
      method: 'PUT',
      body: JSON.stringify({ content }),
    }),
};


// ============================================================================
// BLOG
// ============================================================================

export const blogApi = {
  getAll: (params?: { status?: string; category?: string; page?: number; pageSize?: number }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, String(value));
      });
    }
    return fetchApi<PaginatedResponse<BlogPost>>(`/blog?${searchParams.toString()}`);
  },

  getById: (id: string) => fetchApi<BlogPost>(`/blog/${id}`),

  create: (data: Partial<BlogPost>) =>
    fetchApi<BlogPost>('/blog', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<BlogPost>) =>
    fetchApi<BlogPost>(`/blog/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchApi<void>(`/blog/${id}`, {
      method: 'DELETE',
    }),

  updateSeo: (postId: string, seoData: any) =>
    fetchApi<any>(`/blog/${postId}/seo`, {
      method: 'PUT',
      body: JSON.stringify(seoData),
    }),

  getCategories: () => fetchApi<string[]>('/blog/categories'),
};

// ============================================================================
// LEADS
// ============================================================================

export const leadsApi = {
  getAll: (filters?: LeadFilters) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    return fetchApi<PaginatedResponse<Lead>>(`/leads?${params.toString()}`);
  },

  getById: (id: string) => fetchApi<Lead>(`/leads/${id}`),

  update: (id: string, data: Partial<Lead>) =>
    fetchApi<Lead>(`/leads/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchApi<void>(`/leads/${id}`, {
      method: 'DELETE',
    }),

  addNote: (id: string, note: string) =>
    fetchApi<Lead>(`/leads/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({ note }),
    }),

  assign: (id: string, userId: string) =>
    fetchApi<Lead>(`/leads/${id}/assign`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    }),

  bulkStatusUpdate: (ids: string[], status: string) =>
    fetchApi<void>('/leads/bulk-status', {
      method: 'POST',
      body: JSON.stringify({ ids, status }),
    }),

  export: (filters?: LeadFilters) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    return fetch(`${API_BASE}/leads/export?${params.toString()}`)
      .then(res => res.blob());
  },
};

// ============================================================================
// USERS
// ============================================================================

export const usersApi = {
  getAll: (params?: { role?: string; status?: string }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, String(value));
      });
    }
    return fetchApi<User[]>(`/users?${searchParams.toString()}`);
  },

  getById: (id: string) => fetchApi<User>(`/users/${id}`),

  create: (data: CreateUserInput) =>
    fetchApi<User>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: UpdateUserInput) =>
    fetchApi<User>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchApi<void>(`/users/${id}`, {
      method: 'DELETE',
    }),

  resetPassword: (id: string) =>
    fetchApi<void>(`/users/${id}/reset-password`, {
      method: 'POST',
    }),

  getAgents: () => fetchApi<User[]>('/users?role=AGENT'),
};


// ============================================================================
// MEDIA
// ============================================================================

export const mediaApi = {
  getAll: (params?: { folder?: string; mimeType?: string; page?: number; pageSize?: number }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, String(value));
      });
    }
    return fetchApi<PaginatedResponse<Media>>(`/media?${searchParams.toString()}`);
  },

  upload: (formData: FormData) =>
    fetch(`${API_BASE}/media/upload`, {
      method: 'POST',
      body: formData,
    }).then(res => res.json()),

  uploadMultiple: (formData: FormData) =>
    fetch(`${API_BASE}/media/upload-multiple`, {
      method: 'POST',
      body: formData,
    }).then(res => res.json()),

  update: (id: string, data: Partial<Media>) =>
    fetchApi<Media>(`/media/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchApi<void>(`/media/${id}`, {
      method: 'DELETE',
    }),

  bulkDelete: (ids: string[]) =>
    fetchApi<void>('/media/bulk-delete', {
      method: 'POST',
      body: JSON.stringify({ ids }),
    }),

  getFolders: () => fetchApi<string[]>('/media/folders'),

  createFolder: (name: string) =>
    fetchApi<void>('/media/folders', {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),
};

// ============================================================================
// SETTINGS
// ============================================================================

export const settingsApi = {
  getAll: () => fetchApi<Setting[]>('/settings'),

  getByGroup: (group: string) => fetchApi<Setting[]>(`/settings?group=${group}`),

  get: (key: string) => fetchApi<Setting>(`/settings/${key}`),

  update: (key: string, value: any) =>
    fetchApi<Setting>(`/settings/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ value }),
    }),

  updateBulk: (settings: { key: string; value: any }[]) =>
    fetchApi<void>('/settings/bulk', {
      method: 'PUT',
      body: JSON.stringify({ settings }),
    }),

  // Specific settings groups
  getCompanySettings: () => fetchApi<any>('/settings?group=company'),
  getContactSettings: () => fetchApi<any>('/settings?group=contact'),
  getSocialSettings: () => fetchApi<any>('/settings?group=social'),
  getAnalyticsSettings: () => fetchApi<any>('/settings?group=analytics'),
};

// ============================================================================
// AUTH
// ============================================================================

export const authApi = {
  login: (email: string, password: string) =>
    fetchApi<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    fetchApi<void>('/auth/logout', {
      method: 'POST',
    }),

  getCurrentUser: () => fetchApi<User>('/auth/me'),

  updateProfile: (data: Partial<User>) =>
    fetchApi<User>('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  changePassword: (currentPassword: string, newPassword: string) =>
    fetchApi<void>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  forgotPassword: (email: string) =>
    fetchApi<void>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, password: string) =>
    fetchApi<void>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    }),
};

export const adminApi = {
  dashboard: dashboardApi,
  properties: propertiesApi,
  neighborhoods: neighborhoodsApi,
  blog: blogApi,
  leads: leadsApi,
  users: usersApi,
  seo: seoApi,
  media: mediaApi,
  settings: settingsApi,
  auth: authApi,
};

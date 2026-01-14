import { MetadataRoute } from 'next';

// Mock data - in production, fetch from database
const mockProperties = [
  { id: '1', slug: 'luxury-bosphorus-villa', updatedAt: '2024-01-15' },
  { id: '2', slug: 'historic-galata-apartment', updatedAt: '2024-01-14' },
  { id: '3', slug: 'modern-levent-penthouse', updatedAt: '2024-01-13' },
  { id: '4', slug: 'sariyer-seaside-mansion', updatedAt: '2024-01-12' },
  { id: '5', slug: 'nisantasi-designer-flat', updatedAt: '2024-01-11' },
];

const mockNeighborhoods = [
  { slug: 'bebek', updatedAt: '2024-01-10' },
  { slug: 'nisantasi', updatedAt: '2024-01-10' },
  { slug: 'galata', updatedAt: '2024-01-10' },
  { slug: 'sariyer', updatedAt: '2024-01-10' },
  { slug: 'levent', updatedAt: '2024-01-10' },
];

const mockBlogPosts = [
  { slug: 'istanbul-real-estate-trends-2024', updatedAt: '2024-01-08' },
  { slug: 'buying-property-in-turkey-guide', updatedAt: '2024-01-05' },
  { slug: 'best-neighborhoods-for-investment', updatedAt: '2024-01-03' },
];

const locales = ['en', 'tr'];
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://maisondorient.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemap: MetadataRoute.Sitemap = [];

  // Static pages
  const staticPages = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/properties', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/neighborhoods', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/about', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/services', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/blog', priority: 0.7, changeFrequency: 'daily' as const },
    { path: '/favorites', priority: 0.5, changeFrequency: 'weekly' as const },
    { path: '/compare', priority: 0.5, changeFrequency: 'weekly' as const },
  ];

  // Add static pages for each locale
  for (const locale of locales) {
    for (const page of staticPages) {
      sitemap.push({
        url: `${baseUrl}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      });
    }
  }

  // Add property pages
  for (const property of mockProperties) {
    for (const locale of locales) {
      sitemap.push({
        url: `${baseUrl}/${locale}/properties/${property.id}`,
        lastModified: new Date(property.updatedAt),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  // Add neighborhood pages
  for (const neighborhood of mockNeighborhoods) {
    for (const locale of locales) {
      sitemap.push({
        url: `${baseUrl}/${locale}/neighborhoods/${neighborhood.slug}`,
        lastModified: new Date(neighborhood.updatedAt),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  // Add blog post pages
  for (const post of mockBlogPosts) {
    for (const locale of locales) {
      sitemap.push({
        url: `${baseUrl}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  return sitemap;
}

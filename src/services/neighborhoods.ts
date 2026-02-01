'use server';

import { prisma } from '@/lib/prisma';

export async function getFeaturedNeighborhoods(limit = 4, locale: string = 'tr') {
  try {
    const neighborhoods = await prisma.neighborhood.findMany({
      where: { isActive: true },
      orderBy: [{ isFeatured: 'desc' }, { propertyCount: 'desc' }, { order: 'asc' }],
      take: limit,
      include: {
        _count: {
          select: { properties: true },
        },
        properties: {
          where: { status: 'PUBLISHED' },
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: { images: { where: { isPrimary: true }, take: 1 } },
        },
      },
    });

    return neighborhoods.map((n) => {
      const primaryImage = n.properties[0]?.images[0]?.url;
      const name = typeof n.name === 'object' && n.name !== null
        ? (n.name as any)[locale] || (n.name as any).tr || (n.name as any).en || ''
        : String(n.name);
      return {
        id: n.slug,
        name,
        image: n.image || primaryImage || '/images/placeholder.jpg',
        propertyCount: n._count?.properties || n.propertyCount || 0,
      };
    });
  } catch (error) {
    console.error('Error fetching featured neighborhoods:', error);
    return [];
  }
}

export async function getNeighborhoods(locale: string = 'tr') {
  try {
    const neighborhoods = await prisma.neighborhood.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { properties: true },
        },
      },
    });

    return neighborhoods.map(n => transformNeighborhood(n, locale));
  } catch (error) {
    console.error('Error fetching neighborhoods:', error);
    return [];
  }
}

export async function getNeighborhoodBySlug(slug: string, locale: string = 'tr') {
  try {
    const neighborhood = await prisma.neighborhood.findUnique({
      where: { slug },
      include: {
        seo: true,
        _count: {
          select: { properties: true },
        },
        properties: {
          where: { status: 'PUBLISHED' },
          take: 6,
          orderBy: { createdAt: 'desc' },
          include: {
            images: true,
          },
        },
      },
    });

    if (!neighborhood || !neighborhood.isActive) {
      return null;
    }

    return transformNeighborhoodDetail(neighborhood, locale);
  } catch (error) {
    console.error('Error fetching neighborhood:', error);
    return null;
  }
}

function transformNeighborhood(item: any, locale: string) {
  const getLoc = (json: any) => {
    if (!json) return '';
    if (typeof json === 'string') return json;
    return json[locale] || json.tr || json.en || '';
  };

  return {
    id: item.id,
    name: getLoc(item.name),
    slug: item.slug,
    description: getLoc(item.shortDescription) || getLoc(item.description),
    image: item.image || '/images/placeholder.jpg',
    propertyCount: item._count?.properties || 0,
  };
}

function transformNeighborhoodDetail(item: any, locale: string) {
  const getLoc = (json: any) => {
    if (!json) return '';
    if (typeof json === 'string') return json;
    return json[locale] || json.tr || json.en || '';
  };

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat(locale === 'tr' ? 'tr-TR' : 'en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return {
    id: item.id,
    name: getLoc(item.name),
    slug: item.slug,
    description: getLoc(item.description),
    shortDescription: getLoc(item.shortDescription),
    image: item.image || '/images/placeholder.jpg',
    images: Array.isArray(item.images) ? item.images : [],
    highlights: Array.isArray(item.highlights) ? item.highlights : [],
    lifestyle: getLoc(item.lifestyle),
    latitude: item.latitude,
    longitude: item.longitude,
    propertyCount: item._count?.properties || 0,
    properties: (item.properties || []).map((p: any) => {
      const primaryImage = p.images?.find((img: any) => img.isPrimary)?.url ||
        p.images?.[0]?.url ||
        '/images/placeholder.jpg';
      return {
        id: p.id,
        title: getLoc(p.title),
        location: `${p.neighborhood || ''} ${p.city || ''}`.trim(),
        price: formatPrice(p.price, p.currency),
        image: primaryImage,
        beds: p.bedrooms,
        baths: p.bathrooms,
        size: p.size,
        type: (p.listingType === 'RENT' ? 'rent' : 'sale') as 'sale' | 'rent',
        isNew: p.isNew,
        isFeatured: p.isFeatured,
      };
    }),
  };
}

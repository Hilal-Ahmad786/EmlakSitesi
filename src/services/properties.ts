'use server';

import { prisma } from '@/lib/prisma';
import { PropertyStatus } from '@prisma/client';

export interface PropertyFilter {
    status?: PropertyStatus;
    featured?: boolean;
    type?: string;
    location?: string;
    page?: number;
    limit?: number;
    locale?: string;
}

export async function getProperties(params: PropertyFilter = {}) {
    const {
        status = 'PUBLISHED',
        featured,
        type,
        location,
        page = 1,
        limit = 12,
        locale = 'tr' // Default to TR if not specified
    } = params;

    const where: any = {
        status: status as PropertyStatus,
    };

    if (featured !== undefined) {
        where.isFeatured = featured;
    }

    if (type) {
        where.propertyType = {
            equals: type,
            mode: 'insensitive'
        };
    }

    if (location) {
        where.OR = [
            { neighborhood: { contains: location, mode: 'insensitive' } },
            { district: { contains: location, mode: 'insensitive' } },
            { city: { contains: location, mode: 'insensitive' } },
        ];
    }

    try {
        const [items, total] = await Promise.all([
            prisma.property.findMany({
                where,
                include: {
                    images: true,
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            prisma.property.count({ where }),
        ]);

        return {
            data: items.map(item => transformProperty(item, locale)),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    } catch (error) {
        console.error('Error fetching properties:', error);
        return { data: [], pagination: { page: 1, limit: 12, total: 0, totalPages: 0 } };
    }
}

// Helper to transform Prisma Property to Frontend Property
function transformProperty(item: any, locale: string = 'tr') {
    // Helper to get localized string
    const getLoc = (json: any) => {
        if (!json) return '';
        if (typeof json === 'string') return json;
        // Try requested locale, fallback to other, then empty
        if (locale === 'en') return json.en || json.tr || '';
        return json.tr || json.en || '';
    };

    // Get primary image
    const primaryImage = item.images?.find((img: any) => img.isPrimary)?.url ||
        item.images?.[0]?.url ||
        '/images/placeholder.jpg';

    return {
        id: item.id,
        title: getLoc(item.title),
        location: `${item.neighborhood || ''} ${item.city || ''}`.trim(),
        price: formatPrice(item.price, item.currency),
        image: primaryImage,
        beds: item.bedrooms,
        baths: item.bathrooms,
        size: item.size,
        type: (item.listingType === 'RENT' ? 'rent' : 'sale') as 'sale' | 'rent',
        isNew: item.isNew,
        isFeatured: item.isFeatured,
        lat: item.latitude,
        lng: item.longitude,
    };
}

export async function getPropertyById(id: string) {
    try {
        const item = await prisma.property.findUnique({
            where: { id },
            include: {
                images: { orderBy: { order: 'asc' } },
                neighborhoodRef: true,
                seo: true,
                agent: {
                    select: { id: true, name: true, email: true, phone: true, avatar: true },
                },
            },
        });

        if (!item || item.status !== 'PUBLISHED') {
            return null;
        }

        // Increment view count
        await prisma.property.update({
            where: { id },
            data: { viewCount: { increment: 1 } },
        });

        const getLoc = (json: any) => {
            if (!json) return '';
            if (typeof json === 'string') return json;
            return json.tr || json.en || '';
        };

        const images = (item.images || []).map((img: any) => img.url);
        const primaryImage = item.images?.find((img: any) => img.isPrimary)?.url ||
            item.images?.[0]?.url ||
            '/images/placeholder.jpg';

        return {
            id: item.id,
            title: getLoc(item.title),
            description: getLoc(item.description),
            shortDescription: getLoc(item.shortDescription),
            location: `${item.neighborhood || ''} ${item.city || ''}`.trim(),
            address: item.address,
            price: formatPrice(item.price, item.currency),
            priceNumber: item.price,
            currency: item.currency,
            images: images.length > 0 ? images : [primaryImage],
            image: primaryImage,
            specs: {
                beds: item.bedrooms,
                baths: item.bathrooms,
                size: item.size,
                type: item.propertyType,
                status: item.listingType === 'RENT' ? 'For Rent' : 'For Sale',
                built: item.yearBuilt,
            },
            features: Array.isArray(item.features) ? (item.features as string[]) : [],
            virtualTourUrl: item.virtualTourUrl || '',
            hasVirtualTour: !!item.virtualTourUrl,
            videoUrl: item.videoUrl || '',
            isFeatured: item.isFeatured,
            isNew: item.isNew,
            lat: item.latitude,
            lng: item.longitude,
            agent: item.agent,
            neighborhood: item.neighborhoodRef ? getLoc(item.neighborhoodRef.name) : '',
        };
    } catch (error) {
        console.error('Error fetching property by id:', error);
        return null;
    }
}

function formatPrice(amount: number, currency: string) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 0,
    }).format(amount);
}

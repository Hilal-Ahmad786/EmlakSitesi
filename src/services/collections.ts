'use server';

import { prisma } from '@/lib/prisma';

export async function getCollections() {
    try {
        const collections = await prisma.collection.findMany({
            where: {
                isActive: true,
            },
            orderBy: {
                order: 'asc',
            },
        });

        // For collections missing images, fetch a representative property image
        const results = await Promise.all(
            collections.map(async (col) => {
                let image = col.image;

                if (!image) {
                    // Try to find a representative image from properties matching this collection
                    const representativeImage = await findCollectionImage(col.link);
                    image = representativeImage;
                }

                return transformCollection({ ...col, image });
            })
        );

        return results;
    } catch (error) {
        console.error('Error fetching collections:', error);
        return [];
    }
}

async function findCollectionImage(link: string): Promise<string | null> {
    try {
        const where: any = { status: 'PUBLISHED' };

        // Parse the link to determine what filter this collection represents
        if (link.includes('type=sale')) {
            where.listingType = 'SALE';
        } else if (link.includes('type=rent')) {
            where.listingType = 'RENT';
        } else if (link.includes('type=BUILDING')) {
            where.propertyType = 'BUILDING';
        } else if (link.includes('type=APARTMENT')) {
            where.propertyType = 'APARTMENT';
        } else if (link.includes('type=PENTHOUSE')) {
            where.propertyType = 'PENTHOUSE';
        } else if (link.includes('status=sold')) {
            where.status = 'SOLD';
        } else if (link.includes('status=rented')) {
            where.status = 'RENTED';
        }

        const property = await prisma.property.findFirst({
            where,
            include: {
                images: { where: { isPrimary: true }, take: 1 },
            },
            orderBy: { createdAt: 'desc' },
        });

        return property?.images?.[0]?.url || null;
    } catch {
        return null;
    }
}

function transformCollection(item: any) {
    const getLoc = (json: any) => {
        if (!json) return '';
        if (typeof json === 'string') return json;
        return json.tr || json.en || '';
    };

    return {
        id: item.slug || item.id,
        title: getLoc(item.title),
        image: item.image || '/images/placeholder.jpg',
        link: item.link || '#',
    };
}

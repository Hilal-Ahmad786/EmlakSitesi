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

        return collections.map(transformCollection);
    } catch (error) {
        console.error('Error fetching collections:', error);
        return [];
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

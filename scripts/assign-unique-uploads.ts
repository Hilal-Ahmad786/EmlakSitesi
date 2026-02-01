
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    // 1. Get all available images from uploads
    const uploadsDir = path.join(process.cwd(), 'public/uploads/properties');
    const allImages = fs.readdirSync(uploadsDir)
        .filter(f => f.endsWith('.webp') || f.endsWith('.jpg'))
        .map(f => `/uploads/properties/${f}`);

    console.log(`Found ${allImages.length} available images in uploads.`);

    // 2. Get current usage to avoid collisions
    const neighborhoods = await prisma.neighborhood.findMany();
    const usedImages = new Set<string>();

    // Track images already used by neighborhoods to strictly avoid them
    neighborhoods.forEach(n => {
        if (n.image) usedImages.add(n.image);
    });

    // 3. Identify duplicates and assign new images
    // We want to replace images that are:
    // - Repeated (count > 1)
    // - Or are generic placeholders (like /images/home/hero-4.jpg)

    const imageCounts: Record<string, number> = {};
    neighborhoods.forEach(n => {
        const img = n.image || '';
        imageCounts[img] = (imageCounts[img] || 0) + 1;
    });

    const GENERIC_IMAGES = [
        '/images/home/hero-1.jpg',
        '/images/home/hero-2.jpg',
        '/images/home/hero-3.jpg',
        '/images/home/hero-4.jpg',
        '/images/home/collection-investment.jpg',
        '/images/home/collection-levent.jpg',
        '/images/home/collection-bosphorus.jpg',
        '/images/home/collection-cihangir.jpg',
        '/images/home/collection-mansions.jpg',
        '/images/home/collection-galata.jpg',
    ];

    let assignedCount = 0;

    for (const n of neighborhoods) {
        const currentImg = n.image || '';
        const isDuplicate = imageCounts[currentImg] > 1;
        const isGeneric = GENERIC_IMAGES.includes(currentImg);

        // If it's a duplicate OR generic, we should replace it (unless it's the *first* user of a non-generic duplicate, but let's just make everything unique from uploads to be safe and fresh).
        // Actually, if it's a duplicate non-generic, we might want to keep one. But easiest is to just re-assign anyone using a duplicate or generic.

        if (isDuplicate || isGeneric) {
            // Find a random image that is NOT used
            let newImage = '';
            let attempts = 0;
            while (!newImage && attempts < 100) {
                const candidate = allImages[Math.floor(Math.random() * allImages.length)];
                if (!usedImages.has(candidate)) {
                    newImage = candidate;
                }
                attempts++;
            }

            if (newImage) {
                console.log(`Assigning unique image to ${n.slug}: ${newImage} (was ${currentImg})`);

                await prisma.neighborhood.update({
                    where: { id: n.id },
                    data: { image: newImage }
                });

                usedImages.add(newImage);
                assignedCount++;

                // Decrement count for the old image
                imageCounts[currentImg]--;
            } else {
                console.warn(`Could not find unused image for ${n.slug}`);
            }
        }
    }

    console.log(`\nUpdated ${assignedCount} neighborhoods with unique images.`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());

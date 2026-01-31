import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

const PUBLIC_UPLOADS = path.resolve(__dirname, '../public/uploads/properties');

// These 5 files were empty (0 bytes) and could not be converted
const EMPTY_FILES = [
  'ilan_029_gorsel_10.jpg',
  'ilan_139_gorsel_11.jpg',
  'ilan_204_gorsel_03.jpg',
  'ilan_232_gorsel_18.jpg',
  'ilan_357_gorsel_10.jpg',
];

async function main() {
  console.log('=== Migrating PropertyImage URLs from .jpg to .webp ===\n');

  // 1. Delete records for the 5 empty/unconvertible images
  const emptyUrls = EMPTY_FILES.map(f => `/uploads/properties/${f}`);
  const deleted = await prisma.propertyImage.deleteMany({
    where: { url: { in: emptyUrls } },
  });
  console.log(`Deleted ${deleted.count} records for empty/corrupt images`);

  // 2. Delete the empty .jpg files from disk
  for (const f of EMPTY_FILES) {
    const filePath = path.join(PUBLIC_UPLOADS, f);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`  Removed empty file: ${f}`);
    }
  }

  // 3. Bulk update all remaining PropertyImage URLs from .jpg to .webp using raw SQL
  const countBefore = await prisma.propertyImage.count({ where: { url: { endsWith: '.jpg' } } });
  console.log(`\nFound ${countBefore} images with .jpg URLs to update`);

  if (countBefore > 0) {
    await prisma.$executeRawUnsafe(
      `UPDATE "PropertyImage" SET url = REPLACE(url, '.jpg', '.webp') WHERE url LIKE '%.jpg'`
    );
    console.log(`Bulk updated all .jpg URLs to .webp`);
  }

  // 4. Delete all .jpg files from the uploads directory (keeping .webp)
  console.log('\nDeleting original .jpg files...');
  const allFiles = fs.readdirSync(PUBLIC_UPLOADS);
  let deletedFiles = 0;
  for (const file of allFiles) {
    if (file.endsWith('.jpg')) {
      const filePath = path.join(PUBLIC_UPLOADS, file);
      fs.unlinkSync(filePath);
      deletedFiles++;
    }
  }
  console.log(`Deleted ${deletedFiles} .jpg files`);

  // 5. Fix primary image for properties that lost their primary image
  const propertiesWithoutPrimary = await prisma.property.findMany({
    where: {
      images: {
        every: { isPrimary: false },
      },
    },
    include: { images: { orderBy: { order: 'asc' }, take: 1 } },
  });

  let fixedCount = 0;
  for (const prop of propertiesWithoutPrimary) {
    if (prop.images.length > 0) {
      await prisma.propertyImage.update({
        where: { id: prop.images[0].id },
        data: { isPrimary: true },
      });
      fixedCount++;
    }
  }
  console.log(`Fixed ${fixedCount} properties without primary image`);

  // Stats
  const totalImages = await prisma.propertyImage.count();
  const webpImages = await prisma.propertyImage.count({ where: { url: { endsWith: '.webp' } } });
  console.log(`\n=== Migration Complete ===`);
  console.log(`Total images: ${totalImages}`);
  console.log(`WebP images: ${webpImages}`);
}

main()
  .catch((e) => {
    console.error('Migration error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const neighborhoods = await prisma.neighborhood.findMany({
        orderBy: { name: 'asc' }
    });

    const urlCounts: Record<string, number> = {};
    const duplicates: Record<string, string[]> = {};

    console.log('--- Neighborhood Images Audit ---');
    for (const n of neighborhoods) {
        const img = n.image || 'NULL';
        urlCounts[img] = (urlCounts[img] || 0) + 1;

        // Store localized name safely
        let name = "Unknown";
        if (n.name && typeof n.name === 'object') {
            name = (n.name as any).en || (n.name as any).tr || "Unknown";
        }

        console.log(`[${n.slug}] ${name}: ${img}`);
    }

    console.log('\n--- Duplicate Summary ---');
    for (const [url, count] of Object.entries(urlCounts)) {
        if (count > 1) {
            console.log(`x${count}: ${url}`);
            // Find who uses it
            const users = neighborhoods.filter(n => n.image === url).map(n => n.slug);
            console.log(`    User slugs: ${users.join(', ')}`);
        }
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());

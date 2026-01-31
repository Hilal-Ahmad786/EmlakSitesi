import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_DIR = path.join(__dirname, '../public/uploads/properties');

// Simple concurrency limit function
async function mapLimit(items, limit, fn) {
    const results = [];
    const executing = [];
    for (const item of items) {
        const p = Promise.resolve().then(() => fn(item));
        results.push(p);
        const e = p.then(() => executing.splice(executing.indexOf(e), 1));
        executing.push(e);
        if (executing.length >= limit) {
            await Promise.race(executing);
        }
    }
    return Promise.all(results);
}

async function main() {
    if (!fs.existsSync(TARGET_DIR)) {
        console.log(`Directory ${TARGET_DIR} does not exist.`);
        return;
    }

    const files = fs.readdirSync(TARGET_DIR);
    const imageFiles = files.filter(file => file.match(/\.(jpg|jpeg|png)$/i));

    let processedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    console.log(`Processing directory: public/uploads/properties (${imageFiles.length} images found out of ${files.length} files)`);

    const processFile = async (file) => {
        const sourcePath = path.join(TARGET_DIR, file);
        const targetFilename = file.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        const targetPath = path.join(TARGET_DIR, targetFilename);

        if (fs.existsSync(targetPath)) {
            skippedCount++;
            return;
        }

        try {
            await sharp(sourcePath)
                .resize(1280, null, {
                    withoutEnlargement: true,
                    fit: 'inside'
                })
                .webp({ quality: 80 })
                .toFile(targetPath);

            processedCount++;
            if (processedCount % 50 === 0) {
                process.stdout.write(`.`);
            }
        } catch (error) {
            errorCount++;
            console.error(`\nError processing ${file}:`, error.message);
        }
    };

    // Concurrency of 10
    await mapLimit(imageFiles, 10, processFile);

    console.log(`\nFinished properties: ${processedCount} processed, ${skippedCount} skipped, ${errorCount} errors.`);
}

main().catch(console.error);

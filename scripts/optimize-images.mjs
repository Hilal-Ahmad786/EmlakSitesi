import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data');
const PUBLIC_UPLOADS_DIR = path.join(__dirname, '../public/uploads');

const TARGET_DIRECTORIES = ['Satilik', 'Kiralik', 'Kapali'];

async function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

async function processDirectory(dirName) {
    const sourceDir = path.join(DATA_DIR, dirName);
    const targetDir = path.join(PUBLIC_UPLOADS_DIR, dirName);

    if (!fs.existsSync(sourceDir)) {
        console.log(`Directory ${sourceDir} does not exist. Skipping.`);
        return;
    }

    await ensureDir(targetDir);

    const files = fs.readdirSync(sourceDir);
    let processedCount = 0;
    let skippedCount = 0;

    console.log(`Processing directory: ${dirName} (${files.length} files)`);

    for (const file of files) {
        if (file.match(/\.(jpg|jpeg|png)$/i)) {
            const sourcePath = path.join(sourceDir, file);
            const targetFilename = file.replace(/\.(jpg|jpeg|png)$/i, '.webp');
            const targetPath = path.join(targetDir, targetFilename);

            if (fs.existsSync(targetPath)) {
                // console.log(`Skipping ${file}, already exists`);
                skippedCount++;
                continue;
            }

            try {
                await sharp(sourcePath)
                    .resize(1280, null, { // Resize width to 1280px, maintain aspect ratio
                        withoutEnlargement: true,
                        fit: 'inside'
                    })
                    .webp({ quality: 80 })
                    .toFile(targetPath);

                processedCount++;
                if (processedCount % 100 === 0) {
                    process.stdout.write('.');
                }
            } catch (error) {
                console.error(`Error processing ${file}:`, error.message);
            }
        }
    }
    console.log(`\nFinished ${dirName}: ${processedCount} processed, ${skippedCount} skipped.`);
}

async function main() {
    console.log('Starting image optimization...');
    await ensureDir(PUBLIC_UPLOADS_DIR);

    for (const dir of TARGET_DIRECTORIES) {
        await processDirectory(dir);
    }

    console.log('All done!');
}

main().catch(console.error);

const fs = require('fs');
const path = require('path');
const https = require('https');

const filesToScan = [
    'src/components/features/home/LatestProperties.tsx',
    'src/components/features/home/FeaturedCollections.tsx',
    'src/components/features/home/NeighborhoodSpotlight.tsx',
    'src/app/[locale]/properties/page.tsx',
    'src/app/[locale]/properties/[id]/page.tsx',
    'src/app/[locale]/neighborhoods/page.tsx',
    'src/app/[locale]/compare/page.tsx',
    'src/app/[locale]/favorites/page.tsx',
    'src/components/features/home/HeroSlider.tsx',
    'src/app/[locale]/neighborhoods/[slug]/page.tsx'
];

const projectRoot = process.cwd();

function extractUrls(content) {
    const regex = /https:\/\/images\.unsplash\.com\/[^"'\s`]+/g;
    return content.match(regex) || [];
}

function checkUrl(url) {
    return new Promise((resolve) => {
        https.get(url, (res) => {
            resolve({ url, status: res.statusCode });
        }).on('error', (e) => {
            resolve({ url, status: 'ERROR: ' + e.message });
        });
    });
}

async function verifyImages() {
    console.log('Starting Image Verification...');
    let allUrls = new Set();

    for (const file of filesToScan) {
        const filePath = path.join(projectRoot, file);
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            const urls = extractUrls(content);
            urls.forEach(url => allUrls.add(url));
            console.log(`Found ${urls.length} images in ${file}`);
        } else {
            console.error(`File not found: ${file}`);
        }
    }

    console.log(`\nVerifying ${allUrls.size} unique image URLs...\n`);

    const results = [];
    for (const url of allUrls) {
        const result = await checkUrl(url);
        results.push(result);
        if (result.status === 200) {
            console.log(`✅ [200] ${url.substring(0, 60)}...`);
        } else {
            console.error(`❌ [${result.status}] ${url}`);
        }
    }

    const failed = results.filter(r => r.status !== 200);
    if (failed.length > 0) {
        console.log(`\nFound ${failed.length} broken images!`);
        process.exit(1);
    } else {
        console.log('\nAll images are accessible!');
    }
}

verifyImages();

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const BATCH_SIZE = 500;

function run(command) {
    try {
        // console.log(`Running: ${command}`);
        execSync(command, { stdio: 'inherit' });
        return true;
    } catch (error) {
        console.error(`Error running command: ${command}`);
        return false;
    }
}

async function main() {
    console.log('Retrieving list of .webp files in public/uploads/properties...');

    // Read directory directly because git status hides ignored files even with exception
    const targetDir = 'public/uploads/properties';
    if (!fs.existsSync(targetDir)) {
        console.error('Directory not found');
        return;
    }

    const allFiles = fs.readdirSync(targetDir);
    const filePaths = allFiles
        .filter(f => f.endsWith('.webp'))
        .map(f => path.join(targetDir, f));

    console.log(`Found ${filePaths.length} WebP files to process.`);

    if (filePaths.length === 0) {
        console.log('Nothing to commit.');
        return;
    }

    const batches = [];
    for (let i = 0; i < filePaths.length; i += BATCH_SIZE) {
        batches.push(filePaths.slice(i, i + BATCH_SIZE));
    }

    console.log(`Split into ${batches.length} batches.`);

    for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        console.log(`\nProcessing batch ${i + 1}/${batches.length} (${batch.length} files)...`);

        // Add files
        // Join with quotes just in case, though usually unnecessary for simple alphanumeric
        // Using -f (force) because gitignore might ignore them if not updated yet, or just to be safe as user did before.
        // Wait, 'git add' list length limit?
        // 500 files paths might exceed shell limit.
        // Better write to a file and cat it? or just loop add?
        // Loop add is slow.
        // Chunk the add if needed. 500 paths * ~50 chars = 25000 chars. MacOS limit is usually ~260k. Should be fine.

        const pathsArg = batch.map(p => `"${p}"`).join(' ');

        // Run add
        if (!run(`git add -f ${pathsArg}`)) {
            console.error('Failed to add files. Aborting.');
            process.exit(1);
        }

        // Commit
        if (!run(`git commit -m "Add properties images (Batch ${i + 1}/${batches.length})"`)) {
            console.error('Failed to commit. Aborting.');
            process.exit(1);
        }

        // Push immediately to sync frequently
        // Retrying push if needed? git usually handles transient network issues but let's just run it.
        console.log('Pushing...');
        if (!run('git push')) {
            console.error('Failed to push. Aborting.');
            process.exit(1);
        }
    }

    console.log('\nAll batches completed successfully!');
}

main().catch(console.error);

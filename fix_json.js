const fs = require('fs');
const path = require('path');

const files = [
    '/Users/hilalahamd/MyRestProjects/BurakAbi/EmlakSitesi/messages/en.json',
    '/Users/hilalahamd/MyRestProjects/BurakAbi/EmlakSitesi/messages/tr.json'
];

files.forEach(file => {
    try {
        const content = fs.readFileSync(file, 'utf8');
        // Try to find common syntax errors if parse fails
        try {
            const json = JSON.parse(content);
            console.log(`✅ ${path.basename(file)} is VALID.`);
            if (!json.Footer) {
                console.error(`❌ ${path.basename(file)} matches JSON structure but is MISSING 'Footer' key.`);
            } else {
                console.log(`👍 'Footer' key found in ${path.basename(file)}.`);
            }

            // Check for nested keys that should be root (cleanup)
            if (json.PropertyOfWeek && json.PropertyOfWeek.ReferenceShowcase) {
                console.log("Found ReferenceShowcase nested in PropertyOfWeek. Moving to root.");
                json.ReferenceShowcase = json.PropertyOfWeek.ReferenceShowcase;
                delete json.PropertyOfWeek.ReferenceShowcase;
            }
            if (json.PropertyOfWeek && json.PropertyOfWeek.PromoMosaic) {
                console.log("Found PromoMosaic nested in PropertyOfWeek. Moving to root.");
                json.PromoMosaic = json.PropertyOfWeek.PromoMosaic;
                delete json.PropertyOfWeek.PromoMosaic;
            }

            // Write back cleanly
            fs.writeFileSync(file, JSON.stringify(json, null, 4));
            console.log(`Processed and saved ${path.basename(file)}`);

        } catch (e) {
            console.error(`❌ ${path.basename(file)} is INVALID JSON.`);
            console.error(e.message);
            // Attempt to show context
            const match = e.message.match(/at position (\d+)/);
            if (match) {
                const pos = parseInt(match[1]);
                const start = Math.max(0, pos - 50);
                const end = Math.min(content.length, pos + 50);
                console.log("Context around error:");
                console.log("..." + content.substring(start, end) + "...");
                console.log(" ".repeat(3 + (pos - start)) + "^");
            }
            process.exit(1);
        }
    } catch (err) {
        console.error(`Failed to read ${file}: ${err.message}`);
        process.exit(1);
    }
});

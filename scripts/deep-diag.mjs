// scripts/deep-diag.mjs
import { readFileSync } from 'fs';

const rawData = JSON.parse(readFileSync('public/norway-fylker.geojson', 'utf8'));
rawData.features.forEach((f, i) => {
    let count = 0;
    let outliers = [];
    const name = f.properties?.fylkesnavn ?? f.properties?.name ?? 'Unknown';

    const check = (c) => {
        if (!Array.isArray(c)) return;
        if (typeof c[0] === 'number') {
            count++;
            const [lon, lat] = c;
            // Norway mainland loosely: Lon [2, 35], Lat [55, 75]
            if (lon < 2 || lon > 35 || lat < 55 || lat > 75) {
                outliers.push(c);
            }
        } else {
            c.forEach(check);
        }
    };

    check(f.geometry?.coordinates);
    if (outliers.length > 0) {
        console.log(`[${i}] ${name}: Found ${outliers.length} outliers out of ${count} points.`);
        console.log(`First 3 outliers: ${JSON.stringify(outliers.slice(0, 3))}`);
    } else {
        console.log(`[${i}] ${name}: ${count} points, 0 outliers.`);
    }
});

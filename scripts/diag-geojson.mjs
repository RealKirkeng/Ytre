// scripts/diag-geojson.mjs
import { readFileSync } from 'fs';

function getFeatureBounds(f) {
    let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity;
    const processCoords = (coords) => {
        if (!Array.isArray(coords)) return;
        if (typeof coords[0] === 'number') {
            const [lon, lat] = coords;
            if (lon < minLon) minLon = lon; if (lon > maxLon) maxLon = lon;
            if (lat < minLat) minLat = lat; if (lat > maxLat) maxLat = lat;
        } else {
            coords.forEach(processCoords);
        }
    };
    if (f.geometry && f.geometry.coordinates) processCoords(f.geometry.coordinates);
    return [[minLon, minLat], [maxLon, maxLat]];
}

const rawData = JSON.parse(readFileSync('public/norway-fylker.geojson', 'utf8'));
rawData.features.forEach((f, i) => {
    const id = f.id ?? f.properties?.fylkesnummer ?? 'NO-ID';
    const name = f.properties?.fylkesnavn ?? f.properties?.name ?? 'NO-NAME';
    const bounds = getFeatureBounds(f);
    console.log(`[${i}] ID: ${id} | Name: ${name} | Bounds: ${JSON.stringify(bounds)}`);
});

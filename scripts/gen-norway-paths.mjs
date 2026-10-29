// scripts/gen-norway-paths.mjs
import { readFileSync, writeFileSync } from 'fs';
import { geoMercator, geoPath } from 'd3-geo';

const W = 400, H = 850;

function filterAndNormalizeGeometry(geom) {
    if (!geom) return null;
    const processRings = (rings) => {
        return rings.map(ring => {
            let minLon = 180, maxLon = -180, minLat = 90, maxLat = -90;
            ring.forEach(([lon, lat]) => {
                if (lon < minLon) minLon = lon; if (lon > maxLon) maxLon = lon;
                if (lat < minLat) minLat = lat; if (lat > maxLat) maxLat = lat;
            });
            // If any ring is global, discard it
            if ((maxLon - minLon) > 100 || (maxLat - minLat) > 40) return null;
            return ring;
        }).filter(Boolean);
    };

    if (geom.type === 'Polygon') {
        const rings = processRings(geom.coordinates);
        return rings.length ? { ...geom, coordinates: rings } : null;
    }
    if (geom.type === 'MultiPolygon') {
        const polys = geom.coordinates.map(p => processRings(p)).filter(p => p.length);
        return polys.length ? { ...geom, coordinates: polys } : null;
    }
    return geom;
}

function getCollectionBounds(features) {
    let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity;
    const process = (c) => {
        if (typeof c[0] === 'number') {
            const [lon, lat] = c;
            if (lon < minLon) minLon = lon; if (lon > maxLon) maxLon = lon;
            if (lat < minLat) minLat = lat; if (lat > maxLat) maxLat = lat;
        } else {
            c.forEach(process);
        }
    };
    features.forEach(f => process(f.geometry.coordinates));
    return [[minLon, minLat], [maxLon, maxLat]];
}

async function gen(inputFile, outputFile, idKey, nameKey) {
    const rawData = JSON.parse(readFileSync(inputFile, 'utf8'));

    const validFeatures = rawData.features.map(f => {
        const cleanGeom = filterAndNormalizeGeometry(f.geometry);
        if (!cleanGeom) return null;

        const id = String(f.properties?.[idKey] ?? f.id ?? '');
        const name = String(f.properties?.[nameKey] ?? f.properties?.name ?? '');
        if (!id || id === 'undefined' || name.toLowerCase().includes('bakgrunn')) return null;
        if (name.includes('Svalbard') || name.includes('Jan Mayen')) return null;

        return { ...f, geometry: cleanGeom, properties: { ...f.properties, id, name } };
    }).filter(Boolean);

    if (!validFeatures.length) {
        console.error(`No valid features for ${outputFile}`);
        return;
    }

    const [[minLon, minLat], [maxLon, maxLat]] = getCollectionBounds(validFeatures);

    // Robust Scale calculation for Mercator
    // We want to map [minLon, maxLon] to [padding, W-padding]
    // And [minLat, maxLat] to [padding, H-padding]
    const centerLon = (minLon + maxLon) / 2;
    const centerLat = (minLat + maxLat) / 2;

    // Mercator scaling: width = scale * deltaLon_rad
    // For Norway (tall), height is the bottleneck.
    // Height in Mercator is more complex, but we can approximate or just use a target scale.
    // Let's use a base scale and refine.
    const deltaLonRad = (maxLon - minLon) * Math.PI / 180;
    const targetScaleW = (W - 40) / deltaLonRad;

    // For Lat, we use the Mercator projection formula: y = scale * ln(tan(PI/4 + lat/2))
    const latRad = (lat) => lat * Math.PI / 180;
    const mercY = (lat) => Math.log(Math.tan(Math.PI / 4 + latRad(lat) / 2));
    const deltaY = mercY(maxLat) - mercY(minLat);
    const targetScaleH = (H - 40) / deltaY;

    const finalScale = Math.min(targetScaleW, targetScaleH);

    const proj = geoMercator()
        .center([centerLon, centerLat])
        .scale(finalScale)
        .translate([W / 2, H / 2]);

    const pathGen = geoPath(proj);

    const features = validFeatures.map(f => {
        let rawD = pathGen(f) || '';
        // Filter out large artifact sub-paths
        let d = rawD.split('M').filter(segment => {
            if (!segment) return false;
            const coords = segment.match(/-?\d+\.?\d*/g);
            if (!coords || coords.length < 4) return true;
            let pMinX = Infinity, pMaxX = -Infinity, pMinY = Infinity, pMaxY = -Infinity;
            for (let i = 0; i < coords.length; i += 2) {
                const x = parseFloat(coords[i]), y = parseFloat(coords[i + 1]);
                if (x < pMinX) pMinX = x; if (x > pMaxX) pMaxX = x;
                if (y < pMinY) pMinY = y; if (y > pMaxY) pMaxY = y;
            }
            // Discard sub-paths that span almost the entire viewport
            if ((pMaxX - pMinX) >= W * 0.98 || (pMaxY - pMinY) >= H * 0.98) return false;
            return true;
        }).join('M');
        if (d && !d.startsWith('M')) d = 'M' + d;

        return { id: f.properties.id, name: f.properties.name, d };
    }).filter(f => f.d && f.id);

    console.log(`\n--- ${outputFile} ---`);
    console.log(`Geobounds: Lon [${minLon.toFixed(1)}, ${maxLon.toFixed(1)}] | Lat [${minLat.toFixed(1)}, ${maxLat.toFixed(1)}]`);
    console.log(`Features: ${features.length} | Scale: ${proj.scale().toFixed(1)}`);
    writeFileSync(outputFile, JSON.stringify({ W, H, features }, null, 2), 'utf8');
}

await gen('public/norway-fylker.geojson', 'public/norway-fylker-paths.json', 'fylkesnummer', 'fylkesnavn');
await gen('public/norway-kommuner.geojson', 'public/norway-kommuner-paths.json', 'kommunenummer', 'kommunenavn');

// scripts/diag-scale.mjs
import { readFileSync } from 'fs';
import { geoMercator, geoPath } from 'd3-geo';

const data = JSON.parse(readFileSync('scripts/data/norway-fylker.geojson', 'utf8'));
const W = 400, H = 850;

data.features.slice(0, 1).forEach((f, i) => {
    const name = f.properties?.fylkesnavn || f.id;
    const proj = geoMercator(); // Default scale 150
    const pathGen = geoPath(proj);
    const bounds = pathGen.bounds(f);
    console.log(`[${i}] ${name}: Projected Bounds at Scale 150: ${JSON.stringify(bounds)}`);

    const fitted = geoMercator().fitExtent([[0, 0], [W, H]], f);
    console.log(`Scale after fit: ${fitted.scale()}`);
    console.log(`Translate after fit: ${JSON.stringify(fitted.translate())}`);
});

// scripts/diag-geom-full.mjs
import { readFileSync } from 'fs';
import { geoBounds } from 'd3-geo';

const data = JSON.parse(readFileSync('public/norway-fylker.geojson', 'utf8'));
const f = data.features[0];

console.log('Feature 0 Name:', f.properties.fylkesnavn);
console.log('Feature 0 geoBounds:', geoBounds(f));

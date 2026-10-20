import fs from 'fs';
import path from 'path';

const bundlePath = 'scratch/live_index_bundle.js';
const content = fs.readFileSync(bundlePath, 'utf8');

console.log(`Bundle loaded. Length: ${content.length} characters.`);

// 1. Extract all URLs (https?://...)
const urlRegex = /https?:\/\/[a-zA-Z0-9_\-\./?=&%#+@:,~]+/g;
const allUrls = [...new Set(content.match(urlRegex) || [])];
console.log(`Total URLs found: ${allUrls.length}`);

// Group URLs
const srmUrls = allUrls.filter(u => u.includes('srmtrichy') || u.includes('srmist'));
const externalUrls = allUrls.filter(u => !u.includes('srmtrichy') && !u.includes('srmist'));
const pdfUrls = allUrls.filter(u => u.toLowerCase().endsWith('.pdf') || u.toLowerCase().includes('.pdf'));

console.log('\n--- SRM-RELATED URLS ---');
console.log(srmUrls);

console.log('\n--- PDF URLS ---');
console.log(pdfUrls);

// 2. Extract internal paths (path: "...", to: "...", href: "...")
const pathRegex = /(?:path|to|href|route):\s*["'](\/[a-zA-Z0-9_\-\/#]*)["']/g;
const paths = new Set();
let match;
while ((match = pathRegex.exec(content)) !== null) {
  paths.add(match[1]);
}
console.log('\n--- INTERNAL ROUTES / PATHS ---');
console.log([...paths].sort());

// 3. Extract API endpoints (/api/...)
const apiRegex = /["'](\/api\/[a-zA-Z0-9_\-\/]+)["']/g;
const apiEndpoints = new Set();
while ((match = apiRegex.exec(content)) !== null) {
  apiEndpoints.add(match[1]);
}
console.log('\n--- API ENDPOINTS ---');
console.log([...apiEndpoints].sort());

// 4. Extract phone numbers and emails
const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const emails = [...new Set(content.match(emailRegex) || [])];
console.log('\n--- EMAILS ---');
console.log(emails);

const phoneRegex = /(?:\+91[\-\s]?)?[0-9]{3,5}[\-\s]?[0-9]{5,8}/g;
const phones = [...new Set((content.match(phoneRegex) || []).filter(p => p.length >= 8))];
console.log('\n--- PHONE NUMBERS ---');
console.log(phones);

fs.writeFileSync('scratch/extracted_manifest.json', JSON.stringify({
  srmUrls,
  externalUrls,
  pdfUrls,
  routes: [...paths].sort(),
  apiEndpoints: [...apiEndpoints].sort(),
  emails,
  phones
}, null, 2));

console.log('\nWrote scratch/extracted_manifest.json successfully!');

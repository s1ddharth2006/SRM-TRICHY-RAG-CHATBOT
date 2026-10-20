import fs from 'fs';
const s = fs.readFileSync('mirror/assets/index-CCQCpfua.js', 'utf8');
const routes = new Set();
for (const match of s.matchAll(/path:\s*["']([^"']+)["']/g)) {
  routes.add(match[1]);
}
for (const match of s.matchAll(/to:\s*["'](\/[^"']+)["']/g)) {
  routes.add(match[1]);
}
for (const match of s.matchAll(/href:\s*["'](\/[^"']+)["']/g)) {
  routes.add(match[1]);
}
console.log("Routes found:", Array.from(routes).sort());

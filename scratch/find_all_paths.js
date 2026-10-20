import fs from 'fs';
const s = fs.readFileSync('mirror/assets/index-CCQCpfua.js', 'utf8');

const regex = /["'`](\/[a-zA-Z0-9_\-#]+)["'`]/g;
const links = new Set();
let m;
while ((m = regex.exec(s)) !== null) {
  if (!m[1].startsWith('/assets') && m[1].length > 1) {
    links.add(m[1]);
  }
}
console.log("All SPA paths & hashes:", Array.from(links).sort());

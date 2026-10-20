import fs from 'fs';
const s = fs.readFileSync('mirror/assets/index-CCQCpfua.js', 'utf8');

const idx = s.indexOf('accommodation');
if (idx !== -1) {
  console.log("Accommodation section snippet:");
  console.log(s.slice(idx - 100, idx + 400));
}

const hashIdx = s.indexOf('window.location.hash');
console.log("window.location.hash usage:", hashIdx !== -1);
if (hashIdx !== -1) {
  console.log(s.slice(hashIdx - 100, hashIdx + 200));
}

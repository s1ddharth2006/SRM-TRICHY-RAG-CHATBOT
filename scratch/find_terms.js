import fs from 'fs';
const s = fs.readFileSync('mirror/assets/index-CCQCpfua.js', 'utf8');

const terms = ['hostel', 'news', 'event', 'campus', 'admission'];
for (const t of terms) {
  const matches = [];
  const reg = new RegExp(`["'\`/][^"'\`]*${t}[^"'\`]*["'\`]`, 'gi');
  let m;
  while ((m = reg.exec(s)) !== null) {
    if (m[0].length < 100) matches.push(m[0]);
  }
  console.log(`=== Matches for ${t} (${matches.length}) ===`);
  console.log(Array.from(new Set(matches)).slice(0, 20));
}

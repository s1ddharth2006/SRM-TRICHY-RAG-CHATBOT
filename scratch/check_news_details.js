import fs from 'fs';
const s = fs.readFileSync('mirror/assets/index-CCQCpfua.js', 'utf8');

const matches = [...s.matchAll(/latest-news|news-and-events|news-events|newsAndEvents/g)];
for (const m of matches) {
  console.log("Match at", m.index, ":", s.slice(Math.max(0, m.index - 100), m.index + 200));
}

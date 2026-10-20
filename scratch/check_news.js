import fs from 'fs';
const s = fs.readFileSync('mirror/assets/index-CCQCpfua.js', 'utf8');

const idx = s.indexOf('/news-and-events');
if (idx !== -1) {
  console.log("Context around /news-and-events:");
  console.log(s.slice(Math.max(0, idx - 150), idx + 250));
}

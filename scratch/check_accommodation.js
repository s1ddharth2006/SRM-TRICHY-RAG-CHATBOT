import fs from 'fs';
const s = fs.readFileSync('mirror/assets/index-CCQCpfua.js', 'utf8');

const idx = s.indexOf('/campus-life#accommodation');
if (idx !== -1) {
  console.log("Context around /campus-life#accommodation:");
  console.log(s.slice(Math.max(0, idx - 200), idx + 300));
}

const idHostel = s.indexOf('id="accommodation"');
const idHostel2 = s.indexOf('accommodation');
console.log("accommodation mentions:");
let pos = 0;
while ((pos = s.indexOf('accommodation', pos)) !== -1) {
  console.log("Found at", pos, s.slice(Math.max(0, pos - 50), pos + 100));
  pos += 'accommodation'.length;
  if (pos > 500000) break; // sample a few
}

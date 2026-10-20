import fs from 'fs';
const s = fs.readFileSync('mirror/assets/index-CCQCpfua.js', 'utf8');

let pos = 0;
while ((pos = s.indexOf('#accommodation', pos)) !== -1) {
  console.log("Found #accommodation at", pos, ":");
  console.log(s.slice(Math.max(0, pos - 100), pos + 200));
  pos += '#accommodation'.length;
}

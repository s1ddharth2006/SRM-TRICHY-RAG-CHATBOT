import fs from "fs";
import path from "path";

for (const dir of ["./server/data/live_cms", "./server/data"]) {
  console.log(`\n=== DIR: ${dir} ===`);
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".json"));
  for (const f of files) {
    try {
      const d = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
      const isArr = Array.isArray(d);
      const hasData = d.data ? (Array.isArray(d.data) ? `data[${d.data.length}]` : typeof d.data) : null;
      console.log(`${f}: isArr=${isArr}, hasData=${hasData}, keys=${Object.keys(d).slice(0, 5).join(", ")}`);
    } catch (e) {
      console.log(`${f}: error:`, e.message);
    }
  }
}

import fs from "fs";
import path from "path";

const dir = "./server/data/live_cms";
const pFiles = [
  "institution__programmes__getall.json",
  "schools__programmes__getall.json",
  "school-division__programmes__getall.json"
];

for (const pf of pFiles) {
  const p = path.join(dir, pf);
  if (fs.existsSync(p)) {
    console.log(`\n=== ${pf} ===`);
    const progs = JSON.parse(fs.readFileSync(p, "utf8"));
    const items = Array.isArray(progs) ? progs : (progs.data || []);
    console.log(`Count: ${items.length}`);
    items.forEach(it => {
      console.log("-", it.name || it.title, "| Degree:", it.degree, "| Duration:", it.duration, "| Fee:", it.annualFee);
      if (it.eligibility) console.log("   Eligibility:", it.eligibility);
      if (it.description) console.log("   Description:", it.description.slice(0, 100));
    });
  }
}

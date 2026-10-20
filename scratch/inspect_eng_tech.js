import fs from "fs";
import path from "path";

// 1. Check all data files for "engineering-and-technology" or "inst_01"
const dataDir = "./server/data";
const files = fs.readdirSync(dataDir).filter(f => f.endsWith(".json"));

console.log("=== CHECKING SERVER/DATA FILES ===");
for (const f of files) {
  try {
    const raw = fs.readFileSync(path.join(dataDir, f), "utf8");
    if (raw.includes("engineering-and-technology") || raw.includes("inst_01") || raw.includes("Computing") || raw.includes("B.Tech")) {
      console.log(`Match in ${f}:`);
      const data = JSON.parse(raw);
      if (Array.isArray(data.data)) {
        data.data.forEach(item => {
          if (JSON.stringify(item).includes("engineering-and-technology") || item.institutionId === "inst_01") {
            console.log("  - Item:", item.name || item.title || item.degree, item.slug || item._id);
          }
        });
      } else if (data.data) {
        console.log("  - Object:", Object.keys(data.data));
      }
    }
  } catch (e) {}
}

// 2. Search JS bundle for engineering-and-technology content and sub-links
console.log("\n=== CHECKING JS BUNDLE FOR ROUTES & CONTENT ===");
const js = fs.readFileSync("./mirror/assets/index-CCQCpfua.js", "utf8");

// Look for occurrences of engineering-and-technology
let idx = 0;
const snippets = [];
while ((idx = js.indexOf("engineering-and-technology", idx)) !== -1) {
  const start = Math.max(0, idx - 150);
  const end = Math.min(js.length, idx + 350);
  snippets.push(js.slice(start, end));
  idx += 30;
  if (snippets.length >= 10) break;
}
snippets.forEach((s, i) => console.log(`Snippet ${i + 1}:\n${s}\n`));

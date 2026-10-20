import fs from "fs";
import path from "path";

const js = fs.readFileSync("./mirror/assets/index-CCQCpfua.js", "utf8");
console.log("JS bundle size:", js.length);

const emails = [...new Set(js.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [])];
console.log("Emails found:", emails);

const phones = [...new Set(js.match(/(?:\+?91|0431|1800)[\s\d\-]{5,15}/g) || [])].map(p => p.trim());
console.log("Phones found:", phones.slice(0, 15));

// Check data snapshots
const dataDir = "./server/data";
const files = fs.readdirSync(dataDir).filter(f => f.endsWith(".json"));
console.log("\n--- JSON Snapshot Files in server/data ---");
for (const f of files) {
  try {
    const content = JSON.parse(fs.readFileSync(path.join(dataDir, f), "utf8"));
    const keys = Object.keys(content);
    console.log(f, "->", keys.join(", "));
  } catch (e) {}
}

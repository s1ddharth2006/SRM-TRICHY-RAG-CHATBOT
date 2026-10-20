import fs from "fs";

const progs = JSON.parse(fs.readFileSync("./server/data/live_cms/institution__programmes__getall.json", "utf8"));
const list = Array.isArray(progs) ? progs : progs.data;
console.log("Total programmes found in live CMS:", list.length);

const byInst = {};
list.forEach(p => {
  let instName = "Unassigned";
  if (p.institutionId && typeof p.institutionId === "object") {
    instName = p.institutionId.name || "Unknown";
  } else if (typeof p.institutionId === "string") {
    instName = p.institutionId;
  }
  byInst[instName] = byInst[instName] || [];
  byInst[instName].push({
    name: p.name || p.title || p.degree,
    degree: p.degree,
    duration: p.duration,
    eligibility: p.eligibility,
    fee: p.annualFee
  });
});

for (const [k, v] of Object.entries(byInst)) {
  console.log(`\n=================== ${k} (${v.length} Programmes) ===================`);
  v.forEach(p => console.log(`• ${p.name} (${p.duration || 'N/A'}) - Fee: ${p.fee || 'Check brochure'}`));
}

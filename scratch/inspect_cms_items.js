import fs from "fs";
import path from "path";

const dir = "./server/data/live_cms";
const files = [
  "institution__getall.json",
  "schools__getall.json",
  "school-division__getall.json",
  "institution__programmes__getall.json",
  "school-division__hod-message__getall.json",
  "schools__hod-message__getall.json",
  "institution__events-and-activities__getall.json",
  "institution__infrastructure__getall.json"
];

for (const f of files) {
  const p = path.join(dir, f);
  if (fs.existsSync(p)) {
    console.log(`\n=================== ${f} ===================`);
    const d = JSON.parse(fs.readFileSync(p, "utf8"));
    const items = Array.isArray(d) ? d : (d.data || []);
    console.log(`Count: ${items.length}`);
    items.forEach((it, idx) => {
      console.log(`[${idx}]`, it.name || it.title || it.degree || it.hodName || it.eventName, `(slug: ${it.slug || it._id || ''}, institutionId: ${it.institutionId || ''}, schoolId: ${it.schoolId || ''})`);
    });
  }
}

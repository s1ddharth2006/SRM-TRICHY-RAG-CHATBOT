import fs from "fs";
import path from "path";

const files = [
  "institution__getall.json",
  "institution__infrastructure__getall.json",
  "institution__programmes__getall.json",
  "about__leadership__getall.json",
  "about__accreditation__getall.json",
  "school-division__getall.json",
  "schools__getall.json",
  "student__getAll.json",
  "slider__sliders.json"
];

for (const f of files) {
  const p = path.join("./server/data", f);
  if (fs.existsSync(p)) {
    console.log(`\n=================== ${f} ===================`);
    const d = JSON.parse(fs.readFileSync(p, "utf8"));
    console.log(JSON.stringify(d, null, 2).slice(0, 1500));
  }
}

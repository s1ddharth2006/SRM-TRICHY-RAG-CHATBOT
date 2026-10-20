import fs from "fs";

const p1 = JSON.parse(fs.readFileSync("./server/data/live_cms/schools__programmes__getall.json", "utf8"));
const p2 = JSON.parse(fs.readFileSync("./server/data/live_cms/school-division__programmes__getall.json", "utf8"));

console.log("schools__programmes count:", p1.length);
p1.forEach(p => console.log("School Prog:", p.name || p.title, p.degree, p.duration, p.schoolId?.name || p.schoolId));

console.log("\nschool-division__programmes count:", p2.length);
p2.forEach(p => console.log("Division Prog:", p.name || p.title, p.degree, p.duration, p.divisionId?.name || p.divisionId));

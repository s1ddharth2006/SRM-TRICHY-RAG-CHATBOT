import fs from "fs";
import path from "path";

const dir = "./server/data/live_cms";

console.log("=== ALL INSTITUTIONS ===");
const inst = JSON.parse(fs.readFileSync(path.join(dir, "institution__getall.json"), "utf8")).data;
inst.forEach(i => console.log(i._id, i.name, i.slug));

console.log("\n=== ALL SCHOOLS ===");
const schools = JSON.parse(fs.readFileSync(path.join(dir, "schools__getall.json"), "utf8"));
schools.forEach(s => console.log(s._id, s.name, s.slug, "instId:", s.institutionId));

console.log("\n=== ALL SCHOOL DIVISIONS (DEPARTMENTS) ===");
const divs = JSON.parse(fs.readFileSync(path.join(dir, "school-division__getall.json"), "utf8"));
divs.forEach(d => console.log(d._id, d.name, d.slug, "schoolId:", d.schoolId));

console.log("\n=== ALL PROGRAMMES ===");
const progs = JSON.parse(fs.readFileSync(path.join(dir, "institution__programmes__getall.json"), "utf8"));
progs.forEach(p => console.log(p._id, p.name || p.title, p.degree, p.duration, "instId:", p.institutionId, "schoolId:", p.schoolId, "divisionId:", p.divisionId));

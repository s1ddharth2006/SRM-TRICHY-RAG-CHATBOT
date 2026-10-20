import fs from "fs";
import path from "path";

const dir = "./server/data/live_cms";

const inst = JSON.parse(fs.readFileSync(path.join(dir, "institution__getall.json"), "utf8")).data;
const engInst = inst.find(i => i.slug === "engineering-and-technology");
console.log("=== ENGINEERING & TECHNOLOGY INSTITUTION ===");
console.log(JSON.stringify(engInst, null, 2));

const engInstId = engInst._id;

console.log("\n=== SCHOOLS UNDER ENGINEERING ===");
const schools = JSON.parse(fs.readFileSync(path.join(dir, "schools__getall.json"), "utf8"));
const engSchools = schools.filter(s => s.institutionId === engInstId || (s.institutionId && s.institutionId._id === engInstId));
console.log(JSON.stringify(engSchools, null, 2));

const engSchoolIds = new Set(engSchools.map(s => s._id));

console.log("\n=== DIVISIONS / DEPARTMENTS UNDER ENGINEERING ===");
const divs = JSON.parse(fs.readFileSync(path.join(dir, "school-division__getall.json"), "utf8"));
const engDivs = divs.filter(d => engSchoolIds.has(d.schoolId) || (d.schoolId && engSchoolIds.has(d.schoolId._id)));
console.log(JSON.stringify(engDivs, null, 2));

const engDivIds = new Set(engDivs.map(d => d._id));

console.log("\n=== PROGRAMMES UNDER ENGINEERING ===");
const progs = JSON.parse(fs.readFileSync(path.join(dir, "institution__programmes__getall.json"), "utf8"));
const engProgs = progs.filter(p => {
  const iId = p.institutionId && (p.institutionId._id || p.institutionId);
  const sId = p.schoolId && (p.schoolId._id || p.schoolId);
  const dId = p.divisionId && (p.divisionId._id || p.divisionId);
  return iId === engInstId || engSchoolIds.has(sId) || engDivIds.has(dId) || (p.degree && p.degree.includes("B.Tech"));
});
console.log(JSON.stringify(engProgs, null, 2));

console.log("\n=== DEAN MESSAGE ===");
const deans = JSON.parse(fs.readFileSync(path.join(dir, "institution__dean-message__getall.json"), "utf8")).data;
const engDean = deans.find(d => d.institutionId === engInstId || (d.institutionId && d.institutionId._id === engInstId));
console.log(JSON.stringify(engDean, null, 2));

console.log("\n=== INFRASTRUCTURE FOR ENGINEERING ===");
const infra = JSON.parse(fs.readFileSync(path.join(dir, "institution__infrastructure__getall.json"), "utf8")).data;
const engInfra = infra.filter(i => i.institutionId === engInstId || (i.institutionId && i.institutionId._id === engInstId));
console.log(JSON.stringify(engInfra, null, 2));

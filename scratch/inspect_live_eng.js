import fs from "fs";
import path from "path";

const dir = "./server/data/live_cms";
const files = fs.readdirSync(dir);

console.log("=== INSPECTING LIVE CMS DATA FOR ENGINEERING AND TECHNOLOGY ===\n");

// 1. Institution check
const inst = JSON.parse(fs.readFileSync(path.join(dir, "institution__getall.json"), "utf8"));
const engInst = inst.data.find(i => i.slug === "engineering-and-technology" || i.name.includes("Engineering"));
console.log("Institution Details:", JSON.stringify(engInst, null, 2));

// 2. Dean Message
if (fs.existsSync(path.join(dir, "institution__dean-message__getall.json"))) {
  const deans = JSON.parse(fs.readFileSync(path.join(dir, "institution__dean-message__getall.json"), "utf8"));
  console.log("\nDean Messages:", JSON.stringify(deans.data, null, 2));
}

// 3. Schools under engineering
if (fs.existsSync(path.join(dir, "schools__getall.json"))) {
  const schools = JSON.parse(fs.readFileSync(path.join(dir, "schools__getall.json"), "utf8"));
  console.log("\nSchools:", JSON.stringify(schools.data, null, 2));
}

// 4. School Divisions / Departments
if (fs.existsSync(path.join(dir, "school-division__getall.json"))) {
  const divs = JSON.parse(fs.readFileSync(path.join(dir, "school-division__getall.json"), "utf8"));
  console.log("\nSchool Divisions (Departments):", JSON.stringify(divs.data, null, 2));
}

// 5. Programmes
if (fs.existsSync(path.join(dir, "institution__programmes__getall.json"))) {
  const progs = JSON.parse(fs.readFileSync(path.join(dir, "institution__programmes__getall.json"), "utf8"));
  console.log("\nProgrammes:", JSON.stringify(progs.data, null, 2));
}

// 6. HOD Messages
if (fs.existsSync(path.join(dir, "school-division__hod-message__getall.json"))) {
  const hods = JSON.parse(fs.readFileSync(path.join(dir, "school-division__hod-message__getall.json"), "utf8"));
  console.log("\nHOD Messages:", JSON.stringify(hods.data, null, 2));
}

// 7. Events
if (fs.existsSync(path.join(dir, "institution__events-and-activities__getall.json"))) {
  const events = JSON.parse(fs.readFileSync(path.join(dir, "institution__events-and-activities__getall.json"), "utf8"));
  console.log("\nEvents & Activities:", JSON.stringify(events.data, null, 2));
}

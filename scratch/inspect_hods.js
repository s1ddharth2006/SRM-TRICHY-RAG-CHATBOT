import fs from "fs";

const hods1 = JSON.parse(fs.readFileSync("./server/data/live_cms/school-division__hod-message__getall.json", "utf8"));
const hods2 = JSON.parse(fs.readFileSync("./server/data/live_cms/schools__hod-message__getall.json", "utf8"));

console.log("=== HOD MESSAGES 1 ===");
hods1.forEach(h => {
  console.log("HOD:", h.hodName, "| Role:", h.hodDesignation, "| Scope:", h.facultyScopeName || h.divisionId?.name);
});

console.log("\n=== HOD MESSAGES 2 ===");
hods2.forEach(h => {
  console.log("HOD:", h.hodName, "| Role:", h.hodDesignation, "| Scope:", h.facultyScopeName || h.schoolId?.name);
});

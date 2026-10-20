import fs from "fs";

const js = fs.readFileSync("./mirror/assets/index-CCQCpfua.js", "utf8");

const matches = [];
const re = /institution\/[a-zA-Z0-9_\-]+/gi;
let m;
while ((m = re.exec(js)) !== null) {
  matches.push(m[0]);
}
console.log("Institution routes found in bundle:", [...new Set(matches)]);

const depts = [];
const deptRe = /departments?\/[a-zA-Z0-9_\-]+/gi;
while ((m = deptRe.exec(js)) !== null) {
  depts.push(m[0]);
}
console.log("Department routes found in bundle:", [...new Set(depts)]);

// Also let's check fetch calls in the bundle!
const fetchRe = /api\/[a-zA-Z0-9_\-\/]+/gi;
const apis = [];
while ((m = fetchRe.exec(js)) !== null) {
  apis.push(m[0]);
}
console.log("API endpoints in bundle:", [...new Set(apis)]);

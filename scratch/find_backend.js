import fs from "fs";

const js = fs.readFileSync("./mirror/assets/index-CCQCpfua.js", "utf8");

// Search for baseURL or axios create
const m1 = js.match(/baseURL:\s*["'][^"']+["']/g);
console.log("baseURL:", m1);

// Search for URLs in fetch or axios
const urls = [...new Set(js.match(/https?:\/\/[a-zA-Z0-9.\-_:]+(?:\/[a-zA-Z0-9._\-\/]*)?/g) || [])];
console.log("All URLs in bundle:", urls.filter(u => !u.includes("w3.org") && !u.includes("google")));

// Search for how API calls are made
const apiCalls = [...new Set(js.match(/(?:get|post)\(["'][^"']*api\/[^"']*["']/g) || [])];
console.log("API call patterns:", apiCalls);

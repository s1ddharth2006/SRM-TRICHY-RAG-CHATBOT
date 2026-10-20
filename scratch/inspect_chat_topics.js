import fs from "fs";
const chat = fs.readFileSync("server/chat.js", "utf8");
const matches = [...chat.matchAll(/id:\s*["']([^"']+)["']/g)].map(m => m[1]);
console.log("All Topic IDs in chat.js:", matches);

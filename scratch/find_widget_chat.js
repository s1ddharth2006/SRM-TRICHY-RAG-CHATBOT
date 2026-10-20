import fs from "fs";

const js = fs.readFileSync("./public/srm-tamil-widget.js", "utf8");
const lines = js.split("\n");
lines.forEach((l, i) => {
  if (l.includes("/api/chat") || l.includes("srm-chat") || l.includes("sendMessage") || l.includes("fetch(")) {
    console.log(`Line ${i + 1}: ${l.trim().slice(0, 100)}`);
  }
});

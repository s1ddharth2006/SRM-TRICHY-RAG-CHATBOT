import fs from "fs";

const catalog = JSON.parse(fs.readFileSync("server/data/news_and_events_catalog.json", "utf8"));

console.log("Analyzing catalog for key highlights...");
const highlights = catalog.filter(e => {
  const t = e.title.toLowerCase();
  return (
    t.includes("tensor") ||
    t.includes("fiesta") ||
    t.includes("oracle") ||
    t.includes("swift") ||
    t.includes("iciddm") ||
    t.includes("hydrogen") ||
    t.includes("revive") ||
    t.includes("diacon") ||
    t.includes("perfuse") ||
    t.includes("confluence") ||
    t.includes("rasra") ||
    t.includes("ipl") ||
    t.includes("patent") ||
    t.includes("hackathon") ||
    t.includes("project day") ||
    t.includes("sports day") ||
    t.includes("sensory") ||
    t.includes("moringa") ||
    t.includes("microbial") ||
    t.includes("spice surge") ||
    t.includes("green tech") ||
    t.includes("power bi")
  );
});

console.log(`Found ${highlights.length} top event highlights:`);
highlights.forEach((h, i) => {
  console.log(`\n${i+1}. [${h.category}] ${h.title}`);
  console.log(`   Type: ${h.type} | Date: ${h.date} | Venue: ${h.location}`);
  console.log(`   Conducted by: ${h.conductedBy} | Coordinator: ${h.coordinator}`);
  console.log(`   Desc: ${h.description.slice(0, 140)}...`);
});

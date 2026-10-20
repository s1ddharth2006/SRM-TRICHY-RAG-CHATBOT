import fs from "fs";

const f1 = JSON.parse(fs.readFileSync("scratch/live_cms__institution_events-and-activities_getall.json", "utf8"));
const f2 = JSON.parse(fs.readFileSync("scratch/live_cms__school-division_events-and-activities_getall.json", "utf8"));
const f3 = JSON.parse(fs.readFileSync("scratch/live_cms__schools_events-and-activities_getall.json", "utf8"));

const all = [
  ...(Array.isArray(f1) ? f1 : f1.data || []),
  ...(Array.isArray(f2) ? f2 : f2.data || []),
  ...(Array.isArray(f3) ? f3 : f3.data || [])
];

console.log(`Writing complete list of ${all.length} events to scratch/all_events_manifest.json...`);

const manifest = all.map((e, idx) => ({
  id: e._id,
  index: idx + 1,
  title: (e.name || "").trim(),
  type: e.type || "Event",
  date: e.eventDateTime || "N/A",
  location: e.location || "SRM IST Trichy Campus",
  conductedBy: (e.conductedBy || "").trim(),
  coordinator: (e.co_ordinator || "").trim(),
  resourcePerson: (e.resourcePerson || "").trim(),
  resourcePersonDesignation: (e.resourcePersonDesignation || "").trim(),
  description: (e.description || "").trim(),
  announcement: e.announcement
}));

fs.writeFileSync("scratch/all_events_manifest.json", JSON.stringify(manifest, null, 2), "utf8");
console.log("Successfully wrote scratch/all_events_manifest.json");

// Output top 40 unique event names
console.log("\nSample titles:");
manifest.slice(0, 35).forEach(m => console.log(`${m.index}. [${m.type}] ${m.title} (${m.conductedBy || 'General'})`));

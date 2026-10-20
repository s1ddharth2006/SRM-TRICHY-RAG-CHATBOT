import fs from "fs";

function analyze() {
  const f1 = JSON.parse(fs.readFileSync("scratch/live_cms__institution_events-and-activities_getall.json", "utf8"));
  const f2 = JSON.parse(fs.readFileSync("scratch/live_cms__school-division_events-and-activities_getall.json", "utf8"));
  const f3 = JSON.parse(fs.readFileSync("scratch/live_cms__schools_events-and-activities_getall.json", "utf8"));

  const all = [
    ...(Array.isArray(f1) ? f1 : f1.data || []),
    ...(Array.isArray(f2) ? f2 : f2.data || []),
    ...(Array.isArray(f3) ? f3 : f3.data || [])
  ];
  console.log("Total events loaded:", all.length);

  const types = {};
  const locations = {};
  const conductedBy = {};
  const eventSamples = [];

  for (const item of all) {
    types[item.type || "unknown"] = (types[item.type || "unknown"] || 0) + 1;
    locations[item.location || "unknown"] = (locations[item.location || "unknown"] || 0) + 1;
    conductedBy[item.conductedBy || "unknown"] = (conductedBy[item.conductedBy || "unknown"] || 0) + 1;
  }

  console.log("\n--- Event Types Breakdown ---");
  console.log(types);

  console.log("\n--- Conducted By Breakdown (Top 15) ---");
  const sortedConducted = Object.entries(conductedBy).sort((a,b) => b[1] - a[1]);
  console.log(sortedConducted.slice(0, 15));

  console.log("\n--- Top Locations ---");
  console.log(Object.entries(locations).sort((a,b) => b[1] - a[1]).slice(0, 10));

  console.log("\n--- First 10 Event Details ---");
  for (let i = 0; i < 10; i++) {
    const e = all[i];
    console.log(`\n[${i+1}] Name: ${e.name}`);
    console.log(`    Type: ${e.type} | ConductedBy: ${e.conductedBy} | Location: ${e.location}`);
    console.log(`    Date: ${e.eventDateTime || "N/A"}`);
    console.log(`    Co-ordinator: ${e.co_ordinator || "N/A"}`);
    console.log(`    Resource Person: ${e.resourcePerson || "N/A"} (${e.resourcePersonDesignation || ""})`);
    console.log(`    Description: ${e.description ? e.description.slice(0, 150) + "..." : "N/A"}`);
  }
}

analyze();

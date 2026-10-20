import fs from "fs";
import path from "path";

const f1 = JSON.parse(fs.readFileSync("scratch/live_cms__institution_events-and-activities_getall.json", "utf8"));
const f2 = JSON.parse(fs.readFileSync("scratch/live_cms__school-division_events-and-activities_getall.json", "utf8"));
const f3 = JSON.parse(fs.readFileSync("scratch/live_cms__schools_events-and-activities_getall.json", "utf8"));

const rawEvents = [
  ...(Array.isArray(f1) ? f1 : f1.data || []),
  ...(Array.isArray(f2) ? f2 : f2.data || []),
  ...(Array.isArray(f3) ? f3 : f3.data || [])
];

// Clean HTML tags and excessive whitespace
function cleanText(str) {
  if (!str) return "";
  return String(str)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function categorizeEvent(name, conductedBy, type, desc) {
  const combined = `${name} ${conductedBy} ${desc}`.toLowerCase();
  if (/comput|cse|ai|data\s*science|swift|ios|oracle|tensor|hackathon|matlab|power\s*bi/i.test(combined)) {
    return "Computing & AI";
  }
  if (/mech|hydrogen|manufacturing|iddm|powertrain|automotive|3d\s*print/i.test(combined)) {
    return "Mechanical & Manufacturing";
  }
  if (/eee|ece|electrical|electronics|grid|ltspice|voltex|electronova|patent/i.test(combined)) {
    return "Electrical & Electronics";
  }
  if (/bio\s*tech|food|microbi|bioinforma|vaccine|drug|moringa|fostac/i.test(combined)) {
    return "Biotechnology & Food Technology";
  }
  if (/physiotherapy|bpt|mpt|revive|physio|cpe|spinal|osteoarthritis|cerebral/i.test(combined)) {
    return "Physiotherapy & Rehabilitation";
  }
  if (/occupational\s*therapy|splinting|neonates|sensory\s*integration|inclusion|ot\s*wall|wheelchair/i.test(combined)) {
    return "Occupational Therapy";
  }
  if (/allied\s*health|cpr|perfuse|diacon|dialysis|autism|cancer|obesity|anemia|psychology/i.test(combined)) {
    return "Allied Health Sciences";
  }
  if (/management|mba|bba|confluence|rasra|ipl\s*auction|exemplar|yukti|venture/i.test(combined)) {
    return "Management Studies (DoMS)";
  }
  if (/math|physics|chemistry|english|nss|aadhaar|induction|freshers|onam|ayudha|independence|republic|christmas|women/i.test(combined)) {
    return "Science, Humanities & Cultural";
  }
  return "General Campus Events";
}

const cleanedEvents = [];
const seen = new Set();

for (const raw of rawEvents) {
  const title = cleanText(raw.name);
  if (!title) continue;

  const key = `${title.toLowerCase()}_${(raw.eventDateTime || "").slice(0, 10)}`;
  if (seen.has(key)) continue;
  seen.add(key);

  const desc = cleanText(raw.description);
  const conducted = cleanText(raw.conductedBy);
  const loc = cleanText(raw.location) || "SRM IST Trichy Campus";
  const coordinator = cleanText(raw.co_ordinator);
  const resource = cleanText(raw.resourcePerson);
  const resourceDesig = cleanText(raw.resourcePersonDesignation);
  const type = cleanText(raw.type) || "Event";
  const dateStr = raw.eventDateTime ? raw.eventDateTime.replace("T", " ") : "Scheduled Event";
  const category = categorizeEvent(title, conducted, type, desc);

  cleanedEvents.push({
    id: raw._id || `event_${cleanedEvents.length + 1}`,
    title,
    category,
    type,
    date: dateStr,
    location: loc,
    conductedBy: conducted || "SRM IST Trichy",
    coordinator: coordinator || "Faculty Coordinator",
    resourcePerson: resource ? `${resource} ${resourceDesig ? '(' + resourceDesig + ')' : ''}`.trim() : "",
    description: desc,
    announcement: Boolean(raw.announcement),
    source: "https://www.srmtrichy.edu.in/news-and-events"
  });
}

console.log(`Cleaned and cataloged ${cleanedEvents.length} unique official events.`);

// Category counts
const catCounts = {};
for (const e of cleanedEvents) {
  catCounts[e.category] = (catCounts[e.category] || 0) + 1;
}
console.log("\nCategory Counts:", catCounts);

// Save structured catalog
fs.writeFileSync("server/data/news_and_events_catalog.json", JSON.stringify(cleanedEvents, null, 2), "utf8");
console.log("Saved server/data/news_and_events_catalog.json");

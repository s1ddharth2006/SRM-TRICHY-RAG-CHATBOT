import fs from "fs";

const BASE = "https://srv1079154.hstgr.cloud/api";
const ENDPOINTS = [
  "/institution/events-and-activities/getall",
  "/school-division/events-and-activities/getall",
  "/schools/events-and-activities/getall",
  "/news/getall",
  "/events/getall",
  "/announcement/getall",
  "/announcements/getall",
  "/press-release/getall",
  "/notification/getall",
  "/slider/sliders"
];

async function probe() {
  console.log("Probing live CMS endpoints on srv1079154.hstgr.cloud...\n");
  for (const ep of ENDPOINTS) {
    const url = BASE + ep;
    try {
      const res = await fetch(url, {
        headers: { "user-agent": "Mozilla/5.0" }
      });
      console.log(`Endpoint: ${ep} -> Status: ${res.status}`);
      if (res.ok) {
        const text = await res.text();
        try {
          const json = JSON.parse(text);
          const data = Array.isArray(json) ? json : (json.data || json.items || []);
          console.log(`   Success: returned ${Array.isArray(data) ? data.length : typeof data} records. (Size: ${text.length} bytes)`);
          const fname = `scratch/live_cms_${ep.replace(/\//g, "_")}.json`;
          fs.writeFileSync(fname, JSON.stringify(json, null, 2));
        } catch (e) {
          console.log(`   Non-JSON response (${text.length} bytes)`);
        }
      }
    } catch (e) {
      console.log(`Endpoint: ${ep} -> Fetch error: ${e.message}`);
    }
  }
}

probe();

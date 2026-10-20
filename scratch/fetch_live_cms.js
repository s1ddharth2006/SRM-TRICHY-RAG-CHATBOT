import fs from "fs";
import path from "path";

const BASE_URL = "https://srv1079154.hstgr.cloud/api";
const ENDPOINTS = [
  "/institution/getall",
  "/schools/getall",
  "/school-division/getall",
  "/institution/programmes/getall",
  "/schools/programmes/getall",
  "/school-division/programmes/getall",
  "/institution/dean-message/getall",
  "/school-division/hod-message/getall",
  "/schools/hod-message/getall",
  "/institution/events-and-activities/getall",
  "/school-division/events-and-activities/getall",
  "/schools/events-and-activities/getall",
  "/institution/infrastructure/getall",
  "/institution/stats/getall",
  "/institution/gallery-resource/getall",
  "/about/accreditation/getall",
  "/about/leadership/getall",
  "/student/getAll",
  "/slider/sliders"
];

const OUT_DIR = "./server/data/live_cms";
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function fetchCmsData() {
  console.log("Fetching live CMS data from srv1079154.hstgr.cloud/api...");
  for (const ep of ENDPOINTS) {
    const url = `${BASE_URL}${ep}`;
    try {
      const res = await fetch(url, {
        headers: {
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "accept": "application/json"
        }
      });
      if (res.ok) {
        const json = await res.json();
        const safeName = ep.slice(1).replace(/\//g, "__") + ".json";
        fs.writeFileSync(path.join(OUT_DIR, safeName), JSON.stringify(json, null, 2), "utf8");
        const count = Array.isArray(json.data) ? json.data.length : (json.studentTestimonials ? json.studentTestimonials.length : '1');
        console.log(`✓ ${ep} -> ${safeName} (${count} records)`);
      } else {
        console.log(`✗ ${ep} returned status ${res.status}`);
      }
    } catch (e) {
      console.log(`✗ ${ep} failed:`, e.message);
    }
  }
  console.log("Done fetching live CMS data!");
}

fetchCmsData();

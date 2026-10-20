import fs from "fs";

const API_ENDPOINTS = [
  "https://www.srmtrichy.edu.in/api/institution/getall",
  "https://www.srmtrichy.edu.in/api/schools/getall",
  "https://www.srmtrichy.edu.in/api/school-division/getall",
  "https://www.srmtrichy.edu.in/api/institution/programmes/getall",
  "https://www.srmtrichy.edu.in/api/schools/programmes/getall",
  "https://www.srmtrichy.edu.in/api/school-division/programmes/getall",
  "https://www.srmtrichy.edu.in/api/institution/dean-message/getall",
  "https://www.srmtrichy.edu.in/api/school-division/hod-message/getall",
  "https://www.srmtrichy.edu.in/api/schools/hod-message/getall",
  "https://www.srmtrichy.edu.in/api/institution/infrastructure/getall",
  "https://www.srmtrichy.edu.in/api/institution/events-and-activities/getall"
];

async function checkLiveApis() {
  for (const url of API_ENDPOINTS) {
    try {
      const res = await fetch(url, {
        headers: { "user-agent": "Mozilla/5.0" }
      });
      const text = await res.text();
      console.log(url, "-> Status:", res.status, "Length:", text.length);
      try {
        const json = JSON.parse(text);
        if (json.data) {
          const fname = url.replace("https://www.srmtrichy.edu.in/api/", "").replace(/\//g, "__") + ".json";
          fs.writeFileSync(`./scratch/${fname}`, JSON.stringify(json, null, 2));
          console.log(`   Saved scratch/${fname} (${Array.isArray(json.data) ? json.data.length : 'object'} items)`);
        }
      } catch (err) {}
    } catch (e) {
      console.log(url, "Error:", e.message);
    }
  }
}

checkLiveApis();

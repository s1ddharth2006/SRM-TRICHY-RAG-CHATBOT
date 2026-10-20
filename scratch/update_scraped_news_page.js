import fs from "fs";

const catalog = JSON.parse(fs.readFileSync("server/data/news_and_events_catalog.json", "utf8"));

let text = `# NEWS, EVENTS, CONFERENCES & WORKSHOPS — SRM IST TIRUCHIRAPPALLI\n`;
text += `Official Source: https://www.srmtrichy.edu.in/news-and-events\n\n`;
text += `SRM IST Trichy organizes hundreds of technical hackathons, national conferences, industry workshops, FDPs, cultural festivals, and community awareness rallies across all departments:\n\n`;

const byCat = {};
for (const e of catalog) {
  if (!byCat[e.category]) byCat[e.category] = [];
  byCat[e.category].push(e);
}

for (const [cat, items] of Object.entries(byCat)) {
  text += `## ${cat} (${items.length} Events):\n`;
  for (const item of items) {
    text += `• **${item.title}** [${item.type}] | Date: ${item.date} | Venue: ${item.location}\n`;
    text += `  - Conducted by: ${item.conductedBy || 'SRM IST Trichy'}\n`;
    if (item.coordinator && item.coordinator !== 'Faculty Coordinator') {
      text += `  - Coordinator: ${item.coordinator}\n`;
    }
    if (item.resourcePerson) {
      text += `  - Key Speaker/Resource: ${item.resourcePerson}\n`;
    }
    if (item.description) {
      text += `  - Details: ${item.description.slice(0, 180)}...\n`;
    }
    text += `\n`;
  }
}

const payload = {
  url: "https://www.srmtrichy.edu.in/news-and-events",
  route: "/news-and-events",
  title: "News, Events, Cultural Festivals & Conferences | SRM IST Trichy",
  category: "news_events",
  status: 200,
  contentLength: text.length,
  text,
  hyperlinks: [
    "https://www.srmtrichy.edu.in/",
    "https://www.srmtrichy.edu.in/news-and-events",
    "https://www.srmtrichy.edu.in/departments/cse",
    "https://www.srmtrichy.edu.in/departments/mechanical",
    "https://www.srmtrichy.edu.in/departments/ece",
    "https://www.srmtrichy.edu.in/institution/management-studies",
    "https://www.srmtrichy.edu.in/institution/physiotherapy"
  ],
  scrapedAt: new Date().toISOString()
};

fs.writeFileSync("server/data/scraped_pages/www_srmtrichy_edu_in_news-and-events.json", JSON.stringify(payload, null, 2), "utf8");
console.log(`Updated scraped page with ${text.length} characters of rich event content!`);

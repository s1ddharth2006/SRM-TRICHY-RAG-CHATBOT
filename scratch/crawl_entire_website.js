import fs from "fs";
import path from "path";

const OUT_DIR = "./server/data/scraped_pages";
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// All URLs to scrape
const TARGET_URLS = [
  "https://www.srmtrichy.edu.in/",
  "https://www.srmtrichy.edu.in/about",
  "https://www.srmtrichy.edu.in/admission",
  "https://www.srmtrichy.edu.in/placement",
  "https://www.srmtrichy.edu.in/campus-life",
  "https://www.srmtrichy.edu.in/contact",
  "https://www.srmtrichy.edu.in/institution/engineering-and-technology",
  "https://www.srmtrichy.edu.in/institution/management-studies",
  "https://www.srmtrichy.edu.in/institution/allied-health-sciences",
  "https://www.srmtrichy.edu.in/institution/occupational-therapy",
  "https://www.srmtrichy.edu.in/institution/physiotherapy",
  "https://www.srmtrichy.edu.in/institution/science-and-humanities",
  "https://www.srmtrichy.edu.in/departments/cse",
  "https://www.srmtrichy.edu.in/departments/ai-ds",
  "https://www.srmtrichy.edu.in/departments/cyber-security",
  "https://www.srmtrichy.edu.in/departments/it",
  "https://www.srmtrichy.edu.in/departments/ece",
  "https://www.srmtrichy.edu.in/departments/biotech",
  "https://www.srmtrichy.edu.in/departments/mechanical",
  "https://registration.srmtrichy.edu.in/ph-d-application-form-2027",
  "https://registration.srmtrichy.edu.in/srmist-international-application-form-trichy"
];

function cleanHtmlToText(html) {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
    .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

async function scrapeAll() {
  console.log(`Starting crawl of ${TARGET_URLS.length} target pages...`);
  const results = [];

  for (const url of TARGET_URLS) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(url, {
        headers: {
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) SRM-Chatbot-Trainer/1.0"
        },
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (res.ok) {
        const html = await res.text();
        const text = cleanHtmlToText(html);
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        const title = titleMatch ? titleMatch[1].trim() : url;
        const filename = url.replace(/https?:\/\//, "").replace(/[^a-zA-Z0-9_\-]/g, "_") + ".json";

        const record = {
          url,
          title,
          status: res.status,
          contentLength: text.length,
          text: text.slice(0, 50000), // First 50k chars of clean text
          scrapedAt: new Date().toISOString()
        };

        fs.writeFileSync(path.join(OUT_DIR, filename), JSON.stringify(record, null, 2), "utf8");
        console.log(`✓ Scraped: ${url} (${text.length} chars) -> ${filename}`);
        results.push(record);
      } else {
        console.log(`✗ ${url} returned status ${res.status}`);
      }
    } catch (e) {
      console.log(`✗ ${url} error: ${e.message}`);
    }
  }

  fs.writeFileSync(path.join(OUT_DIR, "index_catalog.json"), JSON.stringify(results.map(r => ({ url: r.url, title: r.title, length: r.contentLength })), null, 2), "utf8");
  console.log(`Crawl completed. Scraped ${results.length} pages into ${OUT_DIR}`);
}

scrapeAll();

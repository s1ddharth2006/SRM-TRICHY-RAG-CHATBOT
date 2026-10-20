import fs from "fs";
import path from "path";

async function inspectNews() {
  console.log("=== INSPECTING LIVE & LOCAL NEWS AND EVENTS ===");

  // 1. Fetch live page HTML
  try {
    const res = await fetch("https://www.srmtrichy.edu.in/news-and-events", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    });
    console.log("Live page status:", res.status);
    const html = await res.text();
    console.log("Live page HTML length:", html.length);
    fs.writeFileSync("scratch/live_news_page.html", html, "utf8");

    // Look for script tags, JS bundles, or API calls inside the HTML
    const scripts = html.match(/src="([^"]+\.js[^"]*)"/g) || [];
    console.log("Script tags found:", scripts.slice(0, 10));

    // Look for CMS host or endpoints
    const cmsMatches = html.match(/https?:\/\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9_.\/-]+/g) || [];
    const uniqueUrls = [...new Set(cmsMatches)].filter(u => u.includes("api") || u.includes("news") || u.includes("event") || u.includes("hstgr"));
    console.log("Relevant URLs in HTML:", uniqueUrls);

  } catch (err) {
    console.error("Live fetch error:", err.message);
  }

  // 2. Inspect CMS JSON files in server/data/live_cms
  const liveCmsDir = "server/data/live_cms";
  if (fs.existsSync(liveCmsDir)) {
    const files = fs.readdirSync(liveCmsDir);
    console.log("\nCMS files in server/data/live_cms:", files);

    for (const file of files) {
      if (file.includes("event") || file.includes("news") || file.includes("activit")) {
        const filePath = path.join(liveCmsDir, file);
        const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
        const items = Array.isArray(data) ? data : (data.data || data.items || []);
        console.log(`\nFile: ${file} -> Items count: ${items.length}`);
        if (items.length > 0) {
          console.log("Sample Item Keys:", Object.keys(items[0]));
          console.log("Sample Item Title:", items[0].title || items[0].name || items[0].event_title || items[0].heading);
          console.log("Sample Item Date:", items[0].date || items[0].event_date || items[0].created_at || items[0].startDate);
        }
      }
    }
  }

  // 3. Inspect scraped_pages/www_srmtrichy_edu_in_news-and-events.json
  const scrapedNewsPath = "server/data/scraped_pages/www_srmtrichy_edu_in_news-and-events.json";
  if (fs.existsSync(scrapedNewsPath)) {
    const content = JSON.parse(fs.readFileSync(scrapedNewsPath, "utf8"));
    console.log("\nScraped page content summary:");
    console.log("Title:", content.title);
    console.log("Content preview:", content.content ? content.content.slice(0, 300) : "empty");
  }
}

inspectNews();

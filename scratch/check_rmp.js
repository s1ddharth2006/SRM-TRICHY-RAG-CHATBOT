import fs from "fs";

async function check() {
  try {
    const res = await fetch("https://srmrmp.edu.in/", {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" }
    });
    const html = await res.text();
    fs.writeFileSync("scratch/rmp.html", html, "utf8");
    console.log("Saved rmp.html, size:", html.length);

    // Look for chat widgets
    const chatMatches = html.match(/[^"'<>\s]+\.(?:js|css)(?:\?[^"'<>\s]*)?/gi) || [];
    const filtered = chatMatches.filter(m => /chat|bot|niaa|meritto|npf|nopaperforms|widget|agent/i.test(m));
    console.log("Chat assets:", [...new Set(filtered)]);

    const iframes = html.match(/<iframe[^>]*>/gi) || [];
    console.log("IFrames:", iframes);

    const scriptTags = html.match(/<script[\s\S]*?<\/script>/gi) || [];
    for (const sc of scriptTags) {
      if (/chat|chatbot|meritto|npf|widget/i.test(sc)) {
        console.log("Script snippet:\n", sc.slice(0, 400));
      }
    }
  } catch (e) {
    console.error(e);
  }
}
check();

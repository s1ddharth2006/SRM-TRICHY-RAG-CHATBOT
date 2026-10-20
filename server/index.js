import http from "http";
import fs from "fs";
import path from "path";
import dns from "dns";
import { fileURLToPath } from "url";
import { handleChat } from "./chat.js";
import { translateMany } from "./translate.js";
import { vectorDb } from "./rag/vector-db.js";
import { ragEngine } from "./rag/rag-engine.js";
import { faqManager } from "./rag/faq-manager.js";
import { learningEngine } from "./rag/learning-engine.js";

dns.setDefaultResultOrder("ipv4first");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DOCS_DIR = path.join(__dirname, "data", "docs");

// Auto-load .env configuration if present (with .env.example fallback)
function loadEnv() {
  const envFiles = [path.join(ROOT, ".env"), path.join(ROOT, ".env.example")];
  for (const envPath of envFiles) {
    if (fs.existsSync(envPath)) {
      try {
        const content = fs.readFileSync(envPath, "utf-8");
        for (const rawLine of content.split(/\r?\n/)) {
          const line = rawLine.trim();
          if (!line || line.startsWith("#")) continue;
          const eq = line.indexOf("=");
          if (eq > 0) {
            const key = line.slice(0, eq).trim();
            let val = line.slice(eq + 1).trim();
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
              val = val.slice(1, -1);
            }
            if (val && !process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      } catch (e) {
        console.warn("Failed to load env file:", envPath, e.message);
      }
    }
  }
}
loadEnv();

const PUBLIC = path.join(ROOT, "public");
const MIRROR = path.join(ROOT, "mirror");
const ORIGIN = "https://www.srmtrichy.edu.in";
const PORT = Number(process.env.PORT || 3000);
const ufetch = globalThis.fetch;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".JPG": "image/jpeg",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

function send(res, status, headers, body) {
  res.writeHead(status, {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, OPTIONS, PUT, DELETE",
    "access-control-allow-headers": "Content-Type, Authorization, x-api-key",
    ...headers
  });
  res.end(body);
}

function mimeFor(file) {
  return MIME[path.extname(file)] || "application/octet-stream";
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function allowedCms(u) {
  try {
    return new URL(u).hostname === "srv1079154.hstgr.cloud";
  } catch {
    return false;
  }
}

function serveFile(res, file) {
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) return false;
  send(res, 200, { "content-type": mimeFor(file), "cache-control": "public, max-age=3600" }, fs.readFileSync(file));
  return true;
}

function safeMirrorPath(urlPath) {
  const relativePath = urlPath === "/" ? "index.html" : urlPath.replace(/^\/+/, "");
  const resolved = path.resolve(MIRROR, relativePath);
  return resolved === MIRROR || resolved.startsWith(MIRROR + path.sep) ? resolved : null;
}

const LOCAL_JS = new Set(["/srm-intercept.js", "/srm-tamil-widget.js", "/srm-tamil-widget.css", "/srm-tamil-dict.js"]);
const DATA_DIR = path.join(__dirname, "data");

async function handleAssetProxy(req, res, urlPath) {
  // 1. Check if the file exists locally in MIRROR or PUBLIC
  const localMirror = safeMirrorPath(urlPath);
  if (localMirror && fs.existsSync(localMirror) && fs.statSync(localMirror).isFile()) {
    return serveFile(res, localMirror);
  }
  const localPublic = path.join(PUBLIC, urlPath);
  if (fs.existsSync(localPublic) && fs.statSync(localPublic).isFile()) {
    return serveFile(res, localPublic);
  }

  // 2. Fetch from ORIGIN with full browser headers
  const remoteUrl = ORIGIN + urlPath;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9000);
    const resp = await ufetch(remoteUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://www.srmtrichy.edu.in/",
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (resp.ok) {
      const buf = Buffer.from(await resp.arrayBuffer());
      const contentType = resp.headers.get("content-type") || mimeFor(urlPath);

      // Cache locally to mirror/assets if path is /assets/*
      try {
        if (localMirror) {
          const dir = path.dirname(localMirror);
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(localMirror, buf);
        }
      } catch (cacheErr) {
        console.warn("Failed to cache asset locally:", cacheErr.message);
      }

      return send(res, 200, {
        "content-type": contentType,
        "cache-control": "public, max-age=86400",
      }, buf);
    }
  } catch (err) {
    console.warn(`Upstream asset fetch failed for ${urlPath}:`, err.message);
  }

  // 3. Fallback placeholder for images if 404 or network failure
  const ext = path.extname(urlPath).toLowerCase();
  if ([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"].includes(ext)) {
    const title = path.basename(urlPath, ext).replace(/[-_].*$/, "").toUpperCase() || "SRM IST";
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0b1e36"/><stop offset="100%" stop-color="#183b63"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><circle cx="300" cy="170" r="50" fill="#c49a45" opacity="0.9"/><text x="50%" y="255" font-family="'DM Sans',sans-serif" font-size="22" font-weight="700" fill="#ffffff" text-anchor="middle">SRM IST TRICHY</text><text x="50%" y="285" font-family="'DM Sans',sans-serif" font-size="14" fill="#cbd5e1" text-anchor="middle">${title}</text></svg>`;
    return send(res, 200, { "content-type": "image/svg+xml", "cache-control": "public, max-age=3600" }, Buffer.from(svg));
  }

  send(res, 404, { "content-type": "text/plain" }, "Not found");
}

function findLocalCms(u) {
  try {
    const parsed = new URL(u);
    const p = parsed.pathname.replace(/^\/api\//, "").replace(/^\//, "");
    const baseName = p.replace(/\//g, "__") + ".json";
    const directFile = path.join(DATA_DIR, baseName);
    if (fs.existsSync(directFile)) return fs.readFileSync(directFile);

    // Fallbacks
    if (p.includes("leadership")) {
      const f = path.join(DATA_DIR, "about__leadership__getall.json");
      if (fs.existsSync(f)) return fs.readFileSync(f);
    }
    if (p.includes("accreditation")) {
      const f = path.join(DATA_DIR, "about__accreditation__getall.json");
      if (fs.existsSync(f)) return fs.readFileSync(f);
    }
    if (p.includes("programmes")) {
      const f = path.join(DATA_DIR, "institution__programmes__getall.json");
      if (fs.existsSync(f)) return fs.readFileSync(f);
    }
    if (p.includes("institution")) {
      const f = path.join(DATA_DIR, "institution__getall.json");
      if (fs.existsSync(f)) return fs.readFileSync(f);
    }
    if (p.includes("slider")) {
      const f = path.join(DATA_DIR, "slider__sliders.json");
      if (fs.existsSync(f)) return fs.readFileSync(f);
    }
    if (p.includes("student")) {
      const f = path.join(DATA_DIR, "student__getAll.json");
      if (fs.existsSync(f)) return fs.readFileSync(f);
    }
    if (p.includes("infrastructure")) {
      const f = path.join(DATA_DIR, "institution__infrastructure__getall.json");
      if (fs.existsSync(f)) return fs.readFileSync(f);
    }
  } catch (e) {}
  return null;
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (req.method === "OPTIONS") {
      return send(res, 204, {}, "");
    }

    // Check public directory for any static assets (embed.js, styles, guides, widgets)
    const publicCandidate = path.join(PUBLIC, url.pathname);
    if (fs.existsSync(publicCandidate) && fs.statSync(publicCandidate).isFile()) {
      return send(res, 200, { "content-type": mimeFor(publicCandidate), "cache-control": "no-cache" }, fs.readFileSync(publicCandidate));
    }

    if (url.pathname === "/__cms") {
      const u = url.searchParams.get("u") || "";
      if (!allowedCms(u)) return send(res, 400, { "content-type": "text/plain" }, "blocked");

      // Render bundled official snapshots first. This makes the mirror dependable
      // when the original CMS is unavailable or slow, without changing the UI.
      const localData = findLocalCms(u);
      if (localData) {
        // The original home-page leadership endpoint returns an array directly,
        // while its bundled snapshot retains the API envelope.
        if (new URL(u).pathname === "/api/about/leadership/getall" && new URL(u).searchParams.get("displayInHome") === "true") {
          const parsed = JSON.parse(localData.toString("utf8"));
          return send(res, 200, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }, JSON.stringify(parsed.data || []));
        }
        return send(res, 200, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }, localData);
      }

      // Endpoints without a bundled snapshot are fetched from the original CMS.
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);
        const up = await ufetch(u, { headers: { "user-agent": "Mozilla/5.0" }, signal: controller.signal });
        clearTimeout(timeoutId);
        if (up.ok) {
          const buf = Buffer.from(await up.arrayBuffer());
          return send(res, up.status, { "content-type": up.headers.get("content-type") || "application/json" }, buf);
        }
      } catch (err) {
        // Upstream unavailable or timed out; continue to local snapshot
      }

      return send(res, 200, { "content-type": "application/json; charset=utf-8" }, JSON.stringify({ success: true, data: [] }));
    }

    if (url.pathname === "/api/translate" && req.method === "POST") {
      const body = JSON.parse((await readBody(req)).toString("utf8") || "{}");
      const translations = await translateMany(body.texts || []);
      return send(res, 200, { "content-type": "application/json; charset=utf-8" }, JSON.stringify({ translations }));
    }

    if (url.pathname === "/api/lead" && req.method === "POST") {
      try {
        const body = JSON.parse((await readBody(req)).toString("utf8") || "{}");
        const leadsFile = path.join(DATA_DIR, "leads.json");
        let leads = [];
        if (fs.existsSync(leadsFile)) {
          try { leads = JSON.parse(fs.readFileSync(leadsFile, "utf8")); } catch (e) { leads = []; }
        }
        const lead = {
          email: body.email || "",
          phone: body.phone || "",
          name: body.name || "",
          lang: body.lang || "en",
          timestamp: new Date().toISOString()
        };
        leads.push(lead);
        fs.writeFileSync(leadsFile, JSON.stringify(leads, null, 2), "utf8");
        return send(res, 200, { "content-type": "application/json; charset=utf-8" }, JSON.stringify({ success: true, message: "Lead saved successfully" }));
      } catch (err) {
        return send(res, 500, { "content-type": "application/json; charset=utf-8" }, JSON.stringify({ success: false, error: err.message }));
      }
    }

    if (url.pathname === "/api/config") {
      if (req.method === "GET") {
        const hasKey = Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);
        return send(res, 200, { "content-type": "application/json; charset=utf-8" }, JSON.stringify({
          hasGeminiKey: hasKey,
          provider: hasKey ? "gemini" : "neural-free"
        }));
      }
      if (req.method === "POST") {
        try {
          const body = JSON.parse((await readBody(req)).toString("utf8") || "{}");
          const key = String(body.apiKey || "").trim();
          if (key) {
            process.env.GEMINI_API_KEY = key;
            const envPath = path.join(ROOT, ".env");
            fs.writeFileSync(envPath, `GEMINI_API_KEY=${key}\nPORT=${PORT}\n`, "utf8");
            return send(res, 200, { "content-type": "application/json; charset=utf-8" }, JSON.stringify({ success: true, hasGeminiKey: true }));
          } else if (body.clear) {
            delete process.env.GEMINI_API_KEY;
            delete process.env.GOOGLE_API_KEY;
            const envPath = path.join(ROOT, ".env");
            fs.writeFileSync(envPath, `GEMINI_API_KEY=\nPORT=${PORT}\n`, "utf8");
            return send(res, 200, { "content-type": "application/json; charset=utf-8" }, JSON.stringify({ success: true, hasGeminiKey: false }));
          }
          return send(res, 400, { "content-type": "application/json; charset=utf-8" }, JSON.stringify({ error: "Missing or invalid apiKey" }));
        } catch (err) {
          return send(res, 500, { "content-type": "application/json; charset=utf-8" }, JSON.stringify({ error: err.message }));
        }
      }
    }

    if (url.pathname === "/api/chat" && req.method === "POST") {
      const body = JSON.parse((await readBody(req)).toString("utf8") || "{}");
      const result = await handleChat(body.message || "", body.history || [], body.lang || "en", { apiKey: body.apiKey });
      return send(res, 200, { "content-type": "application/json; charset=utf-8" }, JSON.stringify(result));
    }

    // --- RAG & Vector Database Endpoints ---
    if (url.pathname === "/api/rag/stats" && req.method === "GET") {
      return send(res, 200, { "content-type": "application/json; charset=utf-8" }, JSON.stringify(vectorDb.getStats()));
    }

    if (url.pathname === "/api/rag/documents" && req.method === "GET") {
      const stats = vectorDb.getStats();
      return send(res, 200, { "content-type": "application/json; charset=utf-8" }, JSON.stringify({ documents: stats.documents }));
    }

    if (url.pathname === "/api/rag/query" && req.method === "POST") {
      try {
        const body = JSON.parse((await readBody(req)).toString("utf8") || "{}");
        const query = String(body.query || "").trim();
        const topK = Number(body.topK || 3);
        const lang = body.lang || "en";
        const hits = await vectorDb.query(query, topK);
        return send(res, 200, { "content-type": "application/json; charset=utf-8" }, JSON.stringify({ query, count: hits.length, hits }));
      } catch (err) {
        return send(res, 500, { "content-type": "application/json; charset=utf-8" }, JSON.stringify({ error: err.message }));
      }
    }

    if (url.pathname === "/api/rag/reindex" && req.method === "POST") {
      try {
        await vectorDb.syncDocs();
        return send(res, 200, { "content-type": "application/json; charset=utf-8" }, JSON.stringify({ success: true, stats: vectorDb.getStats() }));
      } catch (err) {
        return send(res, 500, { "content-type": "application/json; charset=utf-8" }, JSON.stringify({ error: err.message }));
      }
    }

    if (url.pathname === "/api/rag/upload" && req.method === "POST") {
      try {
        const body = JSON.parse((await readBody(req)).toString("utf8") || "{}");
        let { filename, base64 } = body;
        if (!filename || !base64) {
          return send(res, 400, { "content-type": "application/json; charset=utf-8" }, JSON.stringify({ error: "Missing filename or base64 data" }));
        }
        filename = path.basename(filename).replace(/[^\w.-]/g, "_");
        if (!filename.toLowerCase().endsWith(".pdf")) filename += ".pdf";

        const filePath = path.join(DOCS_DIR, filename);
        const buffer = Buffer.from(base64.replace(/^data:application\/pdf;base64,/, ""), "base64");
        fs.writeFileSync(filePath, buffer);

        // Index the newly uploaded document immediately into Vector DB
        await vectorDb.indexPdfFile(filePath, filename);
        vectorDb.saveToDisk();

        return send(res, 200, { "content-type": "application/json; charset=utf-8" }, JSON.stringify({
          success: true,
          filename,
          url: `/docs/${filename}`,
          stats: vectorDb.getStats()
        }));
      } catch (err) {
        return send(res, 500, { "content-type": "application/json; charset=utf-8" }, JSON.stringify({ error: err.message }));
      }
    }

    // --- FAQ Training Endpoints ---
    if (url.pathname === "/api/faqs" && req.method === "GET") {
      return send(res, 200, { "content-type": "application/json; charset=utf-8" }, JSON.stringify({
        count: faqManager.faqs.length,
        faqs: faqManager.getAllFaqs()
      }));
    }

    if (url.pathname === "/api/faqs/train" && req.method === "POST") {
      try {
        const body = JSON.parse((await readBody(req)).toString("utf8") || "{}");
        const trained = faqManager.trainFaq(body);
        return send(res, 200, { "content-type": "application/json; charset=utf-8" }, JSON.stringify({ success: true, faq: trained }));
      } catch (err) {
        return send(res, 500, { "content-type": "application/json; charset=utf-8" }, JSON.stringify({ error: err.message }));
      }
    }

    if (url.pathname.startsWith("/api/faqs/") && req.method === "DELETE") {
      const id = path.basename(url.pathname);
      const deleted = faqManager.deleteFaq(id);
      return send(res, 200, { "content-type": "application/json; charset=utf-8" }, JSON.stringify({ success: deleted }));
    }

    // --- Continuous Active Learning Endpoints ---
    if (url.pathname === "/api/learn/questions" && req.method === "GET") {
      return send(res, 200, { "content-type": "application/json; charset=utf-8" }, JSON.stringify({
        count: learningEngine.learnedQuestions.length,
        learned: learningEngine.getAllLearned()
      }));
    }

    if (url.pathname === "/api/learn/teach" && req.method === "POST") {
      try {
        const body = JSON.parse((await readBody(req)).toString("utf8") || "{}");
        const { question, answer, lang, category } = body;
        if (!question || !answer) {
          return send(res, 400, { "content-type": "application/json; charset=utf-8" }, JSON.stringify({ error: "Missing question or answer" }));
        }
        const learned = await learningEngine.teach(question, answer, lang || "en", category || "general");
        return send(res, 200, { "content-type": "application/json; charset=utf-8" }, JSON.stringify({ success: true, learned }));
      } catch (err) {
        return send(res, 500, { "content-type": "application/json; charset=utf-8" }, JSON.stringify({ error: err.message }));
      }
    }

    if (url.pathname.startsWith("/api/learn/verify/") && req.method === "POST") {
      const id = path.basename(url.pathname);
      const verified = learningEngine.verifyLearned(id);
      return send(res, 200, { "content-type": "application/json; charset=utf-8" }, JSON.stringify({ success: Boolean(verified), item: verified }));
    }

    if (url.pathname.startsWith("/api/learn/questions/") && req.method === "DELETE") {
      const id = path.basename(url.pathname);
      const deleted = learningEngine.deleteLearned(id);
      return send(res, 200, { "content-type": "application/json; charset=utf-8" }, JSON.stringify({ success: deleted }));
    }

    // Serve static PDF documents at /docs/:filename
    if (url.pathname.startsWith("/docs/")) {
      const docFilename = path.basename(url.pathname);
      const docPath = path.join(DOCS_DIR, docFilename);
      if (fs.existsSync(docPath)) {
        return send(res, 200, {
          "content-type": "application/pdf",
          "content-disposition": `inline; filename="${docFilename}"`
        }, fs.readFileSync(docPath));
      }
      return send(res, 404, { "content-type": "text/plain; charset=utf-8" }, "Document not found");
    }

    const localPath = safeMirrorPath(url.pathname);
    if (localPath && path.extname(url.pathname) && serveFile(res, localPath)) return;

    if (url.pathname.startsWith("/assets/") || path.extname(url.pathname)) {
      await handleAssetProxy(req, res, url.pathname);
      return;
    }

    send(
      res,
      200,
      { "content-type": "text/html; charset=utf-8", "cache-control": "no-cache" },
      fs.readFileSync(path.join(MIRROR, "index.html"))
    );
  } catch (err) {
    console.error(err);
    send(res, 500, { "content-type": "text/plain; charset=utf-8" }, "Server error");
  }
});

server.listen(PORT, async () => {
  console.log(`SRM Trichy Tamil clone → http://localhost:${PORT}`);
  try {
    await vectorDb.init();
    await faqManager.init();
    await learningEngine.init();
    console.log(`[RAG & Learning System] Active: ${vectorDb.chunks.length} PDF vectors, ${faqManager.faqs.length} trained FAQs, ${learningEngine.learnedQuestions.length} learned questions.`);
  } catch (err) {
    console.warn("[System Init Warning]:", err.message);
  }
});

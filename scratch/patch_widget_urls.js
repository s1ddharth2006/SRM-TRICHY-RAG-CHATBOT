import fs from "fs";

let js = fs.readFileSync("./public/srm-tamil-widget.js", "utf8");

// 1. Add API_BASE and CSS auto-injection at top
const topInject = `(function () {
  // Determine backend API host for seamless embedding on external websites
  const CURRENT_SCRIPT = document.currentScript || Array.from(document.querySelectorAll("script")).find(s => s.src && s.src.includes("srm-tamil-widget.js"));
  const SCRIPT_ORIGIN = CURRENT_SCRIPT && CURRENT_SCRIPT.src ? new URL(CURRENT_SCRIPT.src).origin : "";
  const API_BASE = (window.SRM_CHAT_API_URL || SCRIPT_ORIGIN || "").replace(/\\/+$/, "");

  // Auto-inject widget stylesheet if not already present on host page
  if (!document.querySelector('link[href*="srm-tamil-widget.css"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = (API_BASE ? API_BASE : "") + "/srm-tamil-widget.css";
    document.head.appendChild(link);
  }
`;

if (!js.includes("SRM_CHAT_API_URL")) {
  js = js.replace(/\(function\s*\(\)\s*\{/, topInject);
}

// 2. Replace /api/translate
js = js.replace(/fetch\(["']\/api\/translate["']/g, 'fetch(`${API_BASE}/api/translate`');

// 3. Replace /api/lead
js = js.replace(/fetch\(["']\/api\/lead["']/g, 'fetch(`${API_BASE}/api/lead`');

// 4. Replace /api/chat
js = js.replace(/fetch\(["']\/api\/chat["']/g, 'fetch(`${API_BASE}/api/chat`');

// 5. Replace any remaining /api/faqs, /api/learn/questions, /api/learn/teach
js = js.replace(/fetch\(["']\/api\/faqs["']/g, 'fetch(`${API_BASE}/api/faqs`');
js = js.replace(/fetch\(["']\/api\/learn\/questions["']/g, 'fetch(`${API_BASE}/api/learn/questions`');
js = js.replace(/fetch\(["']\/api\/learn\/teach["']/g, 'fetch(`${API_BASE}/api/learn/teach`');

fs.writeFileSync("./public/srm-tamil-widget.js", js, "utf8");
console.log("Successfully patched public/srm-tamil-widget.js for universal cross-site integration!");

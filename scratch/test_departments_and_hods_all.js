import { handleChat } from "../server/chat.js";
import { vectorDb } from "../server/rag/vector-db.js";
import { faqManager } from "../server/rag/faq-manager.js";
import { learningEngine } from "../server/rag/learning-engine.js";

async function run() {
  await vectorDb.init();
  await faqManager.init();
  await learningEngine.init();

  const tests = [
    { q: "cse", lang: "en", expectNot: "Kanaga Suba Raja", expectIn: "Department of Computer Science" },
    { q: "who is the hod of cse", lang: "en", expectIn: "Kanaga Suba Raja" },
    { q: "ece", lang: "en", expectNot: "Murugapandiyan", expectIn: "Department of Electronics & Communication" },
    { q: "ece hod", lang: "en", expectIn: "Murugapandiyan" },
    { q: "mechanical", lang: "en", expectIn: "School of Mechanical Engineering" },
    { q: "head of mechanical department", lang: "en", expectIn: "Balasundaram" },
    { q: "cyber security", lang: "en", expectIn: "Department of Cyber Security" },
    { q: "who is the hod of cyber security", lang: "en", expectIn: "Deebalakshmi" },
    { q: "cse fees", lang: "en", expectIn: "₹" }, // Should answer fees!
    { q: "highest package", lang: "en", expectIn: "₹50 LPA" } // Elaborated placement answer
  ];

  console.log("Starting Department & HoD Validation Suite...\n");
  let passed = 0;
  for (const t of tests) {
    const res = await handleChat(t.q, [], t.lang);
    let ok = true;
    if (t.expectIn && !res.answer.toLowerCase().includes(t.expectIn.toLowerCase())) {
      console.error(`FAIL: Query "${t.q}" expected to contain "${t.expectIn}". Got:\n${res.answer}`);
      ok = false;
    }
    if (t.expectNot && res.answer.toLowerCase().includes(t.expectNot.toLowerCase())) {
      console.error(`FAIL: Query "${t.q}" should NOT contain "${t.expectNot}". Got:\n${res.answer}`);
      ok = false;
    }
    if (ok) {
      console.log(`PASS: "${t.q}" -> [Provider: ${res.provider}]`);
      passed++;
    }
  }

  console.log(`\nResults: ${passed} / ${tests.length} tests passed.`);
}

run();

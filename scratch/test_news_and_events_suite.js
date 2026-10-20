import { handleChat } from "../server/chat.js";
import { vectorDb } from "../server/rag/vector-db.js";
import { faqManager } from "../server/rag/faq-manager.js";
import { learningEngine } from "../server/rag/learning-engine.js";

const TEST_CASES = [
  // 1. General News & Events (English)
  {
    name: "General Latest News and Events",
    query: "What are the latest news and events at SRM Trichy?",
    lang: "en",
    expect: ["TENSOR’26", "Project Fiesta", "Oracle Centre of Excellence", "srmtrichy.edu.in/news-and-events"]
  },
  // 2. General News & Events (Tamil)
  {
    name: "General News & Events in Tamil",
    query: "SRM திருச்சி சமீபத்திய செய்திகள் மற்றும் நிகழ்வுகள் என்னென்ன?",
    lang: "ta",
    expect: ["TENSOR’26", "Project Fiesta", "Oracle", "srmtrichy.edu.in/news-and-events"]
  },
  // 3. TENSOR'26 AI Hackathon
  {
    name: "TENSOR'26 AI Hackathon",
    query: "Tell me about TENSOR'26",
    lang: "en",
    expect: ["TENSOR’26", "Balaji Ganesh", "200", "problem statements"]
  },
  // 4. Project Fiesta 2026
  {
    name: "Project Fiesta 2026 (CSE)",
    query: "What is Project Fiesta 2026?",
    lang: "en",
    expect: ["Project Fiesta 2026", "Kanaga Suba Raja", "April 15, 2026"]
  },
  // 5. Oracle Centre of Excellence
  {
    name: "Inauguration of Oracle CoE",
    query: "Tell me about the inauguration of Oracle Centre of Excellence",
    lang: "en",
    expect: ["Oracle Centre of Excellence", "School of Computing", "February 19, 2026"]
  },
  // 6. ICIDDM 2K25 (Mechanical Conference)
  {
    name: "ICIDDM 2K25 Mechanical Conference",
    query: "What is ICIDDM 2K25?",
    lang: "en",
    expect: ["ICIDDM 2K25", "Mechanical", "Digital Manufacturing"]
  },
  // 7. Sustainable Hydrogen Energy
  {
    name: "Sustainable Hydrogen Energy FDP",
    query: "Tell me about the Sustainable Hydrogen Energy FDP",
    lang: "en",
    expect: ["Sustainable Hydrogen Energy", "AICTE-ATAL", "Mechanical"]
  },
  // 8. 8 Patents Published by EEE
  {
    name: "8 Patents Published by EEE Students",
    query: "Tell me about the 8 patents published by EEE students",
    lang: "en",
    expect: ["8 Patents", "Electrical and Electronics", "EEE"]
  },
  // 9. SPICE SURGE Contest
  {
    name: "SPICE SURGE LTspice Contest",
    query: "What is SPICE SURGE?",
    lang: "en",
    expect: ["SPICE SURGE", "LTspice", "VoltEx"]
  },
  // 10. REVIVE '24 (Physiotherapy Conference)
  {
    name: "REVIVE '24 Physiotherapy Conference",
    query: "What is REVIVE '24?",
    lang: "en",
    expect: ["REVIVE ‘24", "Physiotherapy", "500"]
  },
  // 11. DIACON2K26 (Renal Dialysis)
  {
    name: "DIACON2K26 Allied Health Conference",
    query: "Tell me about DIACON2K26",
    lang: "en",
    expect: ["DIACON2K26", "Renal", "Dialysis"]
  },
  // 12. CONFLUENCE 2K25 & IPL Auction
  {
    name: "CONFLUENCE 2K25 & IPL Auction",
    query: "Tell me about CONFLUENCE 2K25 and the IPL auction event",
    lang: "en",
    expect: ["CONFLUENCE 2K25", "Management", "RASRA NG"]
  },
  // 13. Events in CSE Department
  {
    name: "Department Events: CSE",
    query: "What events happened in CSE department?",
    lang: "en",
    expect: ["TENSOR’26", "Project Fiesta", "Oracle"]
  },
  // 14. Events in Mechanical Department
  {
    name: "Department Events: Mechanical",
    query: "What events were conducted in Mechanical Engineering?",
    lang: "en",
    expect: ["ICIDDM 2K25", "Sustainable Hydrogen", "Manufacturing"]
  },
  // 15. Milan Cultural Fest
  {
    name: "Milan Cultural Fest",
    query: "Tell me about Milan cultural fest",
    lang: "en",
    expect: ["Milan", "cultural", "festival"]
  },
  // 16. TENSOR'26 in Tamil
  {
    name: "TENSOR'26 (Tamil)",
    query: "TENSOR 26 ஹேக்கத்தான் பற்றி சொல்",
    lang: "ta",
    expect: ["TENSOR’26", "பாலாஜி கணேஷ்"]
  },
  // 17. Project Fiesta in Tamil
  {
    name: "Project Fiesta (Tamil)",
    query: "Project Fiesta 2026 நிகழ்வு என்ன?",
    lang: "ta",
    expect: ["Project Fiesta 2026", "கனக சுப ராஜா"]
  },
  // 18. EEE Patents in Tamil
  {
    name: "8 Patents (Tamil)",
    query: "EEE மாணவர்கள் வெளியிட்ட 8 காப்புரிமைகள் பற்றி சொல்",
    lang: "ta",
    expect: ["8 காப்புரிமைகள்", "EEE"]
  }
];

async function runTestSuite() {
  console.log("=========================================================");
  console.log("   SRM IST TRICHY - NEWS & EVENTS VALIDATION TEST SUITE   ");
  console.log("=========================================================\n");

  await vectorDb.init();
  await faqManager.init();
  await learningEngine.init();

  let passed = 0;
  let failed = 0;

  for (const t of TEST_CASES) {
    const start = Date.now();
    const res = await handleChat(t.query, [], t.lang);
    const ms = Date.now() - start;

    const text = (res?.answer || "") + " " + (res?.source || "");
    const missing = t.expect.filter(kw => !text.toLowerCase().includes(kw.toLowerCase()));
    const ok = missing.length === 0;

    if (ok) {
      passed++;
      console.log(`✓ [PASS] ${t.name} (${ms}ms) [Provider: ${res.provider}]`);
      console.log(`   Q: "${t.query}"`);
      console.log(`   A: ${res.answer.slice(0, 140).replace(/\n/g, " ")}...\n`);
    } else {
      failed++;
      console.log(`✗ [FAIL] ${t.name} (${ms}ms)`);
      console.log(`   Missing expected keywords: ${missing.join(", ")}`);
      console.log(`   Q: "${t.query}"`);
      console.log(`   A: ${res.answer ? res.answer.slice(0, 200).replace(/\n/g, " ") : "NO ANSWER"}\n`);
    }
  }

  console.log("=========================================================");
  console.log(`RESULTS: ${passed} PASSED | ${failed} FAILED (${passed + failed} TOTAL)`);
  console.log("=========================================================");

  if (failed > 0) process.exit(1);
}

runTestSuite().catch(err => {
  console.error(err);
  process.exit(1);
});

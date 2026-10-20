import { handleChat } from "../server/chat.js";
import { vectorDb } from "../server/rag/vector-db.js";
import { faqManager } from "../server/rag/faq-manager.js";
import { learningEngine } from "../server/rag/learning-engine.js";

const TEST_QUERIES = [
  {
    name: "PhD Online Application Portal (Redirect link)",
    query: "How do I apply online for PhD at SRM Trichy?",
    lang: "en",
    expect: ["registration.srmtrichy.edu.in", "ph-d-application-form-2027"]
  },
  {
    name: "PhD Online Application (Tamil)",
    query: "SRM திருச்சியில் Ph.D. முனைவர் பட்டத்திற்கு ஆன்லைனில் எப்படி விண்ணப்பிப்பது?",
    lang: "ta",
    expect: ["registration.srmtrichy.edu.in", "ph-d"]
  },
  {
    name: "MCA in Generative AI (Course Catalog)",
    query: "Does SRM Trichy offer MCA in Generative AI?",
    lang: "en",
    expect: ["generative ai", "m.c.a", "2"]
  },
  {
    name: "Highest Placement Package",
    query: "What is the highest package and average salary in placements?",
    lang: "en",
    expect: ["50", "lpa", "8.5"]
  },
  {
    name: "Placements (Tamil)",
    query: "வேலைவாய்ப்பு மற்றும் அதிகபட்ச சம்பளம் என்ன?",
    lang: "ta",
    expect: ["50", "lpa"]
  },
  {
    name: "Hostel Fees and Mess Food",
    query: "What are the hostel fees for AC and Non-AC rooms?",
    lang: "en",
    expect: ["85,000", "1,35,000"]
  },
  {
    name: "Hostels (Tamil)",
    query: "விடுதி கட்டணம் எவ்வளவு?",
    lang: "ta",
    expect: ["85,000", "1,35,000"]
  },
  {
    name: "Without Maths Eligibility",
    query: "Can I join B.Tech without 12th Maths?",
    lang: "en",
    expect: ["math", "pcm", "bca"]
  },
  {
    name: "Without Maths (Tamil)",
    query: "12-ல் கணிதம் இல்லாமல் B.Tech படிக்க முடியுமா?",
    lang: "ta",
    expect: ["கணிதம்", "இல்லை", "bca"]
  },
  {
    name: "Apple iMac Lab",
    query: "Tell me about the Apple iMac Lab",
    lang: "en",
    expect: ["apple", "imac", "xcode"]
  },
  {
    name: "College Bus Transport",
    query: "What are the college bus routes and transport fees?",
    lang: "en",
    expect: ["40", "bus", "25,000"]
  },
  {
    name: "International Admissions",
    query: "Where can international students apply?",
    lang: "en",
    expect: ["international-application-form-trichy"]
  },
  {
    name: "Campus Contact & Toll Free",
    query: "What is the admissions toll-free phone number?",
    lang: "en",
    expect: ["1800 202 4565"]
  }
];

async function runTests() {
  console.log("=================================================");
  console.log("   SRM IST TRICHY AI CHATBOT SYSTEM TEST SUITE   ");
  console.log("=================================================\n");

  await vectorDb.init();
  await faqManager.init();
  await learningEngine.init();

  let passed = 0;
  let failed = 0;

  for (const t of TEST_QUERIES) {
    const start = Date.now();
    const res = await handleChat(t.query, [], t.lang);
    const timeMs = Date.now() - start;

    const answerLower = (res?.answer || "").toLowerCase();
    const sourceLower = (res?.source || "").toLowerCase();
    const fullText = `${answerLower} ${sourceLower}`;

    const missing = t.expect.filter(kw => !fullText.includes(kw.toLowerCase()));
    const ok = missing.length === 0;

    if (ok) {
      passed++;
      console.log(`✓ [PASS] ${t.name} (${timeMs}ms)`);
      console.log(`   Q: "${t.query}"`);
      console.log(`   A: ${res.answer.slice(0, 140).replace(/\n/g, " ")}...`);
      console.log(`   Source: ${res.source || "N/A"}\n`);
    } else {
      failed++;
      console.log(`✗ [FAIL] ${t.name} (${timeMs}ms) - Missing keywords: ${missing.join(", ")}`);
      console.log(`   Q: "${t.query}"`);
      console.log(`   A: ${res.answer ? res.answer.slice(0, 160) : "NO ANSWER"}\n`);
    }
  }

  console.log("=================================================");
  console.log(`TEST RESULTS: ${passed} PASSED | ${failed} FAILED (${passed + failed} TOTAL)`);
  console.log("=================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();

import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

const BASE = "http://localhost:3000";

async function run() {
  console.log("=== SRM TRICHY CHATBOT COMPREHENSIVE VALIDATION SUITE ===");
  let passCount = 0;
  let totalTests = 0;

  async function test(name, fn) {
    totalTests++;
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passCount++;
    } catch (err) {
      console.error(`[FAIL] ${name}:`, err.message);
    }
  }

  // 1. CORS Preflight
  await test("1. Cross-Origin OPTIONS check", async () => {
    const res = await fetch(`${BASE}/api/chat`, { method: "OPTIONS" });
    if (res.status !== 204) throw new Error(`Expected 204, got ${res.status}`);
    const origin = res.headers.get("access-control-allow-origin");
    if (origin !== "*") throw new Error(`Expected '*', got ${origin}`);
  });

  // 2. FAQs endpoint
  await test("2. FAQs Endpoint (60 bilingual items)", async () => {
    const res = await fetch(`${BASE}/api/faqs`);
    const json = await res.json();
    if (!Array.isArray(json.faqs)) throw new Error("Invalid FAQ response structure: missing faqs array");
    if (json.faqs.length < 50) throw new Error(`Expected >= 50 FAQs, got ${json.faqs.length}`);
    const sample = json.faqs[0];
    if (!sample.question_en || !sample.answer_en || !sample.question_ta || !sample.answer_ta) {
      throw new Error("FAQ item missing bilingual fields");
    }
    console.log(`   Verified ${json.faqs.length} bilingual FAQs loaded.`);
  });

  // 3. Learned questions endpoint
  await test("3. Learned Questions Endpoint (98+ items)", async () => {
    const res = await fetch(`${BASE}/api/learn/questions`);
    const json = await res.json();
    if (!Array.isArray(json.learned)) throw new Error("Invalid learned questions structure: missing learned array");
    if (json.learned.length < 90) throw new Error(`Expected >= 90 learned questions, got ${json.learned.length}`);
    console.log(`   Verified ${json.learned.length} learned questions loaded.`);
  });

  // 4. Chat Query: B.Tech CSE (English)
  await test("4. Chat: B.Tech CSE & Specializations (English)", async () => {
    const res = await fetch(`${BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "What are the B.Tech specializations in SRM Trichy?", lang: "en" })
    });
    const json = await res.json();
    if (!json.answer || json.answer.length < 10) throw new Error("Empty answer");
    if (!/AI|Data Science|Computer Science|Cyber|B\.Tech|CSBS/i.test(json.answer)) {
      throw new Error("Reply did not mention engineering specializations: " + json.answer);
    }
    console.log("   Answer snippet:", json.answer.slice(0, 90).replace(/\n/g, " ") + "...");
  });

  // 5. Chat Query: B.Tech CSE (Tamil)
  await test("5. Chat: B.Tech பொறியியல் படிப்புகள் (Tamil)", async () => {
    const res = await fetch(`${BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "SRM திருச்சியில் என்னென்ன B.Tech படிப்புகள் உள்ளன?", lang: "ta" })
    });
    const json = await res.json();
    if (!json.answer || json.answer.length < 10) throw new Error("Empty answer");
    console.log("   Tamil answer snippet:", json.answer.slice(0, 90).replace(/\n/g, " ") + "...");
  });

  // 6. Chat Query: Highest Placement Package & Top Recruiters
  await test("6. Chat: Placements & Highest CTC (English)", async () => {
    const res = await fetch(`${BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "What is the highest placement salary package and who are the top recruiters?", lang: "en" })
    });
    const json = await res.json();
    if (!json.answer || !/35|50|LPA|Amazon|TCS|recruit/i.test(json.answer)) {
      throw new Error("Placement response missing expected details: " + json.answer);
    }
    console.log("   Answer snippet:", json.answer.slice(0, 90).replace(/\n/g, " ") + "...");
  });

  // 7. Chat Query: Medical Hospital & Emergency (Tamil)
  await test("7. Chat: மருத்துவக் கல்லூரி மருத்துவமனை & அவசர சிகிச்சை (Tamil)", async () => {
    const res = await fetch(`${BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "SRM மருத்துவக் கல்லூரி மருத்துவமனை வசதிகள் மற்றும் அவசர உதவி எண் என்ன?", lang: "ta" })
    });
    const json = await res.json();
    if (!json.answer || json.answer.length < 10) throw new Error("Empty answer");
    console.log("   Tamil answer snippet:", json.answer.slice(0, 90).replace(/\n/g, " ") + "...");
  });

  // 8. Chat Query: MBA Eligibility & Programs
  await test("8. Chat: Management (MBA) Programs & Eligibility", async () => {
    const res = await fetch(`${BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Tell me about MBA program, specializations and eligibility criteria.", lang: "en" })
    });
    const json = await res.json();
    if (!json.answer || !/MBA|Management|Finance|Marketing|degree/i.test(json.answer)) {
      throw new Error("MBA response missing details: " + json.answer);
    }
    console.log("   Answer snippet:", json.answer.slice(0, 90).replace(/\n/g, " ") + "...");
  });

  // 9. Chat Query: Hostel & Accommodation Rules
  await test("9. Chat: Hostel & Accommodation Facilities", async () => {
    const res = await fetch(`${BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "What hostel facilities and dining options are available for students?", lang: "en" })
    });
    const json = await res.json();
    if (!json.answer || !/hostel|AC|mess|room|dining/i.test(json.answer)) {
      throw new Error("Hostel response missing details: " + json.answer);
    }
    console.log("   Answer snippet:", json.answer.slice(0, 90).replace(/\n/g, " ") + "...");
  });

  // 10. Chat Query: PhD Application Portal & Links
  await test("10. Chat: PhD Application Portal & Registration Link", async () => {
    const res = await fetch(`${BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "How can I apply for PhD program at SRM Trichy?", lang: "en" })
    });
    const json = await res.json();
    if (!json.answer || !/PhD|registration\.srmtrichy\.edu\.in|apply|research/i.test(json.answer)) {
      throw new Error("PhD response missing portal details: " + json.answer);
    }
    console.log("   Answer snippet:", json.answer.slice(0, 90).replace(/\n/g, " ") + "...");
  });

  // 11. Chat Query: International Admissions
  await test("11. Chat: International Student Admissions & NRI Eligibility", async () => {
    const res = await fetch(`${BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "What is the procedure for international students and NRI admissions?", lang: "en" })
    });
    const json = await res.json();
    if (!json.answer || !/international|NRI|srmist|admission|foreign/i.test(json.answer)) {
      throw new Error("International response missing details: " + json.answer);
    }
    console.log("   Answer snippet:", json.answer.slice(0, 90).replace(/\n/g, " ") + "...");
  });

  // 12. Active Continuous Learning Test
  await test("12. Continuous Learning Engine (Teach & Recall)", async () => {
    const uniqueTag = "CAMPUS_ROBOTICS_LAB_TEST_" + Date.now();
    const teachRes = await fetch(`${BASE}/api/learn/teach`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: `Where is the Advanced Robotics Research Facility located in SRM Trichy ${uniqueTag}?`,
        answer: `The Advanced Robotics Research Facility is located in the FET Innovation Block, 3rd Floor, SRM Trichy (${uniqueTag}).`,
        category: "Research",
        source: "Manual Validation"
      })
    });
    const teachJson = await teachRes.json();
    if (!teachJson.success) throw new Error("Failed to teach question: " + JSON.stringify(teachJson));

    // Verify recall
    const recallRes = await fetch(`${BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: `Where is the Advanced Robotics Research Facility located in SRM Trichy ${uniqueTag}?`, lang: "en" })
    });
    const recallJson = await recallRes.json();
    if (!recallJson.answer || !recallJson.answer.includes("FET Innovation Block")) {
      throw new Error("Model failed to recall freshly learned information: " + recallJson.answer);
    }
    console.log("   Learned recall verified:", recallJson.answer.slice(0, 90).replace(/\n/g, " ") + "...");
  });

  console.log(`\n==================================================`);
  console.log(`FINAL RESULT: ${passCount} / ${totalTests} TESTS PASSED!`);
  console.log(`==================================================`);
  if (passCount !== totalTests) {
    process.exit(1);
  }
}

run().catch(err => {
  console.error("Fatal test error:", err);
  process.exit(1);
});

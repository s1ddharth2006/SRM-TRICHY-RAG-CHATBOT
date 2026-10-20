async function testHttp() {
  const cases = [
    {
      desc: "API: 'cse' in English",
      body: { message: "cse", lang: "en", history: [] },
      assert: (res) => {
        if (res.answer.toLowerCase().includes("kanaga suba raja")) {
          throw new Error("Should NOT contain HoD name!");
        }
        if (!res.answer.includes("Department of Computer Science")) {
          throw new Error("Missing department details!");
        }
      }
    },
    {
      desc: "API: 'who is the hod of cse' in English",
      body: { message: "who is the hod of cse", lang: "en", history: [] },
      assert: (res) => {
        if (!res.answer.includes("Kanaga Suba Raja")) {
          throw new Error("Expected HoD name Dr. S. Kanaga Suba Raja!");
        }
      }
    },
    {
      desc: "API: 'cse' in Tamil",
      body: { message: "cse", lang: "ta", history: [] },
      assert: (res) => {
        if (!res.answer.includes("கணினி அறிவியல் மற்றும் பொறியியல் துறை")) {
          throw new Error("Expected Tamil department details!");
        }
        if (res.answer.includes("கனக சுப ராஜா")) {
          throw new Error("Should NOT contain HoD in default department query!");
        }
      }
    },
    {
      desc: "API: 'cse துறை தலைவர் யார்' in Tamil",
      body: { message: "cse துறை தலைவர் யார்", lang: "ta", history: [] },
      assert: (res) => {
        if (!res.answer.includes("கனக சுப ராஜா")) {
          throw new Error("Expected Tamil HoD name!");
        }
      }
    },
    {
      desc: "API: 'ece' in English",
      body: { message: "ece", lang: "en", history: [] },
      assert: (res) => {
        if (res.answer.toLowerCase().includes("murugapandiyan")) {
          throw new Error("Should NOT contain HoD name for 'ece'!");
        }
        if (!res.answer.includes("Electronics & Communication")) {
          throw new Error("Missing ECE department details!");
        }
      }
    },
    {
      desc: "API: 'who is the hod of ece'",
      body: { message: "who is the hod of ece", lang: "en", history: [] },
      assert: (res) => {
        if (!res.answer.includes("Murugapandiyan")) {
          throw new Error("Expected ECE HoD name!");
        }
      }
    },
    {
      desc: "API: 'latest news and events' in English",
      body: { message: "What are the latest news and events at SRM Trichy?", lang: "en", history: [] },
      assert: (res) => {
        if (!res.answer.includes("TENSOR’26") || !res.answer.includes("Project Fiesta")) {
          throw new Error("Missing flagship events in news overview!");
        }
      }
    },
    {
      desc: "API: 'tell me about TENSOR'26'",
      body: { message: "Tell me about TENSOR'26", lang: "en", history: [] },
      assert: (res) => {
        if (!res.answer.includes("Balaji Ganesh") || !res.answer.includes("200")) {
          throw new Error("Missing TENSOR'26 key details!");
        }
      }
    },
    {
      desc: "API: 'Project Fiesta 2026'",
      body: { message: "What is Project Fiesta 2026?", lang: "en", history: [] },
      assert: (res) => {
        if (!res.answer.includes("Kanaga Suba Raja") || !res.answer.includes("April 15, 2026")) {
          throw new Error("Missing Project Fiesta details!");
        }
      }
    },
    {
      desc: "API: '8 patents published by EEE students'",
      body: { message: "Tell me about the 8 patents published by EEE students", lang: "en", history: [] },
      assert: (res) => {
        if (!res.answer.includes("8 Patents") || !res.answer.includes("Electrical and Electronics")) {
          throw new Error("Missing 8 patents details!");
        }
      }
    },
    {
      desc: "API: 'latest news' in Tamil",
      body: { message: "SRM திருச்சி சமீபத்திய செய்திகள் மற்றும் நிகழ்வுகள் என்னென்ன?", lang: "ta", history: [] },
      assert: (res) => {
        if (!res.answer.includes("TENSOR’26") || !res.answer.includes("Project Fiesta")) {
          throw new Error("Missing Tamil news overview details!");
        }
      }
    }
  ];

  console.log("=== Testing Live HTTP API on http://localhost:3000 ===");
  for (const c of cases) {
    const res = await fetch("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(c.body)
    });
    if (!res.ok) {
      console.error(`HTTP status ${res.status} for ${c.desc}`);
      process.exit(1);
    }
    const json = await res.json();
    try {
      c.assert(json);
      console.log(`✓ [PASS] ${c.desc}`);
    } catch (err) {
      console.error(`✗ [FAIL] ${c.desc}: ${err.message}`);
      console.error("Received answer:", json.answer);
      process.exit(1);
    }
  }

  // Check embed.js
  const embedRes = await fetch("http://localhost:3000/embed.js");
  if (embedRes.ok && (await embedRes.text()).includes("Universal")) {
    console.log("✓ [PASS] GET /embed.js served correctly");
  } else {
    console.error("✗ [FAIL] GET /embed.js failed");
    process.exit(1);
  }

  // Check integration_guide.html
  const guideRes = await fetch("http://localhost:3000/integration_guide.html");
  if (guideRes.ok && (await guideRes.text()).includes("Universal Integration")) {
    console.log("✓ [PASS] GET /integration_guide.html served correctly");
  } else {
    console.error("✗ [FAIL] GET /integration_guide.html failed");
    process.exit(1);
  }

  console.log("\nAll live HTTP endpoint tests passed successfully!");
}

testHttp().catch(err => {
  console.error(err);
  process.exit(1);
});

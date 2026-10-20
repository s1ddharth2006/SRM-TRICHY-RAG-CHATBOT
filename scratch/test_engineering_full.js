const queries = [
  // 1. Dean
  { message: "Who is the Dean of Engineering and Technology?", lang: "en" },
  { message: "பொறியியல் புலத்தின் டீன் யார்?", lang: "ta" },

  // 2. Specialized Labs
  { message: "What labs are available in the Engineering department?", lang: "en" },
  { message: "பொறியியல் ஆய்வகங்கள் என்னென்ன உள்ளன?", lang: "ta" },

  // 3. Apple iMac Lab
  { message: "Tell me about the Apple iMac Lab", lang: "en" },
  { message: "ஆப்பிள் லேப் பற்றி கூறுங்கள்", lang: "ta" },

  // 4. ARVR Lab
  { message: "Tell me about the ARVR Lab", lang: "en" },
  { message: "AR/VR ஆய்வகத்தில் என்னென்ன வசதிகள் உள்ளன?", lang: "ta" },

  // 5. Fortinet Cyber Lab
  { message: "Tell me about the Fortinet Cyber Security Lab", lang: "en" },
  { message: "போர்டினெட் சைபர் லேப் பற்றி கூறுங்கள்", lang: "ta" },

  // 6. CSE Specializations
  { message: "What B.Tech specializations are available in Computer Science (CSE)?", lang: "en" },
  { message: "CSE-ல் என்னென்ன சிறப்புப் பாடப்பிரிவுகள் உள்ளன?", lang: "ta" },

  // 7. Software Product Engineering
  { message: "What is B.Tech Software Product Engineering?", lang: "en" },
  { message: "B.Tech Software Product Engineering படிப்பு பற்றிய விவரங்கள் என்ன?", lang: "ta" },

  // 8. CSBS
  { message: "What is B.Tech Computer Science and Business Systems (CSBS)?", lang: "en" },
  { message: "B.Tech CSBS படிப்பு எதனைப் பற்றியது?", lang: "ta" },

  // 9. M.Tech CSE
  { message: "Does SRM Trichy offer M.Tech in Computer Science?", lang: "en" },
  { message: "M.Tech CSE படிப்பு உள்ளதா?", lang: "ta" },

  // 10. Ph.D.
  { message: "Can I do a Ph.D. in Engineering at SRM Trichy?", lang: "en" },
  { message: "SRM திருச்சியில் பொறியியலில் முனைவர் பட்டம் செய்ய முடியுமா?", lang: "ta" },

  // 11. Student Chapters & Hackathons
  { message: "What student technical clubs and hackathons exist?", lang: "en" },
  { message: "பொறியியல் மாணவர்களுக்கான சங்கங்கள் மற்றும் ஹேக்கத்தான்கள் என்னென்ன?", lang: "ta" }
];

async function runTests() {
  console.log("=== RUNNING FULL ENGINEERING & TECHNOLOGY VALIDATION SUITE ===\n");
  let passed = 0;

  for (const q of queries) {
    try {
      const res = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(q)
      });
      const data = await res.json();
      console.log(`Q [${q.lang}]: "${q.message}"`);
      console.log(`Provider: [${data.provider}] | Source: ${data.source}`);
      console.log(`Answer: ${data.answer.replace(/\n+/g, " ")}`);
      console.log("-".repeat(70));
      passed++;
    } catch (err) {
      console.error(`Failed on query: "${q.message}":`, err.message);
    }
  }

  console.log(`\nTests completed: ${passed}/${queries.length} passed.`);
}

runTests();

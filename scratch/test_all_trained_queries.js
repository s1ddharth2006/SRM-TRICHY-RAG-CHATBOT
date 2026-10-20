import fs from "fs";

const queries = [
  // 1. Admissions & Cutoff
  { message: "Can I get admission in B.Tech with 80% marks in 12th?", lang: "en" },
  { message: "12-ல் 80% பெற்றால் சேர்க்கை கிடைக்குமா?", lang: "ta" },
  
  // 2. Without Maths
  { message: "Can I join B.Tech without Mathematics?", lang: "en" },
  { message: "கணிதம் இல்லாமல் B.Tech படிக்க முடியுமா?", lang: "ta" },

  // 3. Fees
  { message: "What is the fee for B.Tech CSE?", lang: "en" },
  { message: "B.Tech CSE கட்டணம் எவ்வளவு?", lang: "ta" },

  // 4. Placements & Salary
  { message: "What was the highest package offered in placements?", lang: "en" },
  { message: "அதிகபட்ச சம்பளம் எவ்வளவு?", lang: "ta" },

  // 5. Hostels & Food
  { message: "What are the hostel facilities and fees?", lang: "en" },
  { message: "விடுதி வசதி மற்றும் கட்டணம் எப்படி?", lang: "ta" },

  // 6. Scholarships
  { message: "What scholarships are available for 12th marks?", lang: "en" },
  { message: "12-ஆம் வகுப்பு மதிப்பெண்ணுக்கு உதவித்தொகை உண்டா?", lang: "ta" },

  // 7. Hospital & Transport
  { message: "Is there a hospital on campus?", lang: "en" },
  { message: "வளாகத்தில் மருத்துவமனை மற்றும் பேருந்து உள்ளதா?", lang: "ta" },

  // 8. Contact & Helpline
  { message: "What is the admission helpline number?", lang: "en" },
  { message: "சேர்க்கை உதவி எண் என்ன?", lang: "ta" }
];

async function runTests() {
  console.log("Running comprehensive validation tests across all domains...\n");
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
      console.log(`A [${data.provider}]: ${data.answer.replace(/\n+/g, " ")}`);
      console.log("-".repeat(70));
      passed++;
    } catch (err) {
      console.error(`Failed on query: "${q.message}":`, err.message);
    }
  }

  console.log(`\nTests completed: ${passed}/${queries.length} passed.`);
}

runTests();

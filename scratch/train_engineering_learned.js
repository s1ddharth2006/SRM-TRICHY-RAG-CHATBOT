import fs from "fs";
import path from "path";
import { generateLocalEmbedding } from "../server/rag/vector-db.js";

const LEARN_FILE = "./server/data/learned_questions.json";
const list = JSON.parse(fs.readFileSync(LEARN_FILE, "utf8"));

const ENG_TRAIN_PAIRS = [
  {
    question: "Who is the Dean of Engineering and Technology?",
    answer: "**Dr. Balasundaram R** is the Professor & Associate Dean of the Faculty of Engineering and Technology (30+ years experience).\n\n🌐 **Source:** [srmtrichy.edu.in/institution/engineering-and-technology](https://www.srmtrichy.edu.in/institution/engineering-and-technology)",
    lang: "en",
    category: "engineering",
    source: "https://www.srmtrichy.edu.in/institution/engineering-and-technology"
  },
  {
    question: "பொறியியல் புலத்தின் டீன் யார்?",
    answer: "பொறியியல் மற்றும் தொழில்நுட்ப புலத்தின் பேராசிரியர் மற்றும் இணை டீன் **முனைவர் பாலசுந்தரம் R** (30+ ஆண்டுகள் அனுபவம்).\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/institution/engineering-and-technology](https://www.srmtrichy.edu.in/institution/engineering-and-technology)",
    lang: "ta",
    category: "engineering",
    source: "https://www.srmtrichy.edu.in/institution/engineering-and-technology"
  },
  {
    question: "Tell me about Dr Balasundaram",
    answer: "**Dr. Balasundaram R** is the Associate Dean of Engineering & Technology at SRM Trichy with over 30 years of academic, research, and administrative excellence.\n\n🌐 **Source:** [srmtrichy.edu.in/institution/engineering-and-technology](https://www.srmtrichy.edu.in/institution/engineering-and-technology)",
    lang: "en",
    category: "engineering",
    source: "https://www.srmtrichy.edu.in/institution/engineering-and-technology"
  },
  {
    question: "What labs are available in the Engineering department?",
    answer: "Elite industry labs include: **Apple iMac App Development CoE (Xcode/Swift)**, **AR/VR Immersive Lab**, **Fortinet Cyber Security Lab (FortiGate/FortiSIEM)**, **Cisco Academy**, and **NVIDIA GPU Labs**.\n\n🌐 **Source:** [srmtrichy.edu.in/institution/engineering-and-technology#infrastructure](https://www.srmtrichy.edu.in/institution/engineering-and-technology#infrastructure)",
    lang: "en",
    category: "engineering_labs",
    source: "https://www.srmtrichy.edu.in/institution/engineering-and-technology#infrastructure"
  },
  {
    question: "பொறியியல் ஆய்வகங்கள் என்னென்ன உள்ளன?",
    answer: "**Apple iMac ஆப் மேம்பாட்டு மையம் (Xcode/Swift)**, **AR/VR ஆய்வகம்**, **Fortinet சைபர் லேப் (FortiGate/FortiSIEM)**, மற்றும் **NVIDIA GPU கம்ப்யூட்டிங் ஆய்வகங்கள்** உள்ளன.\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/institution/engineering-and-technology#infrastructure](https://www.srmtrichy.edu.in/institution/engineering-and-technology#infrastructure)",
    lang: "ta",
    category: "engineering_labs",
    source: "https://www.srmtrichy.edu.in/institution/engineering-and-technology#infrastructure"
  },
  {
    question: "Tell me about the Apple iMac Lab",
    answer: "Established with **Apple Inc.** as the *iMac App Development Center of Excellence*, providing iMacs, MacBooks, Xcode, Swift, and iOS certifications.\n\n🌐 **Source:** [srmtrichy.edu.in/institution/engineering-and-technology#infrastructure](https://www.srmtrichy.edu.in/institution/engineering-and-technology#infrastructure)",
    lang: "en",
    category: "engineering_labs",
    source: "https://www.srmtrichy.edu.in/institution/engineering-and-technology#infrastructure"
  },
  {
    question: "ஆப்பிள் லேப் பற்றி கூறுங்கள்",
    answer: "**Apple Inc.** உடன் இணைந்து உருவாக்கப்பட்ட *iMac App Development CoE* ஆய்வகம். iMacs, MacBooks, Xcode, Swift கொண்டு iOS ஆப் டெவலப்மென்ட் பயிற்சி வழங்குகிறது.\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/institution/engineering-and-technology#infrastructure](https://www.srmtrichy.edu.in/institution/engineering-and-technology#infrastructure)",
    lang: "ta",
    category: "engineering_labs",
    source: "https://www.srmtrichy.edu.in/institution/engineering-and-technology#infrastructure"
  },
  {
    question: "Tell me about the ARVR Lab",
    answer: "The **AR/VR Lab** provides immersive technology headsets for interactive simulations across education, healthcare anatomy, gaming, and industrial digital twins.\n\n🌐 **Source:** [srmtrichy.edu.in/institution/engineering-and-technology#infrastructure](https://www.srmtrichy.edu.in/institution/engineering-and-technology#infrastructure)",
    lang: "en",
    category: "engineering_labs",
    source: "https://www.srmtrichy.edu.in/institution/engineering-and-technology#infrastructure"
  },
  {
    question: "Tell me about the Fortinet Cyber Security Lab",
    answer: "Equipped with **FortiGate Next-Gen Firewalls**, FortiAnalyzer, and FortiSIEM for threat monitoring, SOC security operations, and defense certifications.\n\n🌐 **Source:** [srmtrichy.edu.in/departments/cyber-security](https://www.srmtrichy.edu.in/departments/cyber-security)",
    lang: "en",
    category: "engineering_labs",
    source: "https://www.srmtrichy.edu.in/departments/cyber-security"
  },
  {
    question: "போர்டினெட் சைபர் லேப் பற்றி கூறுங்கள்",
    answer: "**FortiGate ஃபயர்வால்கள்**, FortiAnalyzer மற்றும் FortiSIEM கருவிகளுடன் தொழில்முறை நெட்வொர்க் பாதுகாப்பு மற்றும் SOC அச்சுறுத்தல் கண்காணிப்பு ஆய்வகம்.\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/departments/cyber-security](https://www.srmtrichy.edu.in/departments/cyber-security)",
    lang: "ta",
    category: "engineering_labs",
    source: "https://www.srmtrichy.edu.in/departments/cyber-security"
  },
  {
    question: "What B.Tech specializations are available in Computer Science (CSE)?",
    answer: "B.Tech CSE offers: **AI & ML**, **Cyber Security**, **Data Sciences**, **Software Product Engineering**, and **Computer Science & Business Systems (CSBS)**.\n\n🌐 **Source:** [srmtrichy.edu.in/institution/engineering-and-technology](https://www.srmtrichy.edu.in/institution/engineering-and-technology)",
    lang: "en",
    category: "programmes",
    source: "https://www.srmtrichy.edu.in/institution/engineering-and-technology"
  },
  {
    question: "CSE-ல் என்னென்ன சிறப்புப் பாடப்பிரிவுகள் உள்ளன?",
    answer: "B.Tech CSE சிறப்புப் பிரிவுகள்: **AI & ML**, **சைபர் செக்யூரிட்டி**, **டேட்டா சயின்ஸ்**, **சாப்ட்வேர் ப்ராடக்ட் இன்ஜினியரிங்**, மற்றும் **CSBS**.\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/institution/engineering-and-technology](https://www.srmtrichy.edu.in/institution/engineering-and-technology)",
    lang: "ta",
    category: "programmes",
    source: "https://www.srmtrichy.edu.in/institution/engineering-and-technology"
  },
  {
    question: "What is B.Tech Software Product Engineering?",
    answer: "A modern B.Tech program focused on full-stack architecture, microservices, cloud deployments, DevOps, and agile software product lifecycles.\n\n🌐 **Source:** [srmtrichy.edu.in/departments/cse](https://www.srmtrichy.edu.in/departments/cse)",
    lang: "en",
    category: "programmes",
    source: "https://www.srmtrichy.edu.in/departments/cse"
  },
  {
    question: "What is B.Tech Computer Science and Business Systems (CSBS)?",
    answer: "Blends core computer science with corporate business analytics, financial technology, and management systems.\n\n🌐 **Source:** [srmtrichy.edu.in/departments/cse](https://www.srmtrichy.edu.in/departments/cse)",
    lang: "en",
    category: "programmes",
    source: "https://www.srmtrichy.edu.in/departments/cse"
  },
  {
    question: "Does SRM Trichy offer M.Tech in Computer Science?",
    answer: "**Yes.** 2-Year **M.Tech in CSE (AI & ML Specialization)** is offered with annual fee of **₹1,00,000 to ₹1,50,000**.\n\n🌐 **Source:** [srmtrichy.edu.in/institution/programmes](https://www.srmtrichy.edu.in/institution/programmes)",
    lang: "en",
    category: "programmes",
    source: "https://www.srmtrichy.edu.in/institution/programmes"
  },
  {
    question: "M.Tech CSE படிப்பு உள்ளதா?",
    answer: "**ஆம்.** 2 ஆண்டு **M.Tech CSE (AI & ML சிறப்புப் பிரிவு)** படிப்பு உள்ளது (கட்டணம்: ₹1,00,000 முதல் ₹1,50,000 / ஆண்டு).\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/institution/programmes](https://www.srmtrichy.edu.in/institution/programmes)",
    lang: "ta",
    category: "programmes",
    source: "https://www.srmtrichy.edu.in/institution/programmes"
  },
  {
    question: "Can I do a Ph.D. in Engineering at SRM Trichy?",
    answer: "**Yes.** Full-time & part-time Ph.D. research under recognized supervisors. Apply at **https://registration.srmtrichy.edu.in/ph-d-application-form-2027**.\n\n🌐 **Source:** [registration.srmtrichy.edu.in](https://registration.srmtrichy.edu.in/ph-d-application-form-2027)",
    lang: "en",
    category: "programmes",
    source: "https://registration.srmtrichy.edu.in/ph-d-application-form-2027"
  },
  {
    question: "What student technical clubs and hackathons exist?",
    answer: "SRM Trichy has active **ACM & IEEE Student Chapters**, annual **FLABS Internal Hackathons**, and **CTF Ethical Hacking** challenges.\n\n🌐 **Source:** [srmtrichy.edu.in/institution/engineering-and-technology](https://www.srmtrichy.edu.in/institution/engineering-and-technology)",
    lang: "en",
    category: "campus_life",
    source: "https://www.srmtrichy.edu.in/institution/engineering-and-technology"
  }
];

let added = 0;
for (const p of ENG_TRAIN_PAIRS) {
  const existing = list.find(item => item.question.toLowerCase() === p.question.toLowerCase());
  if (existing) {
    existing.answer = p.answer;
    existing.source = p.source;
    existing.vector = generateLocalEmbedding(p.question);
  } else {
    list.push({
      id: `eng_train_${Date.now()}_${added}`,
      question: p.question,
      answer: p.answer,
      source: p.source,
      score: 1.0,
      status: "verified_trained",
      provider: "trained-website-knowledge",
      lang: p.lang,
      category: p.category,
      vector: generateLocalEmbedding(p.question),
      askCount: 5,
      lastAskedAt: new Date().toISOString()
    });
    added++;
  }
}

fs.writeFileSync(LEARN_FILE, JSON.stringify(list, null, 2), "utf8");
console.log(`Added/Updated ${added} engineering learned items. Total learned: ${list.length}`);

import fs from "fs";
import path from "path";
import { generateLocalEmbedding } from "../server/rag/vector-db.js";

const LEARN_FILE = "./server/data/learned_questions.json";
const list = JSON.parse(fs.readFileSync(LEARN_FILE, "utf8"));

const MASTER_PAIRS = [
  {
    question: "Does SRM Trichy offer MCA in Generative AI?",
    answer: "**Yes!** SRM Trichy offers a 2-Year **M.C.A. with Specialization in Generative AI**, covering LLMs, Prompt Engineering, and AI application architecture.\n\n🌐 **Source:** [srmtrichy.edu.in/institution/science-and-humanities](https://www.srmtrichy.edu.in/institution/science-and-humanities)",
    lang: "en",
    category: "programmes",
    source: "https://www.srmtrichy.edu.in/institution/science-and-humanities"
  },
  {
    question: "Generative AI MCA படிப்பு உள்ளதா?",
    answer: "**ஆம்!** பெரிய மொழி மாதிரிகள் (LLMs) மற்றும் ஜெனரேட்டிவ் AI சிறப்புப் பிரிவுடன் கூடிய 2 ஆண்டு **M.C.A. படிப்பு** உள்ளது.\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/institution/science-and-humanities](https://www.srmtrichy.edu.in/institution/science-and-humanities)",
    lang: "ta",
    category: "programmes",
    source: "https://www.srmtrichy.edu.in/institution/science-and-humanities"
  },
  {
    question: "What are the specializations in MBA?",
    answer: "MBA offers 7 streams: **Finance, Marketing, HR, Business Analytics, Operations, General Management, and Healthcare & Hospital Management**.\n\n🌐 **Source:** [srmtrichy.edu.in/institution/management-studies](https://www.srmtrichy.edu.in/institution/management-studies)",
    lang: "en",
    category: "programmes",
    source: "https://www.srmtrichy.edu.in/institution/management-studies"
  },
  {
    question: "MBA-ல் என்னென்ன பிரிவுகள் உள்ளன?",
    answer: "MBA-ல் 7 பிரிவுகள்: **நிதி (Finance), மார்க்கெட்டிங், HR, பிசினஸ் அனலிட்டிக்ஸ், ஆபரேஷன்ஸ், மற்றும் மருத்துவமனை மேலாண்மை**.\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/institution/management-studies](https://www.srmtrichy.edu.in/institution/management-studies)",
    lang: "ta",
    category: "programmes",
    source: "https://www.srmtrichy.edu.in/institution/management-studies"
  },
  {
    question: "Tell me about MBA in Hospital Management",
    answer: "A 2-year MBA with daily clinical administrative training at the on-campus **750-bed Teaching Hospital** (HoD: Dr. R. Somasundaram).\n\n🌐 **Source:** [srmtrichy.edu.in/institution/management-studies](https://www.srmtrichy.edu.in/institution/management-studies)",
    lang: "en",
    category: "programmes",
    source: "https://www.srmtrichy.edu.in/institution/management-studies"
  },
  {
    question: "What courses are in Hotel Management?",
    answer: "• **B.Sc. Hotel & Hospitality Administration** (3/4 Yrs Honours)\n• **Diploma in Hotel Management** (3 Yrs)\n• 100% placements in Taj, Marriott, Oberoi.\n\n🌐 **Source:** [srmtrichy.edu.in/institution/institute-of-hotel-management](https://www.srmtrichy.edu.in/institution/institute-of-hotel-management)",
    lang: "en",
    category: "programmes",
    source: "https://www.srmtrichy.edu.in/institution/institute-of-hotel-management"
  },
  {
    question: "ஹோட்டல் மேனேஜ்மென்ட் படிப்புகள் என்னென்ன?",
    answer: "• **B.Sc. ஹோட்டல் நிர்வாகம்** (3/4 ஆண்டுகள்)\n• **டிப்ளமோ கேட்டரிங் சயின்ஸ்** (3 ஆண்டுகள்)\n• 5-நட்சத்திர ஹோட்டல்களில் 100% வேலைவாய்ப்பு.\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/institution/institute-of-hotel-management](https://www.srmtrichy.edu.in/institution/institute-of-hotel-management)",
    lang: "ta",
    category: "programmes",
    source: "https://www.srmtrichy.edu.in/institution/institute-of-hotel-management"
  },
  {
    question: "What MPT specializations are available?",
    answer: "7 MPT Specializations: **Musculoskeletal, Neuroscience, Cardio-Pulmonary, Sports Science, Pediatrics, OBG, and Oncology Science** (2 Years).\n\n🌐 **Source:** [srmtrichy.edu.in/institution/physiotherapy](https://www.srmtrichy.edu.in/institution/physiotherapy)",
    lang: "en",
    category: "programmes",
    source: "https://www.srmtrichy.edu.in/institution/physiotherapy"
  },
  {
    question: "MPT பிசியோதெரபி பிரிவுகள் என்னென்ன?",
    answer: "MPT-ல் 7 பிரிவுகள்: **தசைக்கூடு, நரம்பியல், விளையாட்டு அறிவியல், குழந்தைகள் நலன், இருதயம், மகளிர் நலம், மற்றும் புற்றுநோய் அறிவியல்**.\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/institution/physiotherapy](https://www.srmtrichy.edu.in/institution/physiotherapy)",
    lang: "ta",
    category: "programmes",
    source: "https://www.srmtrichy.edu.in/institution/physiotherapy"
  },
  {
    question: "What is Bachelor of Occupational Therapy (BOT)?",
    answer: "5-Year BOT (4 yrs study + 1 yr internship) equipped with **11 specialized rehab laboratories** under NCAHP Act (Associate Dean: Dr. D. Suresh).\n\n🌐 **Source:** [srmtrichy.edu.in/institution/occupational-therapy](https://www.srmtrichy.edu.in/institution/occupational-therapy)",
    lang: "en",
    category: "programmes",
    source: "https://www.srmtrichy.edu.in/institution/occupational-therapy"
  },
  {
    question: "ஆக்குபேஷனல் தெரபி படிப்பு பற்றி கூறுங்கள்",
    answer: "11 நவீன மறுவாழ்வு ஆய்வகங்களுடன் கூடிய 5 ஆண்டு BOT படிப்பு (4 ஆண்டு படிப்பு + 1 ஆண்டு பயிற்சி, இணை டீன்: முனைவர் D. சுரேஷ்).\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/institution/occupational-therapy](https://www.srmtrichy.edu.in/institution/occupational-therapy)",
    lang: "ta",
    category: "programmes",
    source: "https://www.srmtrichy.edu.in/institution/occupational-therapy"
  },
  {
    question: "What Allied Health Science degrees are available?",
    answer: "B.Sc. & M.Sc. in: **Physician Associate, Dialysis Therapy, Anesthesia & OT Tech, Medical Lab Science, Radiology & Imaging, Optometry, and Nutrition**.\n\n🌐 **Source:** [srmtrichy.edu.in/institution/allied-health-sciences](https://www.srmtrichy.edu.in/institution/allied-health-sciences)",
    lang: "en",
    category: "programmes",
    source: "https://www.srmtrichy.edu.in/institution/allied-health-sciences"
  },
  {
    question: "அலைடு ஹெல்த் சயின்ஸ் படிப்புகள் என்னென்ன?",
    answer: "**பிசிஷியன் அசோசியேட், டயாலிசிஸ், மயக்கவியல் (OT Tech), மருத்துவ ஆய்வகம், ரேடியாலஜி, ஆப்டோமெட்ரி, மற்றும் ஊட்டச்சத்து** படிப்புகள் உள்ளன.\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/institution/allied-health-sciences](https://www.srmtrichy.edu.in/institution/allied-health-sciences)",
    lang: "ta",
    category: "programmes",
    source: "https://www.srmtrichy.edu.in/institution/allied-health-sciences"
  },
  {
    question: "How to apply for Ph.D. online?",
    answer: "Apply online at **https://registration.srmtrichy.edu.in/ph-d-application-form-2027** for Full-Time and Part-Time Ph.D. programs.\n\n🌐 **Source:** [registration.srmtrichy.edu.in](https://registration.srmtrichy.edu.in/ph-d-application-form-2027)",
    lang: "en",
    category: "admissions",
    source: "https://registration.srmtrichy.edu.in/ph-d-application-form-2027"
  },
  {
    question: "Ph.D. விண்ணப்பிப்பது எப்படி?",
    answer: "**https://registration.srmtrichy.edu.in/ph-d-application-form-2027** இணையதளத்தில் முழு நேர மற்றும் பகுதி நேர Ph.D.-க்கு விண்ணப்பிக்கலாம்.\n\n🌐 **ஆதாரம்:** [registration.srmtrichy.edu.in](https://registration.srmtrichy.edu.in/ph-d-application-form-2027)",
    lang: "ta",
    category: "admissions",
    source: "https://registration.srmtrichy.edu.in/ph-d-application-form-2027"
  },
  {
    question: "How can foreign or international students apply?",
    answer: "International students from 50+ countries can apply at **https://registration.srmtrichy.edu.in/srmist-international-application-form-trichy**.\n\n🌐 **Source:** [registration.srmtrichy.edu.in](https://registration.srmtrichy.edu.in/srmist-international-application-form-trichy)",
    lang: "en",
    category: "admissions",
    source: "https://registration.srmtrichy.edu.in/srmist-international-application-form-trichy"
  },
  {
    question: "What is the student portal URL?",
    answer: "Access the official student portal at **https://cubonline.biz/StudentLogin** for attendance, internal marks, semester results, and fee receipts.\n\n🌐 **Source:** [cubonline.biz](https://cubonline.biz/StudentLogin)",
    lang: "en",
    category: "campus_life",
    source: "https://cubonline.biz/StudentLogin"
  },
  {
    question: "மாணவர் லாகின் போர்டல் எது?",
    answer: "வருகைப்பதிவு மற்றும் தேர்வு முடிவுகளைப் பார்க்க அதிகாரப்பூர்வ போர்டல்: **https://cubonline.biz/StudentLogin**.\n\n🌐 **ஆதாரம்:** [cubonline.biz](https://cubonline.biz/StudentLogin)",
    lang: "ta",
    category: "campus_life",
    source: "https://cubonline.biz/StudentLogin"
  },
  {
    question: "Who is the HoD of CSE?",
    answer: "**Dr. S. Kanaga Suba Raja** is the Professor & Head of the Department of Computer Science and Engineering (CSE).\n\n🌐 **Source:** [srmtrichy.edu.in/departments/cse](https://www.srmtrichy.edu.in/departments/cse)",
    lang: "en",
    category: "leadership",
    source: "https://www.srmtrichy.edu.in/departments/cse"
  },
  {
    question: "Who is the HoD of Cyber Security?",
    answer: "**Dr. R. Deebalakshmi** is the Associate Professor & Head of the Department of Cyber Security.\n\n🌐 **Source:** [srmtrichy.edu.in/departments/cyber-security](https://www.srmtrichy.edu.in/departments/cyber-security)",
    lang: "en",
    category: "leadership",
    source: "https://www.srmtrichy.edu.in/departments/cyber-security"
  },
  {
    question: "Who is the HoD of AI and ML?",
    answer: "**Dr. R. Balaji Ganesh** is the Associate Professor & HoD of AI & ML and Assistant Dean (Research).\n\n🌐 **Source:** [srmtrichy.edu.in/departments/ai-ds](https://www.srmtrichy.edu.in/departments/ai-ds)",
    lang: "en",
    category: "leadership",
    source: "https://www.srmtrichy.edu.in/departments/ai-ds"
  },
  {
    question: "Who is the HoD of ECE?",
    answer: "**Dr. P. Murugapandiyan** is the Professor & Head of the Department of Electronics and Communication Engineering (ECE).\n\n🌐 **Source:** [srmtrichy.edu.in/departments/ece](https://www.srmtrichy.edu.in/departments/ece)",
    lang: "en",
    category: "leadership",
    source: "https://www.srmtrichy.edu.in/departments/ece"
  },
  {
    question: "Does SRM Trichy offer B.Tech in Blockchain?",
    answer: "**Yes.** SRM Trichy offers **B.Tech CSE with Specialization in Blockchain Technology**, covering smart contracts and Web3.\n\n🌐 **Source:** [srmtrichy.edu.in/institution/engineering-and-technology](https://www.srmtrichy.edu.in/institution/engineering-and-technology)",
    lang: "en",
    category: "programmes",
    source: "https://www.srmtrichy.edu.in/institution/engineering-and-technology"
  },
  {
    question: "Does SRM Trichy offer B.Tech in IoT?",
    answer: "**Yes.** SRM Trichy offers **B.Tech CSE with Specialization in Internet of Things (IoT)**, featuring sensor hardware and smart automation.\n\n🌐 **Source:** [srmtrichy.edu.in/institution/engineering-and-technology](https://www.srmtrichy.edu.in/institution/engineering-and-technology)",
    lang: "en",
    category: "programmes",
    source: "https://www.srmtrichy.edu.in/institution/engineering-and-technology"
  },
  {
    question: "Does SRM Trichy offer Biomedical Engineering?",
    answer: "**Yes.** 4-Year **B.Tech in Biomedical Engineering** with practical hospital instrumentation postings at the on-campus 750-bed teaching hospital.\n\n🌐 **Source:** [srmtrichy.edu.in/institution/engineering-and-technology](https://www.srmtrichy.edu.in/institution/engineering-and-technology)",
    lang: "en",
    category: "programmes",
    source: "https://www.srmtrichy.edu.in/institution/engineering-and-technology"
  },
  {
    question: "Does SRM Trichy offer Food Technology?",
    answer: "**Yes.** **B.Tech Biotechnology with Specialization in Food Technology** is offered (HoD: Dr. M. Maria Leena).\n\n🌐 **Source:** [srmtrichy.edu.in/departments/biotech](https://www.srmtrichy.edu.in/departments/biotech)",
    lang: "en",
    category: "programmes",
    source: "https://www.srmtrichy.edu.in/departments/biotech"
  },
  {
    question: "How do I integrate this chatbot into the main website?",
    answer: "Embed this script tag before `</body>`:\n`<script src=\"https://your-domain/srm-tamil-widget.js\"></script>`\nIt automatically loads the floating widget with full RAG and bilingual support.\n\n🌐 **Source:** [srmtrichy.edu.in](https://www.srmtrichy.edu.in/)",
    lang: "en",
    category: "technical",
    source: "https://www.srmtrichy.edu.in/"
  },
  {
    question: "சாட்பாட்டை முதன்மை இணையதளத்தில் இணைப்பது எப்படி?",
    answer: "வலைப்பக்கத்தின் `</body>` முன் இந்த ஸ்கிரிப்டை சேர்க்கவும்:\n`<script src=\"https://your-domain/srm-tamil-widget.js\"></script>`\nஇது தானாகவே சாட்பாட்டை இயக்கும்.\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in](https://www.srmtrichy.edu.in/)",
    lang: "ta",
    category: "technical",
    source: "https://www.srmtrichy.edu.in/"
  }
];

let added = 0;
for (const p of MASTER_PAIRS) {
  const existing = list.find(item => item.question.toLowerCase() === p.question.toLowerCase());
  if (existing) {
    existing.answer = p.answer;
    existing.source = p.source;
    existing.vector = generateLocalEmbedding(p.question);
  } else {
    list.push({
      id: `master_train_${Date.now()}_${added}`,
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
console.log(`Added/Updated ${added} master learned items. Total learned questions: ${list.length}`);

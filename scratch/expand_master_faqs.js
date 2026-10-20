import fs from "fs";

const FAQ_FILE = "./server/data/faqs.json";
const faqs = JSON.parse(fs.readFileSync(FAQ_FILE, "utf8"));

const MASTER_ADDITIONS = [
  {
    id: "faq_mca_genai",
    category: "programmes",
    question_en: "Does SRM Trichy offer MCA with Generative AI?",
    question_ta: "SRM திருச்சியில் Generative AI கொண்ட MCA படிப்பு உள்ளதா?",
    keywords: ["mca generative ai", "mca genai", "mca", "எம்சிஏ", "ஜெனரேட்டிவ் ஏஐ"],
    answer_en: "**Yes!** SRM Trichy offers a 2-Year **M.C.A. with Specialization in Generative AI**, covering LLMs, Prompt Engineering, and AI application architecture.",
    answer_ta: "**ஆம்!** பெரிய மொழி மாதிரிகள் (LLMs) மற்றும் ஜெனரேட்டிவ் AI சிறப்புப் பிரிவுடன் கூடிய 2 ஆண்டு **M.C.A. படிப்பு** உள்ளது.",
    source: "https://www.srmtrichy.edu.in/institution/science-and-humanities"
  },
  {
    id: "faq_mba_specializations",
    category: "programmes",
    question_en: "What are all the specializations available in MBA at SRM Trichy?",
    question_ta: "SRM திருச்சியில் MBA படிப்பில் என்னென்ன சிறப்புப் பிரிவுகள் உள்ளன?",
    keywords: ["mba specializations", "mba streams", "finance mba", "marketing mba", "எம்.பி.ஏ பிரிவுகள்"],
    answer_en: "MBA offers 7 streams: **Finance, Marketing, HR, Business Analytics, Operations, General Management, and Healthcare & Hospital Management**.",
    answer_ta: "MBA-ல் 7 பிரிவுகள்: **நிதி (Finance), மார்க்கெட்டிங், HR, பிசினஸ் அனலிட்டிக்ஸ், ஆபரேஷன்ஸ், மற்றும் மருத்துவமனை மேலாண்மை**.",
    source: "https://www.srmtrichy.edu.in/institution/management-studies"
  },
  {
    id: "faq_mba_hospital_mgmt",
    category: "programmes",
    question_en: "Tell me about MBA in Healthcare and Hospital Management.",
    question_ta: "MBA மருத்துவமனை மேலாண்மை (Healthcare & Hospital Management) படிப்பு பற்றி கூறுங்கள்.",
    keywords: ["mba hospital management", "healthcare mba", "மருத்துவமனை மேலாண்மை"],
    answer_en: "A 2-year MBA with daily clinical administrative training at the on-campus **750-bed Teaching Hospital** (HoD: Dr. R. Somasundaram).",
    answer_ta: "வளாகத்தில் உள்ள **750 படுக்கை SRM மருத்துவமனையில்** நேரடி நிர்வாக பயிற்சியுடன் கூடிய 2 ஆண்டு MBA படிப்பு (துறைத் தலைவர்: Dr. R. சோமசுந்தரம்).",
    source: "https://www.srmtrichy.edu.in/institution/management-studies"
  },
  {
    id: "faq_bcom_logistics",
    category: "programmes",
    question_en: "What is B.Com Logistics (Honours)?",
    question_ta: "B.Com Logistics (Honours) படிப்பு எதனைப் பற்றியது?",
    keywords: ["bcom logistics", "aedp", "apprenticeship bcom", "லாஜிஸ்டிக்ஸ்"],
    answer_en: "An Apprenticeship Embedded Degree Programme (AEDP) combining academic commerce with paid supply chain industry apprenticeships.",
    answer_ta: "படிப்போடு நேரடி தொழில் நிறுவனப் பயிற்சியை (Apprenticeship) இணைத்து வழங்கப்படும் B.Com லாஜிஸ்டிக்ஸ் படிப்பு.",
    source: "https://www.srmtrichy.edu.in/institution/science-and-humanities"
  },
  {
    id: "faq_hotel_management",
    category: "programmes",
    question_en: "What courses are offered by the Institute of Hotel Management?",
    question_ta: "ஹோட்டல் மேனேஜ்மென்ட் பிரிவில் என்னென்ன படிப்புகள் உள்ளன?",
    keywords: ["hotel management", "catering", "hospitality", "chef", "ஹோட்டல் மேனேஜ்மென்ட்"],
    answer_en: "• **B.Sc. Hotel and Hospitality Administration** (3/4 Yrs Honours)\n• **Diploma in Hotel Management** (3 Yrs)\n• 100% placements in Taj, Marriott, Oberoi.",
    answer_ta: "• **B.Sc. ஹோட்டல் நிர்வாகம்** (3/4 ஆண்டுகள்)\n• **டிப்ளமோ கேட்டரிங் சயின்ஸ்** (3 ஆண்டுகள்)\n• தாஜ், மேரியட் உள்ளிட்ட 5-நட்சத்திர ஹோட்டல்களில் 100% வேலைவாய்ப்பு.",
    source: "https://www.srmtrichy.edu.in/institution/institute-of-hotel-management"
  },
  {
    id: "faq_bpt_specializations",
    category: "programmes",
    question_en: "What Master of Physiotherapy (MPT) specializations are available?",
    question_ta: "மாஸ்டர் ஆஃப் பிசியோதெரபி (MPT) படிப்பில் என்னென்ன பிரிவுகள் உள்ளன?",
    keywords: ["mpt specializations", "master physiotherapy", "sports physio", "எம்.பி.டி"],
    answer_en: "7 MPT Specializations: **Musculoskeletal, Neuroscience, Cardio-Pulmonary, Sports Science, Pediatrics, OBG, and Oncology Science** (2 Years).",
    answer_ta: "MPT-ல் 7 பிரிவுகள்: **தசைக்கூடு, நரம்பியல், விளையாட்டு அறிவியல், குழந்தைகள் நலன், இருதயம், மகளிர் நலம், மற்றும் புற்றுநோய் அறிவியல்**.",
    source: "https://www.srmtrichy.edu.in/institution/physiotherapy"
  },
  {
    id: "faq_occupational_therapy",
    category: "programmes",
    question_en: "Tell me about Bachelor of Occupational Therapy (BOT).",
    question_ta: "ஆக்குபேஷனல் தெரபி (BOT) படிப்பு பற்றிய விவரங்கள் என்ன?",
    keywords: ["bot", "occupational therapy", "rehab", "தொழில் சிகிச்சை"],
    answer_en: "5-Year BOT (4 yrs study + 1 yr internship) equipped with **11 specialized rehab laboratories** under NCAHP Act (Associate Dean: Dr. D. Suresh).",
    answer_ta: "11 நவீன மறுவாழ்வு ஆய்வகங்களுடன் கூடிய 5 ஆண்டு BOT படிப்பு (4 ஆண்டு படிப்பு + 1 ஆண்டு பயிற்சி, இணை டீன்: முனைவர் D. சுரேஷ்).",
    source: "https://www.srmtrichy.edu.in/institution/occupational-therapy"
  },
  {
    id: "faq_allied_health_courses",
    category: "programmes",
    question_en: "What Allied Health Science courses are offered?",
    question_ta: "அலைடு ஹெல்த் சயின்ஸ் பிரிவில் என்னென்ன படிப்புகள் உள்ளன?",
    keywords: ["allied health", "physician associate", "dialysis", "radiology", "optometry", "அலைடு ஹெல்த்"],
    answer_en: "B.Sc. & M.Sc. in: **Physician Associate, Dialysis Therapy, Anesthesia & OT Tech, Medical Lab Science, Radiology & Imaging, Optometry, and Nutrition**.",
    answer_ta: "**பிசிஷியன் அசோசியேட், டயாலிசிஸ், மயக்கவியல் (OT Tech), மருத்துவ ஆய்வகம், ரேடியாலஜி, ஆப்டோமெட்ரி, மற்றும் ஊட்டச்சத்து** படிப்புகள் உள்ளன.",
    source: "https://www.srmtrichy.edu.in/institution/allied-health-sciences"
  },
  {
    id: "faq_phd_admissions",
    category: "admissions",
    question_en: "How do I apply for Ph.D. admissions at SRM Trichy?",
    question_ta: "SRM திருச்சியில் Ph.D. சேர்க்கைக்கு எவ்வாறு விண்ணப்பிப்பது?",
    keywords: ["phd admission", "phd apply", "doctoral admission", "பிஎச்டி விண்ணப்பம்"],
    answer_en: "Apply online at **https://registration.srmtrichy.edu.in/ph-d-application-form-2027** for Full-Time and Part-Time Ph.D. programs.",
    answer_ta: "**https://registration.srmtrichy.edu.in/ph-d-application-form-2027** இணையதளத்தில் முழு நேர மற்றும் பகுதி நேர Ph.D.-க்கு விண்ணப்பிக்கலாம்.",
    source: "https://registration.srmtrichy.edu.in/ph-d-application-form-2027"
  },
  {
    id: "faq_international_admissions",
    category: "admissions",
    question_en: "How can international students apply for admission?",
    question_ta: "வெளிநாட்டு மாணவர்கள் (International Students) எவ்வாறு விண்ணப்பிக்கலாம்?",
    keywords: ["international students", "nri admission", "foreign students", "வெளிநாட்டு மாணவர்கள்"],
    answer_en: "International students from 50+ countries can apply at **https://registration.srmtrichy.edu.in/srmist-international-application-form-trichy** (Visa & scholarship support provided).",
    answer_ta: "50+ நாடுகளைச் சேர்ந்த மாணவர்கள் **https://registration.srmtrichy.edu.in/srmist-international-application-form-trichy** வழியாக விண்ணப்பிக்கலாம்.",
    source: "https://registration.srmtrichy.edu.in/srmist-international-application-form-trichy"
  },
  {
    id: "faq_student_portal",
    category: "campus_life",
    question_en: "What is the student portal URL for attendance and results?",
    question_ta: "மாணவர்களுக்கான வருகைப்பதிவு மற்றும் தேர்வு முடிவுகள் போர்டல் எது?",
    keywords: ["student login", "cubonline", "results", "attendance portal", "மாணவர் போர்டல்"],
    answer_en: "Access the official student portal at **https://cubonline.biz/StudentLogin** for daily attendance, internal marks, semester results, and fee receipts.",
    answer_ta: "வருகைப்பதிவு, தேர்வுக் கட்டணம் மற்றும் முடிவுகளைப் பார்க்க அதிகாரப்பூர்வ போர்டல்: **https://cubonline.biz/StudentLogin**.",
    source: "https://cubonline.biz/StudentLogin"
  },
  {
    id: "faq_hod_cse",
    category: "leadership",
    question_en: "Who is the Head of Department (HoD) of Computer Science and Engineering?",
    question_ta: "கணினி அறிவியல் மற்றும் பொறியியல் (CSE) துறைத் தலைவர் யார்?",
    keywords: ["hod cse", "cse hod", "kanaga suba raja", "சிஎஸ்இ தலைவர்"],
    answer_en: "**Dr. S. Kanaga Suba Raja** is the Professor & Head of the Department of Computer Science and Engineering (CSE).",
    answer_ta: "கணினி அறிவியல் மற்றும் பொறியியல் துறையின் தலைவர் பேராசிரியர் **முனைவர் S. கனக சுப ராஜா** ஆவார்.",
    source: "https://www.srmtrichy.edu.in/departments/cse"
  },
  {
    id: "faq_hod_cyber_security",
    category: "leadership",
    question_en: "Who is the HoD of Cyber Security?",
    question_ta: "சைபர் செக்யூரிட்டி துறைத் தலைவர் யார்?",
    keywords: ["hod cyber security", "deebalakshmi", "சைபர் தலைவர்"],
    answer_en: "**Dr. R. Deebalakshmi** is the Associate Professor & Head of the Department of Cyber Security.",
    answer_ta: "சைபர் செக்யூரிட்டி துறையின் தலைவர் இணைப் பேராசிரியர் **முனைவர் R. தீபலக்ஷ்மி** ஆவார்.",
    source: "https://www.srmtrichy.edu.in/departments/cyber-security"
  },
  {
    id: "faq_hod_aiml",
    category: "leadership",
    question_en: "Who is the HoD of Artificial Intelligence and Machine Learning (AIML)?",
    question_ta: "AI & ML துறைத் தலைவர் யார்?",
    keywords: ["hod aiml", "balaji ganesh", "ஏஐஎம்எல் தலைவர்"],
    answer_en: "**Dr. R. Balaji Ganesh** is the Associate Professor & HoD of AI & ML and Assistant Dean (Research).",
    answer_ta: "AI & ML துறையின் தலைவர் மற்றும் ஆராய்ச்சி உதவி டீன் **முனைவர் R. பாலாஜி கணேஷ்** ஆவார்.",
    source: "https://www.srmtrichy.edu.in/departments/ai-ds"
  },
  {
    id: "faq_hod_ece",
    category: "leadership",
    question_en: "Who is the HoD of Electronics and Communication Engineering (ECE)?",
    question_ta: "ECE துறைத் தலைவர் யார்?",
    keywords: ["hod ece", "murugapandiyan", "இசிஇ தலைவர்"],
    answer_en: "**Dr. P. Murugapandiyan** is the Professor & Head of the Department of Electronics and Communication Engineering (ECE).",
    answer_ta: "ECE துறையின் தலைவர் பேராசிரியர் **முனைவர் P. முருகபாண்டியன்** ஆவார்.",
    source: "https://www.srmtrichy.edu.in/departments/ece"
  },
  {
    id: "faq_btech_blockchain",
    category: "programmes",
    question_en: "Does SRM Trichy offer B.Tech in Blockchain Technology?",
    question_ta: "SRM திருச்சியில் Blockchain Technology B.Tech படிப்பு உள்ளதா?",
    keywords: ["blockchain", "blockchain btech", "பிளாக்செயின்"],
    answer_en: "**Yes.** SRM Trichy offers **B.Tech CSE with Specialization in Blockchain Technology**, covering smart contracts, distributed ledgers, and Web3.",
    answer_ta: "**ஆம்.** ஸ்மார்ட் ஒப்பந்தங்கள் மற்றும் Web3 சார்ந்த **B.Tech CSE பிளாக்செயின் தொழில்நுட்ப சிறப்புப் பிரிவு** உள்ளது.",
    source: "https://www.srmtrichy.edu.in/institution/engineering-and-technology"
  },
  {
    id: "faq_btech_iot",
    category: "programmes",
    question_en: "Does SRM Trichy offer B.Tech in Internet of Things (IoT)?",
    question_ta: "SRM திருச்சியில் IoT (Internet of Things) படிப்பு உள்ளதா?",
    keywords: ["iot", "internet of things", "ஐஓடி"],
    answer_en: "**Yes.** SRM Trichy offers **B.Tech CSE with Specialization in Internet of Things (IoT)**, featuring embedded sensor hardware and smart automation.",
    answer_ta: "**ஆம்.** சென்சார்கள் மற்றும் ஆட்டோமேஷன் சார்ந்த **B.Tech CSE Internet of Things (IoT)** படிப்பு உள்ளது.",
    source: "https://www.srmtrichy.edu.in/institution/engineering-and-technology"
  },
  {
    id: "faq_btech_biomedical",
    category: "programmes",
    question_en: "Does SRM Trichy offer B.Tech in Biomedical Engineering?",
    question_ta: "B.Tech பயோமெடிக்கல் இன்ஜினியரிங் படிப்பு உள்ளதா?",
    keywords: ["biomedical engineering", "btech biomedical", "பயோமெடிக்கல்"],
    answer_en: "**Yes.** 4-Year **B.Tech in Biomedical Engineering** with practical hospital instrumentation postings at the on-campus 750-bed teaching hospital.",
    answer_ta: "**ஆம்.** வளாக மருத்துவமனையில் நேரடி உபகரணப் பயிற்சியுடன் கூடிய 4 ஆண்டு **B.Tech பயோமெடிக்கல் இன்ஜினியரிங்** உள்ளது.",
    source: "https://www.srmtrichy.edu.in/institution/engineering-and-technology"
  },
  {
    id: "faq_btech_food_tech",
    category: "programmes",
    question_en: "Does SRM Trichy offer B.Tech in Food Technology?",
    question_ta: "SRM திருச்சியில் Food Technology படிப்பு உள்ளதா?",
    keywords: ["food technology", "food tech", "உணவு தொழில்நுட்பம்"],
    answer_en: "**Yes.** **B.Tech Biotechnology with Specialization in Food Technology** is offered (HoD: Dr. M. Maria Leena).",
    answer_ta: "**ஆம்.** உணவு பதப்படுத்துதல் மற்றும் தரக்கட்டுப்பாடு சார்ந்த **B.Tech பயோடெக்னாலஜி (Food Technology)** படிப்பு உள்ளது.",
    source: "https://www.srmtrichy.edu.in/departments/biotech"
  },
  {
    id: "faq_how_to_integrate_widget",
    category: "technical",
    question_en: "How can this chatbot widget be integrated into the main SRM Trichy website?",
    question_ta: "இந்த சாட்பாட்டை SRM திருச்சி முதன்மை இணையதளத்தில் எவ்வாறு இணைப்பது?",
    keywords: ["integrate chatbot", "embed widget", "script tag", "இணைப்பது எப்படி"],
    answer_en: "Embed this one-line script before `</body>`:\n`<script src=\"https://your-domain/srm-tamil-widget.js\"></script>`\nIt automatically initializes with full RAG and bilingual support.",
    answer_ta: "வலைப்பக்கத்தின் `</body>` முன் இந்த ஒரு வரியை சேர்க்கவும்:\n`<script src=\"https://your-domain/srm-tamil-widget.js\"></script>`\nஇது தானாகவே சாட்பாட்டை இயக்கும்.",
    source: "https://www.srmtrichy.edu.in/"
  }
];

let added = 0;
const existingIds = new Set(faqs.map(f => f.id));
for (const m of MASTER_ADDITIONS) {
  if (!existingIds.has(m.id)) {
    faqs.push(m);
    added++;
  }
}

fs.writeFileSync(FAQ_FILE, JSON.stringify(faqs, null, 2), "utf8");
console.log(`Successfully added ${added} master FAQs. Total FAQs in system: ${faqs.length}`);

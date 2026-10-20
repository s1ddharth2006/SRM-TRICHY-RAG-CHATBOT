import fs from "fs";
import path from "path";

const FAQ_FILE = "./server/data/faqs.json";
const faqs = JSON.parse(fs.readFileSync(FAQ_FILE, "utf8"));

const NEW_ENG_FAQS = [
  {
    id: "faq_engineering_dean",
    category: "engineering",
    question_en: "Who is the Dean of the Faculty of Engineering and Technology?",
    question_ta: "பொறியியல் மற்றும் தொழில்நுட்ப புலத்தின் டீன் (Dean) யார்?",
    keywords: ["dean of engineering", "associate dean", "balasundaram", "டீன்", "பாலசுந்தரம்"],
    answer_en: "**Dr. Balasundaram R** is the Professor & Associate Dean of the Faculty of Engineering and Technology (30+ years academic and research experience).",
    answer_ta: "பொறியியல் மற்றும் தொழில்நுட்ப புலத்தின் பேராசிரியர் மற்றும் இணை டீன் **முனைவர் பாலசுந்தரம் R** (30+ ஆண்டுகள் அனுபவம் கொண்டவர்).",
    source: "https://www.srmtrichy.edu.in/institution/engineering-and-technology"
  },
  {
    id: "faq_apple_imac_lab",
    category: "engineering_labs",
    question_en: "What is the Apple iMac Lab at SRM Trichy?",
    question_ta: "SRM திருச்சியில் உள்ள Apple iMac ஆய்வகம் (Apple Lab) பற்றிய விவரங்கள் என்ன?",
    keywords: ["apple lab", "imac", "xcode", "swift", "app development", "ios", "ஆப்பிள் லேப்", "ஐமேக்"],
    answer_en: "Established with **Apple Inc.** as the *iMac App Development Center of Excellence*, equipped with Apple iMacs, MacBooks, Xcode, and Swift for iOS development certifications.",
    answer_ta: "**Apple Inc.** உடன் இணைந்து உருவாக்கப்பட்ட *iMac App Development CoE* ஆய்வகம். iMacs, MacBooks, Xcode, Swift கொண்டு iOS ஆப் டெவலப்மென்ட் பயிற்சி வழங்குகிறது.",
    source: "https://www.srmtrichy.edu.in/institution/engineering-and-technology#infrastructure"
  },
  {
    id: "faq_arvr_lab",
    category: "engineering_labs",
    question_en: "What facilities are available in the AR/VR Lab?",
    question_ta: "AR/VR (Augmented & Virtual Reality) ஆய்வகத்தில் என்னென்ன வசதிகள் உள்ளன?",
    keywords: ["arvr", "augmented reality", "virtual reality", "metaverse", "gaming lab", "விர்ச்சுவல் ரியாலிட்டி"],
    answer_en: "Equipped with immersive AR/VR headsets and tracking systems for interactive simulation in healthcare, education, gaming, and industrial digital twins.",
    answer_ta: "மருத்துவம், கல்வி, கேமிங் மற்றும் தொழில்துறை பயன்பாடுகளுக்கான இன்டராக்டிவ் AR/VR ஹெட்செட்டுகள் மற்றும் விர்ச்சுவல் சிமுலேஷன் ஆய்வகம்.",
    source: "https://www.srmtrichy.edu.in/institution/engineering-and-technology#infrastructure"
  },
  {
    id: "faq_fortinet_lab",
    category: "engineering_labs",
    question_en: "What is the Fortinet Cyber Security Laboratory?",
    question_ta: "Fortinet சைபர் செக்யூரிட்டி ஆய்வகம் (Fortinet Lab) எவ்வாறு செயல்படுகிறது?",
    keywords: ["fortinet", "fortigate", "fortisiem", "soc", "firewall", "cyber lab", "ஃபோர்டினெட்"],
    answer_en: "Equipped with defense-grade **FortiGate Next-Gen Firewalls**, FortiAnalyzer, and FortiSIEM for hands-on SIEM security operations and threat monitoring.",
    answer_ta: "**FortiGate ஃபயர்வால்கள்**, FortiAnalyzer மற்றும் FortiSIEM கருவிகளுடன் கூடிய தொழில்முறை நெட்வொர்க் பாதுகாப்பு மற்றும் SOC அச்சுறுத்தல் கண்காணிப்பு ஆய்வகம்.",
    source: "https://www.srmtrichy.edu.in/departments/cyber-security"
  },
  {
    id: "faq_cse_specializations",
    category: "programmes",
    question_en: "What B.Tech specializations are offered under Computer Science and Engineering?",
    question_ta: "B.Tech கணினி அறிவியல் (CSE) பிரிவில் என்னென்ன சிறப்புப் பாடப்பிரிவுகள் (Specializations) உள்ளன?",
    keywords: ["cse specializations", "aiml", "data sciences", "cyber security cse", "csbs", "சிறப்புப் பிரிவுகள்"],
    answer_en: "B.Tech CSE offers: **AI & ML**, **Cyber Security**, **Data Sciences**, **Software Product Engineering**, and **Computer Science & Business Systems (CSBS)**.",
    answer_ta: "B.Tech CSE சிறப்புப் பிரிவுகள்: **AI & ML**, **சைபர் செக்யூரிட்டி**, **டேட்டா சயின்ஸ்**, **சாப்ட்வேர் ப்ராடக்ட் இன்ஜினியரிங்**, மற்றும் **CSBS**.",
    source: "https://www.srmtrichy.edu.in/institution/engineering-and-technology"
  },
  {
    id: "faq_software_product_eng",
    category: "programmes",
    question_en: "What is B.Tech Software Product Engineering?",
    question_ta: "B.Tech Software Product Engineering படிப்பு பற்றிய விவரங்கள் என்ன?",
    keywords: ["software product engineering", "product architecture", "agile", "சாப்ட்வேர் ப்ராடக்ட்"],
    answer_en: "Focuses on full-lifecycle software product development, cloud-native architectures, DevOps, microservices, and modern Agile product management.",
    answer_ta: "முழுமையான மென்பொருள் தயாரிப்பு வடிவமைப்பு, கிளவுட்-நேட்டிவ் கட்டமைப்புகள், DevOps, மைக்ரோசர்வீசஸ் மற்றும் Agile தயாரிப்பு மேலாண்மைக்கான படிப்பு.",
    source: "https://www.srmtrichy.edu.in/departments/cse"
  },
  {
    id: "faq_csbs_program",
    category: "programmes",
    question_en: "What is B.Tech Computer Science and Business Systems (CSBS)?",
    question_ta: "B.Tech CSBS (Computer Science and Business Systems) படிப்பு எதனைப் பற்றியது?",
    keywords: ["csbs", "computer science and business systems", "business analytics", "சிஎஸ்பிஎஸ்"],
    answer_en: "A blended curriculum combining fundamental Computer Science with Business Analytics, Financial Tech, and Enterprise Management.",
    answer_ta: "அடிப்படை கணினி அறிவியலுடன் வணிகப் பகுப்பாய்வு, நிதித் தொழில்நுட்பம் மற்றும் நிறுவன மேலாண்மையை இணைக்கும் நவீன படிப்பு.",
    source: "https://www.srmtrichy.edu.in/departments/cse"
  },
  {
    id: "faq_mtech_cse",
    category: "programmes",
    question_en: "Does SRM Trichy offer M.Tech in Computer Science and Engineering?",
    question_ta: "SRM திருச்சியில் M.Tech கணினி அறிவியல் (CSE) படிப்பு உள்ளதா?",
    keywords: ["mtech", "mtech cse", "masters in engineering", "எம்டெக்"],
    answer_en: "**Yes.** 2-Year **M.Tech CSE with Specialization in AI & ML** is offered (Annual Fee: ₹1,00,000 – ₹1,50,000 for B.E./B.Tech graduates).",
    answer_ta: "**ஆம்.** 2 ஆண்டு **M.Tech CSE (AI & ML சிறப்புப் பிரிவு)** படிப்பு உள்ளது (கட்டணம்: ₹1,00,000 முதல் ₹1,50,000 / ஆண்டு).",
    source: "https://www.srmtrichy.edu.in/institution/programmes"
  },
  {
    id: "faq_phd_engineering",
    category: "programmes",
    question_en: "Can I do a Ph.D. in Engineering at SRM Trichy?",
    question_ta: "SRM திருச்சியில் பொறியியலில் முனைவர் பட்டம் (Ph.D.) செய்ய முடியுமா?",
    keywords: ["phd", "doctoral", "research", "பிஎச்டி", "முனைவர் பட்டம்"],
    answer_en: "**Yes.** Full-time and part-time Ph.D. programs in Computing, ECE, and Mechanical are available. Apply at **https://registration.srmtrichy.edu.in/ph-d-application-form-2027**.",
    answer_ta: "**ஆம்.** கம்ப்யூட்டிங், ECE மற்றும் மெக்கானிக்கல் துறைகளில் முழு நேர மற்றும் பகுதி நேர Ph.D. உண்டு. விண்ணப்பிக்க: **registration.srmtrichy.edu.in**.",
    source: "https://registration.srmtrichy.edu.in/ph-d-application-form-2027"
  },
  {
    id: "faq_student_chapters",
    category: "campus_life",
    question_en: "What student technical chapters and hackathons exist for engineering?",
    question_ta: "பொறியியல் மாணவர்களுக்கான தொழில்நுட்ப சங்கங்கள் மற்றும் ஹேக்கத்தான்கள் என்னென்ன?",
    keywords: ["acm", "ieee", "hackathon", "flabs", "ctf", "போட்டிகள்", "ஹேக்கத்தான்"],
    answer_en: "Active **ACM & IEEE Student Chapters**, annual **FLABS Internal Hackathons**, and **Capture the Flag (CTF)** ethical hacking challenges.",
    answer_ta: "செயலில் உள்ள **ACM & IEEE மாணவர் அமைப்புகள்**, ஆண்டு **FLABS ஹேக்கத்தான்**, மற்றும் **CTF** எத்திக்கல் ஹேக்கிங் போட்டிகள்.",
    source: "https://www.srmtrichy.edu.in/institution/engineering-and-technology"
  }
];

// Deduplicate by ID
const existingIds = new Set(faqs.map(f => f.id));
let added = 0;
for (const n of NEW_ENG_FAQS) {
  if (!existingIds.has(n.id)) {
    faqs.push(n);
    added++;
  }
}

fs.writeFileSync(FAQ_FILE, JSON.stringify(faqs, null, 2), "utf8");
console.log(`Added ${added} new Engineering & Technology FAQs. Total FAQs: ${faqs.length}`);

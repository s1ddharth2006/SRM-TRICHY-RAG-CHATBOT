import dns from "dns";
import { scrapeSource, referSrmWebsite } from "./scraper.js";
import { translateText, detectLanguage, looksTamil } from "./translate.js";
import { ragEngine } from "./rag/rag-engine.js";
import { faqManager } from "./rag/faq-manager.js";
import { learningEngine } from "./rag/learning-engine.js";
import { handleDepartmentOrHodQuery } from "./department-handler.js";
import { handleNewsAndEventsQuery } from "./news-handler.js";

dns.setDefaultResultOrder("ipv4first");

/**
 * SRM IST Trichy Grounding Facts
 */
export const COLLEGE_DATA = {
  profile: {
    name: "SRM Institute of Science and Technology (SRM IST), Tiruchirappalli Campus",
    location: "SRM Nagar, Trichy-Chennai National Highway (NH-45), near Samayapuram Toll Plaza, Trichy - 621 105, Tamil Nadu",
    campusArea: "50+ Acres lush green campus",
    type: "Category-1 Deemed-to-be University (UGC / MHRD)",
    naacGrade: "A++ (Highest possible grade)",
    approvals: ["UGC Category 1", "NAAC A++", "AICTE", "ABET Accredited Programs", "ISO 9001 Certified"],
    tollFree: "1800 202 4565",
    phone: "0431 - 2258900 / 0431 - 2258901",
    email: "admissions@srmtrichy.edu.in / info@srmtrichy.edu.in",
    website: "https://www.srmtrichy.edu.in",
    hours: "Monday – Saturday: 9:00 AM – 5:00 PM",
    landmark: "Near Samayapuram Mariamman Temple (4 km), ~20 km from Central Bus Stand & Railway Station, ~25 km from Trichy Airport (TRZ)"
  },
  leadership: {
    founder: "Dr. T. R. Paarivendhar (Member of Parliament, Founder Chancellor)",
    proChancellorAdmin: "Dr. Ravi Pachamoothoo (Pro-Chancellor, Administration)",
    proChancellorAcademics: "Dr. P. Sathyanarayanan (Pro-Chancellor, Academics)",
    viceChancellor: "Dr. C. Muthamizhchelvan (Vice Chancellor)",
    registrar: "Dr. S. Ponnusamy (Registrar)"
  },
  placements: {
    rate: "95%+",
    highestPackage: "₹50 LPA (50 Lakhs Per Annum)",
    averagePackage: "₹8.5 LPA",
    companiesCount: "600+ top multinational recruiters visit annually",
    topRecruiters: [
      "Amazon", "Microsoft", "Google", "Zoho", "TCS", "Infosys", "Wipro",
      "Cognizant", "Capgemini", "Accenture", "Renault Nissan", "Barclays",
      "HCL", "Mindtree", "Tech Mahindra", "Deloitte", "L&T", "Bosch"
    ],
    cdc: "Career Development Centre (CDC) provides 360-degree training from Year 1: Soft skills, Aptitude, Full-Stack Coding, DSA, and Mock Interviews with Corporate HRs."
  },
  fees: {
    btechCSE: "₹1,75,000 – ₹2,50,000 per year",
    btechOther: "₹1,50,000 – ₹2,00,000 per year",
    mba: "₹1,75,000 – ₹2,25,000 per year",
    bba: "₹75,000 – ₹1,10,000 per year",
    bcaBcom: "₹70,000 – ₹1,05,000 per year",
    bpt: "₹1,10,000 – ₹1,60,000 per year",
    alliedHealth: "₹90,000 – ₹1,40,000 per year",
    hotelManagement: "₹85,000 – ₹1,20,000 per year",
    hostelMess: "₹85,000 – ₹1,35,000 per year (depending on AC / Non-AC and 2/3/4 sharing)",
    transport: "₹25,000 – ₹40,000 per year (based on route distance)"
  }
};

/**
 * Comprehensive Knowledge Base & Intent Matrix (40+ Topics)
 */
const TOPICS = [
  // 1. Marks eligibility & Cutoff (e.g. 75% marks, 60% marks, chance of admission)
  {
    id: "marks_eligibility",
    patterns: [
      /(can i get|eligibility|chance|seat|cutoff|cut off|admission with|marks?|percentage|%)\b.*(admission|seat|b\.?tech|cse|join|get in)/i,
      /(75%|80%|60%|70%|85%|90%|50%|55%|65%)\s*(marks?|percentage|%|la|la seat|la admission)/i,
      /மதிப்பெண்.*சேர்க்கை|சேர முடியுமா|கட் ஆப்|cut\s*off/i
    ],
    negativePatterns: [/attendance|வருகை/i, /scholarship|concession|உதவித்தொகை/i],
    ta: `**12-ஆம் வகுப்பு மதிப்பெண்கள் அடிப்படையில் சேர்க்கை (Admission Eligibility):**

• **B.Tech பொறியியல் சேர்க்கை தகுதி:** 12-ஆம் வகுப்பில் இயற்பியல், வேதியியல் மற்றும் கணிதத்தில் (PCM) குறைந்தபட்சம் **60% மதிப்பெண்கள்** பெற்றிருக்க வேண்டும்.
• **75% / 80%+ மதிப்பெண்கள் பெற்றிருந்தால்:** நீங்கள் SRM IST திருச்சியில் B.Tech CSE, AI & DS உள்ளிட்ட முதன்மைப் பிரிவுகளில் எளிதாக சேர்க்கை பெற தகுதியுடையவர்!
• **உதவித்தொகை வாய்ப்பு:** 80% மற்றும் 90%-க்கு மேல் மதிப்பெண் பெற்ற மாணவர்களுக்கு கல்விக் கட்டணத்தில் 25% முதல் 50% வரை மெரிட் உதவித்தொகை (Merit Scholarship) சலுகையும் உண்டு.
• **சேர்க்கை முறை:** SRMJEEE நுழைவுத் தேர்வு மூலமாகவும், 12-ஆம் வகுப்பு மெரிட் மதிப்பெண்கள் அடிப்படையிலும் சேர்க்கை வழங்கப்படுகிறது.

விண்ணப்பிக்க: [srmtrichy.edu.in/admission](https://www.srmtrichy.edu.in/admission) | உதவி எண்: 📞 1800 202 4565.`,
    en: `**Admission Eligibility & Marks Criteria at SRM IST Trichy:**

• **B.Tech Eligibility:** A minimum of **60% aggregate in Physics, Chemistry, and Mathematics (PCM)** in 10+2 / Higher Secondary.
• **With 75% / 80%+ Marks:** You are comfortably eligible for B.Tech programs including CSE, AI & Data Science, and Cyber Security!
• **Merit Scholarships:** Students with 80%+ or 90%+ in 12th boards qualify for **25% to 50% tuition fee waivers**.
• **Admission Pathways:** Through SRMJEEE rank or direct Board Exam merit.

Apply online: [srmtrichy.edu.in/admission](https://www.srmtrichy.edu.in/admission) | Toll-Free: 📞 1800 202 4565.`,
    source: "https://www.srmtrichy.edu.in/admission"
  },

  // 2. Without maths / 12th subject eligibility for B.Tech
  {
    id: "without_maths",
    patterns: [/(without|no)\s+math|கணிதம்\s+இல்லாமல்|maths\s+illama|கணித\s+பாடம்\s+இல்ல/i],
    ta: `**12-ஆம் வகுப்பில் கணிதம் இல்லாமல் B.Tech படிக்க முடியுமா?**

**இல்லை, 12-ஆம் வகுப்பில் கணிதம் (Mathematics) இல்லாமல் B.Tech படிப்புகளில் நேரடியாக சேர முடியாது.**

• **சேர்க்கை விதிமுறை:** AICTE மற்றும் SRM IST விதிமுறைகளின்படி, B.Tech (கணினி அறிவியல் - CSE உட்பட) சேர்வதற்கு 12-ஆம் வகுப்பில் இயற்பியல், வேதியியல் மற்றும் **கணிதம் (PCM)** பாடங்களில் குறைந்தபட்சம் 60% மதிப்பெண்கள் பெற்றிருப்பது கட்டாயமாகும்.
• **உங்களுக்கான மாற்றுப் படிப்புகள் (SRM திருச்சியில்):**
  - **BCA (கணினி பயன்பாடுகள்):** 12-ஆம் வகுப்பில் கணிதம் இல்லாத மாணவர்களும் மென்பொருள் மற்றும் IT துறையில் சாதிக்க 3 ஆண்டு BCA படிக்கலாம்.
  - **BBA / B.Com:** வணிகம் மற்றும் மேலாண்மைத் துறையில் விருப்பமிருந்தால்.
  - **BPT (இயன்முறை சிகிச்சை) / Allied Health:** 12-ஆம் வகுப்பில் உயிரியல் (PCB) படித்திருந்தால்.

கூடுதல் சேர்க்கை ஆலோசனைக்கு: 📞 1800 202 4565.`,
    en: `**Regarding B.Tech Admission without 12th Mathematics:**

**No, Mathematics is mandatory for all B.Tech programs (including CSE).**

• **Eligibility Rule:** As per AICTE and SRM IST admission regulations, candidates must have completed 10+2 with Physics, Chemistry, and **Mathematics (PCM)** with a minimum of 60% aggregate.
• **Alternative Pathways at SRM Trichy:**
  - **BCA (Bachelor of Computer Applications):** If your goal is software development, coding, and IT careers, you can join BCA without 12th Maths.
  - **BBA / B.Com:** If you have an Arts or Commerce background.
  - **BPT (Physiotherapy) / BOT / Allied Health:** If your 12th subjects included Biology (PCB).

For personal counseling, call Toll-Free: 📞 1800 202 4565.`,
    source: "https://www.srmtrichy.edu.in/admission"
  },

  // 3. Attendance rules (75% attendance)
  {
    id: "attendance",
    patterns: [/attendance|வருகை|absent|leave|75%\s*attendance/i],
    ta: `**SRM IST திருச்சி — வருகைப்பதிவு விதிமுறைகள் (Attendance Rules):**

• **குறைந்தபட்ச வருகைப்பதிவு:** பருவத் தேர்வுகளுக்கு (Semester Exams) விண்ணப்பிக்க **குறைந்தபட்சம் 75% வருகைப்பதிவு கட்டாயமாகும்**.
• **மருத்துவ விடுப்பு (Medical Leave):** முறையான மருத்துவச் சான்றிதழுடன் கூடிய விடுப்புகளுக்கு குறிப்பிட்ட சலுகை உண்டு (குறைந்தபட்சம் 65% வரை பரிசீலிக்கப்படும்).
• **ஆன்-டியூட்டி (On-Duty / OD):** கல்லூரி சார்பில் விளையாட்டுகள், மாநாடுகள், சிம்போசியம் மற்றும் தொழில்நுட்ப போட்டிகளில் பங்கேற்கும் மாணவர்களுக்கு OD வருகைப்பதிவு வழங்கப்படும்.
• **ERP கண்காணிப்பு:** மாணவர்கள் மற்றும் பெற்றோர்கள் தங்கள் தினசரி வருகைப்பதிவை SRM மாணவர் போர்ட்டல் (Student ERP Portal) மூலம் உடனுக்குடன் தெரிந்து கொள்ளலாம்.`,
    en: `**Attendance Policy at SRM IST Trichy:**

• **Mandatory Requirement:** A minimum of **75% attendance is compulsory** in each course to be eligible to sit for semester examinations.
• **Medical Condonation:** In genuine medical cases supported by verified certificates, attendance up to 65% may be condoned as per university norms.
• **On-Duty (OD):** Students representing SRM in sports, technical fests, symposiums, or conferences receive official OD attendance credit.
• **Real-Time Tracking:** Daily attendance is updated on the SRM Student ERP portal for both students and parents to monitor.`,
    source: "https://www.srmtrichy.edu.in/campus-life"
  },

  // 4. Dress code & rules
  {
    id: "dress_code",
    patterns: [/dress\s*code|uniform|clothes|wear|ஆடை|யூனிபார்ம்|டிரஸ்\s*கோட்/i],
    ta: `**SRM IST திருச்சி — ஆடை மற்றும் ஒழுங்குமுறை விதிகள் (Dress Code):**

• **பொதுவான ஆடை முறை:** மாணவர்கள் கண்ணியமான, முறையான ஆடைகளை (Formal / Decent Smart Casuals) அணிய வேண்டும்.
• **மாணவர்கள் (Boys):** காலர் கொண்ட சட்டை (Shirts/Polo T-shirts) மற்றும் பேன்ட். டீ-சர்ட்களில் தேவையற்ற வாசகங்கள் தவிர்க்கப்பட வேண்டும்.
• **மாணவியர் (Girls):** சுடிதார் / சல்வார் கமீஸ் (துப்பட்டாவுடன்) அல்லது கண்ணியமான முறையான ஆடைகள்.
• **லேப் வகுப்புகள் (Lab Sessions):** ஆய்வகப் பயிற்சிகளின் போது பாதுகாப்பு காலணிகள் (Shoes) மற்றும் குறிப்பிட்ட துறைகளுக்கான லேப் கோட் (Lab Coat) அணிவது கட்டாயம்.
• **அடையாள அட்டை (ID Card):** கல்லூரி வளாகத்திற்குள் இருக்கும் அனைத்து நேரங்களிலும் கல்லூரி அடையாள அட்டையை அணிந்திருப்பது கட்டாயமாகும்.`,
    en: `**Dress Code & Discipline at SRM IST Trichy:**

• **General Attire:** Students are expected to wear neat, modest, and professional clothing (Formals / Smart Casuals).
• **Boys:** Formal shirts or neat collared polo T-shirts with formal trousers/jeans. Round-neck T-shirts with loud graphics are not permitted.
• **Girls:** Chudidar / Salwar Kameez with dupatta, or modest formal attire.
• **Laboratory Dress Code:** Closed footwear/shoes and departmental lab coats are mandatory during all practical/lab sessions.
• **Identity Cards:** SRM Student ID card must be worn visibly at all times within the campus.`,
    source: "https://www.srmtrichy.edu.in/campus-life"
  },

  // 5. Teachers & Faculty
  {
    id: "faculty_teachers",
    patterns: [/faculty|teachers?|professors?|staff|teaching|ஆசிரியர்கள்|பேராசிரியர்கள்|படிப்பு\s*தரம்/i],
    ta: `**SRM IST திருச்சி — பேராசிரியர்கள் மற்றும் கற்பித்தல் தரம் (Faculty & Academics):**

• **தகுதிவாய்ந்த பேராசிரியர்கள்:** பெரும்பாலான பேராசிரியர்கள் ஐஐடி (IIT), என்ஐடி (NIT) மற்றும் புகழ்பெற்ற மத்திய/மாநில பல்கலைக்கழகங்களில் முனைவர் பட்டம் (Ph.D) பெற்றவர்கள்.
• **ஆராய்ச்சி & தொழில்முறை அனுபவம்:** பேராசிரியர்கள் சர்வதேச ஆய்வுக்கட்டுரைகள் மற்றும் காப்புரிமைகளை (Patents) வெளியிட்டுள்ளதோடு, தொழில்துறை அனுபவமும் கொண்டவர்கள்.
• **வழிகாட்டுதல் (Mentorship):** ஒவ்வொரு 15-20 மாணவர்களுக்கும் ஒரு பிரத்யேக ஆசிரியர் வழிகாட்டியாக (Faculty Mentor) நியமிக்கப்பட்டு அவர்களின் கல்வி மற்றும் தனித்திறன் வளர்ச்சி கண்காணிக்கப்படுகிறது.
• **நவீன கற்பித்தல்:** ஸ்மார்ட் வகுப்பறைகள், நேரடி செயல்முறை விளக்கங்கள் மற்றும் தொழில்முறை பயிற்சிகள் மூலம் கற்பிக்கப்படுகிறது.`,
    en: `**Faculty and Teaching Excellence at SRM IST Trichy:**

• **Highly Qualified Educators:** Faculty members hold Ph.D. and Master's degrees from premier institutions including IITs, NITs, and renowned global universities.
• **Research & Industry Experience:** Active researchers with numerous Scopus-indexed publications, funded projects, and patents.
• **Student-Faculty Mentorship:** Every student is assigned a dedicated Faculty Mentor (1:15 ratio) for academic guidance, career counseling, and personal development.
• **Modern Pedagogy:** Interactive smart classrooms, experiential lab sessions, and curriculum aligned with industry 4.0 demands.`,
    source: "https://www.srmtrichy.edu.in/about"
  },

  // 6. Ragging & Campus Safety
  {
    id: "ragging_safety",
    patterns: [/ragging|safety|security|safe|பயமா|ராக்கிங்|பாதுகாப்பு/i],
    ta: `**SRM IST திருச்சி — வளாக பாதுகாப்பு மற்றும் ராக்கிங் தடுப்பு (Zero-Tolerance to Ragging):**

• **ராக்கிங் முற்றிலும் தடை:** SRM IST திருச்சி வளாகத்தில் ராக்கிங் முற்றிலும் தடை செய்யப்பட்டுள்ளது (Zero-Tolerance Policy). உச்ச நீதிமன்ற மற்றும் UGC வழிகாட்டுதல்கள் முழுமையாகப் பின்பற்றப்படுகின்றன.
• **ராக்கிங் தடுப்புக் குழு:** கல்லூரி முதல்வர் மற்றும் மூத்த பேராசிரியர்கள் அடங்கிய தீவிர Anti-Ragging Committee 24 மணி நேரமும் செயல்படுகிறது.
• **24/7 CCTV கண்காணிப்பு:** கல்லூரி வளாகம், வகுப்பறைகள், விடுதிகள் மற்றும் நுழைவாயில்கள் முழுவதும் சிசிடிவி கேமராக்கள் மற்றும் பிரத்யேக பாதுகாவலர்களால் கண்காணிக்கப்படுகிறது.
• **மாணவர் உதவி எண்:** ஏதேனும் புகார் அல்லது உதவி தேவைப்பட்டால் ரகசியமாக தெரிவிக்க பிரத்யேக புகார் பெட்டி மற்றும் உதவி எண்கள் உள்ளன.`,
    en: `**Campus Safety and Anti-Ragging Measures at SRM IST Trichy:**

• **Zero-Tolerance to Ragging:** Ragging in any form is strictly prohibited on and off campus as per Supreme Court and UGC regulations.
• **Anti-Ragging Squad:** An active Anti-Ragging Committee and mobile vigilance squad conduct unannounced checks across campus and hostels.
• **24/7 Security & CCTV:** The entire 50+ acre campus is monitored by high-definition CCTV surveillance with professional 24/7 security personnel.
• **Emergency Grievance Redressal:** Students can report any concerns confidentially to the dean's office or via the national toll-free anti-ragging helpline.`,
    source: "https://www.srmtrichy.edu.in/campus-life"
  },

  // 7. Campus Life
  {
    id: "campus_life",
    patterns: [/campus\s*life|environment|ambience|atmosphere|வளாக\s*வாழ்க்கை|வளாகம்\s*எப்படி|வளாக\s*அனுபவம்/i],
    ta: `**SRM IST திருச்சி — வளாக வாழ்க்கை மற்றும் சுற்றுச்சூழல் (Campus Life):**

• **50+ ஏக்கர் பசுமை வளாகம்:** திருச்சி-சென்னை தேசிய நெடுஞ்சாலையில் (NH-45) இயற்கை எழில் கொஞ்சும் அமைதியான சூழலில் அமைந்துள்ளது.
• **அனைத்து வசதிகளும் ஒரே இடத்தில்:** நவீன வகுப்பறைகள், சர்வதேச தரத்திலான விளையாட்டு மைதானங்கள், மத்திய நூலகம், ஃபுட் கோர்ட், ஏடிஎம் மற்றும் 750 படுக்கைகள் கொண்ட SRM மருத்துவமனை.
• **சுறுசுறுப்பான மாணவர் மன்றங்கள்:** கோடிங், ரோபோடிக்ஸ், இசை, நடனம், புகைப்படம், என்.சி.சி, என்.எஸ்.எஸ் உள்ளிட்ட பல்வேறு மன்றங்கள்.
• **கலாச்சார திருவிழாக்கள்:** ஆண்டுதோறும் 'Milan / Tarang' கலை விழா மற்றும் 'Technozion' தேசிய கருத்தரங்கு மாணவர்களின் திறமைகளை வெளிக்கொணர்கிறது.`,
    en: `**Campus Life at SRM IST Trichy:**

• **50+ Acre Lush Green Campus:** Situated along NH-45, providing a serene, modern, and student-centric academic environment.
• **World-Class Infrastructure:** Smart air-conditioned classrooms, hi-tech laboratories, 50,000+ volume central library, multi-cuisine food courts, ATMs, and on-campus multi-specialty hospital.
• **Vibrant Student Clubs:** Over 20+ active technical, cultural, literary, and social service clubs (Rotaract, NSS, NCC, Coding, Robotics).
• **Festivals & Events:** Grand annual cultural fest 'Milan / Tarang' and national technical symposium 'Technozion'.`,
    source: "https://www.srmtrichy.edu.in/campus-life"
  },

  // 8. CSE Department
  {
    id: "cse_department",
    patterns: [/cse\s*department|computer science department|cse\s*lab|about cse|cse\s*branch|கணினி\s*அறிவியல்\s*துறை|tell me about cse/i],
    negativePatterns: [/vs|versus|difference|ஒப்பீடு/i],
    ta: `**SRM IST திருச்சி — கணினி அறிவியல் மற்றும் பொறியியல் துறை (CSE Department):**

• **பாடத்திட்டம்:** Full-Stack Web Development, Data Structures & Algorithms, Cloud Computing, Cyber Security, Artificial Intelligence மற்றும் IoT.
• **அதிநவீன ஆய்வகங்கள்:** அதிவேக இணையம் மற்றும் உயர் செயல்திறன் கொண்ட கணினிகளுடன் கூடிய நவீன கோடிங் லேப்கள்.
• **தொழில்துறை ஒத்துழைப்பு:** Microsoft, AWS, Oracle, IBM உள்ளிட்ட முன்னணி நிறுவனங்களுடன் இணைந்து சான்றிதழ் பயிற்சிகள்.
• **வேலைவாய்ப்பு சாதனைகள்:** CSE மாணவர்களுக்கு ஆண்டுக்கு அதிகபட்சமாக **₹50 LPA** வரையிலும், சராசரியாக **₹8.5 LPA** சம்பளத்திலும் வேலைவாய்ப்புகள் கிடைக்கின்றன (Amazon, Zoho, Microsoft, TCS, Infosys).`,
    en: `**Department of Computer Science & Engineering (CSE) at SRM IST Trichy:**

• **Cutting-Edge Curriculum:** Covers Full-Stack Development, Data Structures, Cloud Computing, AI & Machine Learning, Cyber Security, and DevOps.
• **Hi-Tech Computing Labs:** State-of-the-art computer labs with high-speed fiber internet, Linux/Windows environments, and GPU workstations.
• **Industry Partnerships:** Collaborative training and certifications with AWS, Microsoft, Oracle, and IBM.
• **Placement Records:** CSE students receive top packages up to **₹50 LPA**, with average packages of **₹8.5 LPA** from recruiters like Amazon, Microsoft, Zoho, TCS, and Infosys.`,
    source: "https://www.srmtrichy.edu.in/departments"
  },

  // 9. AI & Data Science
  {
    id: "aids_department",
    patterns: [/ai\s*(&|and)?\s*ds|artificial intelligence|data science|செயற்கை நுண்ணறிவு/i],
    negativePatterns: [/vs|versus|difference|ஒப்பீடு/i],
    ta: `**SRM IST திருச்சி — AI & Data Science துறை:**

• **எதிர்கால தொழில்நுட்பங்கள்:** Machine Learning, Deep Learning, Natural Language Processing (NLP), Computer Vision, Big Data Analytics.
• **GPU லேப் வசதிகள்:** NVIDIA GPU பணிநிலையங்கள் கொண்ட சிறப்பு செயற்கை நுண்ணறிவு ஆய்வகம்.
• **வேலைவாய்ப்புத் துறைகள்:** AI Engineer, Data Scientist, ML Engineer, Business Intelligence Analyst போன்ற உயர்மட்ட பதவிகள்.
• **சம்பள விவரம்:** AI & DS மாணவர்களுக்கும் ₹50 LPA வரையிலான உச்சபட்ச வேலைவாய்ப்புகள் மற்றும் கார்ப்பரேட் இன்டர்ன்ஷிப்புகள் கிடைக்கின்றன.`,
    en: `**Department of AI & Data Science at SRM IST Trichy:**

• **Futuristic Curriculum:** Machine Learning, Deep Learning, NLP, Computer Vision, Big Data Analytics, and Reinforcement Learning.
• **Dedicated GPU Workstations:** Equipped with NVIDIA hardware for training large AI models and data pipelines.
• **Career Opportunities:** AI Engineer, Data Scientist, Machine Learning Architect, Analytics Consultant.
• **Placement Highlights:** Eligible for premium software and AI product company placements up to ₹50 LPA.`,
    source: "https://www.srmtrichy.edu.in/departments"
  },

  // 10. CSE vs AI & Data Science
  {
    id: "cse_vs_aids",
    patterns: [
      /(cse|computer science)\s+(vs|versus|difference|better)\s+(ai|data science)/i,
      /(ai|data science)\s+(vs|versus|difference|better)\s+(cse)/i
    ],
    ta: `**B.Tech CSE மற்றும் B.Tech AI & Data Science ஒப்பீடு (SRM திருச்சி):**

இரண்டுமே SRM IST திருச்சியில் மிக அதிக வரவேற்பைப் பெற்ற முதன்மைப் பாடப்பிரிவுகளாகும்:

1. **B.Tech கணினி அறிவியல் மற்றும் பொறியியல் (CSE):**
   • **பாடத்திட்டம்:** பரந்த கணினி அடித்தளம் — Data Structures, Operating Systems, Networks, Cloud Computing, Full-Stack Development.
   • **பொருத்தம்:** மென்பொருள் துறையின் அனைத்துப் பிரிவுகளுக்கும் (Software Developer, System Architect, Cloud Engineer) ஏற்றது.

2. **B.Tech செயற்கை நுண்ணறிவு மற்றும் தரவு அறிவியல் (AI & DS):**
   • **பாடத்திட்டம்:** எதிர்கால தொழில்நுட்பங்கள் — Machine Learning, Deep Learning, Neural Networks, Big Data Analytics, GPU லேப் பயிற்சிகள்.
   • **பொருத்தம்:** AI பொறியாளர், Data Scientist, Machine Learning நிபுணர் போன்ற குறிப்பிட்ட எதிர்காலப் பணிகளுக்கு ஏற்றது.

💼 **வேலைவாய்ப்பு:** இரண்டு பாடப்பிரிவு மாணவர்களுமே Amazon, Microsoft, Zoho போன்ற முன்னணி நிறுவனங்களின் ₹50 LPA வரையிலான வேலைவாய்ப்புகளுக்கு சமமான தகுதி பெற்றவர்கள்!`,
    en: `**Comparison: B.Tech CSE vs B.Tech AI & Data Science at SRM Trichy**

Both are top-tier engineering choices with outstanding career prospects:

1. **B.Tech Computer Science & Engineering (CSE):**
   • **Core Focus:** Broad, versatile computing foundation — Data Structures, Operating Systems, Computer Networks, Full-Stack Development, Cloud Computing.
   • **Career Scope:** Prepares you for any software engineering role across the tech industry.

2. **B.Tech Artificial Intelligence & Data Science (AI & DS):**
   • **Core Focus:** Specialized & futuristic — Machine Learning algorithms, Neural Networks, Deep Learning, Big Data Analytics, Python & GPU computing.
   • **Career Scope:** Tailored for AI Engineers, Data Scientists, and Machine Learning Specialists.

💼 **Placements:** Both branches are equally eligible for top product companies (Amazon, Microsoft, Google, Zoho) offering packages up to **₹50 LPA**.
• **Recommendation:** Choose **CSE** for maximum flexibility across all software roles; choose **AI & DS** if you specifically want to master AI models and intelligent data systems.`,
    source: "https://www.srmtrichy.edu.in/departments"
  },

  // 11. College Timings
  {
    id: "college_timings",
    patterns: [/college\s*timings?|class\s*timings?|hours|schedule|நேரம்|கல்லூரி\s*நேரம்|வகுப்பு\s*நேரம்/i],
    ta: `**SRM IST திருச்சி — கல்லூரி மற்றும் வகுப்பு நேரங்கள் (College Timings):**

• **வகுப்பு நேரங்கள்:** திங்கள் முதல் வெள்ளி வரை காலை **8:45 AM முதல் மாலை 4:30 PM வரை**.
• **மதிய உணவு இடைவேளை:** மதியம் 12:30 PM முதல் 1:20 PM வரை.
• **நூலக வேலை நேரம்:** கல்லூரி வேலை நாட்களில் காலை **8:30 AM முதல் இரவு 7:00 PM வரை**.
• **நிர்வாக அலுவலக நேரம்:** திங்கள் முதல் சனிக்கிழமை வரை காலை 9:00 AM முதல் மாலை 5:00 PM வரை.
• **விடுதி நுழைவு நேரம்:** விடுதி மாணவர்களுக்கு இரவு 8:00 மணிக்குள் வருகைப்பதிவு (Hostel curfew).`,
    en: `**College Timings and Working Hours at SRM IST Trichy:**

• **Academic Class Hours:** Monday to Friday, **8:45 AM to 4:30 PM**.
• **Lunch Break:** 12:30 PM to 1:20 PM.
• **Central Library Timings:** Open from **8:30 AM to 7:00 PM** on all working days.
• **Administrative Office:** Monday to Saturday, 9:00 AM to 5:00 PM.
• **Hostel In-Timings:** Students staying in hostels must return by 8:00 PM.`,
    source: "https://www.srmtrichy.edu.in/campus-life"
  },

  // 12. Laptop Requirement
  {
    id: "laptop_requirement",
    patterns: [/laptop|computer needed|மடிக்கணினி|லேப்டாப்|சிஸ்டம்\s*தேவையா/i],
    ta: `**SRM IST திருச்சி — மடிக்கணினி (Laptop) தேவை விவரங்கள்:**

• **பொறியியல் மற்றும் கணினி மாணவர்களுக்கு (CSE, AI & DS, IT):** கோடிங் பயிற்சிகள், திட்டப் பணிகள் (Projects) மற்றும் ஆன்லைன் சான்றிதழ்களுக்கு ஒரு மடிக்கணினி வைத்திருப்பது மிகவும் பரிந்துரைக்கப்படுகிறது.
• **பரிந்துரைக்கப்படும் விவரக்குறிப்புகள் (Specs):** Intel Core i5 / AMD Ryzen 5 அல்லது அதற்கு மேல், 8GB/16GB RAM, 512GB SSD.
• **கல்லூரி ஆய்வக வசதி:** கல்லூரி கணினி ஆய்வகங்களில் மாணவர்கள் பயன்பாட்டிற்கு அதிநவீன கணினிகள் மற்றும் அதிவேக இணைய வசதி எப்போதும் உள்ளது.
• **வளாக வைஃபை:** முழு வளாகத்திலும் மாணவர்களுக்கான இலவச அதிவேக வைஃபை (Wi-Fi) வசதி உண்டு.`,
    en: `**Laptop Requirements at SRM IST Trichy:**

• **Recommended for Tech Branches:** For students in CSE, AI & DS, Cyber Security, and BCA, having a personal laptop is highly recommended for coding assignments, hackathons, and project work.
• **Recommended Specs:** Intel Core i5 / Ryzen 5 (or higher), 8GB/16GB RAM, 512GB SSD.
• **Campus Lab Support:** All core computing labs are equipped with high-performance desktop PCs and high-speed internet during practical hours.
• **Campus Wi-Fi:** High-speed Wi-Fi access is available throughout academic blocks and hostels for registered student devices.`,
    source: "https://www.srmtrichy.edu.in/campus-life"
  },

  // 13. Direct Admission & Entrance (SRMJEEE)
  {
    id: "direct_admission",
    patterns: [/(without|no)\s+(entrance|srmjeee)|direct\s+admission|நேரடி\s+சேர்க்கை|srmjeee\s+kandippa/i],
    ta: `**SRMJEEE நுழைவுத் தேர்வு கட்டாயமா? நேரடி சேர்க்கை உண்டா?**

• **B.Tech பொறியியல்:** SRMJEEE தேர்வு மூலமாக மட்டுமின்றி, 12-ஆம் வகுப்பு பொதுத்தேர்வு மதிப்பெண்கள் (PCM 60%-க்கு மேல்) அடிப்படையிலும் மெரிட் முறையில் நேரடி சேர்க்கை பெற வாய்ப்புள்ளது.
• **பொறியியல் அல்லாத படிப்புகள் (BBA, BCA, B.Com, BPT, BOT, Allied Health):** இவற்றிற்கு SRMJEEE தேர்வு தேவையில்லை; 12-ஆம் வகுப்பு மதிப்பெண்கள் அடிப்படையில் நேரடியாக சேரலாம்.
• **MBA:** இளங்கலை பட்டப்படிப்பு மதிப்பெண் + SRM MAT அல்லது TANCET மதிப்பெண்கள் மூலம் சேர்க்கை பெறலாம்.

உங்கள் விருப்பப் பாடப்பிரிவுக்கான நேரடி சேர்க்கை விவரங்களை அறிய: 📞 1800 202 4565.`,
    en: `**Is SRMJEEE Entrance Exam Compulsory for B.Tech Admission?**

• **SRMJEEE & Board Marks:** While SRMJEEE is the primary entrance pathway, **direct admission based on 12th Board Merit (PCM aggregate 60%+)** is also considered for eligible seats at SRM IST Trichy.
• **Non-Engineering Programs (BBA, BCA, B.Com, BPT, BOT, Allied Health):** Do not require SRMJEEE; admission is based directly on 12th standard marks.
• **MBA:** Requires a bachelor's degree (50%+) + scores from SRM MAT, CAT, MAT, or TANCET.

To check direct admission seat availability for your desired branch, contact the admissions office directly: 📞 1800 202 4565.`,
    source: "https://www.srmtrichy.edu.in/admission"
  },

  // 14. Hostel & Accommodation Facilities (General)
  {
    id: "hostel_accommodation",
    patterns: [
      /^hostels?\??$/i,
      /^விடுதி\??$/i,
      /(hostel|room|accommodation|stay|விடுதி|தங்குமிடம்|हॉस्टल|హాస్టల్)\b/i,
      /hostel\s+(details|facility|facilities|option|room|blocks?|sharing|ac|non[-\s]*ac)/i
    ],
    negativePatterns: [
      /hostel\s+(compulsory|mandatory)|விடுதி\s+கட்டாயமா/i,
      /(fee|fees|cost|கட்டணம்).*(hostel|room|விடுதி)/i,
      /non[-\s]*veg|veg|mess\s+food/i
    ],
    ta: `**SRM IST திருச்சி — விடுதி மற்றும் தங்குமிட வசதிகள் (Hostel & Accommodation):**

• **தனித்தனி விடுதிகள்:** மாணவர் மற்றும் மாணவியருக்கு தனித்தனி 24/7 சிசிடிவி கண்காணிப்புடன் கூடிய பாதுகாப்பான வளாக விடுதிகள்.
• **அறை தேர்வுகள்:** ஏசி (AC) மற்றும் நான்-ஏசி (Non-AC) வசதிகளுடன் 2, 3 மற்றும் 4 நபர்கள் தங்கும் வசதியான, காற்றோட்டமான அறைகள்.
• **விடுதி வசதிகள்:**
  - 24 மணி நேரமும் அதிவேக Wi-Fi இணைய வசதி
  - சுத்திகரிக்கப்பட்ட குடிநீர் (RO Purified) & தடையில்லா மின்சார வசதி (Power Backup)
  - சுகாதாரமான தென்னிந்திய மற்றும் வடஇந்திய மெஸ் உணவு
  - நவீன உடற்பயிற்சிக் கூடம் (Gym), வாசிப்பு அறை & விளையாட்டு மைதானங்கள்
  - மருத்துவ அவசரத்திற்கு வளாகத்திலேயே 750 படுக்கைகள் கொண்ட SRM சூப்பர் ஸ்பெஷாலிட்டி மருத்துவமனை

🔗 [விடுதி & தங்குமிட விவரங்கள் (Hostels)](https://www.srmtrichy.edu.in/campus-life#accommodation) | சேர்க்கை உதவி எண்: 📞 1800 202 4565`,
    en: `**SRM IST Trichy — Hostels & Accommodation Facilities:**

• **Separate Secure Hostels:** 24/7 guarded, CCTV-monitored dedicated residential blocks for Boys and Girls on campus.
• **Room Configurations:** Modern AC and Non-AC rooms with 2, 3, and 4-sharing options equipped with ergonomic furniture and study tables.
• **Hostel Amenities:**
  - Campus-wide high-speed Wi-Fi and round-the-clock power backup
  - RO purified drinking water & biometric access
  - Nutritious South & North Indian multi-cuisine dining
  - Gymnasium, indoor games, and student recreation lounges
  - On-campus 750-bed SRM Super Speciality Medical College Hospital

🔗 [Explore Hostel & Accommodation](https://www.srmtrichy.edu.in/campus-life#accommodation) | Admissions Helpline: 📞 1800 202 4565`,
    source: "https://www.srmtrichy.edu.in/campus-life#accommodation"
  },

  // 14b. Is hostel compulsory / Day scholar
  {
    id: "is_hostel_compulsory",
    patterns: [/hostel\s+(compulsory|mandatory)|விடுதி\s+கட்டாயமா|day\s*scholar|hostel\s+kandippa|hostel\s+irukanuma/i],
    ta: `**SRM IST திருச்சியில் விடுதியில் தங்குவது கட்டாயமா?**

**இல்லை, விடுதியில் தங்குவது கட்டாயமல்ல!**

• **டே-ஸ்காலர் (Day Scholar) வசதி:** திருச்சி, சமயபுரம், தஞ்சாவூர், கரூர், முசிறி உள்ளிட்ட பகுதிகளைச் சேர்ந்த மாணவர்கள் கல்லூரிக்கு தினமும் வீட்டிலிருந்தே வந்து செல்லலாம்.
• **கல்லூரி பேருந்து வசதி:** திருச்சி மாநகரத்தின் அனைத்து முக்கியப் பகுதிகள் மற்றும் சுற்றுப்புற நகரங்களை இணைக்கும் GPS வசதியுடன் கூடிய கல்லூரி பேருந்துகள் இயக்கப்படுகின்றன.
• **விடுதி தேவைப்பட்டால்:** வெளியூர் மாணவர்கள் அல்லது வளாகத்தில் தங்க விரும்பும் மாணவர்களுக்கு தனித்தனி நவீன ஏசி (AC) மற்றும் நான்-ஏசி விடுதி அறைகள் உள்ளன.

🔗 [விடுதி & தங்குமிட விவரங்கள் (Hostels)](https://www.srmtrichy.edu.in/campus-life#accommodation) | பேருந்து வழித்தடங்கள் அல்லது விடுதிக் கட்டண விவரங்கள் பற்றி மேலும் அறிய வேண்டுமா?`,
    en: `**Is Hostel Compulsory at SRM IST Trichy?**

**No, staying in the hostel is completely optional.**

• **Day Scholar Facility:** Students residing in Tiruchirappalli, Samayapuram, Thanjavur, Karur, Musiri, or surrounding areas can attend college as Day Scholars.
• **Extensive Bus Fleet:** SRM IST operates modern GPS-tracked buses connecting all major parts of Trichy and neighboring districts.
• **Hostel Availability:** If you live far away or wish to stay on campus, separate AC & Non-AC hostels (with 24/7 security, Wi-Fi, gym, and multi-cuisine dining) are available.

🔗 [Explore Hostel & Accommodation](https://www.srmtrichy.edu.in/campus-life#accommodation)`,
    source: "https://www.srmtrichy.edu.in/campus-life#accommodation"
  },

  // 15. Hostel food / Non-veg / Mess
  {
    id: "food_mess",
    patterns: [/non[-\s]*veg|veg(etarian)?\s+only|chicken|egg|அசைவ|சைவ|mess\s+food|food\s+(in\s+hostel|available)|சாப்பாடு|உணவு/i],
    ta: `**SRM IST திருச்சி விடுதி உணவு மற்றும் மெஸ் விவரங்கள்:**

• **சுவையான தென்னிந்திய & வடஇந்திய உணவுகள்:** தானியங்கி சமையலறையில் சுகாதாரமான முறையில் தயாரிக்கப்படும் சத்தான உணவுகள்.
• **அசைவ உணவுகள் (Non-Veg):** வாரத்தில் குறிப்பிட்ட நாட்களில் சுவையான அசைவ உணவுகள் (Chicken / Egg) வழங்கப்படுகின்றன.
• **சைவ உணவுப் பிரிவு:** சைவ உணவு உண்பவர்களுக்குத் தனி உணவு பரிமாறும் கவுண்ட்டர்கள் மற்றும் சிறப்பு சைவ உணவுகள் (Paneer / Mushroom) வழங்கப்படுகின்றன.
• **வளாக உணவகங்கள்:** மெஸ் தவிர வளாகத்திற்குள் நவீன ஃபுட் கோர்ட், ஸ்நாக்ஸ் பார் மற்றும் பழச்சாறு நிலையங்கள் உள்ளன.

🔗 [விடுதி மற்றும் உணவு வசதிகள்](https://www.srmtrichy.edu.in/campus-life#accommodation)`,
    en: `**Hostel Mess & Dining Options at SRM IST Trichy:**

• **Hygienic Multi-Cuisine:** The hostel mess serves nutritious, hygienic **South Indian and North Indian** meals prepared in automated kitchens.
• **Non-Vegetarian Options:** Non-veg dishes (Chicken, Egg) are served on designated days every week.
• **Vegetarian Care:** Separate, clean dining counters are maintained for vegetarian students with special menus (Paneer, Mushroom).
• **Campus Food Courts:** In addition to the mess, the campus features a multi-brand food court, bakery, cafes, and fruit juice centers.

🔗 [Explore Hostel & Dining](https://www.srmtrichy.edu.in/campus-life#accommodation)`,
    source: "https://www.srmtrichy.edu.in/campus-life#accommodation"
  },

  // 16. Placements & Top Packages
  {
    id: "placements",
    patterns: [/placement|highest\s+(package|salary)|top\s+(company|companies|recruiters)|50\s*lpa|average\s*package|வேலைவாய்ப்பு|சம்பளம்/i],
    negativePatterns: [/fee|fees|கட்டணம்/i],
    ta: `**SRM IST திருச்சி — வேலைவாய்ப்பு சாதனைகள் (Placements):**

• **அதிகபட்ச சம்பளத் தொகுப்பு (Highest Package):** ஆண்டுக்கு **₹50,00,000 (50 LPA)**.
• **சராசரி சம்பளம் (Average Package):** ஆண்டுக்கு **₹8.5 LPA**.
• **வேலைவாய்ப்பு விகிதம்:** **95%-க்கும் அதிகமான** மாணவர்களுக்கு வேலைவாய்ப்பு உறுதி செய்யப்படுகிறது.
• **முன்னணி நிறுவனங்கள் (600+):** Amazon, Microsoft, Google, Zoho, TCS, Infosys, Wipro, Cognizant, Renault Nissan, Barclays, Deloitte உள்ளிட்ட முன்னணி நிறுவனங்கள்.
• **CDC பயிற்சி:** முதலாமாண்டு முதலே கோடிங், ஆப்டிடியூட், மற்றும் மாதிரி நேர்காணல் பயிற்சிகள் வழங்கப்படுகின்றன.`,
    en: `**Placement Highlights at SRM IST Trichy:**

• **Highest Salary Package:** **₹50,00,000 (50 LPA)**.
• **Average Package:** **₹8.5 LPA**.
• **Placement Percentage:** **95%+** of eligible students placed every year.
• **Top Recruiters (600+):** Amazon, Microsoft, Google, Zoho, TCS, Infosys, Wipro, Cognizant, Renault Nissan, Barclays, Deloitte, Bosch, and L&T.
• **CDC Training:** Intensive training from Year 1 covering Full-Stack development, DSA, and mock HR interviews.`,
    source: "https://www.srmtrichy.edu.in/placement"
  },

  // 17. Engineering fees
  {
    id: "fees_engineering",
    patterns: [
      /(fee|fees|cost|tuition|கட்டணம்).*(b\.?tech|cse|ai|engineering|course|degree)|(b\.?tech|cse|ai|engineering|course|degree).*(fee|fees|cost|tuition|கட்டணம்)/i,
      /^fees?\??$/i, /^கட்டணம்\??$/i
    ],
    negativePatterns: [/hostel|விடுதி|bus|பேருந்து/i],
    ta: `**SRM IST திருச்சி — B.Tech CSE மற்றும் பொறியியல் கல்விக் கட்டண விவரங்கள்:**

• **B.Tech (CSE, AI & DS, Cyber Security, IT):** ஆண்டுக்கு சுமார் **₹1,75,000 முதல் ₹2,50,000 வரை**.
• **B.Tech (Biotech, ECE, Mechanical):** ஆண்டுக்கு சுமார் **₹1,50,000 முதல் ₹2,00,000 வரை**.
• **உதவித்தொகை சலுகைகள்:**
  - **Founder's Scholarship:** தேர்வுகளில் முதலிடம் பெற்ற மாணவர்களுக்கு 100% கட்டணத் தள்ளுபடி.
  - **Merit Scholarship:** அதிக மதிப்பெண் பெற்ற மாணவர்களுக்கு 25% முதல் 50% வரை கட்டணச் சலுகை.
  - **விளையாட்டு உதவித்தொகை:** மாநில மற்றும் தேசிய வீரர்களுக்கு பிரத்யேக கட்டணச் சலுகை உண்டு.

சேர்க்கை உதவி எண்: 📞 1800 202 4565.`,
    en: `**B.Tech CSE & Engineering Tuition Fees at SRM IST Trichy:**

• **B.Tech (CSE, AI & Data Science, Cyber Security, IT):** Approximately **₹1,75,000 to ₹2,50,000 per year**.
• **B.Tech (Biotech, ECE, Mechanical):** Approximately **₹1,50,000 to ₹2,00,000 per year**.
• **Scholarship Waivers:** 
  - **Founder's Scholarship:** 100% full fee waiver for top school/board rankers.
  - **Merit Scholarship:** 25% to 50% tuition waiver for high academic scorers.
  - **Sports Quota:** Concessions for state and national athletes.

For fee payment schedules and online booking, visit: [srmtrichy.edu.in/admission](https://www.srmtrichy.edu.in/admission).`,
    source: "https://www.srmtrichy.edu.in/admission"
  },

  // 18. Hostel fees
  {
    id: "fees_hostel",
    patterns: [/(fee|fees|cost|கட்டணம்).*(hostel|room|விடுதி)|(hostel|room|விடுதி).*(fee|fees|cost|கட்டணம்)/i],
    ta: `**SRM IST திருச்சி — விடுதி மற்றும் உணவுக் கட்டண விவரங்கள்:**

• **அறை வகைகள் மற்றும் தோராய ஆண்டுக் கட்டணம்:**
  - **நான்-ஏசி (Non-AC) அறைகள் (3 / 4 பேர்):** ஆண்டுக்கு சுமார் ₹85,000 முதல் ₹1,05,000 வரை.
  - **ஏசி (AC) அறைகள் (2 / 3 / 4 பேர்):** ஆண்டுக்கு சுமார் ₹1,15,000 முதல் ₹1,35,000 வரை.
• **சேவை உள்ளடக்கங்கள்:** தங்குமிடம், 3 வேளை உணவு + மாலை சிற்றுண்டி, 24 மணி நேர மின்சாரம் & வைஃபை, மற்றும் உடற்பயிற்சிக் கூடம் (Gym) வசதிகள் அடங்கும்.

🔗 [விடுதி & கட்டண விவரங்கள் (Hostels)](https://www.srmtrichy.edu.in/campus-life#accommodation)`,
    en: `**Hostel & Mess Fees at SRM IST Trichy:**

• **Room Types & Annual Fees (Approximate):**
  - **Non-AC Rooms (3 or 4 Sharing):** ₹85,000 – ₹1,05,000 / year
  - **AC Rooms (2, 3, or 4 Sharing):** ₹1,15,000 – ₹1,35,000 / year
• **Inclusions:** Includes boarding, 3 daily meals + evening snacks, 24/7 electricity, high-speed Wi-Fi, RO water, security, and gym access.

🔗 [Hostel Details & Fee Policy](https://www.srmtrichy.edu.in/campus-life#accommodation)`,
    source: "https://www.srmtrichy.edu.in/campus-life#accommodation"
  },

  // 19. Transport / Bus routes
  {
    id: "transport_buses",
    patterns: [/(bus|transport|routes?|பேருந்து|வழித்தடம்).*(route|from|timing|available|iruka|fee)|where.*bus|how.*reach/i],
    ta: `**SRM IST திருச்சி — கல்லூரி பேருந்து வழித்தடங்கள்:**

• **திருச்சி மாநகர வழித்தடங்கள்:** மத்திய பேருந்து நிலையம், சத்திரம் பேருந்து நிலையம், ஸ்ரீரங்கம், தில்லை நகர், கே.கே. நகர், டிவிஎஸ் டோல்கேட்.
• **சுற்றுவட்டார வழித்தடங்கள்:** சமயபுரம், தஞ்சாவூர், கரூர், முசிறி, குளித்தலை, மணப்பாறை, அரியலூர், பெரம்பலூர், லால்குடி.
• **சிறப்பம்சங்கள்:** அனைத்து பேருந்துகளிலும் GPS கண்காணிப்பு வசதி மற்றும் அனுபவமிக்க ஓட்டுநர்கள்.
• **பேருந்துக் கட்டணம்:** பயண தூரத்தைப் பொறுத்து ஆண்டுக்கு சுமார் ₹25,000 முதல் ₹40,000 வரை.

🔗 [கல்லூரி பேருந்து வழித்தடங்கள் (Transport)](https://www.srmtrichy.edu.in/campus-life#transport)`,
    en: `**College Bus Routes & Transport at SRM IST Trichy:**

• **Trichy City Routes:** Central Bus Stand, Chathiram Bus Stand, Srirangam, Thillai Nagar, KK Nagar, TVS Tolgate, Palpannai.
• **Surrounding Town Routes:** Samayapuram, Thanjavur, Karur, Musiri, Kulithalai, Manapparai, Ariyalur, Perambalur, Lalgudi.
• **Features:** Modern GPS-tracked AC and non-AC buses with emergency communication and trained drivers.
• **Annual Bus Fee:** Approximately ₹25,000 – ₹40,000 per year depending on route distance.

🔗 [Explore Campus Transport & Routes](https://www.srmtrichy.edu.in/campus-life#transport)`,
    source: "https://www.srmtrichy.edu.in/campus-life#transport"
  },

  // 20. Library
  {
    id: "library",
    patterns: [/library|புத்தகம்|நூலகம்/i],
    ta: `**SRM IST திருச்சி — மத்திய நூலக வசதிகள் (Central Library):**

• **புத்தகத் தொகுப்பு:** 50,000-க்கும் மேற்பட்ட சர்வதேச மற்றும் தேசிய கல்விப் புத்தகங்கள், குறிப்பு நூல்கள் (Reference Books).
• **மின்-நூலகம் (E-Library):** IEEE, ScienceDirect, Springer, DELNET உள்ளிட்ட முன்னணி சர்வதேச மின்-ஆய்விதழ்கள் (e-Journals).
• **வசதிகள்:** குளிர்சாதன வசதி கொண்ட நவீன வாசிப்பு மண்டபம், மல்டிமீடியா கணினி முனையங்கள், மற்றும் தனிப் படிப்பு அறைகள்.
• **இயங்கும் நேரம்:** கல்லூரி வேலை நாட்களில் காலை 8:30 மணி முதல் மாலை 7:00 மணி வரை.

🔗 [மத்திய நூலக விவரங்கள் (Central Library)](https://www.srmtrichy.edu.in/library)`,
    en: `**Central Library Facilities at SRM IST Trichy:**

• **Rich Collection:** Over 50,000+ volumes of textbooks, reference materials, and academic journals.
• **Digital Resources:** Subscriptions to IEEE Xplore, ScienceDirect, Springer, DELNET, and major e-databases.
• **Amenities:** Air-conditioned reading halls, multimedia workstations, automated RFID check-in/out, and dedicated quiet study cabins.
• **Timings:** Open from 8:30 AM to 7:00 PM on all academic working days.

🔗 [Explore Central Library](https://www.srmtrichy.edu.in/library)`,
    source: "https://www.srmtrichy.edu.in/library"
  },

  // 21. Sports & Gym
  {
    id: "sports_gym",
    patterns: [/sport|cricket|football|gym|fitness|athletic|விளையாட்டு|உடற்பயிற்சி/i],
    ta: `**SRM IST திருச்சி — விளையாட்டு மற்றும் உடற்பயிற்சி வசதிகள் (Sports & Athletics):**

• **வெளி மைதானங்கள்:** சர்வதேச தரத்திலான கிரிக்கெட் மைதானம் (Turf Pitch), FIFA தரத்திலான கால்பந்து மைதானம், மற்றும் 400 மீட்டர் தடகளப் பாதை.
• **கோர்ட்டுகள்:** மின்னொளி வசதி கொண்ட கூடைப்பந்து (Basketball) மற்றும் கைப்பந்து (Volleyball) மைதானங்கள்.
• **உள்விளையாட்டு அரங்கம்:** பிரத்யேக இறகுப்பந்து (Badminton), டேபிள் டென்னிஸ், செஸ் மற்றும் கேரம் வசதிகள்.
• **ஜிம் (Gym):** மாணவர் மற்றும் மாணவியருக்கு தனித்தனியான நவீன உடற்பயிற்சிக் கூடங்கள் மற்றும் தகுதிவாய்ந்த பயிற்சியாளர்கள்.

🔗 [விளையாட்டு & உடற்பயிற்சி மையம் (Sports)](https://www.srmtrichy.edu.in/sports)`,
    en: `**Sports and Athletic Facilities at SRM IST Trichy:**

• **Outdoor Arenas:** International-standard cricket turf pitch, FIFA-standard football ground, and a 400m synthetic athletic track.
• **Floodlit Courts:** Professional basketball and volleyball courts with night floodlights.
• **Indoor Sports Complex:** Badminton courts, table tennis tables, chess, and carrom arenas.
• **Modern Gymnasium:** Separate fully-equipped fitness gyms for boys and girls with certified fitness trainers.

🔗 [Sports & Athletic Facilities](https://www.srmtrichy.edu.in/sports)`,
    source: "https://www.srmtrichy.edu.in/sports"
  },

  // 22. Scholarships (Only when explicitly asking about scholarships/concessions)
  {
    id: "scholarships",
    patterns: [/\bscholarships?\b|\bconcessions?\b|\bfee discount\b|உதவித்தொகை|கட்டணச்\s*சலுகை/i],
    ta: `**SRM IST திருச்சி — உதவித்தொகை மற்றும் கட்டணச் சலுகைகள் (Scholarships):**

• **நிறுவனர் தகுதி உதவித்தொகை (Founder's Scholarship):** பள்ளி மற்றும் வாரியத் தேர்வுகளில் முதலிடம் பெற்ற மாணவர்களுக்கு 100% கல்விக் கட்டணம் மற்றும் விடுதிக் கட்டணத் தள்ளுபடி.
• **மெரிட் உதவித்தொகை (Merit Scholarship):** 12-ஆம் வகுப்பில் அதிக மதிப்பெண் (80%+ / 90%+) பெற்ற மாணவர்களுக்கு 25% முதல் 50% வரை கல்விக் கட்டணச் சலுகை.
• **விளையாட்டு ஒதுக்கீடு (Sports Quota):** மாநில மற்றும் தேசிய அளவிலான விளையாட்டுப் போட்டிகளில் சாதனை படைத்த வீரர்களுக்கு சிறப்பு கட்டணச் சலுகை.
• **சமூக-பொருளாதார சலுகைகள்:** தகுதியான பொருளாதாரத்தில் பின்தங்கிய மாணவர்களுக்குக் கட்டண உதவி.`,
    en: `**Scholarships & Fee Concessions at SRM IST Trichy:**

• **Founder's Scholarship:** 100% full tuition and hostel fee waiver for school/board toppers and top national rankers.
• **Merit Scholarships:** 25% to 50% tuition fee waiver for students with outstanding 12th board marks (80%+ / 90%+ PCM).
• **Sports Scholarships:** Substantial fee waivers and hostel support for state and national level athletes.
• **Socio-Economic Support:** Concessions for deserving students from economically weaker backgrounds and SRM alumni.`,
    source: "https://www.srmtrichy.edu.in/admission"
  },

  // 23. Leadership
  {
    id: "leadership",
    patterns: [/chancellor|founder|paarivendhar|வேந்தர்|பாரிவேந்தர்|தலைமை/i],
    ta: `**SRM பல்கலைக்கழக தலைமை நிர்வாகம் (Leadership):**

• **நிறுவனர் வேந்தர் (Founder Chancellor):** **டாக்டர் டி. ஆர். பாரிவேந்தர் (Dr. T. R. Paarivendhar)** — நாடாளுமன்ற உறுப்பினர் மற்றும் கல்வியாளர்.
• **இணை வேந்தர் (நிர்வாகம்):** டாக்டர் ரவி பச்சமுத்து.
• **இணை வேந்தர் (கல்வி):** டாக்டர் பி. சத்யநாராயணன்.
• **துணை வேந்தர் (Vice Chancellor):** டாக்டர் சி. முத்தமிழ்ச்செல்வன்.
• **பதிவாளர் (Registrar):** டாக்டர் எஸ். பொன்னுசாமி.`,
    en: `**University Leadership at SRM IST Trichy:**

• **Founder Chancellor:** **Dr. T. R. Paarivendhar** — Visionary educationalist and Member of Parliament.
• **Pro-Chancellor (Administration):** Dr. Ravi Pachamoothoo.
• **Pro-Chancellor (Academics):** Dr. P. Sathyanarayanan.
• **Vice Chancellor:** Dr. C. Muthamizhchelvan.
• **Registrar:** Dr. S. Ponnusamy.`,
    source: "https://www.srmtrichy.edu.in/leadership"
  },

  // 24. MBA & Management
  {
    id: "mba_management",
    patterns: [/mba|bba|management\s*studies|business\s*school|மேலாண்மை/i],
    ta: `**SRM IST திருச்சி — MBA மற்றும் மேலாண்மைப் படிப்புகள் (Faculty of Management):**

• **இரட்டை சிறப்புப் பாடம் (Dual Specialization):** நிதி (Finance), சந்தைப்படுத்தல் (Marketing), மனித வளம் (HR), வணிகப் பகுப்பாய்வு (Business Analytics), மற்றும் செயல்பாடுகள் (Operations).
• **ஆண்டு கல்விக் கட்டணம்:** சுமார் ₹1,75,000 முதல் ₹2,25,000 வரை.
• **சேர்க்கைத் தகுதி:** ஏதேனும் ஒரு இளங்கலை பட்டப்படிப்பில் 50% மதிப்பெண் + SRM MAT / CAT / TANCET தேர்வு மதிப்பெண்.
• **பயிற்சி முறை:** Harvard கேஸ் ஸ்டடி முறை, நேரடி கார்ப்பரேட் பயிற்சிகள் மற்றும் கோடைகால இன்டர்ன்ஷிப்.`,
    en: `**Management Programs at SRM IST Trichy (Faculty of Management):**

• **MBA (Dual Specialization):** Finance, Marketing, Human Resources (HR), Business Analytics, Operations & Supply Chain.
• **Tuition Fees:** Approximately ₹1,75,000 to ₹2,25,000 per year.
• **Eligibility:** Any recognized undergraduate degree with minimum 50% aggregate + SRM MAT, CAT, MAT, or TANCET scores.
• **Pedagogy:** Harvard & IIM case study methodology, corporate guest lectures, and mandatory summer internships.`,
    source: "https://www.srmtrichy.edu.in/departments"
  },

  // 25. Hospital & Medical
  {
    id: "hospital_medical",
    patterns: [/hospital|medical\s*college|doctor|clinic|மருத்துவ/i],
    ta: `**SRM மருத்துவக் கல்லூரி மருத்துவமனை (SRM Medical College Hospital & Research Centre):**

• **வளாக மருத்துவமனை:** கல்லூரி வளாகத்திற்கு அருகிலேயே அமைந்துள்ள 750+ படுக்கைகள் கொண்ட அதிநவீன பன்னோக்கு மருத்துவமனை.
• **24 மணி நேர சேவைகள்:** தீவிர சிகிச்சைப் பிரிவு (ICU), அவசர விபத்து சிகிச்சை (Trauma Care), மற்றும் ஆம்புலன்ஸ் சேவை.
• **மாணவர் நலம்:** கல்லூரி வளாகத்திலேயே முதலுதவி மையம் மற்றும் மாணவர்களுக்கு சலுகை விலையில் சிறப்பு மருத்துவ பரிசோதனைகள்.

🔗 [மருத்துவமனை மற்றும் உள்கட்டமைப்பு](https://www.srmtrichy.edu.in/institution/infrastructure)`,
    en: `**SRM Medical College Hospital & Research Centre:**

• **On-Campus Facility:** 750+ bed multi-specialty tertiary care teaching hospital located right next to the campus.
• **24/7 Emergency Care:** Comprehensive trauma center, ICU, ambulance services, round-the-clock pharmacy, and clinical labs.
• **Student Healthcare:** Dedicated health center on campus with subsidized medical consultations and health checks for students.

🔗 [Hospital & Campus Infrastructure](https://www.srmtrichy.edu.in/institution/infrastructure)`,
    source: "https://www.srmtrichy.edu.in/institution/infrastructure"
  },

  // 26. Comparison: BPT vs BOT
  {
    id: "bpt_vs_bot",
    patterns: [
      /(difference|compare|versus|vs).*(bpt|physiotherapy).*(bot|occupational)/i,
      /(bpt|physiotherapy).*(vs|versus|difference|compare).*(bot|occupational)/i
    ],
    ta: `**BPT (இயன்முறை சிகிச்சை) மற்றும் BOT (தொழில் சிகிச்சை) இடையேயான வேறுபாடுகள்:**

இரண்டுமே SRM மருத்துவக் கல்லூரி மருத்துவமனையுடன் இணைந்த 4.5 ஆண்டு மருத்துவ சிகிச்சைப் படிப்புகளாகும்:

• **BPT (Bachelor of Physiotherapy):**
  - உடல் இயக்கம், தசை வலிமை, மூட்டு வலிகள், மற்றும் பக்கவாதம்/விபத்துகளுக்குப் பிந்தைய உடல் மறுவாழ்வு சிகிச்சைகளில் கவனம் செலுத்துகிறது.
  - விளையாட்டு வீரர்கள் மற்றும் எலும்பு/நரம்பியல் நோயாளிகளுக்கு உடற்பயிற்சி சிகிச்சை அளிப்பவர்கள்.

• **BOT (Bachelor of Occupational Therapy):**
  - நோயாளிகள் அல்லது மாற்றுத்திறனாளிகள் தங்கள் அன்றாடப் பணிகளை (சுய பராமரிப்பு, வேலை, கல்வி) தன்னிச்சையாகச் செய்ய உதவும் சிகிச்சை முறை.
  - சிறப்புக் குழந்தைகள் (Autism/ADHD), மனநல மறுவாழ்வு மற்றும் பணிச்சூழலியல் (Ergonomics) துறைகளில் அதிக தேவை கொண்ட படிப்பு.

இரண்டு படிப்புகளுக்குமே உள்நாட்டிலும் வெளிநாடுகளிலும் மிகச் சிறந்த வேலைவாய்ப்புகள் உள்ளன!`,
    en: `**Difference between BPT (Physiotherapy) and BOT (Occupational Therapy) at SRM Trichy:**

Both are 4.5-year clinical rehabilitation degree programs with training at SRM Medical Hospital:

• **BPT (Bachelor of Physiotherapy):**
  - Focuses on **physical movement, motor function, muscle strength, and pain relief** resulting from injuries, surgery, or musculoskeletal/neurological conditions.
  - Common roles: Sports physiotherapist, orthopedic rehab specialist, pediatric physiotherapist.

• **BOT (Bachelor of Occupational Therapy):**
  - Focuses on **enabling patients to perform activities of daily living (ADL)** independently, integrating physical, sensory, cognitive, and mental rehabilitation.
  - Common roles: Pediatric therapist (autism, ADHD), ergonomic consultant, neurological rehabilitation specialist.

Both offer excellent career opportunities in hospitals, sports clinics, and overseas health sectors.`,
    source: "https://www.srmtrichy.edu.in/departments"
  },

  // 27. News & Events
  {
    id: "news_and_events",
    patterns: [
      /(news|event|evating\s*ents|happening|circular|announcement|symposium|conference|workshop|fest|செய்தி|செய்திகள்|நிகழ்வு|நிகழ்வுகள்|நிகழ்ச்சி|விழா|கருத்தரங்கு|சுற்றறிக்கை|समाचार|कार्यक्रम|వార్తలు|ఈవెంట్)/i,
      /latest\s*(news|event|update)/i,
      /^news\??$/i, /^events?\??$/i
    ],
    ta: `**SRM IST திருச்சி — செய்திகள் மற்றும் நிகழ்வுகள் (News & Events):**

• **அண்மைய நிகழ்வுகள் & மாநாடுகள்:** SRM IST திருச்சியில் சர்வதேச ஆராய்ச்சி மாநாடுகள், தேசிய அளவிலான ஹேக்கத்தான்கள் (Hackathons), IEEE பயிலரங்குகள் மற்றும் தொழில்நுட்ப கருத்தரங்குகள் தொடர்ந்து நடத்தப்படுகின்றன.
• **கலாச்சார மற்றும் விளையாட்டு விழாக்கள்:** ஆண்டுதோறும் நடைபெறும் பிரம்மாண்டமான 'Milan / Tarang' கலாச்சார விழா, 'Technozion' தேசிய தொழில்நுட்ப கருத்தரங்கு மற்றும் மாநில/பல்கலைக்கழக விளையாட்டுப் போட்டிகள்.
• **சுற்றறிக்கைகள் & அறிவிப்புகள்:** செமஸ்டர் தேர்வு அட்டவணைகள், புதிய சேர்க்கை அறிவிப்புகள், வேலைவாய்ப்பு முகாம்கள் மற்றும் கல்வி நாள்காட்டி விவரங்கள் நிகழ்வுகள் பக்கத்தில் உடனுக்குடன் பதிவேற்றப்படுகின்றன.

🔗 [அனைத்து செய்திகள் மற்றும் நிகழ்வுகள் (News & Events)](https://www.srmtrichy.edu.in/news-and-events) | [கல்வி நாள்காட்டி (Academic Calendar)](https://www.srmtrichy.edu.in/academic_calendar)`,
    en: `**SRM IST Trichy — Official News & Events Portal:**

• **Conferences & Workshops:** SRM IST Trichy actively conducts international research symposia, IEEE workshops, national hackathons, and corporate seminars.
• **Cultural & Tech Extravaganzas:** Flagship events include annual cultural gala 'Milan / Tarang', national technical symposium 'Technozion', and university sports tournaments.
• **Announcements & Circulars:** Up-to-date circulars on semester schedules, academic calendars, placement drives, and campus achievements.

🔗 [Explore All News & Events](https://www.srmtrichy.edu.in/news-and-events) | [Academic Calendar](https://www.srmtrichy.edu.in/academic_calendar)`,
    source: "https://www.srmtrichy.edu.in/news-and-events"
  },

  // 27b. Clubs & Student Activities
  {
    id: "clubs_events",
    patterns: [/club|culture|symposium|fests?|மன்ற|சங்க|திருவிழா/i],
    ta: `**மாணவர் மன்றங்கள் மற்றும் கலாச்சார நிகழ்வுகள் (Clubs & Campus Life):**

• **தொழில்நுட்ப மன்றங்கள்:** Coding Club, Robotics Club, AI & IoT Innovation Club, Web Development Cell.
• **கலாச்சார மற்றும் சமூக மன்றங்கள்:** Rotaract Club, Literary & Debating Society, Photography Club, Music & Dance Club.
• **தேசிய அமைப்புகள்:** தேசிய மாணவர் படை (NCC) மற்றும் நாட்டு நலப்பணித் திட்டம் (NSS).
• **முக்கிய திருவிழாக்கள்:** ஆண்டுதோறும் நடைபெறும் 'Milan / Tarang' கலாச்சார விழா மற்றும் 'Technozion' தேசிய அளவிலான தொழில்நுட்ப கருத்தரங்கு.

🔗 [செய்திகள் மற்றும் கலாச்சார நிகழ்வுகள்](https://www.srmtrichy.edu.in/news-and-events)`,
    en: `**Student Clubs & Cultural Life at SRM IST Trichy:**

• **Technical Clubs:** Coding Club, Robotics Club, AI & IoT Innovation Hub, Web Development Cell.
• **Cultural & Social Clubs:** Rotaract Club, Literary & Debating Society, Photography Club, Music & Dance Ensemble.
• **National Units:** National Cadet Corps (NCC) and National Service Scheme (NSS).
• **Flagship Festivals:** Annual cultural extravaganza 'Milan / Tarang' and national tech symposium 'Technozion'.

🔗 [Explore Clubs & Events](https://www.srmtrichy.edu.in/news-and-events)`,
    source: "https://www.srmtrichy.edu.in/news-and-events"
  },

  // 28. Accreditations & Ranking
  {
    id: "accreditations",
    patterns: [/naac|ugc|ranking|rank|grade|அங்கீகாரம்|தரம்/i],
    ta: `**SRM IST திருச்சி — தேசிய மற்றும் சர்வதேச அங்கீகாரங்கள் (Accreditations):**

• **NAAC A++ தரம்:** இந்திய அரசின் தேசிய மதிப்பீடு மற்றும் தரச்சான்று அவையினால் (NAAC) மிக உயர்ந்த **'A++'** தரம் வழங்கப்பட்டுள்ளது.
• **UGC Category-1:** மத்திய கல்வி அமைச்சகம் மற்றும் UGC-யினால் தன்னாட்சி பெற்ற முதன்மை நிகர்நிலைப் பல்கலைக்கழக அந்தஸ்து.
• **NIRF & ABET:** இந்திய மற்றும் சர்வதேச அளவில் சிறந்த தரவரிசை மற்றும் பொறியியல் அங்கீகாரம்.
• **AICTE:** அனைத்து தொழில்நுட்ப மற்றும் மேலாண்மைப் படிப்புகளுக்கும் முழுமையான அங்கீகாரம்.`,
    en: `**Accreditations and Rankings at SRM IST Trichy:**

• **NAAC Grade:** **A++** (Highest national accreditation grade).
• **UGC Status:** Category-1 Deemed-to-be University under MHRD/UGC regulations.
• **NIRF:** Consistently ranked among top Indian universities and engineering institutions.
• **ABET:** Internationally accredited engineering curriculum.
• **AICTE:** Full approval for all technical and management programs.`,
    source: "https://www.srmtrichy.edu.in/about"
  },

  // 29. Is it a good college? / College Review
  {
    id: "college_review",
    patterns: [/good\s+(college|university)|worth|should\s+i\s+join|why\s+choose\s+srm|review|நல்ல\s*கல்லூரியா|சேரலாமா/i],
    ta: `**SRM IST திருச்சியில் சேர்வது சிறந்த தேர்வா? (Why Choose SRM Trichy):**

• **கல்வித் தரம்:** NAAC 'A++' மற்றும் UGC Category-1 அங்கீகாரம் பெற்ற முதன்மை நிகர்நிலைப் பல்கலைக்கழகம்.
• **வேலைவாய்ப்பு உறுதி:** ஆண்டுதோறும் 95%+ வேலைவாய்ப்பு, அதிகபட்ச ஊதியம் **₹50 LPA**, சராசரி ஊதியம் **₹8.5 LPA** (Amazon, Microsoft, Zoho, TCS, Infosys).
• **உள்கட்டமைப்பு:** 50+ ஏக்கர் பசுமை வளாகம், நவீன ஸ்மார்ட் வகுப்பறைகள், சர்வதேச விளையாட்டு மைதானங்கள் மற்றும் 750 படுக்கைகள் கொண்ட SRM மருத்துவமனை.
• **அமைவிடம்:** திருச்சி-சென்னை நெடுஞ்சாலையில் அமைதியான, பாதுகாப்பான கல்விச் சூழல்.

உங்களின் எதிர்காலக் கல்வி மற்றும் வேலைவாய்ப்பிற்கு SRM IST திருச்சி ஒரு மிகச்சிறந்த தேர்வு!`,
    en: `**Why SRM IST Trichy is an Excellent Choice:**

• **Academic Prestige:** NAAC 'A++' Grade, UGC Category-1 Deemed University status with ABET accreditation.
• **Outstanding Placements:** 95%+ placement record, Highest package **₹50 LPA**, Average **₹8.5 LPA** with 600+ recruiters (Amazon, Microsoft, Google, Zoho, TCS).
• **Modern Campus:** 50+ acre green campus, advanced coding & AI labs, 50,000+ volume library, FIFA-standard turf, and 750-bed hospital.
• **Holistic Growth:** 360-degree CDC training from Year 1, active clubs, hackathons, and international exposure.

It is undoubtedly a top-tier institution for higher education in Tamil Nadu!`,
    source: "https://www.srmtrichy.edu.in/about"
  },

  // 30. Wi-Fi & Internet
  {
    id: "wifi_internet",
    patterns: [/wifi|wi-fi|internet|இணையம்|வைஃபை/i],
    ta: `**SRM IST திருச்சி — இணையம் மற்றும் வைஃபை வசதிகள் (Wi-Fi & Internet):**

• **வளாகம் முழுவதும் அதிவேக வைஃபை:** கல்வி வளாகங்கள், ஆய்வகங்கள், நூலகம் மற்றும் விடுதிகள் முழுவதும் பாதுகாப்பான அதிவேக ஃபைபர் வைஃபை வசதி.
• **மாணவர் பதிவு:** ஒவ்வொரு மாணவருக்கும் தனிப்பயன் பயனர் பெயர் மற்றும் கடவுச்சொல் (SSID Login) வழங்கப்படுகிறது.
• **ஆராய்ச்சி & கோடிங்:** ஹேக்கத்தான் மற்றும் கோடிங் பயிற்சிகளுக்காக 24 மணி நேர இணைய வசதி ஆய்வகங்களில் செய்யப்பட்டுள்ளது.`,
    en: `**High-Speed Wi-Fi & Internet Facilities at SRM IST Trichy:**

• **Campus-Wide High-Speed Wi-Fi:** Secure, high-speed fiber-optic Wi-Fi covering all academic blocks, laboratories, central library, and student hostels.
• **Individual Student Logins:** Dedicated secure login credentials for each registered student with safe web filtering.
• **24/7 Connectivity:** Continuous internet access in hostels and computer centers for project work and hackathons.`,
    source: "https://www.srmtrichy.edu.in/campus-life"
  },

  // 31. Contact & Helpline
  {
    id: "contact_helpline",
    patterns: [/contact|phone|number|mobile|email|call|help\s*line|தொடர்பு|தொலைபேசி|எண்/i],
    ta: `**SRM IST திருச்சி — தொடர்பு விவரங்கள் (Contact Information):**

• **இலவச உதவி எண் (Toll-Free):** 📞 **1800 202 4565**
• **தொலைபேசி:** 0431 - 2258900 / 0431 - 2258901
• **மின்னஞ்சல்:** admissions@srmtrichy.edu.in / info@srmtrichy.edu.in
• **இணையதளம்:** [www.srmtrichy.edu.in](https://www.srmtrichy.edu.in)
• **முகவரி:** SRM நகர், திருச்சி-சென்னை தேசிய நெடுஞ்சாலை (NH-45), சமயபுரம் டோல் பிளாசா அருகில், திருச்சி - 621 105.
• **அலுவலக நேரம்:** திங்கள் முதல் சனிக்கிழமை வரை: 9:00 AM – 5:00 PM.`,
    en: `**Contact Details for SRM IST Trichy:**

• **Toll-Free Admission Helpline:** 📞 **1800 202 4565**
• **Office Numbers:** 0431 - 2258900 / 0431 - 2258901
• **Email:** admissions@srmtrichy.edu.in / info@srmtrichy.edu.in
• **Official Website:** [www.srmtrichy.edu.in](https://www.srmtrichy.edu.in)
• **Campus Address:** SRM Nagar, Trichy-Chennai Highway (NH-45), near Samayapuram Toll Plaza, Trichy - 621 105.
• **Working Hours:** Monday to Saturday: 9:00 AM – 5:00 PM.`,
    source: "https://www.srmtrichy.edu.in/contact"
  },

  // 32. Courtesy & Thanks
  {
    id: "courtesy",
    patterns: [/^(thanks?|thank you|thx|நன்றி|super|awesome|good|great|ok|okay|bye|see you)\b/i],
    ta: `மிக்க மகிழ்ச்சி! SRM IST திருச்சி குறித்து மேலும் ஏதேனும் விவரங்கள் (பாடப்பிரிவுகள், கட்டணம், வேலைவாய்ப்பு, விடுதி போன்றவை) தேவைப்பட்டால் எப்போது வேண்டுமானாலும் கேளுங்கள். உங்களுக்கு உதவ எப்போதும் தயாராக உள்ளேன்! 🎓`,
    en: `You're very welcome! If you have any further questions about SRM IST Trichy (courses, fees, placements, hostels, admissions), feel free to ask anytime. Wishing you the very best! 🎓`,
    source: "https://www.srmtrichy.edu.in"
  }
];

/**
 * Find relevant knowledge from verified TOPICS & COLLEGE_DATA to ground LLM generation
 */
function findRelevantKnowledge(query) {
  const q = String(query || "").toLowerCase();
  const matched = [];

  for (const topic of TOPICS) {
    if (topic.negativePatterns && topic.negativePatterns.some(np => np.test(q))) {
      continue;
    }
    if (topic.patterns && topic.patterns.some(p => p.test(q))) {
      matched.push(topic);
      if (matched.length >= 3) break;
    }
  }

  if (matched.length === 0) {
    // Keyword fallback
    const keywords = ["fee", "cse", "admission", "hostel", "placement", "scholarship", "math", "cutoff", "bus", "food", "sports", "hospital", "bba", "mba", "bpt", "news", "event", "evating", "circular"];
    for (const kw of keywords) {
      if (q.includes(kw)) {
        const found = TOPICS.find(t => t.id.includes(kw) || (t.patterns && t.patterns.some(p => p.test(kw))));
        if (found && !matched.includes(found)) {
          matched.push(found);
          if (matched.length >= 2) break;
        }
      }
    }
  }

  return matched.map(m => `[Topic: ${m.id}]\nEnglish: ${m.en}\nTamil: ${m.ta}`).join("\n\n");
}

/**
 * Contextually determine the exact official URL for any inquiry
 */
export function getContextualSource(query) {
  const q = String(query || "").toLowerCase();
  if (/hostel|room|mess|accommodation|stay|விடுதி|தங்குமிடம்|हॉस्टल|హాస్టల్/i.test(q)) {
    return "https://www.srmtrichy.edu.in/campus-life#accommodation";
  }
  if (/news|event|evating\s*ents|happening|circular|announcement|symposium|conference|workshop|fest|செய்தி|செய்திகள்|நிகழ்வு|நிகழ்வுகள்|நிகழ்ச்சி|விழா|கருத்தரங்கு|சுற்றறிக்கை|समाचार|कार्यक्रम|ఘటనలు|ఈవెంట్|వార్తలు/i.test(q)) {
    return "https://www.srmtrichy.edu.in/news-and-events";
  }
  if (/placement|package|salary|job|recruit|lpa|வேலை|சம்பளம்|प्लेसमेंट|ప్లేస్‌మెంట్/i.test(q)) {
    return "https://www.srmtrichy.edu.in/placement";
  }
  if (/sports|gym|cricket|football|fitness|விளையாட்டு|खेल|క్రీడలు/i.test(q)) {
    return "https://www.srmtrichy.edu.in/sports";
  }
  if (/library|book|journal|நூலகம்|புத்தகம்|पुस्तकालय|లైబ్రరీ/i.test(q)) {
    return "https://www.srmtrichy.edu.in/library";
  }
  if (/bus|transport|routes?|பேருந்து|வழித்தடம்|बस|బస్సు/i.test(q)) {
    return "https://www.srmtrichy.edu.in/campus-life#transport";
  }
  if (/contact|phone|number|mobile|email|call|help\s*line|தொடர்பு|முகவரி|संपर्क|సంప్రదించండి/i.test(q)) {
    return "https://www.srmtrichy.edu.in/contact";
  }
  if (/course|program|degree|btech|cse|mba|bba|bpt|பாடப்பிரிவு|துறை/i.test(q)) {
    return "https://www.srmtrichy.edu.in/institution/programmes";
  }
  if (/campus|facility|hospital|வளாக|மருத்துவமனை|परिसर|క్యాంపస్/i.test(q)) {
    return "https://www.srmtrichy.edu.in/campus-life";
  }
  if (/admission|apply|register|eligibility|seat|cutoff|சேர்க்கை|பதிவு|விண்ணப்ப|प्रवेश|అడ్మిషన్/i.test(q)) {
    return "https://www.srmtrichy.edu.in/admission";
  }
  return "https://www.srmtrichy.edu.in";
}

/**
 * Call Google Gemini API (gemini-2.0-flash / gemini-1.5-flash)
 */
async function callGemini(question, history = [], lang = "en", customKey = null) {
  const apiKey = customKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) return null;

  const langNames = {
    ta: "Tamil (தமிழ்) script ONLY - natural, polite, helpful spoken and formal Tamil tailored for students & parents. Never output in English.",
    en: "fluent English - warm, professional, engaging and concise"
  };
  const targetLang = langNames[lang] || langNames.en;

  const relevantFacts = findRelevantKnowledge(question);

  const systemInstruction = `You are Mozhi AI, the official intelligent admission counselor and campus assistant for SRM Institute of Science and Technology (SRM IST), Tiruchirappalli Campus (https://www.srmtrichy.edu.in).

CORE BEHAVIOR & RULES:
1. CONCISENESS MANDATE (CRITICAL): Keep your response SHORT, SWEET, and PRECISE (strictly maximum 2 to 3 sentences or concise bullet points, under 50 words). Directly state the answer without fluff, lengthy preambles, or conversational filler.
2. Be highly responsive, dynamic, and personalized. Directly answer the user's specific question, calculation, or scenario. NEVER output a rigid prebuilt template.
3. Reply STRICTLY in ${targetLang}. If the requested language is Tamil, reply 100% in Tamil script. If English, reply in English.
4. Formatting & Accurate Link Mapping (CRITICAL RULE):
   - Use clean markdown with bold highlights and concise bullet points.
   - Use ONLY the precise link matching the user's specific topic:
     * Hostel / Accommodation / Rooms / Mess -> [Hostels & Accommodation](https://www.srmtrichy.edu.in/campus-life#accommodation)
     * News / Events / Symposia / Festivals / Circulars -> [News & Events](https://www.srmtrichy.edu.in/news-and-events)
     * Placements / Salary Packages -> [Placements](https://www.srmtrichy.edu.in/placement)
     * Campus Life -> [Campus Life](https://www.srmtrichy.edu.in/campus-life)
     * Bus / Transport -> [Transport & Bus Routes](https://www.srmtrichy.edu.in/campus-life#transport)
     * Central Library -> [Central Library](https://www.srmtrichy.edu.in/library)
     * Sports & Gym -> [Sports Complex](https://www.srmtrichy.edu.in/sports)
     * Academic Programmes -> [Programmes](https://www.srmtrichy.edu.in/institution/programmes)
     * Contact / Helpline -> [Contact Us](https://www.srmtrichy.edu.in/contact)
     * ONLY when specifically asking about admissions/applying: [Apply Online](https://admissions.srmtrichy.edu.in/) or [Admissions Portal](https://www.srmtrichy.edu.in/admission)
   - NEVER generate or append the admission registration link when the user is asking about hostels, news, events, placements, library, bus, or sports!
5. If the user asks about marks / eligibility (e.g., 75%, 60%, 80%):
   - B.Tech eligibility requires minimum 60% PCM (Physics, Chemistry, Maths) in 10+2.
   - If they have >=60%, congratulate them and confirm they are eligible.
   - 80%+ and 90%+ qualify for 25% to 50% merit scholarships.
6. Official Helpline: Toll-Free 1800 202 4565 | Email: admissions@srmtrichy.edu.in

OFFICIAL SRM IST TRICHY FACTS:
- Location: SRM Nagar, Trichy-Chennai NH-45, near Samayapuram Toll Plaza, Trichy - 621 105, Tamil Nadu.
- Accreditations: Category-1 Deemed University, NAAC A++ (Highest Grade), AICTE, ABET.
- Campus: 50+ Acres lush green campus with on-campus 750-bed SRM Super Specialty Hospital.
- Academic Programs: B.Tech (CSE, AI & DS, Cyber Security, Biotech, IT, ECE, Mech, Civil), MBA, BBA, BPT (Physiotherapy 4.5 yrs), BOT, Allied Health Sciences, BCA, B.Com, M.Com, B.Sc, M.Sc, Ph.D.
- Annual Tuition Fees: B.Tech CSE ₹1.75L - ₹2.5L; Other B.Tech ₹1.5L - ₹2.0L; MBA ₹1.75L - ₹2.25L; BCA/BBA/B.Com ₹70k - ₹1.1L; BPT ₹1.1L - ₹1.6L.
- Hostels: Boys & Girls separate, AC and Non-AC (₹85,000 - ₹1,35,000/yr including mess), 2/3/4 sharing, 24/7 security, WiFi, gym, South & North Indian food. Link: https://www.srmtrichy.edu.in/campus-life#accommodation
- News & Events: Hackathons, Milan cultural fest, symposia, exam circulars. Link: https://www.srmtrichy.edu.in/news-and-events
- Transport: AC & Deluxe buses covering Trichy, Thanjavur, Karur, Dindigul, Pudukkottai, Perambalur (₹25k - ₹40k/yr). Link: https://www.srmtrichy.edu.in/campus-life#transport
- Placements: 95%+ placement record, Highest ₹50 LPA, Average ₹8.5 LPA, 600+ recruiters (Amazon, Microsoft, Google, Zoho, TCS, Infosys, Cognizant, Wipro, Renault Nissan, Barclays). Link: https://www.srmtrichy.edu.in/placement
${relevantFacts ? "\nVERIFIED TOPIC CONTEXT:\n" + relevantFacts : ""}`;

  // Build Gemini contents array with alternating user and model turns
  const contents = [];
  if (Array.isArray(history) && history.length > 0) {
    const recent = history.slice(-6);
    for (const msg of recent) {
      if (!msg || !msg.content) continue;
      const role = (msg.role === "bot" || msg.role === "assistant" || msg.role === "model") ? "model" : "user";
      if (contents.length > 0 && contents[contents.length - 1].role === role) {
        contents[contents.length - 1].parts[0].text += "\n" + msg.content;
      } else {
        contents.push({ role, parts: [{ text: msg.content }] });
      }
    }
  }

  // Ensure first turn is user
  if (contents.length > 0 && contents[0].role !== "user") {
    contents.shift();
  }

  // Add the current user question
  if (contents.length > 0 && contents[contents.length - 1].role === "user") {
    contents[contents.length - 1].parts[0].text += "\n" + question;
  } else {
    contents.push({ role: "user", parts: [{ text: question }] });
  }

  const payload = {
    system_instruction: {
      parts: [{ text: systemInstruction }]
    },
    contents,
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 160
    }
  };

  const models = ["gemini-flash-latest", "gemini-3.5-flash", "gemini-flash-lite-latest", "gemini-2.0-flash", "gemini-1.5-flash"];
  for (const model of models) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8500);
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.trim().length > 15) {
          let ans = text.trim();
          if (lang === "ta" && !looksTamil(ans)) ans = await translateText(ans, "ta");
          return { answer: ans, source: getContextualSource(question), provider: "gemini" };
        }
      }
    } catch (e) {
      // try next model
    }
  }

  return null;
}

/**
 * High-speed Free LLM with grounded prompt & 7.5s timeout
 */
async function callFreeLLM(question, lang = "en") {
  const langDirectives = {
    ta: "STRICT REQUIREMENT: Answer 100% in natural fluent Tamil (தமிழ்) script only. Do not output English sentences.",
    en: "Answer directly in clear, warm, fluent English."
  };
  const targetDirective = langDirectives[lang] || langDirectives.en;

  const relevantFacts = findRelevantKnowledge(question);

  const prompt = `You are Mozhi AI, the official Admission Assistant for SRM IST Trichy (https://www.srmtrichy.edu.in).
${targetDirective}
CRITICAL MANDATE: Keep your response SHORT, SWEET, and PRECISE (strictly maximum 2 to 3 sentences or concise bullets, under 50 words). Do NOT output a generic canned template; directly address what was asked without fluff.

Key SRM Trichy Facts & Specific Links:
- Hostels: Boys & Girls separate, AC & Non-AC, 2/3/4 sharing (₹85k - ₹1.35L/yr with food) -> Link: [Hostel & Accommodation](https://www.srmtrichy.edu.in/campus-life#accommodation)
- News & Events: Symposia, Milan cultural fest, hackathons, circulars -> Link: [News & Events](https://www.srmtrichy.edu.in/news-and-events)
- Placements: 95%+, Highest ₹50 LPA, Average ₹8.5 LPA (Amazon, Zoho, Microsoft, TCS) -> Link: [Placements](https://www.srmtrichy.edu.in/placement)
- Courses: B.Tech (60% in PCM), MBA, BPT, BCA -> Link: [Programmes](https://www.srmtrichy.edu.in/institution/programmes)
- Admissions / Apply: [Apply Online](https://admissions.srmtrichy.edu.in/)
- Helpline: Toll-Free 1800 202 4565 | Email: admissions@srmtrichy.edu.in
RULE: NEVER output an admission application link when the user asks about hostels, news, events, placements, or facilities!

${relevantFacts ? "Relevant Details: " + relevantFacts.slice(0, 350) : ""}

Student Question: "${question}"
Response (${targetDirective}):`;

  const models = ["openai", "mistral"];
  for (const model of models) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 7500);
      const url = `https://text.pollinations.ai/${encodeURIComponent(prompt)}?model=${model}&seed=${Math.floor(Math.random() * 1000)}`;
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) MozhiAI/2.0" },
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (res.ok) {
        const text = await res.text();
        if (text && text.trim().length > 25 && !text.includes('"error"') && !text.includes("Queue full")) {
          let ans = text.trim();
          if (lang === "ta" && !looksTamil(ans)) ans = await translateText(ans, "ta");
          return { answer: ans, source: getContextualSource(question), provider: "free-ai" };
        }
      }
    } catch (e) {
      // try next model
    }
  }

  return null;
}

/**
 * Conversational Context Follow-up (e.g. "tell me more", "what else?")
 */
async function handleFollowup(history, lang) {
  if (!history || history.length === 0) return null;
  const lastUserMsg = [...history].reverse().find(m => m.role === "user");
  if (!lastUserMsg) return null;

  const prevText = lastUserMsg.content.toLowerCase();
  for (const t of TOPICS) {
    if (t.patterns.some(p => p.test(prevText))) {
      if (lang === "ta") {
        return {
          answer: `**இது குறித்த கூடுதல் விவரங்கள் (${t.id.replace(/_/g, ' ')}):**\n\n${t.ta}\n\n• மேலும் குறிப்பிட்ட சந்தேகங்களுக்கு SRM திருச்சி சேர்க்கை மையத்தை **1800 202 4565** என்ற எண்ணில் தொடர்பு கொள்ளலாம்.`,
          source: t.source || "https://www.srmtrichy.edu.in"
        };
      } else {
        return {
          answer: `**Continuing on ${t.id.replace(/_/g, ' ').toUpperCase()}:**\n\n${t.en}\n\n• For more specific details or admission inquiries, you can also reach the SRM Trichy Admission Cell at **1800 202 4565**.`,
          source: t.source || "https://www.srmtrichy.edu.in"
        };
      }
    }
  }
  return null;
}

/**
 * Offline / Fallback Matcher from Grounded Topics
 */
async function findTopicFallback(query, lang = "en") {
  const q = query.toLowerCase();
  for (const topic of TOPICS) {
    if (topic.negativePatterns && topic.negativePatterns.some(np => np.test(q))) {
      continue;
    }
    if (topic.patterns && topic.patterns.some(p => p.test(q))) {
      if (lang === "ta") {
        return { answer: topic.ta, source: topic.source || "https://www.srmtrichy.edu.in" };
      } else {
        return { answer: topic.en, source: topic.source || "https://www.srmtrichy.edu.in" };
      }
    }
  }
  return null;
}

/**
 * Highly Responsive Dynamic Semantic Synthesizer
 * Formulates individualized, conversational responses addressing user-specific questions, marks, courses, and fees
 * in Tamil and English.
 */
function synthesizeResponse(query, lang = "en") {
  const q = String(query || "").toLowerCase();

  // 1. Extract marks / percentage if mentioned
  const pctMatch = q.match(/(\d{1,2}(?:\.\d+)?)\s*(?:%|percent|marks?|மதிப்பெண்|अंक|మార్కులు)/i);
  const pct = pctMatch ? parseFloat(pctMatch[1]) : null;

  // 2. Specific Subject/Course mentions
  const isCSE = /cse|computer\s*science|coding|software|கணினி|कंप्यूटर|కంప్యూటర్/i.test(q);
  const isAIDS = /ai\s*(&|and)?\s*ds|artificial\s*intelligence|data\s*science|செயற்கை\s*நுண்ணறிவு|आर्टिफिशियल|డేటా\s*సైన్స్/i.test(q);
  const isBPT = /\bbpt\b|physio|physiotherapy|இயன்முறை|फिजियो|ఫిజియో/i.test(q);
  const isMBA = /\bmba\b|மேலாண்மை|प्रबंधन|మేనేజ్/i.test(q);
  const isMathsQuestion = /without\s*math|no\s*math|கணிதம்\s*இல்லாமல்|maths\s*illama|गणित\s*के\s*बिना|గణితం\s*లేకుండా/i.test(q);

  // 3. Category mentions
  const mentionsFees = /fee|fees|cost|charge|tuition|expenses|கட்டணம்|செலவு|फीस|शुल्क|ఖర్చు|ఫీజు/i.test(q);
  const mentionsHostel = /hostel|room|mess|food|stay|accommodation|விடுதி|உணவு|हॉस्टल|హాస్టల్|భోజనం/i.test(q);
  const mentionsPlacement = /placement|package|job|salary|company|recruit|lpa|வேலை|சம்பளம்|प्लेसमेंट|पैकेज|नौकरी|ఉద్యోగం|ప్లేస్‌మెంట్/i.test(q);
  const mentionsCampus = /campus|facility|hospital|sports|bus|transport|வளாக|மருத்துவமனை|பேருந்து|कैंपस|अस्पताल|క్యాంపస్|హాస్పిటల్/i.test(q);
  const mentionsNewsEvents = /news|event|evating\s*ents|happening|circular|announcement|symposium|conference|workshop|fest|செய்தி|செய்திகள்|நிகழ்வு|நிகழ்வுகள்|நிகழ்ச்சி|விழா|கருத்தரங்கு|சுற்றறிக்கை|समाचार|कार्यक्रम|ఘటనలు|ఈవెంట్|వార్తలు/i.test(q);

  const sections = [];

  if (lang === "ta") {
    // ---------------- TAMIL DYNAMIC RESPONSE ----------------
    if (isMathsQuestion) {
      sections.push(`⚠️ **12-ஆம் வகுப்பில் கணிதம் இல்லாமல் B.Tech படிக்க இயலாது.** SRM IST மற்றும் AICTE விதிமுறைப்படி B.Tech சேர்க்கைக்கு 12-ஆம் வகுப்பில் **கணிதம் (Mathematics)** கட்டாயம். ஆனால் கணிதம் இல்லாத மாணவர்கள் **BCA (கணினி பயன்பாடுகள்)**, **BBA**, **B.Com** அல்லது **BPT (இயன்முறை சிகிச்சை)** படிப்புகளில் சேரலாம்.`);
    } else if (pct !== null) {
      if (pct >= 60) {
        sections.push(`🎉 **உங்கள் மதிப்பெண் (${pct}%):** நீங்கள் SRM IST திருச்சியில் B.Tech ${isCSE ? "CSE" : "பொறியியல்"} சேர்க்கை பெற **முழு தகுதியுடையவர்**! B.Tech சேர்க்கைக்கான குறைந்தபட்ச தகுதி 12-ஆம் வகுப்பில் PCM பாடங்களில் 60% ஆகும்.`);
        if (pct >= 80) {
          sections.push(`🌟 **மெரிட் உதவித்தொகை (Merit Scholarship):** நீங்கள் ${pct}% மதிப்பெண் பெற்றுள்ளதால், ஆண்டுக் கல்விக் கட்டணத்தில் **25% முதல் 50% வரை மெரிட் உதவித்தொகை** சலுகை பெறவும் தகுதி பெறுகிறீர்கள்!`);
        }
      } else {
        sections.push(`ℹ️ **மதிப்பெண் வழிகாட்டுதல் (${pct}%):** B.Tech சேர்க்கைக்கு 12-ஆம் வகுப்பில் இயற்பியல், வேதியியல், கணிதத்தில் (PCM) குறைந்தபட்சம் 60% அவசியம். ${pct}% மதிப்பெண்களுடன் நீங்கள் SRM திருச்சியில் **BCA, BBA, B.Com** உள்ளிட்ட சிறந்த மாற்றுப் படிப்புகளில் எளிதாக சேரலாம்.`);
      }
    }

    if (isCSE) {
      sections.push(`💻 **B.Tech கணினி அறிவியல் & பொறியியல் (CSE):**
• Cloud Computing, AI & ML, Full-Stack Development மற்றும் Cyber Security சிறப்புப் பிரிவுகள்.
• Microsoft, AWS, Oracle நிறுவன சான்றிதழ் பயிற்சிகள் மற்றும் உயர்தர ஆய்வகங்கள்.
• CSE மாணவர்களுக்கு அதிகபட்சமாக **₹50 LPA** வரையிலும் (சராசரி ₹8.5 LPA) Amazon, Zoho, Microsoft நிறுவனங்களில் வேலைவாய்ப்புகள் கிடைக்கின்றன.
• ஆண்டுக் கல்விக் கட்டணம்: **₹1,75,000 – ₹2,50,000**.`);
    } else if (isAIDS) {
      sections.push(`🤖 **B.Tech AI & Data Science:**
• Machine Learning, Deep Learning, Big Data Analytics மற்றும் NLP பாடத்திட்டம்.
• பிரத்யேக NVIDIA GPU பணிநிலையங்கள் கொண்ட சிறப்பு செயற்கை நுண்ணறிவு ஆய்வகம்.
• AI Engineer, Data Scientist பணிகளுக்கு ₹50 LPA வரையிலான உச்சபட்ச வேலைவாய்ப்புகள்.`);
    } else if (isBPT) {
      sections.push(`🏥 **BPT (இயன்முறை சிகிச்சை - 4.5 ஆண்டுகள்):**
• கல்லூரி வளாகத்திற்குள்ளேயே அமைந்துள்ள 750 படுக்கைகள் கொண்ட SRM மருத்துவமனையில் நேரடி நோயாளிகளுடன் கூடிய செய்முறைப் பயிற்சி!
• ஆண்டுக் கட்டணம்: **₹1,10,000 – ₹1,60,000**.`);
    } else if (isMBA) {
      sections.push(`📈 **MBA மேலாண்மை படிப்பு (2 ஆண்டுகள்):**
• Finance, Marketing, HR, Business Analytics மற்றும் Logistics சிறப்புப் பிரிவுகள்.
• கார்ப்பரேட் இன்டர்ன்ஷிப் மற்றும் உயர்நிலை மேலாண்மை வேலைவாய்ப்புகள்.
• ஆண்டுக் கட்டணம்: **₹1,75,000 – ₹2,25,000**.`);
    }

    if (mentionsFees && !isCSE && !isBPT && !isMBA) {
      sections.push(`💰 **கல்விக் கட்டண விவரங்கள் (2026-27):**
• **B.Tech பொறியியல்:** ₹1,50,000 – ₹2,50,000 / ஆண்டு (பிரிவைப் பொறுத்து)
• **MBA:** ₹1,75,000 – ₹2,25,000 / ஆண்டு
• **BCA / BBA / B.Com:** ₹70,000 – ₹1,10,000 / ஆண்டு
• **BPT (Physiotherapy):** ₹1,10,000 – ₹1,60,000 / ஆண்டு
• 80%+ மதிப்பெண்களுக்கு 25%-50% வரை மெரிட் உதவித்தொகை உண்டு.`);
    }

    if (mentionsHostel) {
      sections.push(`🏠 **விடுதி & உணவு வசதிகள் (Hostel & Mess):**
• மாணவர் மற்றும் மாணவியருக்கு தனித்தனி 24/7 பாதுகாப்பான ஏசி / நான்-ஏசி விடுதிகள் (2/3/4 நபர்கள் பகிரும் வசதி).
• சுத்தமான, சத்தான தென்னிந்திய & வட இந்திய மெஸ் உணவு வழங்கப்படுகிறது.
• கட்டணம்: ஆண்டுக்கு **₹85,000 முதல் ₹1,35,000 வரை** (உணவு உட்பட). அதிவேக WiFi மற்றும் உடற்பயிற்சிக் கூடம் உண்டு.`);
    }

    if (mentionsNewsEvents) {
      sections.push(`📢 **செய்திகள் & அண்மைய நிகழ்வுகள் (News & Events):**
• **கருத்தரங்குகள் & பயிலரங்குகள்:** தேசிய மற்றும் சர்வதேச ஆராய்ச்சி மாநாடுகள், IEEE பட்டறைகள், மற்றும் தேசிய ஹேக்கத்தான்கள் வளாகத்தில் தொடர்ச்சியாக நடத்தப்படுகின்றன.
• **கலாச்சார மற்றும் தொழில்நுட்ப விழாக்கள்:** ஆண்டுதோறும் நடைபெறும் புகழ்பெற்ற 'Milan / Tarang' கலாச்சார விழா மற்றும் 'Technozion' தேசிய தொழில்நுட்ப கருத்தரங்கு.
• **சுற்றறிக்கைகள் & தேர்வுகள்:** செமஸ்டர் தேர்வு அட்டவணைகள், புதிய சேர்க்கை அறிவிப்புகள் மற்றும் கல்லூரி சுற்றறிக்கைகள் நிகழ்வுகள் பக்கத்தில் உடனுக்குடன் வெளியிடப்படுகின்றன.`);
    }

    if (mentionsPlacement && !isCSE) {
      sections.push(`💼 **வேலைவாய்ப்பு சாதனைகள் (Placements):**
• **95%+ மாணவர்களுக்கு வேலைவாய்ப்பு!**
• அதிகபட்ச சம்பள தொகுப்பு: **₹50 LPA** | சராசரி சம்பளம்: **₹8.5 LPA**.
• 600+ முன்னணி நிறுவனங்கள்: Amazon, Microsoft, Zoho, TCS, Infosys, Cognizant, Renault Nissan, Barclays.`);
    }

    if (mentionsCampus && !mentionsHostel) {
      sections.push(`🏫 **வளாக வசதிகள்:**
• திருச்சி-சென்னை NH-45 சாலையில் 50+ ஏக்கர் பசுமை சூழல்.
• வளாகத்திலேயே 750 படுக்கைகள் கொண்ட SRM சூப்பர் ஸ்பெஷாலிட்டி கற்பித்தல் மருத்துவமனை, மத்திய நூலகம் மற்றும் ஏசி பேருந்து வசதிகள்.`);
    }

    if (sections.length === 0) {
      sections.push(`🎓 **SRM IST திருச்சி சேர்க்கை 2026:**
• B.Tech (CSE, AI & DS, Cyber Security, Biotech, IT, ECE), MBA, BPT, BCA, B.Com படிப்புகளுக்கு சேர்க்கை நடைபெறுகிறது.
• B.Tech சேர்க்கைக்கு 12-ஆம் வகுப்பில் PCM பாடங்களில் 60% மதிப்பெண்கள் அவசியம்.
• 95%+ வேலைவாய்ப்புடன் அதிகபட்ச சம்பளம் ₹50 LPA.`);
    }

    let primaryLink = "";
    let contextSource = "https://www.srmtrichy.edu.in";

    if (mentionsHostel) {
      primaryLink = "🔗 [விடுதி & தங்குமிட விவரங்கள் (Hostels)](https://www.srmtrichy.edu.in/campus-life#accommodation)";
      contextSource = "https://www.srmtrichy.edu.in/campus-life#accommodation";
    } else if (mentionsNewsEvents) {
      primaryLink = "🔗 [செய்திகள் மற்றும் நிகழ்வுகள் (News & Events)](https://www.srmtrichy.edu.in/news-and-events) | [கல்வி நாள்காட்டி](https://www.srmtrichy.edu.in/academic_calendar)";
      contextSource = "https://www.srmtrichy.edu.in/news-and-events";
    } else if (mentionsPlacement) {
      primaryLink = "🔗 [வேலைவாய்ப்பு விவரங்கள் (Placements)](https://www.srmtrichy.edu.in/placement)";
      contextSource = "https://www.srmtrichy.edu.in/placement";
    } else if (isCSE || isAIDS || isBPT || isMBA) {
      primaryLink = "🔗 [பாடப்பிரிவுகள் (Programmes)](https://www.srmtrichy.edu.in/institution/programmes) | [சேர்க்கை விவரங்கள்](https://www.srmtrichy.edu.in/admission)";
      contextSource = "https://www.srmtrichy.edu.in/institution/programmes";
    } else if (mentionsFees) {
      primaryLink = "🔗 [கட்டணக் கொள்கை](https://www.srmtrichy.edu.in/admission)";
      contextSource = "https://www.srmtrichy.edu.in/admission";
    } else if (mentionsCampus) {
      primaryLink = "🔗 [வளாக வாழ்க்கை (Campus Life)](https://www.srmtrichy.edu.in/campus-life) | [உள்கட்டமைப்பு](https://www.srmtrichy.edu.in/institution/infrastructure)";
      contextSource = "https://www.srmtrichy.edu.in/campus-life";
    } else {
      primaryLink = "🔗 [இப்போதே விண்ணப்பிக்கவும்](https://admissions.srmtrichy.edu.in/) | [சேர்க்கை போர்ட்டல்](https://www.srmtrichy.edu.in/admission)";
      contextSource = "https://www.srmtrichy.edu.in/admission";
    }

    return {
      answer: sections.join("\n\n") + `\n\n${primaryLink}\n📞 SRM திருச்சி உதவி எண்: **1800 202 4565** | மின்னஞ்சல்: **admissions@srmtrichy.edu.in**`,
      source: contextSource
    };

  } else {
    // ---------------- ENGLISH DYNAMIC RESPONSE ----------------
    if (isMathsQuestion) {
      sections.push(`⚠️ **Regarding B.Tech Admission without 12th Mathematics:** As per AICTE and SRM IST norms, 10+2 with **Mathematics (PCM)** is strictly mandatory for all B.Tech branches. However, candidates without Maths can pursue careers in tech and healthcare via **BCA (Computer Applications)**, **BBA**, **B.Com**, or **BPT (Physiotherapy)**.`);
    } else if (pct !== null) {
      if (pct >= 60) {
        sections.push(`🎉 **With your score (${pct}%):** You are **fully eligible** for B.Tech ${isCSE ? "CSE" : "Engineering"} admission at SRM IST Trichy! The minimum requirement is 60% aggregate in Physics, Chemistry, and Mathematics (PCM).`);
        if (pct >= 80) {
          sections.push(`🌟 **Merit Scholarship Privilege:** Having scored ${pct}%, you qualify for a **25% to 50% tuition fee waiver** under SRM's merit scholarship program!`);
        }
      } else {
        sections.push(`ℹ️ **Marks Advisory (${pct}%):** B.Tech admission requires at least 60% in PCM. With ${pct}%, you can explore premier alternatives like **BCA (Software/Cloud)**, **BBA**, or **B.Com** with excellent corporate placement support.`);
      }
    }

    if (isCSE) {
      sections.push(`💻 **B.Tech Computer Science & Engineering (CSE):**
• Specializations in AI & ML, Cloud Computing, Cyber Security, and Full-Stack Development.
• Advanced GPU coding labs with industry partnerships (Microsoft, AWS, Oracle).
• Placements reaching up to **₹50 LPA** (Average ₹8.5 LPA) with top recruiters like Amazon, Microsoft, Zoho, and TCS.
• Annual Tuition: **₹1,75,000 – ₹2,50,000**.`);
    } else if (isAIDS) {
      sections.push(`🤖 **B.Tech AI & Data Science:**
• Curriculum covers Deep Learning, Natural Language Processing, Big Data, and Computer Vision.
• State-of-the-art NVIDIA GPU computing workstations.
• High placement demand with top packages up to ₹50 LPA.`);
    } else if (isBPT) {
      sections.push(`🏥 **BPT (Physiotherapy - 4.5 Years):**
• Direct clinical exposure with live patient rotations in the on-campus 750-bed SRM Super Specialty Hospital!
• Annual Tuition: **₹1,10,000 – ₹1,60,000**.`);
    } else if (isMBA) {
      sections.push(`📈 **MBA Program (2 Years):**
• Dual specializations in Finance, Marketing, HR, Business Analytics, and Logistics.
• Corporate leadership internships and high-placement roles.
• Annual Tuition: **₹1,75,000 – ₹2,25,000**.`);
    }

    if (mentionsFees && !isCSE && !isBPT && !isMBA) {
      sections.push(`💰 **Tuition Fee Schedule (2026-27):**
• **B.Tech:** ₹1,50,000 – ₹2,50,000 / year (by branch)
• **MBA:** ₹1,75,000 – ₹2,25,000 / year
• **BCA / BBA / B.Com:** ₹70,000 – ₹1,10,000 / year
• **BPT (Physiotherapy):** ₹1,10,000 – ₹1,60,000 / year
• Merit scholarships available for 80%+ marks (up to 50% waiver).`);
    }

    if (mentionsHostel) {
      sections.push(`🏠 **Hostel & Food Facilities:**
• Safe, separate boys' and girls' hostels with AC and Non-AC options (2/3/4 sharing).
• Hygienic South & North Indian multi-cuisine mess included.
• Cost: **₹85,000 – ₹1,35,000 / year** (inclusive of food, WiFi, gym, and 24/7 security).`);
    }

    if (mentionsNewsEvents) {
      sections.push(`📢 **News & Campus Events:**
• **Research Conferences & Symposia:** SRM IST Trichy actively conducts international research symposia, IEEE technical workshops, and national hackathons.
• **Cultural & Tech Festivities:** Annual cultural gala 'Milan / Tarang', national technical symposium 'Technozion', and state/national athletic tournaments.
• **Announcements & Schedules:** Real-time updates on semester schedules, academic calendars, placement drives, and campus achievements.`);
    }

    if (mentionsPlacement && !isCSE) {
      sections.push(`💼 **Placements at SRM IST Trichy:**
• **95%+ Placement Track Record!**
• Highest Package: **₹50 LPA** | Average Package: **₹8.5 LPA**.
• 600+ top recruiters: Amazon, Microsoft, Zoho, TCS, Infosys, Cognizant, Renault Nissan, Barclays.`);
    }

    if (mentionsCampus && !mentionsHostel) {
      sections.push(`🏫 **Campus Highlights:**
• 50+ Acre modern campus on NH-45 Trichy-Chennai highway.
• On-campus 750-bed SRM Hospital, central digital library, high-tech sports complex, and college bus fleet.`);
    }

    if (sections.length === 0) {
      sections.push(`🎓 **SRM IST Trichy Admissions 2026:**
• Admissions open for B.Tech, MBA, BPT, Allied Health, BCA, and B.Com programs.
• B.Tech requires a minimum 60% in 10+2 PCM.
• 95%+ placement record with top package of ₹50 LPA.`);
    }

    let primaryLink = "";
    let contextSource = "https://www.srmtrichy.edu.in";

    if (mentionsHostel) {
      primaryLink = "🔗 [Hostels & Accommodation Details](https://www.srmtrichy.edu.in/campus-life#accommodation)";
      contextSource = "https://www.srmtrichy.edu.in/campus-life#accommodation";
    } else if (mentionsNewsEvents) {
      primaryLink = "🔗 [Explore News & Events](https://www.srmtrichy.edu.in/news-and-events) | [Academic Calendar](https://www.srmtrichy.edu.in/academic_calendar)";
      contextSource = "https://www.srmtrichy.edu.in/news-and-events";
    } else if (mentionsPlacement) {
      primaryLink = "🔗 [View Official Placement Report](https://www.srmtrichy.edu.in/placement)";
      contextSource = "https://www.srmtrichy.edu.in/placement";
    } else if (isCSE || isAIDS || isBPT || isMBA) {
      primaryLink = "🔗 [Explore Programmes](https://www.srmtrichy.edu.in/institution/programmes) | [Admissions Portal](https://www.srmtrichy.edu.in/admission)";
      contextSource = "https://www.srmtrichy.edu.in/institution/programmes";
    } else if (mentionsFees) {
      primaryLink = "🔗 [Fee Policy & Scholarships](https://www.srmtrichy.edu.in/admission)";
      contextSource = "https://www.srmtrichy.edu.in/admission";
    } else if (mentionsCampus) {
      primaryLink = "🔗 [Explore Campus Life](https://www.srmtrichy.edu.in/campus-life) | [Infrastructure](https://www.srmtrichy.edu.in/institution/infrastructure)";
      contextSource = "https://www.srmtrichy.edu.in/campus-life";
    } else {
      primaryLink = "🔗 [Apply Online](https://admissions.srmtrichy.edu.in/) | [Admissions Portal](https://www.srmtrichy.edu.in/admission)";
      contextSource = "https://www.srmtrichy.edu.in/admission";
    }

    return {
      answer: sections.join("\n\n") + `\n\n${primaryLink}\n📞 Toll-Free Helpline: **1800 202 4565** | Email: **admissions@srmtrichy.edu.in**`,
      source: contextSource
    };
  }
}

/**
 * Post-processor: ensure all answers are strictly short, sweet, and precise
 */
export function makeShortAndSweet(text, lang = "en") {
  if (!text) return text;
  let str = String(text).trim();

  // 1. Remove verbose banner preambles & raw topic title banners
  str = str.replace(/^(🎓|📄|⭐|💡)\s*\*\*[^*]+\*\*:?\s*\n*/, "");
  str = str.replace(/^\*\*[^*]+(Admission Eligibility|விதிகள்|வழிகாட்டுதல்|Policy|Highlights|Matrix|Placements|Fees|Details)[^*]*\*\*:?\s*\n*/i, "");

  const lines = str.split("\n").map(l => l.trim()).filter(Boolean);
  const bulletLines = [];
  const nonBulletLines = [];
  const footerLines = [];

  for (const line of lines) {
    if (/^(📞|🔗|Email:|மின்னஞ்சல்:|உதவி எண்:)/i.test(line) || line.includes("1800 202 4565") || line.includes("admissions@srmtrichy.edu.in")) {
      footerLines.push(line);
    } else if (/^[•\-*🌟✓✔]/i.test(line)) {
      bulletLines.push(line);
    } else {
      nonBulletLines.push(line);
    }
  }

  // If there are bullets, keep up to 7 informative bullets
  if (bulletLines.length > 0) {
    const selectedBullets = bulletLines.slice(0, 7);
    const lead = nonBulletLines.slice(0, 2).join("\n\n");
    let out = lead ? `${lead}\n\n` : "";
    out += selectedBullets.join("\n");
    if (footerLines.length > 0) {
      const firstFoot = footerLines[0].split("|")[0].trim();
      out += `\n\n${firstFoot}`;
    }
    return out.trim();
  }

  // If it's paragraphs without bullets, limit to 4-5 concise sentences
  const paragraphs = str.split(/\n\s*\n/).filter(p => !p.startsWith("📞") && !p.startsWith("🔗"));
  if (paragraphs.length > 0) {
    let mainPara = paragraphs.slice(0, 2).join("\n\n");
    const sentences = mainPara.split(/(?<=[.!?])\s+/);
    if (sentences.length > 5) {
      mainPara = sentences.slice(0, 5).join(" ");
    }
    if (mainPara.length > 550) {
      mainPara = mainPara.slice(0, 520) + "...";
    }
    if (footerLines.length > 0) {
      const firstFoot = footerLines[0].split("|")[0].trim();
      return `${mainPara}\n\n${firstFoot}`.trim();
    }
    return mainPara.trim();
  }

  return str;
}

/**
 * Ensure language matches targetLang, otherwise translate
 */
async function ensureLanguage(res, targetLang) {
  if (!res || !res.answer) return res;
  
  // Dedicated structured resolvers (department, news, hod) format carefully curated responses
  // and must preserve their complete content and bullet structure.
  let ans = res.answer;
  if (!res.provider?.includes("resolver") && !res.provider?.includes("department") && !res.provider?.includes("news")) {
    ans = makeShortAndSweet(res.answer, targetLang);
  }

  if (targetLang === "ta" && !looksTamil(ans)) {
    ans = await translateText(ans, "ta");
  }
  return {
    ...res,
    answer: ans,
    lang: targetLang
  };
}

/**
 * Main Chat Handler: Gemini AI + High-Speed Free LLM + Intelligent Grounding Matrix
 */
export async function handleChat(message, history = [], requestedLang = "en", options = {}) {
  const raw = String(message || "").trim();
  
  // 1. Detect language directly from the message content
  const detectedFromMsg = detectLanguage(raw);

  // 2. Validate requested language
  const validLangs = ["en", "ta"];
  let lang = detectedFromMsg || (validLangs.includes(requestedLang) ? requestedLang : "en");

  // 3. If still "en", check if recent conversation in history was in Tamil
  if (lang === "en" && Array.isArray(history)) {
    for (let i = history.length - 1; i >= 0; i--) {
      const prevMsg = history[i];
      if (prevMsg && prevMsg.role === "user" && prevMsg.content) {
        const histLang = detectLanguage(prevMsg.content);
        if (histLang) {
          lang = histLang;
          break;
        }
      }
    }
  }

  if (!raw) {
    const greetings = {
      en: "Hello! I am Mozhi AI, the official SRM IST Trichy Admission Assistant. How may I assist you today?",
      ta: "வணக்கம்! நான் SRM IST திருச்சி மொழி AI (Mozhi AI) சேர்க்கை தகவல் உதவியாளர். சேர்க்கை, கட்டணம், B.Tech படிப்புகள் மற்றும் வேலைவாய்ப்பு பற்றி நீங்கள் என்னிடம் கேட்கலாம்."
    };
    return {
      answer: greetings[lang] || greetings.en,
      source: "https://www.srmtrichy.edu.in",
      lang
    };
  }

  const q = raw.toLowerCase();

  // Instant Warm Greeting (pure greetings only)
  if (/^(hi|hello|hey|vanakkam|வணக்கம்|who are you|நீ யார்|நீங்க யாரு|good (morning|afternoon|evening))[\s.!?,]*$/i.test(q)) {
    const greetingResponses = {
      en: "Hello! 👋 Welcome to SRM IST Trichy! I'm **Mozhi AI**, your official campus & admission assistant. I can help you with admissions, course eligibility, fees, ₹50 LPA placements, hostels, campus life, and news & events. What would you like to explore? [Explore Admissions](https://www.srmtrichy.edu.in/admission)",
      ta: "வணக்கம்! 👋 SRM IST திருச்சிக்கு நல்வரவு! நான் **மொழி AI (Mozhi AI)**, உங்கள் அதிகாரப்பூர்வ சேர்க்கை ஆலோசகர். சேர்க்கை, பாடப்பிரிவு தகுதிகள், கல்விக் கட்டணம், ₹50 LPA வேலைவாய்ப்பு, விடுதி மற்றும் வளாக நிகழ்வுகள் பற்றி நீங்கள் அறியலாம். [சேர்க்கை விவரங்கள் காண்க](https://www.srmtrichy.edu.in/admission)"
    };
    return {
      answer: greetingResponses[lang] || greetingResponses.en,
      source: "https://www.srmtrichy.edu.in/admission",
      lang
    };
  }

  // Instant Courteous Sign-off (pure sign-offs only)
  if (/^(thanks?|thank you|thx|நன்றி|super|awesome|good job|ok|okay|bye|see you)[\s.!?,]*$/i.test(q)) {
    const thanksResponses = {
      en: "You're very welcome! If you have any further questions about SRM IST Trichy admissions, courses, fees, placements, or hostels, feel free to ask anytime. Best wishes! 🎓",
      ta: "மிக்க மகிழ்ச்சி! SRM IST திருச்சி சேர்க்கை, கட்டணம், வேலைவாய்ப்பு, விடுதி குறித்து மேலும் ஏதேனும் சந்தேகங்கள் இருந்தால் எப்போது வேண்டுமானாலும் கேளுங்கள். உங்கள் கல்விப் பயணத்திற்கு வாழ்த்துகள்! 🎓"
    };
    return {
      answer: thanksResponses[lang] || thanksResponses.en,
      source: "https://www.srmtrichy.edu.in",
      lang
    };
  }

  // Conversational Context Follow-up (e.g. "tell me more", "explain in detail")
  if (/^(tell me more|what else|more details|explain in detail|மேலும் சொல்|விளக்கமாக சொல்)\b/i.test(q)) {
    const followup = await handleFollowup(history, lang);
    if (followup) return await ensureLanguage(followup, lang);
  }

  // Dedicated News & Events Resolver (Conferences, Symposia, Hackathons, Fests & Campus Activities)
  try {
    const newsMatch = handleNewsAndEventsQuery(raw, lang);
    if (newsMatch && newsMatch.answer) {
      return await ensureLanguage(newsMatch, lang);
    }
  } catch (newsErr) {
    console.warn("[NewsResolver] Warning:", newsErr.message);
  }

  // Dedicated Department & HoD Resolver (Department details by default; HoD only if explicitly asked)
  try {
    const deptMatch = handleDepartmentOrHodQuery(raw, lang);
    if (deptMatch && deptMatch.answer) {
      return await ensureLanguage(deptMatch, lang);
    }
  } catch (deptErr) {
    console.warn("[DeptResolver] Warning:", deptErr.message);
  }

  // 1 & 2. Check Trained FAQs and Autonomous Learned Memory (Ranked by Precision Score)
  try {
    const [faqMatch, learnedMatch] = await Promise.all([
      faqManager.matchFaq(raw, lang).catch(() => null),
      learningEngine.findLearnedMatch(raw, lang).catch(() => null)
    ]);

    if (faqMatch && learnedMatch) {
      if (learnedMatch.score > faqMatch.score) {
        return await ensureLanguage(learnedMatch, lang);
      }
      return await ensureLanguage(faqMatch, lang);
    }
    if (faqMatch && faqMatch.answer) return await ensureLanguage(faqMatch, lang);
    if (learnedMatch && learnedMatch.answer) return await ensureLanguage(learnedMatch, lang);
  } catch (matchErr) {
    console.warn("[Matcher] FAQ/Learning check warning:", matchErr.message);
  }

  let responseResult = null;

  // 3. PDF Vector Database RAG (Retrieval-Augmented Generation from Official Documents)
  try {
    const ragResult = await ragEngine.generateAnswer(raw, history, lang, options.apiKey);
    if (ragResult && ragResult.answer) {
      responseResult = ragResult;
    }
  } catch (ragErr) {
    console.warn("[RAG] Vector retrieval fallback:", ragErr.message);
  }

  // 4. Refer Official Website https://www.srmtrichy.edu.in/
  if (!responseResult) {
    try {
      const webRes = await referSrmWebsite(raw, lang);
      if (webRes && webRes.answer) {
        responseResult = webRes;
      }
    } catch (webErr) {
      console.warn("[SrmWeb] Referral fallback:", webErr.message);
    }
  }

  // 4. Google Gemini API (gemini-2.0-flash / gemini-1.5-flash)
  if (!responseResult) {
    const geminiRes = await callGemini(raw, history, lang, options.apiKey);
    if (geminiRes && geminiRes.answer) {
      responseResult = {
        answer: geminiRes.answer,
        source: geminiRes.source || getContextualSource(raw),
        provider: "gemini"
      };
    }
  }

  // 5. Secondary: High-Speed Free LLM
  if (!responseResult) {
    const freeLLMRes = await callFreeLLM(raw, lang);
    if (freeLLMRes && freeLLMRes.answer) {
      responseResult = {
        answer: freeLLMRes.answer,
        source: freeLLMRes.source || getContextualSource(raw),
        provider: "neural-free"
      };
    }
  }

  // 6. Grounded Topic Match
  if (!responseResult) {
    const topicMatch = await findTopicFallback(raw, lang);
    if (topicMatch) {
      responseResult = {
        ...topicMatch,
        source: topicMatch.source || getContextualSource(raw),
        provider: "knowledge-base"
      };
    }
  }

  // 7. Intelligent Dynamic Semantic Synthesizer
  if (!responseResult) {
    const synth = synthesizeResponse(raw, lang);
    if (synth && synth.answer) {
      responseResult = {
        ...synth,
        source: synth.source || getContextualSource(raw),
        provider: "dynamic-ai"
      };
    }
  }

  // 8. Catch-all
  if (!responseResult) {
    responseResult = {
      answer: "Welcome to SRM IST Trichy! For complete admissions guidance, programs, and campus details, please contact admissions toll-free at 1800 202 4565 or email admissions@srmtrichy.edu.in.",
      source: getContextualSource(raw),
      provider: "fallback"
    };
  }

  // --- CONTINUOUS ACTIVE LEARNING STEP ---
  // When a user asks a new question, the model automatically learns it!
  try {
    if (raw.length >= 8 && responseResult.answer && !responseResult.answer.includes("Welcome to SRM IST Trichy! For complete admissions guidance")) {
      await learningEngine.learn(raw, responseResult.answer, lang, {
        source: responseResult.source,
        provider: responseResult.provider
      });
    }
  } catch (learnSaveErr) {
    console.warn("[LearningEngine] Auto-learn save error:", learnSaveErr.message);
  }

  return await ensureLanguage(responseResult, lang);
}

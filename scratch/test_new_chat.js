// Prototype testing for comprehensive multi-topic SRM Trichy Chatbot
const TOPICS = [
  {
    id: "marks_eligibility",
    patterns: [/(can i get|eligibility|chance|seat|cutoff|cut off|admission with|marks?|percentage|%)\b.*(admission|seat|b\.?tech|cse|join|get in)/i, /(75%|80%|60%|70%|85%|90%)\s*(marks?|percentage|%|la|la seat)/i, /மதிப்பெண்.*சேர்க்கை|சேர முடியுமா/i],
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

Apply online: [srmtrichy.edu.in/admission](https://www.srmtrichy.edu.in/admission) | Toll-Free: 📞 1800 202 4565.`
  },
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
• **Real-Time Tracking:** Daily attendance is updated on the SRM Student ERP portal for both students and parents to monitor.`
  },
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
• **Identity Cards:** SRM Student ID card must be worn visibly at all times within the campus.`
  },
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
• **Modern Pedagogy:** Interactive smart classrooms, experiential lab sessions, and curriculum aligned with industry 4.0 demands.`
  },
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
• **Emergency Grievance Redressal:** Students can report any concerns confidentially to the dean's office or via the national toll-free anti-ragging helpline.`
  },
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
• **Festivals & Events:** Grand annual cultural fest 'Milan / Tarang' and national technical symposium 'Technozion'.`
  },
  {
    id: "cse_department",
    patterns: [/cse\s*department|computer science department|cse\s*lab|about cse|cse\s*branch|கணினி\s*அறிவியல்\s*துறை/i],
    ta: `**SRM IST திருச்சி — கணினி அறிவியல் மற்றும் பொறியியல் துறை (CSE Department):**

• **பாடத்திட்டம்:** Full-Stack Web Development, Data Structures & Algorithms, Cloud Computing, Cyber Security, Artificial Intelligence மற்றும் IoT.
• **அதிநவீன ஆய்வகங்கள்:** அதிவேக இணையம் மற்றும் உயர் செயல்திறன் கொண்ட கணினிகளுடன் கூடிய நவீன கோடிங் லேப்கள்.
• **தொழில்துறை ஒத்துழைப்பு:** Microsoft, AWS, Oracle, IBM உள்ளிட்ட முன்னணி நிறுவனங்களுடன் இணைந்து சான்றிதழ் பயிற்சிகள்.
• **வேலைவாய்ப்பு சாதனைகள்:** CSE மாணவர்களுக்கு ஆண்டுக்கு அதிகபட்சமாக **₹50 LPA** வரையிலும், சராசரியாக **₹8.5 LPA** சம்பளத்திலும் வேலைவாய்ப்புகள் கிடைக்கின்றன (Amazon, Zoho, Microsoft, TCS, Infosys).`,
    en: `**Department of Computer Science & Engineering (CSE) at SRM IST Trichy:**

• **Cutting-Edge Curriculum:** Covers Full-Stack Development, Data Structures, Cloud Computing, AI & Machine Learning, Cyber Security, and DevOps.
• **Hi-Tech Computing Labs:** State-of-the-art computer labs with high-speed fiber internet, Linux/Windows environments, and GPU workstations.
• **Industry Partnerships:** Collaborative training and certifications with AWS, Microsoft, Oracle, and IBM.
• **Placement Records:** CSE students receive top packages up to **₹50 LPA**, with average packages of **₹8.5 LPA** from recruiters like Amazon, Microsoft, Zoho, TCS, and Infosys.`
  },
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
• **Hostel In-Timings:** Students staying in hostels must return by 8:00 PM.`
  },
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
• **Campus Wi-Fi:** High-speed Wi-Fi access is available throughout academic blocks and hostels for registered student devices.`
  }
];

function matchTopic(q, lang) {
  const query = q.toLowerCase();
  for (const t of TOPICS) {
    if (t.negativePatterns && t.negativePatterns.some(np => np.test(query))) {
      continue;
    }
    if (t.patterns.some(p => p.test(query))) {
      return lang === 'en' ? t.en : t.ta;
    }
  }
  return null;
}

const testQuestions = [
  'how is the campus life?',
  'what is the dress code?',
  'how are the teachers and faculty?',
  'is 75% attendance compulsory?',
  'tell me about cse department',
  'can i get admission in cse with 75% marks?',
  'is there any ragging in college?',
  'what are the college timings?',
  'is laptop necessary for cse?'
];

console.log('Testing new topic matcher:');
testQuestions.forEach(q => {
  const match = matchTopic(q, 'ta');
  console.log(`Q: "${q}" -> Found match? ${match ? 'YES' : 'NO'}`);
  if (match) {
    console.log(`   Preview: ${match.slice(0, 70).replace(/\n/g, ' ')}...`);
  }
});

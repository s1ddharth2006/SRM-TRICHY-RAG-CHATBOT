/**
 * SRM IST Trichy - Official News & Events Query Resolver
 * 
 * Sources: 
 * - https://www.srmtrichy.edu.in/news-and-events
 * - Official CMS Endpoints (167+ verified campus events)
 */

export const NEWS_OVERVIEW = {
  en: `**Latest News, Events & Activities at SRM IST Tiruchirappalli:**

SRM IST Trichy is an active hub of national conferences, technical hackathons, industry symposiums, and cultural festivals:

• **Flagship Technical & Academic Events:**
  - **TENSOR’26:** 24-Hour AI & Software Innovation Hackathon tackling 200 real-world problem statements (Organized by Dr. R. Balaji Ganesh, AI & DS).
  - **Project Fiesta 2026:** Mega showcase of in-house student engineering projects (Organized by Dr. S. Kanaga Suba Raja, HoD CSE).
  - **Inauguration of Oracle Centre of Excellence:** World-class enterprise database and cloud analytics suite.
  - **ICIDDM 2K25:** International Conference on Interactive Design & Digital Manufacturing (School of Mechanical Engineering).
  - **AICTE-ATAL FDP on Sustainable Hydrogen Energy:** 1-week national faculty training on green hydrogen technology.
  - **8 Patents Published by EEE Students:** Prestigious student research achievement across electrical power systems.
  - **iOS App Development using Swift:** Native Apple development workshop at the Apple iMac Centre of Excellence.

• **Healthcare & Medical Conferences:**
  - **REVIVE ‘24:** 1st National Physiotherapy Conference bringing together 500+ clinical rehabilitation experts.
  - **DIACON2K26 & PERFUSE 2K26:** National conferences in Renal Dialysis and Cardiac Perfusion Technologies.
  - **National Conference on Sensory Integration & Hand Splinting:** Specialized pediatric and orthopedic rehab programs.

• **Management & Business Meets:**
  - **CONFLUENCE 2K25:** National management symposium hosted by Faculty of Management Studies (DoMS).
  - **RASRA NG 2025 (IPL Auction):** Strategic bidding and team management tournament.

• **Campus Life, Culture & Sports:**
  - **Milan & Tarang:** Annual national-level cultural festivals and inter-collegiate technical symposia.
  - **Project Day & Sports Day:** University-wide multi-day expos and athletic tournaments at the SRM sports arena.

🌐 **Explore All 167+ Live Campus Events:** [srmtrichy.edu.in/news-and-events](https://www.srmtrichy.edu.in/news-and-events)`,

  ta: `**SRM IST திருச்சி — சமீபத்திய செய்திகள் மற்றும் நிகழ்வுகள் (News & Events):**

SRM IST திருச்சி வளாகத்தில் தேசிய மாநாடுகள், ஹேக்கத்தான்கள், துறைசார் கருத்தரங்குகள் மற்றும் கலாச்சார விழாக்கள் தொடர்ந்து நடைபெற்று வருகின்றன:

• **முக்கிய தொழில்நுட்ப & கல்வி நிகழ்வுகள்:**
  - **TENSOR’26:** செயற்கை நுண்ணறிவு (AI) துறையின் 24-மணி நேர மெகா ஹேக்கத்தான் (முனைவர் R. பாலாஜி கணேஷ் ஒருங்கிணைப்பில்).
  - **Project Fiesta 2026:** மாணவர்கள் உருவாக்கிய புத்தாக்க தொழில்நுட்ப திட்டங்களின் மெகா கண்காட்சி (CSE HoD முனைவர் S. கனக சுப ராஜா தலைமையில்).
  - **Oracle சிறப்பு மையம் தொடக்க விழா:** மேம்பட்ட தரவுத்தளம் மற்றும் கிளவுட் கம்ப்யூட்டிங் மையம்.
  - **ICIDDM 2K25:** இயந்திரவியல் துறையின் சர்வதேச டிஜிட்டல் உற்பத்தி மாநாடு.
  - **நிலையான ஹைட்ரஜன் ஆற்றல் AICTE-ATAL FDP:** பசுமை ஆற்றல் குறித்த ஒரு வார தேசிய ஆசிரியர் பயிற்சி.
  - **EEE மாணவர்களின் 8 காப்புரிமைகள் (Patents):** மின் மற்றும் மின்னணுவியல் மாணவர்களின் சாதனை.
  - **Apple iMac Swift iOS பட்டறை:** Apple iMac மையத்தில் நடைபெற்ற iOS ஆப் மேம்பாட்டு பயிற்சி.

• **மருத்துவம் மற்றும் சுகாதார மாநாடுகள்:**
  - **REVIVE ‘24:** இயன்முறை சிகிச்சைக் கல்லூரியின் முதலாவது தேசிய மறுவாழ்வு மாநாடு (500+ மருத்துவ நிபுணர்கள் பங்கேற்பு).
  - **DIACON2K26 & PERFUSE 2K26:** சிறுநீரக டயாலிசிஸ் மற்றும் இருதய பெர்ஃப்யூஷன் தேசிய மாநாடுகள்.
  - **சென்சரி இன்டகிரேஷன் தேசிய மாநாடு:** தொழில் சிகிச்சை (OT) துறையின் சிறப்பு குழந்தைகள் மறுவாழ்வு கருத்தரங்கம்.

• **மேலாண்மை & வணிக நிகழ்வுகள்:**
  - **CONFLUENCE 2K25 & RASRA NG (IPL Auction):** DoMS மேலாண்மை துறையின் வர்த்தக உத்தி மற்றும் ஏல போட்டிகள்.

• **கலாச்சாரம் & விளையாட்டு:**
  - **மிலன் (Milan) & தரங் (Tarang):** தென்னிந்திய அளவிலான மாபெரும் கல்லூரி கலை விழா.
  - **திட்ட நாள் (Project Day) & விளையாட்டு நாள் (Sports Day):** வளாக அளவிலான விளையாட்டு மற்றும் அறிவியல் கண்காட்சிகள்.

🌐 **முழு நிகழ்வுகள் விவரம்:** [srmtrichy.edu.in/news-and-events](https://www.srmtrichy.edu.in/news-and-events)`
};

export const SPECIFIC_EVENTS = [
  // 1. TENSOR'26
  {
    id: "tensor_26",
    matcher: /(?:\b(tensor['’]?\s*26|tensor)\b|டென்சர்)/i,
    en: `**TENSOR’26: Where Innovation Met Endurance!**
• **Organized by:** Dr. R. Balaji Ganesh (Associate Professor, Department of Artificial Intelligence & Data Science).
• **Category:** AI & Software Engineering Hackathon.
• **Venue:** SRM-IST Tiruchirappalli Campus.
• **Highlights:** An intensive 24-hour sprint tackling over 200 real-world industry problem statements. Students developed autonomous machine learning models, computer vision neural networks, and generative AI software pipelines under tight deadlines.
🌐 [srmtrichy.edu.in/news-and-events](https://www.srmtrichy.edu.in/news-and-events)`,
    ta: `**TENSOR’26: புத்தாக்கமும் உறுதியும் இணைந்த மாபெரும் தளம்!**
• **ஒருங்கிணைப்பாளர்:** முனைவர் R. பாலாஜி கணேஷ் (AI & Data Science துறை).
• **பிரிவு:** 24-மணி நேர செயற்கை நுண்ணறிவு மற்றும் மென்பொருள் ஹேக்கத்தான்.
• **இடம்:** SRM IST திருச்சி வளாகம்.
• **சிறப்பம்சங்கள்:** 200-க்கும் மேற்பட்ட தொழில் நிறுவனங்களின் சவால்களுக்கு மாணவர்கள் விடிய விடிய ஆழ்கற்றல், கணினி பார்வை மற்றும் ஜெனரேட்டிவ் AI மென்பொருள் தீர்வுகளை உருவாக்கினர்.
🌐 [srmtrichy.edu.in/news-and-events](https://www.srmtrichy.edu.in/news-and-events)`
  },

  // 2. Project Fiesta 2026
  {
    id: "project_fiesta",
    matcher: /(?:\b(project\s*fiesta(\s*2026)?)\b|ப்ராஜெக்ட்\s*ஃபியஸ்டா)/i,
    en: `**Project Fiesta 2026 – A Mega Showcase of Innovation**
• **Organized by:** Dr. S. Kanaga Suba Raja (Professor & HoD, Computer Science and Engineering).
• **Date:** April 15, 2026 | **Venue:** SRM IST Seminar Hall.
• **Overview:** An intra-university mega project expo where final-year and pre-final year CSE students presented live working prototypes across Blockchain, Cyber Security, Cloud Computing, IoT, and Full-Stack Engineering before corporate judges.
🌐 [srmtrichy.edu.in/departments/cse](https://www.srmtrichy.edu.in/departments/cse)`,
    ta: `**Project Fiesta 2026 – மாணவர் கண்டுபிடிப்புகளின் மெகா கண்காட்சி**
• **ஒருங்கிணைப்பாளர்:** முனைவர் S. கனக சுப ராஜா (பேராசிரியர் & HoD, CSE துறை).
• **தேதி:** ஏப்ரல் 15, 2026 | **இடம்:** SRM IST கருத்தரங்கு கூடம்.
• **விவரம்:** கணினி அறிவியல் மாணவர்கள் உருவாக்கிய பிளாக்செயின், சைபர் செக்யூரிட்டி, கிளவுட் கம்ப்யூட்டிங், IoT மற்றும் முழு-ஸ்டேக் மென்பொருள் மாதிரிகளை தொழில் நிறுவன நடுவர்கள் முன் காட்சிப்படுத்திய பிரம்மாண்ட நிகழ்வு.
🌐 [srmtrichy.edu.in/departments/cse](https://www.srmtrichy.edu.in/departments/cse)`
  },

  // 3. Oracle Centre of Excellence
  {
    id: "oracle_coe",
    matcher: /(?:\b(oracle(\s*centre\s*of\s*excellence|\s*coe)?)\b|ஆரக்கிள்)/i,
    en: `**Inauguration of Oracle Centre of Excellence**
• **Conducted by:** School of Computing, SRM IST Tiruchirappalli.
• **Date:** February 19, 2026 | **Venue:** Oracle Centre of Excellence Lab, SRM IST.
• **Significance:** Sets up high-performance Oracle Cloud Infrastructure, Autonomous Databases, Java Enterprise tools, and ERP applications for student hands-on mastery and industry certification.
🌐 [srmtrichy.edu.in/departments/cse](https://www.srmtrichy.edu.in/departments/cse)`,
    ta: `**Oracle சிறப்பு மையம் (Oracle Centre of Excellence) தொடக்க விழா**
• **நடத்திய புலம்:** SRM IST திருச்சி கம்ப்யூட்டிங் பள்ளி (School of Computing).
• **தேதி:** பிப்ரவரி 19, 2026 | **இடம்:** Oracle சிறப்பு மையம் ஆய்வகம்.
• **முக்கியத்துவம்:** Oracle கிளவுட், தானியங்கி டேட்டாபேஸ் மற்றும் ERP தொழில்நுட்பங்களில் மாணவர்கள் நேரடி பயிற்சி பெற்று சான்றிதழ் பெற அமைக்கப்பட்ட சர்வதேச ஆய்வு மையம்.
🌐 [srmtrichy.edu.in/departments/cse](https://www.srmtrichy.edu.in/departments/cse)`
  },

  // 4. ICIDDM 2K25 (Mechanical Engineering Conference)
  {
    id: "iciddm_2k25",
    matcher: /\b(iciddm(\s*2k25)?|interactive\s*design\s*and\s*digital\s*manufacturing)\b/i,
    en: `**International Conference on Interactive Design and Digital Manufacturing (ICIDDM 2K25)**
• **Conducted by:** School of Mechanical Engineering, SRM IST Tiruchirappalli.
• **Mode & Venue:** Two-day hybrid mode (April 11–12, 2025) at SRM IST Trichy.
• **Highlights:** International scholars and industry delegates discussed additive manufacturing, digital twins, robotics, aerospace lightweight composites, and Industry 4.0 automation.
🌐 [srmtrichy.edu.in/departments/mechanical](https://www.srmtrichy.edu.in/departments/mechanical)`,
    ta: `**ICIDDM 2K25 சர்வதேச மாநாடு (Interactive Design & Digital Manufacturing)**
• **நடத்திய துறை:** இயந்திரவியல் பொறியியல் பள்ளி (School of Mechanical Engineering).
• **தேதி:** ஏப்ரல் 11–12, 2025 | நேரடி மற்றும் இணைய வழியில் நடைபெற்றது.
• **சிறப்பம்சங்கள்:** 3D பிரிண்டிங், டிஜிட்டல் இரட்டையர்கள் (Digital Twins), ரோபோட்டிக்ஸ் மற்றும் ஆட்டோமேஷன் குறித்த உலகளாவிய ஆய்வுக் கட்டுரைகள் சமர்ப்பிக்கப்பட்டன.
🌐 [srmtrichy.edu.in/departments/mechanical](https://www.srmtrichy.edu.in/departments/mechanical)`
  },

  // 5. Sustainable Hydrogen Energy AICTE-ATAL FDP
  {
    id: "hydrogen_fdp",
    matcher: /(?:\b(hydrogen(\s*energy)?|sustainable\s*hydrogen|aicte[- ]atal\s*fdp)\b|ஹைட்ரஜன்)/i,
    en: `**AICTE-ATAL One-Week FDP on Sustainable Hydrogen Energy: Technology, Innovation, and Entrepreneurship**
• **Conducted by:** School of Mechanical Engineering, SRM IST Tiruchirappalli (Dr. S. Hemanth).
• **Funding:** Sponsored by AICTE Training and Learning (ATAL) Academy.
• **Theme:** Green hydrogen generation, fuel cell electric vehicles (FCEVs), hydrogen storage, safety compliance, and zero-emission entrepreneurship.
🌐 [srmtrichy.edu.in/departments/mechanical](https://www.srmtrichy.edu.in/departments/mechanical)`,
    ta: `**நிலையான ஹைட்ரஜன் ஆற்றல்: AICTE-ATAL ஒரு வார ஆசிரியர் பயிற்சி திட்டம் (FDP)**
• **நடத்திய துறை:** இயந்திரவியல் பொறியியல் பள்ளி (முனைவர் S. ஹேமந்த் ஒருங்கிணைப்பில்).
• **ஸ்பான்சர்:** மத்திய அரசின் AICTE Training and Learning (ATAL) அகாடமி.
• **தலைப்பு:** பசுமை ஹைட்ரஜன் உற்பத்தி, ஃப்யூல் செல் வாகனங்கள் (FCEVs), மற்றும் பூஜ்ஜிய-கார்பன் தொழில்முனைவு.
🌐 [srmtrichy.edu.in/departments/mechanical](https://www.srmtrichy.edu.in/departments/mechanical)`
  },

  // 6. 8 Patents Published by EEE Students
  {
    id: "eee_patents",
    matcher: /(?:\b(8\s*patents?|patents?(\s*(published|by\s*eee))?)\b|காப்புரிமை)/i,
    en: `**Heartiest Congratulations: 8 Patents Published by EEE Students!**
• **Department:** Department of Electrical and Electronics Engineering (EEE), SRMIST Tiruchirappalli.
• **Achievement:** Undergraduate and postgraduate engineering students from EEE filed and successfully had 8 national research patents officially published in the Indian Patent Journal, covering smart energy grids, IoT monitoring, and EV charging infrastructure.
🌐 [srmtrichy.edu.in/departments/eee](https://www.srmtrichy.edu.in/departments/eee)`,
    ta: `**பாராட்டுகள்: EEE மாணவர்கள் வெளியிட்ட 8 தேசிய காப்புரிமைகள் (Patents)!**
• **துறை:** மின் மற்றும் மின்னணுவியல் பொறியியல் துறை (EEE), SRMIST திருச்சி.
• **சாதனை:** ஸ்மார்ட் மின் கிரிட், IoT சாதனங்கள் மற்றும் எலக்ட்ரிக் வாகன சார்ஜிங் தொழில்நுட்பங்களில் EEE மாணவர்கள் மேற்கொண்ட ஆராய்ச்சிகளுக்காக இந்திய காப்புரிமை அலுவலகத்தால் 8 காப்புரிமைகள் வெளியிடப்பட்டுள்ளன.
🌐 [srmtrichy.edu.in/departments/eee](https://www.srmtrichy.edu.in/departments/eee)`
  },

  // 7. SPICE SURGE & Green Tech Challenge
  {
    id: "spice_surge",
    matcher: /\b(spice\s*surge|ltspice|electronova|voltex|green\s*tech\s*challenge)\b/i,
    en: `**SPICE SURGE & Green Tech Challenge (EEE Department Innovation Events)**
• **Organized by:** Department of EEE under the **VoltEx Innovation Club** and **ELECTRONOVA**.
• **Contest:**
  - **SPICE SURGE:** Hands-on LTspice simulation tournament evaluating analog circuits, power filters, and transient response (Student Coordinators: Yezhilvanan H and B.V.G.V. Lohith Kumar).
  - **Green Tech Challenge:** Sustainable clean energy model design challenge addressing carbon-neutral campus solutions.
🌐 [srmtrichy.edu.in/departments/eee](https://www.srmtrichy.edu.in/departments/eee)`,
    ta: `**SPICE SURGE & கிரீன் டெக் சேலஞ்ச் (EEE துறை புத்தாக்க நிகழ்வுகள்)**
• **ஒருங்கிணைப்பு:** EEE துறையின் **VoltEx Innovation Club** மற்றும் **ELECTRONOVA**.
• **நிகழ்வுகள்:**
  - **SPICE SURGE:** LTspice மின்சுற்று அனலாக் சர்க்யூட் வடிவமைப்பு மற்றும் உருவகப்படுத்துதல் போட்டி.
  - **கிரீன் டெக் சேலஞ்ச்:** சுற்றுச்சூழல் நட்பு மற்றும் பசுமை மின்னாற்றல் சாதனங்கள் உருவாக்கும் போட்டி.
🌐 [srmtrichy.edu.in/departments/eee](https://www.srmtrichy.edu.in/departments/eee)`
  },

  // 8. iOS App Development using Swift
  {
    id: "ios_swift_workshop",
    matcher: /\b(ios\s*app|swift\s*workshop|apple\s*imac\s*lab\s*event)\b/i,
    en: `**iOS App Development using Swift Workshop**
• **Conducted by:** Ms. R. Sharanya at the **iOS App Development Studio / Apple iMac Centre of Excellence**.
• **Focus:** Native iOS development, Swift syntax, Xcode IDE, SwiftUI components, Apple Developer certificates, and mobile app deployment to the App Store.
🌐 [srmtrichy.edu.in/institution/engineering-and-technology#infrastructure](https://www.srmtrichy.edu.in/institution/engineering-and-technology#infrastructure)`,
    ta: `**Swift மொழி மூலம் iOS ஆப் மேம்பாட்டு பட்டறை (iOS App Development Workshop)**
• **நடத்தியவர்:** திருமதி R. சரண்யா (Apple iMac சிறப்பு மையம்).
• **பயிற்சி:** Swift புரோகிராமிங், Xcode தளம், SwiftUI கூறுகள் மற்றும் App Store-ல் செயலிகளை வெளியிடும் தொழில்முறை பயிற்சி.
🌐 [srmtrichy.edu.in/institution/engineering-and-technology#infrastructure](https://www.srmtrichy.edu.in/institution/engineering-and-technology#infrastructure)`
  },

  // 9. REVIVE '24 (Physiotherapy National Conference)
  {
    id: "revive_24",
    matcher: /\b(revive(\s*['’]?24)?|physiotherapy\s*conference)\b/i,
    en: `**1st National Physiotherapy Conference – REVIVE ‘24**
• **Conducted by:** SRM College of Physiotherapy, SRM IST Tiruchirappalli.
• **Participation:** Over 500 delegates including clinical physiotherapists, orthopaedic surgeons, and postgraduate scholars across India.
• **Focus Areas:** Advanced musculoskeletal mobilization, neuro-rehab robotics, sports injury recovery protocols, and evidence-based clinical practices.
🌐 [srmtrichy.edu.in/institution/physiotherapy](https://www.srmtrichy.edu.in/institution/physiotherapy)`,
    ta: `**REVIVE ‘24 முதலாவது தேசிய இயன்முறை சிகிச்சை மாநாடு**
• **நடத்திய கல்லூரி:** SRM இயன்முறை சிகிச்சைக் கல்லூரி (College of Physiotherapy).
• **பங்கேற்பு:** இந்தியா முழுவதிலுமிருந்து 500-க்கும் மேற்பட்ட இயன்முறை மருத்துவர்கள் மற்றும் பேராசிரியர்கள்.
• **முக்கிய கருப்பொருள்கள்:** தசைக்கூடு சீரமைப்பு, நரம்பியல் மறுவாழ்வு ரோபோட்டிக்ஸ் மற்றும் விளையாட்டு காயங்கள் மீட்பு முறைகள்.
🌐 [srmtrichy.edu.in/institution/physiotherapy](https://www.srmtrichy.edu.in/institution/physiotherapy)`
  },

  // 10. Physio-Tech '26 & Spinal Manipulation Workshop
  {
    id: "physio_tech_26",
    matcher: /\b(physio[- ]tech|spinal\s*manipulation|sacro[- ]iliac)\b/i,
    en: `**National Physiotherapy Symposiums: Physio-Tech’26 & Sacro-Iliac Spinal Manipulation Workshop**
• **Conducted by:** SRM College of Physiotherapy.
• **Highlights:**
  - **Physio-Tech’26:** Explored robotic gait trainers, electrotherapy biofeedback, and virtual reality stroke rehabilitation.
  - **Spinal Manipulation Workshop:** Intensive hands-on cadaveric and clinical biomechanics training focusing specifically on Sacro-Iliac joint mobilization techniques.
🌐 [srmtrichy.edu.in/institution/physiotherapy](https://www.srmtrichy.edu.in/institution/physiotherapy)`,
    ta: `**Physio-Tech’26 கருத்தரங்கு மற்றும் ஸ்பைனல் மேனிபுலேஷன் சிறப்புப் பயிற்சி**
• **நடத்திய கல்லூரி:** SRM இயன்முறை சிகிச்சைக் கல்லூரி.
• **சிறப்பம்சங்கள்:**
  - **Physio-Tech’26:** ரோபோடிக் நடைப் பயிற்சி, மின்சிகிச்சை பயோ-ஃபீட்பேக் மற்றும் VR பக்கவாத மறுவாழ்வு.
  - **Sacro-Iliac ஜாயிண்ட் பயிற்சி:** முதுகுத்தண்டு மற்றும் இடுப்பு மூட்டு சீரமைப்பு செயல்முறை பயிற்சி.
🌐 [srmtrichy.edu.in/institution/physiotherapy](https://www.srmtrichy.edu.in/institution/physiotherapy)`
  },

  // 11. DIACON2K26 & PERFUSE 2K26
  {
    id: "diacon_perfuse",
    matcher: /\b(diacon(\s*2k26)?|perfuse(\s*2k26)?|cpr\s*week)\b/i,
    en: `**DIACON2K26, PERFUSE 2K26 & National CPR Week (Allied Health Sciences)**
• **Conducted by:** College of Allied Health Sciences, SRM IST Tiruchirappalli.
• **Events:**
  - **DIACON2K26:** National Conference on advanced Renal Dialysis Technology, artificial kidney innovations, and hemodialysis management.
  - **PERFUSE 2K26:** Cardiac Perfusion Technology symposium featuring ECMO and cardiopulmonary bypass heart-lung machine demonstrations.
  - **National CPR Week:** Hands-on emergency cardiopulmonary resuscitation simulation drills conducted for students and faculty.
🌐 [srmtrichy.edu.in/institution/allied-health-sciences](https://www.srmtrichy.edu.in/institution/allied-health-sciences)`,
    ta: `**DIACON2K26, PERFUSE 2K26 மற்றும் தேசிய CPR வாரம் (Allied Health Sciences)**
• **நடத்திய கல்லூரி:** SRM தொடர்புடைய சுகாதார அறிவியல் கல்லூரி.
• **நிகழ்வுகள்:**
  - **DIACON2K26:** சிறுநீரக டயாலிசிஸ் மற்றும் செயற்கை சிறுநீரக தொழில்நுட்பங்கள் குறித்த தேசிய மாநாடு.
  - **PERFUSE 2K26:** இதயம்-நுரையீரல் மெஷின் (ECMO) மற்றும் கார்டியாக் பெர்ஃப்யூஷன் மாநாடு.
  - **தேசிய CPR வாரம்:** அவசர கால உயிர்காக்கும் CPR நேரடி செயல்முறை பயிற்சி.
🌐 [srmtrichy.edu.in/institution/allied-health-sciences](https://www.srmtrichy.edu.in/institution/allied-health-sciences)`
  },

  // 12. CONFLUENCE 2K25 & RASRA NG IPL Auction
  {
    id: "confluence_rasra",
    matcher: /\b(confluence(\s*2k25)?|rasra(\s*ng)?|ipl\s*auction|exemplar)\b/i,
    en: `**CONFLUENCE 2K25 & RASRA NG (IPL Auction Management Tournaments)**
• **Conducted by:** Faculty of Management Studies (DoMS), SRM IST Tiruchirappalli.
• **Events:**
  - **CONFLUENCE 2K25:** National flagship business conclave featuring executive panel discussions, marketing crisis simulations, and business plan ideations.
  - **RASRA NG 2025 (Player Pursuit - IPL Auction):** Live mock player auction testing financial risk analysis, salary cap strategy, and negotiations.
🌐 [srmtrichy.edu.in/institution/management-studies](https://www.srmtrichy.edu.in/institution/management-studies)`,
    ta: `**CONFLUENCE 2K25 & RASRA NG IPL ஏல மேலாண்மை போட்டிகள் (DoMS)**
• **நடத்திய புலம்:** மேலாண்மைப் புலம் (DoMS - MBA & BBA), SRM IST திருச்சி.
• **நிகழ்வுகள்:**
  - **CONFLUENCE 2K25:** தொழில் நிறுவன தலைவர்கள் பங்கேற்ற தேசிய மேலாண்மை கருத்தரங்கு.
  - **RASRA NG 2025 (IPL Auction):** பட்ஜெட் திட்டமிடல் மற்றும் உத்தி சார்ந்த நேரடி கிரிக்கெட் வீரர்கள் ஏல மேலாண்மை போட்டி.
🌐 [srmtrichy.edu.in/institution/management-studies](https://www.srmtrichy.edu.in/institution/management-studies)`
  },

  // 13. Milan & Tarang Cultural Festivals
  {
    id: "milan_tarang",
    matcher: /\b(milan|tarang|cultural\s*fest|கலாச்சார\s*விழா)\b/i,
    en: `**Milan & Tarang – National Cultural & Arts Festivals at SRM IST Trichy**
• **Milan:** South India's celebrated inter-collegiate mega cultural festival, drawing students from 100+ universities for western dance, classical music, theatrical drama, fashion walks, and live celebrity musical concerts.
• **Tarang:** University-wide multi-disciplinary talent meet and technical exhibition.
• **Other Celebrations:** Freshers Inauguration, Onam Festival, Ayudha Pooja, Pongal, Christmas, and National Sports Day.
🌐 [srmtrichy.edu.in/campus-life](https://www.srmtrichy.edu.in/campus-life)`,
    ta: `**மிலன் (Milan) & தரங் (Tarang) — மாபெரும் கலை & கலாச்சார விழாக்கள்**
• **மிலன் (Milan):** 100-க்கும் மேற்பட்ட பல்கலைக்கழகங்களைச் சேர்ந்த ஆயிரக்கணக்கான மாணவர்கள் பங்கேற்கும் தென்னிந்தியாவின் முன்னணி கலாச்சார விழா. இதில் நடனம், இசை, ஃபேஷன் ஷோ மற்றும் பிரபல பாடகர்களின் இசைக்கச்சேரிகள் நடைபெறும்.
• **தரங் (Tarang):** மாணவர்களின் கலை மற்றும் அறிவியல் திறமைகளை வெளிப்படுத்தும் வளாக விழா.
• **பிற விழாக்கள்:** ஓணம், ஆயுத பூஜை, பொங்கல், கிறிஸ்துமஸ் மற்றும் விளையாட்டு தின விழாக்கள்.
🌐 [srmtrichy.edu.in/campus-life](https://www.srmtrichy.edu.in/campus-life)`
  },

  // 14. Project Day
  {
    id: "project_day",
    matcher: /\b(project\s*day|project\s*expo|திட்ட\s*நாள்)\b/i,
    en: `**Project Day & Multi-Disciplinary Innovation Expo**
• **Conducted by:** SRM IST Trichy Campus (Engineering, Physiotherapy, Management).
• **Overview:** Interactive academic exhibition where hundreds of undergraduate and postgraduate students display working hardware prototypes, software solutions, research posters, and healthcare devices to peer scholars, faculty, and industry leaders.
🌐 [srmtrichy.edu.in/news-and-events](https://www.srmtrichy.edu.in/news-and-events)`,
    ta: `**திட்ட நாள் (Project Day) & அறிவியல் கண்காட்சி**
• **நடத்திய அமைப்பு:** SRM IST திருச்சி வளாகம் (பொறியியல், இயன்முறை சிகிச்சை, மேலாண்மை புலங்கள்).
• **விவரம்:** இளங்கலை மற்றும் முதுகலை மாணவர்கள் உருவாக்கிய இயங்கும் ரோபோட்டிக்ஸ் சாதனங்கள், சாப்ட்வேர் ஆப்ஸ், மருத்துவ உபகரணங்கள் மற்றும் ஆய்வுக் கட்டுரைகளை காட்சிப்படுத்தும் பிரம்மாண்ட அறிவியல் கண்காட்சி.
🌐 [srmtrichy.edu.in/news-and-events](https://www.srmtrichy.edu.in/news-and-events)`
  }
];

export const DEPARTMENT_EVENTS = [
  {
    id: "cse_events",
    matcher: /\b(cse|computer\s*science|computing)\b/i,
    en: `**Recent & Upcoming Events in Computer Science & Engineering (School of Computing):**
• **TENSOR’26:** 24-Hour AI & Software Innovation Hackathon tackling 200 real-world industry problem statements.
• **Project Fiesta 2026:** In-House Mega Project Expo led by CSE HoD Dr. S. Kanaga Suba Raja.
• **Inauguration of Oracle Centre of Excellence:** World-class Oracle cloud and enterprise database lab.
• **iOS App Development using Swift:** Native Apple development workshop conducted at the Apple iMac CoE.
• **FLABS Internal Hackathon 2026:** Campus sprint for Smart India Hackathon (SIH 2026).
• **Power BI Data Analyst Associate FDP:** One-week faculty skill enhancement program.
• **Prompt Engineering & Generative AI FDP:** National faculty training with IIT Guwahati & E&ICT Academy.
🌐 [srmtrichy.edu.in/departments/cse](https://www.srmtrichy.edu.in/departments/cse)`,
    ta: `**கணினி அறிவியல் மற்றும் பொறியியல் துறை (CSE) நிகழ்வுகள்:**
• **TENSOR’26:** 200 சவால்களுக்கு விடையளித்த 24-மணி நேர செயற்கை நுண்ணறிவு ஹேக்கத்தான்.
• **Project Fiesta 2026:** CSE HoD முனைவர் S. கனக சுப ராஜா தலைமையில் நடைபெற்ற மெகா திட்ட கண்காட்சி.
• **Oracle சிறப்பு மையம் தொடக்க விழா:** சர்வதேச தரத்திலான கிளவுட் மற்றும் டேட்டாபேஸ் மையம்.
• **Apple iMac Swift iOS பட்டறை:** Swift மூலம் மொபைல் செயலிகள் உருவாக்கும் நேரடி பயிற்சி.
• **Internal Hackathon 2026:** SIH 2026 தேசிய போட்டிக்கான வளாக அளவிலான தேர்வுப் போட்டி.
• **Power BI & Generative AI FDP:** IIT கவுகாத்தி இணைந்து நடத்திய மேம்பட்ட AI பயிற்சி.
🌐 [srmtrichy.edu.in/departments/cse](https://www.srmtrichy.edu.in/departments/cse)`
  },
  {
    id: "mech_events",
    matcher: /\b(mech|mechanical)\b/i,
    en: `**Events in School of Mechanical Engineering:**
• **ICIDDM 2K25:** International Conference on Interactive Design and Digital Manufacturing (Additive manufacturing, robotics, digital twins).
• **AICTE-ATAL FDP on Sustainable Hydrogen Energy:** 1-Week national training on green hydrogen, fuel cells, and zero-carbon technology.
• **Manufacturing Goes Digital:** Industry 4.0 workshop with 3D Printing & Additive Manufacturing demonstrations.
• **3D Printing & Functional Fabrication:** Multi-disciplinary workshop bridging Healthcare and Food processing.
🌐 [srmtrichy.edu.in/departments/mechanical](https://www.srmtrichy.edu.in/departments/mechanical)`,
    ta: `**இயந்திரவியல் பொறியியல் பள்ளி (Mechanical Engineering) நிகழ்வுகள்:**
• **ICIDDM 2K25 சர்வதேச மாநாடு:** டிஜிட்டல் உற்பத்தி மற்றும் ரோபோட்டிக்ஸ் குறித்த சர்வதேச ஆய்வுக் கருத்தரங்கு.
• **AICTE-ATAL நிலையான ஹைட்ரஜன் ஆற்றல் FDP:** பசுமை ஹைட்ரஜன் மற்றும் எரிபொருள் கலன்கள் (Fuel Cells) குறித்த தேசிய பயிற்சி.
• **Manufacturing Goes Digital:** 3D பிரிண்டிங் மற்றும் Industry 4.0 ஆட்டோமேஷன் பயிற்சி பட்டறை.
🌐 [srmtrichy.edu.in/departments/mechanical](https://www.srmtrichy.edu.in/departments/mechanical)`
  },
  {
    id: "eee_ece_events",
    matcher: /\b(eee|ece|electrical|electronics)\b/i,
    en: `**Events in Electrical (EEE) & Electronics (ECE) Engineering:**
• **8 Patents Published by EEE Students:** Prestigious research milestone published in the Indian Patent Journal.
• **SPICE SURGE:** Ultimate LTspice Simulation Contest organized by the VoltEx Innovation Club.
• **Green Tech Challenge:** Sustainable clean energy innovation contest by ELECTRONOVA.
• **Smart Grids & HVDC Technologies:** Two-Day national technical workshop on smart electrical distribution.
• **Python for Data Science Industry Connect:** Hands-on analytics training by ECE Data Science division.
• **Electronics in Automotive Systems:** Industry expert lecture on EV ECUs and embedded protocols.
🌐 [srmtrichy.edu.in/departments/eee](https://www.srmtrichy.edu.in/departments/eee)`,
    ta: `**மின் (EEE) மற்றும் மின்னணுவியல் (ECE) பொறியியல் நிகழ்வுகள்:**
• **EEE மாணவர்களின் 8 காப்புரிமைகள் (Patents):** இந்திய காப்புரிமை இதழில் வெளியிடப்பட்ட மாணவர்களின் ஆராய்ச்சி சாதனை.
• **SPICE SURGE:** VoltEx Innovation Club நடத்திய LTspice மின்சுற்று வடிவமைப்பு போட்டி.
• **கிரீன் டெக் சேலஞ்ச்:** ELECTRONOVA மன்றத்தின் பசுமை மின்னாற்றல் போட்டி.
• **ஸ்மார்ட் கிரிட் & HVDC பட்டறை:** நவீன மின்கட்டமைப்பு குறித்த இருதின தேசிய கருத்தரங்கு.
🌐 [srmtrichy.edu.in/departments/eee](https://www.srmtrichy.edu.in/departments/eee)`
  },
  {
    id: "management_events",
    matcher: /\b(management|mba|bba|doms)\b/i,
    en: `**Events in Faculty of Management Studies (DoMS):**
• **CONFLUENCE 2K25:** Annual National Management and Business Symposium.
• **RASRA NG 2025 (Player Pursuit - IPL Auction):** High-stakes strategic bidding and budget optimization contest.
• **Exemplar 2025 – IPL Auction:** Inter-collegiate tournament hosted at Coimbatore.
• **FROM VISION TO VENTURE:** Executive workshop on startup creation and venture capital funding.
• **CORPORATE WALK:** Leadership branding and corporate personality development program.
🌐 [srmtrichy.edu.in/institution/management-studies](https://www.srmtrichy.edu.in/institution/management-studies)`,
    ta: `**மேலாண்மைப் புலம் (DoMS - MBA & BBA) நிகழ்வுகள்:**
• **CONFLUENCE 2K25:** தேசிய அளவிலான வர்த்தக மற்றும் மேலாண்மை மாநாடு.
• **RASRA NG 2025 (IPL Auction):** நேரடி கிரிக்கெட் வீரர்கள் ஏல உத்தி மேலாண்மை போட்டி.
• **FROM VISION TO VENTURE:** புதிய ஸ்டார்ட்அப் நிறுவனங்களை உருவாக்குவதற்கான தொழில்முனைவோர் பயிற்சி.
• **கார்ப்பரேட் வாக் (Corporate Walk):** தலைமைப் பண்பு மற்றும் கார்ப்பரேட் திறன் மேம்பாட்டு நிகழ்ச்சி.
🌐 [srmtrichy.edu.in/institution/management-studies](https://www.srmtrichy.edu.in/institution/management-studies)`
  },
  {
    id: "physiotherapy_events",
    matcher: /\b(physiotherapy|bpt|mpt)\b/i,
    en: `**Events in SRM College of Physiotherapy:**
• **REVIVE ‘24:** 1st National Physiotherapy Conference bringing together 500+ rehabilitation specialists.
• **Physio-Tech’26:** 1st & 2nd National Physiotherapy Symposiums on advanced clinical tech.
• **Spinal Manipulation Workshop:** Hands-on training on Sacro-Iliac joint mobilization.
• **Project Day Expo:** 123+ students presented healthcare innovation models.
• **Osteoarthritis Awareness Rally:** World Physiotherapy Day public rally from Chathiram to Anna statue.
• **21st Tamil Nadu State Senior Para Athletic Championship - 2026:** University physiotherapy delegation.
🌐 [srmtrichy.edu.in/institution/physiotherapy](https://www.srmtrichy.edu.in/institution/physiotherapy)`,
    ta: `**இயன்முறை சிகிச்சைக் கல்லூரி (College of Physiotherapy) நிகழ்வுகள்:**
• **REVIVE ‘24:** 500+ மருத்துவர்கள் பங்கேற்ற 1-வது தேசிய மறுவாழ்வு மாநாடு.
• **Physio-Tech’26:** அதிநவீன இயன்முறை சிகிச்சை தொழில்நுட்ப கருத்தரங்கு.
• **முதுகுத்தண்டு சீரமைப்பு (Spinal Manipulation) பட்டறை:** Sacro-Iliac மூட்டு சிகிச்சை செயல்முறை பயிற்சி.
• **திட்ட நாள் கண்காட்சி (Project Day):** 123 மாணவர்கள் காட்சிப்படுத்திய மருத்துவ சாதனங்கள் கண்காட்சி.
• **கீல்வாதம் விழிப்புணர்வு பேரணி:** சத்திரம் பேருந்து நிலையம் முதல் அண்ணா சிலை வரை நடைபெற்ற பேரணி.
🌐 [srmtrichy.edu.in/institution/physiotherapy](https://www.srmtrichy.edu.in/institution/physiotherapy)`
  }
];

/**
 * Handle News and Events queries
 */
export function handleNewsAndEventsQuery(rawQuery, lang = "en") {
  if (!rawQuery) return null;
  const qLower = String(rawQuery).toLowerCase().trim();

  // 1. Check for specific named events (TENSOR'26, Project Fiesta, Oracle CoE, etc.)
  for (const event of SPECIFIC_EVENTS) {
    if (event.matcher.test(qLower)) {
      const ans = lang === "ta" ? event.ta : event.en;
      return {
        answer: ans,
        source: "https://www.srmtrichy.edu.in/news-and-events",
        provider: "news-specific-event-resolver",
        topic: event.id,
        lang
      };
    }
  }

  // 2. Check if query is asking about news/events generally or department-specific events
  const isNewsQuery = /(?:\b(news|events?|activities|activity|festivals?|conferences?|symposiums?|fests?|hackathons?|workshops?|webinars?)\b|செய்திகள்|நிகழ்வுகள்|கருத்தரங்கம்|மாநாடு|விழா)/i.test(qLower);

  if (isNewsQuery) {
    // Check if user is asking for events in a specific department
    for (const dept of DEPARTMENT_EVENTS) {
      if (dept.matcher.test(qLower)) {
        const ans = lang === "ta" ? dept.ta : dept.en;
        return {
          answer: ans,
          source: "https://www.srmtrichy.edu.in/news-and-events",
          provider: "news-department-events-resolver",
          topic: dept.id,
          lang
        };
      }
    }

    // General news & events overview
    const ans = lang === "ta" ? NEWS_OVERVIEW.ta : NEWS_OVERVIEW.en;
    return {
      answer: ans,
      source: "https://www.srmtrichy.edu.in/news-and-events",
      provider: "news-events-overview-resolver",
      topic: "news_and_events_overview",
      lang
    };
  }

  return null;
}

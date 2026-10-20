/**
 * SRM IST Trichy - Dedicated Department & HoD Intent Handler
 * 
 * Rules:
 * 1. If user queries a department (e.g., "cse", "ece", "mechanical", "cyber security"):
 *    - By default, show comprehensive details of the department (Degrees, Specializations, Industry Labs, Placements, Eligibility, Link).
 *    - Do NOT show the HoD name.
 * 2. Only show the HoD name if the user explicitly asks for the HoD (e.g., "who is the hod of cse", "cse hod", "head of department cse").
 * 3. Provide rich, elaborated, informative responses.
 */

export const DEPARTMENTS = [
  // 1. Computer Science & Engineering (CSE)
  {
    id: "cse",
    matcher: /\b(cse|computer\s*science(\s*and\s*engineering)?|comp\s*sci|கணினி\s*அறிவியல்)\b/i,
    hodMatcher: /\b(hod|h\.o\.d|head|தலைவர்|டீன்)\b/i,
    hod_en: `**Dr. S. Kanaga Suba Raja** (Professor & HoD) is the Head of the Department of Computer Science and Engineering (CSE) at SRM IST Trichy. He guides cutting-edge curricula and research across AI, Cloud, and Software Product Engineering.\n\n🌐 **Source:** [srmtrichy.edu.in/departments/cse](https://www.srmtrichy.edu.in/departments/cse)`,
    hod_ta: `**முனைவர் S. கனக சுப ராஜா** (பேராசிரியர் & HoD) SRM IST திருச்சி கணினி அறிவியல் மற்றும் பொறியியல் துறையின் (CSE) தலைவர் ஆவார். அவர் செயற்கை நுண்ணறிவு, கிளவுட் மற்றும் மென்பொருள் பொறியியல் பாடத்திட்டங்கள் மற்றும் ஆராய்ச்சிகளை வழிநடத்துகிறார்.\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/departments/cse](https://www.srmtrichy.edu.in/departments/cse)`,
    details_en: `**Department of Computer Science & Engineering (CSE) — SRM IST Trichy:**

The School of Computing / Department of CSE is a premier branch at SRM IST Trichy, featuring NAAC A++ accreditation, elite industry centers of excellence, and high-tier placement records.

• **Academic Programmes Offered:**
  - **B.Tech in Computer Science and Engineering (CSE)** (4 Years) with industry-tailored specializations in:
    - Artificial Intelligence & Machine Learning (AI & ML)
    - Cyber Security & Digital Forensics
    - Big Data Analytics & Data Science
    - Blockchain Technology
    - Internet of Things (IoT)
    - Medical Engineering
    - Software Product Engineering (Full-Stack & Agile)
    - Computer Science & Business Systems (CSBS — in partnership with TCS)
  - **M.Tech in CSE** (2 Years) with specialization in AI & ML
  - **Ph.D. in Computer Science & Engineering** (Full-Time & Part-Time)

• **Elite Industry Laboratories & Centers of Excellence:**
  - **Apple iMac Centre of Excellence:** Dedicated iOS, iPadOS & Swift application engineering lab.
  - **Fortinet Cyber Security Industry Lab:** Real-time SOC defense drills with FortiGate firewalls & FortiSIEM.
  - **NVIDIA GPU Computing Labs:** Deep learning, Computer Vision, and Generative AI neural clusters.
  - **AR/VR Immersive Lab:** Spatial computing with Meta Quest VR headsets and digital twin simulations.
  - **Cisco Networking Academy:** Enterprise routing, switching, and cloud computing.

• **Placements & Career Opportunities:**
  - **95%+ Placement Track Record** with highest package of **₹50 LPA** and average package of **₹8.5 LPA**.
  - **Top Recruiters:** Amazon, Microsoft, Google, Zoho Corporation, TCS Ninja/Digital, Cognizant, Infosys, Capgemini, Virtusa.

• **Eligibility:** Minimum 60% aggregate in 12th Board PCM (Physics, Chemistry, Maths).

🌐 **Explore Department:** [srmtrichy.edu.in/departments/cse](https://www.srmtrichy.edu.in/departments/cse) | Admissions Helpline: 📞 1800 202 4565`,
    details_ta: `**கணினி அறிவியல் மற்றும் பொறியியல் துறை (CSE) — SRM IST திருச்சி:**

SRM IST திருச்சியின் கம்ப்யூட்டிங் பள்ளி (School of Computing) NAAC A++ அங்கீகாரம் மற்றும் சர்வதேச தரத்திலான தொழில்நுட்ப ஆய்வகங்களுடன் செயல்படும் முதன்மைப் புலமாகும்.

• **வழங்கப்படும் படிப்புகள்:**
  - **B.Tech CSE (4 ஆண்டுகள்)** மற்றும் சிறப்புப் பிரிவுகள்:
    - செயற்கை நுண்ணறிவு & இயந்திர கற்றல் (AI & ML)
    - சைபர் செக்யூரிட்டி & எத்திக்கல் ஹேக்கிங் (Cyber Security)
    - பிக் டேட்டா அனலிட்டிக்ஸ் & டேட்டா சயின்ஸ் (Data Science)
    - பிளாக்செயின் தொழில்நுட்பம் (Blockchain)
    - இன்டர்நெட் ஆஃப் திங்ஸ் (IoT)
    - மெடிக்கல் இன்ஜினியரிங் (Medical Engineering)
    - சாப்ட்வேர் ப்ராடக்ட் இன்ஜினியரிங் (Software Product)
    - TCS உடன்படிக்கையுடன் CSBS
  - **M.Tech CSE** (2 ஆண்டுகள்) AI & ML சிறப்புப் பிரிவு
  - **Ph.D. முனைவர் ஆராய்ச்சி** (முழுநேரம் / பகுதிநேரம்)

• **முன்னணி தொழில் நிறுவன ஆய்வகங்கள்:**
  - **Apple iMac மையம்:** Apple iMacs, Xcode & Swift மூலம் iOS ஆப் மேம்பாட்டு மையம்.
  - **Fortinet சைபர் லேப்:** FortiGate மற்றும் FortiSIEM உடனான நேரடி பாதுகாப்பு லேப்.
  - **NVIDIA GPU ஆய்வகம்:** ஆழ்கற்றல் மற்றும் Generative AI கணினி மையம்.
  - **AR/VR ஆய்வகம்:** விர்ச்சுவல் ரியாலிட்டி முப்பரிமாண தொழில்நுட்ப ஆய்வகம்.
  - **Cisco அகாடமி:** கார்ப்பரேட் நெட்வொர்க்கிங் மற்றும் கிளவுட் பயிற்சி.

• **வேலைவாய்ப்பு (Placements):**
  - **95%+ வேலைவாய்ப்பு**டன் அதிகபட்ச சம்பளம் **₹50 LPA**, சராசரி **₹8.5 LPA**.
  - **முன்னணி நிறுவனங்கள்:** Amazon, Microsoft, Zoho, TCS, Infosys, Capgemini.

• **சேர்க்கை தகுதி:** 12-ல் இயற்பியல், வேதியியல், கணிதத்தில் (PCM) குறைந்தபட்சம் 60% மதிப்பெண்கள்.

🌐 **துறை விவரங்கள்:** [srmtrichy.edu.in/departments/cse](https://www.srmtrichy.edu.in/departments/cse) | உதவி எண்: 📞 1800 202 4565`,
    source: "https://www.srmtrichy.edu.in/departments/cse"
  },

  // 2. Artificial Intelligence & Data Science (AI & DS)
  {
    id: "aids",
    matcher: /\b(ai\s*(&|and)?\s*ds|ai\s*(&|and)?\s*ml|artificial\s*intelligence|data\s*sciences?|செயற்கை\s*நுண்ணறிவு)\b/i,
    hodMatcher: /\b(hod|h\.o\.d|head|தலைவர்|டீன்)\b/i,
    hod_en: `**Dr. R. Balaji Ganesh** (Associate Professor & HoD, Assistant Dean Research) heads AI & ML, while **Dr. Yuvaraj Duraisamy** heads Big Data Analytics & Data Science, and **Dr. S. Shanmuga Priya** heads the Department of AI at SRM IST Trichy.\n\n🌐 **Source:** [srmtrichy.edu.in/departments/ai-ds](https://www.srmtrichy.edu.in/departments/ai-ds)`,
    hod_ta: `SRM IST திருச்சியில் **முனைவர் R. பாலாஜி கணேஷ்** AI & ML துறை தலைவராகவும் மற்றும் உதவி டீன் (ஆராய்ச்சி) ஆகவும், **முனைவர் யுவராஜ் துரைசாமி** பிக் டேட்டா & டேட்டா சயின்ஸ் தலைவராகவும், **முனைவர் S. சண்முகப் பிரியா** AI துறை தலைவராகவும் செயல்படுகின்றனர்.\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/departments/ai-ds](https://www.srmtrichy.edu.in/departments/ai-ds)`,
    details_en: `**Department of AI & Data Science (AI & DS) — SRM IST Trichy:**

The AI & Data Science department trains students in next-generation autonomous algorithms, neural network design, and large-scale data intelligence.

• **Programmes Offered:**
  - **B.Tech Artificial Intelligence and Data Science (AI & DS)** (4 Years)
  - **B.Tech CSE with AI & ML** (4 Years)
  - **B.Tech Artificial Intelligence and Future Technologies** (4 Years)
  - **M.Tech in CSE (AI & ML)** (2 Years)

• **Advanced Computational Infrastructure:**
  - **NVIDIA GPU Computing Labs:** Powered by NVIDIA Tensor Core GPUs for training large deep learning transformers, LLMs, and computer vision models.
  - **Data Engineering Suite:** Hadoop, Apache Spark, Python/R analytics, and cloud databases (AWS/Azure).

• **Career Roles & Placements:**
  - Roles: Machine Learning Engineer, Data Scientist, NLP Specialist, Autonomous Systems Developer, AI Solutions Architect.
  - Eligible for premier tech placements up to **₹50 LPA** with recruiters like Amazon, Microsoft, Zoho, and Google.

• **Eligibility:** Minimum 60% PCM in 12th Higher Secondary.

🌐 **Explore Department:** [srmtrichy.edu.in/departments/ai-ds](https://www.srmtrichy.edu.in/departments/ai-ds) | Admissions: 📞 1800 202 4565`,
    details_ta: `**செயற்கை நுண்ணறிவு & தரவு அறிவியல் துறை (AI & DS) — SRM IST திருச்சி:**

எதிர்கால தொழில்நுட்பங்களான ஆழ்கற்றல், நரம்பியல் நெட்வொர்க்குகள் மற்றும் பெரிய தரவு பகுப்பாய்வு ஆகியவற்றில் சிறப்புப் பயிற்சி வழங்கும் முதன்மைத் துறை.

• **வழங்கப்படும் படிப்புகள்:**
  - **B.Tech AI & Data Science (AI & DS)** (4 ஆண்டுகள்)
  - **B.Tech CSE (AI & ML)** (4 ஆண்டுகள்)
  - **B.Tech AI and Future Technologies** (4 ஆண்டுகள்)
  - **M.Tech CSE (AI & ML)** (2 ஆண்டுகள்)

• **அதிநவீன ஆய்வகங்கள்:**
  - **NVIDIA GPU கணினி மையம்:** ஆழ்கற்றல் மற்றும் மொழி மாதிரிகளை (LLMs) உருவாக்க உயர் செயல்திறன் கொண்ட NVIDIA GPU பணிநிலையங்கள்.
  - **டேட்டா இன்ஜினியரிங் லேப்:** Hadoop, Spark, Python, Cloud AI தளங்கள்.

• **வேலைவாய்ப்புகள்:** AI Engineer, Data Scientist, ML Architect போன்ற உயர்மட்ட பதவிகள் (சம்பளம்: ₹8.5 LPA முதல் ₹50 LPA வரை).

• **தகுதி:** 12-ல் இயற்பியல், வேதியியல், கணிதத்தில் குறைந்தபட்சம் 60% மதிப்பெண்கள்.

🌐 **துறை விவரங்கள்:** [srmtrichy.edu.in/departments/ai-ds](https://www.srmtrichy.edu.in/departments/ai-ds) | உதவி எண்: 📞 1800 202 4565`,
    source: "https://www.srmtrichy.edu.in/departments/ai-ds"
  },

  // 3. Cyber Security
  {
    id: "cyber_security",
    matcher: /\b(cyber\s*security|cyber|ethical\s*hacking|சைபர்\s*செக்யூரிட்டி)\b/i,
    hodMatcher: /\b(hod|h\.o\.d|head|தலைவர்|டீன்)\b/i,
    hod_en: `**Dr. R. Deebalakshmi** (Associate Professor & HoD) is the Head of the Department of Cyber Security at SRM IST Trichy. She oversees the Fortinet Centre of Excellence and student cybersecurity teams.\n\n🌐 **Source:** [srmtrichy.edu.in/departments/cyber-security](https://www.srmtrichy.edu.in/departments/cyber-security)`,
    hod_ta: `**முனைவர் R. தீபலக்ஷ்மி** (இணைப் பேராசிரியர் & HoD) SRM IST திருச்சி சைபர் செக்யூரிட்டி துறையின் தலைவர் ஆவார். இவர் Fortinet சிறப்பு மையம் மற்றும் மாணவர் பாதுகாப்பு குழுக்களை வழிநடத்துகிறார்.\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/departments/cyber-security](https://www.srmtrichy.edu.in/departments/cyber-security)`,
    details_en: `**Department of Cyber Security — SRM IST Trichy:**

The Department of Cyber Security prepares elite security engineers with hands-on defense drills, ethical hacking, and real-world threat hunting.

• **Academic Degree:**
  - **B.Tech CSE with Specialization in Cyber Security** (4 Years)
  - **Ph.D. in Cyber Security & Digital Forensics**

• **Elite Cybersecurity Facilities:**
  - **Fortinet Industry Lab:** Featuring FortiGate enterprise firewalls, FortiAnalyzer, and FortiSIEM threat intelligence analytics.
  - **Capture The Flag (CTF) Arena:** Active student defense teams competing in national and international ethical hacking contests.
  - **Cisco Security Academy:** Hands-on intrusion detection (IDS/IPS), network protocol analysis, and penetration testing.

• **Career Profiles & Placements:**
  - Information Security Analyst, SOC Engineer, Ethical Hacker, Penetration Tester, Cloud Security Architect.
  - Placements in global security corporations with packages up to **₹50 LPA**.

• **Eligibility:** 10+2 with minimum 60% in PCM.

🌐 **Explore Department:** [srmtrichy.edu.in/departments/cyber-security](https://www.srmtrichy.edu.in/departments/cyber-security) | Admissions: 📞 1800 202 4565`,
    details_ta: `**சைபர் செக்யூரிட்டி துறை (Cyber Security) — SRM IST திருச்சி:**

தகவல் பாதுகாப்பு, நெட்வொர்க் பாதுகாப்பு மற்றும் எத்திக்கல் ஹேக்கிங் ஆகியவற்றில் சர்வதேச நிபுணர்களை உருவாக்கும் முன்னணித் துறை.

• **படிப்புகள்:**
  - **B.Tech CSE (Cyber Security)** (4 ஆண்டுகள்)
  - **Ph.D. சைபர் செக்யூரிட்டி & டிஜிட்டல் தடயவியல்**

• **சிறப்பு ஆய்வகங்கள்:**
  - **Fortinet சிறப்பு மையம்:** FortiGate எண்டர்பிரைஸ் ஃபயர்வால் மற்றும் FortiSIEM அச்சுறுத்தல் பகுப்பாய்வு மையம்.
  - **CTF அரங்கம்:** சர்வதேச எத்திக்கல் ஹேக்கிங் மற்றும் பாதுகாப்பு போட்டிகளுக்கான மாணவர் தளம்.
  - **Cisco பாதுகாப்பு அகாடமி:** நெட்வொர்க் ஊடுருவல் தடுப்பு சோதனைக் களம்.

• **வேலைவாய்ப்புகள்:** Ethical Hacker, Security Analyst, SOC Engineer (சம்பளம்: ₹8.5 LPA முதல் ₹50 LPA வரை).

• **தகுதி:** 12-ல் இயற்பியல், வேதியியல், கணிதத்தில் குறைந்தபட்சம் 60% மதிப்பெண்கள்.

🌐 **துறை விவரங்கள்:** [srmtrichy.edu.in/departments/cyber-security](https://www.srmtrichy.edu.in/departments/cyber-security) | உதவி எண்: 📞 1800 202 4565`,
    source: "https://www.srmtrichy.edu.in/departments/cyber-security"
  },

  // 4. Information Technology (IT)
  {
    id: "it",
    matcher: /\b(information\s*technology|\bit\s*department|\bit\s*branch|\bit\s*course|தகவல்\s*தொழில்நுட்பம்)\b/i,
    hodMatcher: /\b(hod|h\.o\.d|head|தலைவர்|டீன்)\b/i,
    hod_en: `**Dr. Jubilant J. Kizhakkethottam** (Professor & HoD) is the Head of the Department of Information Technology at SRM IST Trichy.\n\n🌐 **Source:** [srmtrichy.edu.in/departments/it](https://www.srmtrichy.edu.in/departments/it)`,
    hod_ta: `**முனைவர் ஜூபிலன்ட் ஜே. கிழக்கெத்தோட்டம்** (பேராசிரியர் & HoD) SRM IST திருச்சி தகவல் தொழில்நுட்பத் துறையின் (IT) தலைவர் ஆவார்.\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/departments/it](https://www.srmtrichy.edu.in/departments/it)`,
    details_en: `**Department of Information Technology (IT) — SRM IST Trichy:**

The Department of Information Technology bridges software development, cloud infrastructure, enterprise computing, and DevOps engineering.

• **Degree Offered:** **B.Tech Information Technology (IT)** (4 Years)
• **Key Curriculum Highlights:** Cloud Architecture (AWS, Azure), DevOps, Enterprise Software Engineering, Distributed Databases, Web Technologies, and Mobile App Development.
• **Placements:** 95%+ placement rate in product and IT consulting majors: Amazon, Zoho, TCS, Infosys, Capgemini, Virtusa (Packages: ₹8.5 LPA to ₹50 LPA).
• **Eligibility:** Minimum 60% aggregate in 12th PCM.

🌐 **Explore Department:** [srmtrichy.edu.in/departments/it](https://www.srmtrichy.edu.in/departments/it) | Helpline: 📞 1800 202 4565`,
    details_ta: `**தகவல் தொழில்நுட்பத் துறை (IT) — SRM IST திருச்சி:**

மென்பொருள் உருவாக்கம், கிளவுட் கம்ப்யூட்டிங் மற்றும் எண்டர்பிரைஸ் தொழில்நுட்பங்களை இணைக்கும் முதன்மைத் துறை.

• **படிப்பு:** **B.Tech தகவல் தொழில்நுட்பம் (IT)** (4 ஆண்டுகள்)
• **முக்கிய பாடங்கள்:** Cloud Architecture (AWS/Azure), DevOps, Web Development, மொபைல் ஆப் உருவாக்கம்.
• **வேலைவாய்ப்பு:** Amazon, Zoho, TCS, Infosys நிறுவனங்களில் 95%+ வேலைவாய்ப்பு (சம்பளம்: ₹8.5 LPA முதல் ₹50 LPA வரை).
• **தகுதி:** 12-ல் PCM பாடங்களில் குறைந்தபட்சம் 60% மதிப்பெண்கள்.

🌐 **துறை விவரங்கள்:** [srmtrichy.edu.in/departments/it](https://www.srmtrichy.edu.in/departments/it) | உதவி எண்: 📞 1800 202 4565`,
    source: "https://www.srmtrichy.edu.in/departments/it"
  },

  // 5. Electronics & Communication Engineering (ECE)
  {
    id: "ece",
    matcher: /\b(ece|electronics\s*and\s*communication|மின்னணுவியல்)\b/i,
    hodMatcher: /\b(hod|h\.o\.d|head|தலைவர்|டீன்)\b/i,
    hod_en: `**Dr. P. Murugapandiyan** (Professor & HoD) heads ECE, and **Dr. Rajasekar R** heads ECE with Data Science at SRM IST Trichy.\n\n🌐 **Source:** [srmtrichy.edu.in/departments/ece](https://www.srmtrichy.edu.in/departments/ece)`,
    hod_ta: `SRM IST திருச்சியில் ECE துறைக்கு **முனைவர் P. முருகபாண்டியன்** (பேராசிரியர் & HoD) மற்றும் ECE டேட்டா சயின்ஸ் துறைக்கு **முனைவர் ராஜசேகர் R** தலைவர்களாக உள்ளனர்.\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/departments/ece](https://www.srmtrichy.edu.in/departments/ece)`,
    details_en: `**Department of Electronics & Communication Engineering (ECE) — SRM IST Trichy:**

The ECE department offers comprehensive training in semiconductor chips, VLSI design, wireless 5G communications, and embedded IoT.

• **Programmes Offered:**
  - **B.Tech Electronics and Communication Engineering** (4 Years)
  - **B.Tech ECE with Specialization in Data Science** (4 Years)
  - **M.Tech Embedded System and VLSI Design** (2 Years)
  - **Ph.D. in VLSI, Wireless Networks & Signal Processing**

• **Specialized Labs:** VLSI Design Lab (Cadence/Synopsys), ARM Embedded Systems Lab, RF & Microwave Testing, and Digital Signal Processing (DSP).
• **Placements:** Core electronics companies (Bosch, Texas Instruments, Intel partners, Renault Nissan) & Tier-1 software giants up to ₹50 LPA.
• **Eligibility:** Minimum 60% PCM in 12th Board.

🌐 **Explore Department:** [srmtrichy.edu.in/departments/ece](https://www.srmtrichy.edu.in/departments/ece) | Helpline: 📞 1800 202 4565`,
    details_ta: `**மின்னணு மற்றும் தகவல் தொடர்பு பொறியியல் துறை (ECE) — SRM IST திருச்சி:**

செமிகண்டக்டர், VLSI சிப் வடிவமைப்பு, 5G வயர்லெஸ் மற்றும் உட்பொதிக்கப்பட்ட அமைப்புகளில் (Embedded Systems) சிறப்புப் பயிற்சி தரும் துறை.

• **படிப்புகள்:**
  - **B.Tech ECE** (4 ஆண்டுகள்)
  - **B.Tech ECE (Data Science)** (4 ஆண்டுகள்)
  - **M.Tech Embedded System and VLSI Design** (2 ஆண்டுகள்)
  - **Ph.D. ஆராய்ச்சி**
• **ஆய்வகங்கள்:** Cadence & Synopsys VLSI லேப், ARM Embedded லேப், மைக்ரோவேவ் & RF லேப்.
• **வேலைவாய்ப்புகள்:** Bosch, Renault Nissan, L&T, மற்றும் மென்பொருள் நிறுவனங்கள் (சம்பளம்: ₹8.5 LPA முதல் ₹50 LPA வரை).

🌐 **துறை விவரங்கள்:** [srmtrichy.edu.in/departments/ece](https://www.srmtrichy.edu.in/departments/ece) | உதவி எண்: 📞 1800 202 4565`,
    source: "https://www.srmtrichy.edu.in/departments/ece"
  },

  // 6. Mechanical Engineering
  {
    id: "mechanical",
    matcher: /\b(mechanical(\s*engineering)?|mech|மெக்கானிக்கல்)\b/i,
    hodMatcher: /\b(hod|h\.o\.d|head|தலைவர்|டீன்)\b/i,
    hod_en: `**Dr. Balasundaram R** (Professor & Associate Dean, 30+ Years Experience) heads the School of Mechanical Engineering at SRM IST Trichy.\n\n🌐 **Source:** [srmtrichy.edu.in/departments/mechanical](https://www.srmtrichy.edu.in/departments/mechanical)`,
    hod_ta: `**முனைவர் பாலசுந்தரம் R** (பேராசிரியர் & இணை டீன், 30+ ஆண்டுகள் அனுபவம்) SRM IST திருச்சி மெக்கானிக்கல் பொறியியல் பள்ளியின் தலைவராக உள்ளார்.\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/departments/mechanical](https://www.srmtrichy.edu.in/departments/mechanical)`,
    details_en: `**School of Mechanical Engineering — SRM IST Trichy:**

Associate Dean & Head: **Dr. Balasundaram R** (30+ Years Experience).
The School of Mechanical Engineering integrates traditional manufacturing with Industry 4.0, robotics, automation, and electric vehicle (EV) engineering.

• **Programmes Offered:**
  - **B.Tech Mechanical Engineering** (4 Years)
  - **Ph.D. in Mechanical Engineering & Thermal Science**
• **Specialized Labs:** CNC Machining Centre, 3D Printing & Additive Manufacturing, Fluid Mechanics Lab, Mechatronics & Robotics Lab, Automotive Powertrain & EV Lab.
• **Placements:** Core automotive & manufacturing giants (Renault Nissan, Hyundai Mobis, L&T, Bosch, Ashok Leyland) and IT firms.
• **Eligibility:** Minimum 60% PCM in 12th Board.

🌐 **Explore Department:** [srmtrichy.edu.in/departments/mechanical](https://www.srmtrichy.edu.in/departments/mechanical) | Admissions: 📞 1800 202 4565`,
    details_ta: `**இயந்திரவியல் பொறியியல் பள்ளி (Mechanical Engineering) — SRM IST திருச்சி:**

இணை டீன் & தலைவர்: **முனைவர் பாலசுந்தரம் R** (30+ ஆண்டுகள் அனுபவம்).
பாரம்பரிய பொறியியலுடன் ரோபோட்டிக்ஸ், ஆட்டோமேஷன் மற்றும் எலக்ட்ரிக் வாகன (EV) தொழில்நுட்பங்களை இணைக்கும் துறை.

• **படிப்புகள்:**
  - **B.Tech மெக்கானிக்கல் இன்ஜினியரிங்** (4 ஆண்டுகள்)
  - **Ph.D. முனைவர் ஆராய்ச்சி**
• **ஆய்வகங்கள்:** CNC லேப், 3D பிரிண்டிங் லேப், ரோபோட்டிக்ஸ் & மெக்கட்ரானிக்ஸ் லேப், EV பவர்ட்ரெயின் லேப்.
• **வேலைவாய்ப்புகள்:** Renault Nissan, Bosch, L&T, Hyundai மற்றும் IT நிறுவனங்கள்.
• **தகுதி:** 12-ல் PCM பாடங்களில் குறைந்தபட்சம் 60% மதிப்பெண்கள்.

🌐 **துறை விவரங்கள்:** [srmtrichy.edu.in/departments/mechanical](https://www.srmtrichy.edu.in/departments/mechanical) | உதவி எண்: 📞 1800 202 4565`,
    source: "https://www.srmtrichy.edu.in/departments/mechanical"
  },

  // 7. Biotechnology & Food Technology
  {
    id: "biotech",
    matcher: /\b(biotech(nology)?|food\s*tech(nology)?|உயிரித்\s*தொழில்நுட்பம்)\b/i,
    hodMatcher: /\b(hod|h\.o\.d|head|தலைவர்|டீன்)\b/i,
    hod_en: `**Dr. S. Hemanth Phani Kumar** heads Biotechnology, and **Dr. M. Maria Leena** heads Food Technology at SRM IST Trichy.\n\n🌐 **Source:** [srmtrichy.edu.in/departments/bio-tech](https://www.srmtrichy.edu.in/departments/bio-tech)`,
    hod_ta: `SRM IST திருச்சியில் பயோடெக்னாலஜி துறைக்கு **முனைவர் S. ஹேமந்த் பணி குமார்** மற்றும் உணவு தொழில்நுட்பத் துறைக்கு **முனைவர் M. மரியா லீனா** தலைவர்களாக உள்ளனர்.\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/departments/bio-tech](https://www.srmtrichy.edu.in/departments/bio-tech)`,
    details_en: `**Department of Biotechnology & Food Technology — SRM IST Trichy:**

Focuses on modern bioprocessing, food engineering, molecular diagnostics, and pharmaceutical biotechnology.

• **Degree Offered:** **B.Tech Biotechnology with Specialization in Food Technology** (4 Years) & Ph.D.
• **Laboratories:** Fermentation & Bioprocess Unit, Food Chemistry & Preservation Lab, Plant & Animal Tissue Culture Lab, HPLC Analytical Testing.
• **Career Pathways:** Food Processing Corporations, Biopharma Companies, Quality Control Labs, and Global Research Institutions.
• **Eligibility:** Minimum 60% aggregate in 12th PCM or PCB (Physics, Chemistry, Biology/Maths).

🌐 **Explore Department:** [srmtrichy.edu.in/departments/bio-tech](https://www.srmtrichy.edu.in/departments/bio-tech) | Helpline: 📞 1800 202 4565`,
    details_ta: `**உயிரித்தொழில்நுட்பம் & உணவு தொழில்நுட்பத் துறை — SRM IST திருச்சி:**

உயிர்வேதியியல், உணவு பதப்படுத்துதல் மற்றும் மருந்து உற்பத்தியில் சிறப்புப் பயிற்சி வழங்கும் துறை.

• **படிப்பு:** **B.Tech Biotechnology (Food Technology சிறப்புப் பிரிவு)** (4 ஆண்டுகள்) & Ph.D.
• **ஆய்வகங்கள்:** நொதித்தல் & பயோபிராசஸ் லேப், உணவு வேதியியல் லேப், திசு வளர்ப்பு லேப், HPLC பரிசோதனை மையம்.
• **வேலைவாய்ப்புகள்:** பயோபார்மா, உணவு உற்பத்தி ஆலைகள் மற்றும் சர்வதேச ஆராய்ச்சி நிறுவனங்கள்.
• **தகுதி:** 12-ல் PCM அல்லது PCB-ல் குறைந்தபட்சம் 60% மதிப்பெண்கள்.

🌐 **துறை விவரங்கள்:** [srmtrichy.edu.in/departments/bio-tech](https://www.srmtrichy.edu.in/departments/bio-tech) | உதவி எண்: 📞 1800 202 4565`,
    source: "https://www.srmtrichy.edu.in/departments/bio-tech"
  },

  // 8. Electrical & Electronics Engineering (EEE)
  {
    id: "eee",
    matcher: /\b(eee|electrical\s*and\s*electronics|மின்சார\s*பொறியியல்)\b/i,
    hodMatcher: /\b(hod|h\.o\.d|head|தலைவர்|டீன்)\b/i,
    hod_en: `**Dr. Dheepanchakkravarthy A** (Associate Professor & HoD) is the Head of the Department of Electrical & Electronics Engineering (EEE) at SRM IST Trichy.\n\n🌐 **Source:** [srmtrichy.edu.in/departments/eee](https://www.srmtrichy.edu.in/departments/eee)`,
    hod_ta: `**முனைவர் தீபன்சக்கரவர்த்தி A** (இணைப் பேராசிரியர் & HoD) SRM IST திருச்சி EEE துறையின் தலைவர் ஆவார்.\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/departments/eee](https://www.srmtrichy.edu.in/departments/eee)`,
    details_en: `**Department of Electrical & Electronics Engineering (EEE) — SRM IST Trichy:**

Focuses on Electric Vehicles (EV), smart power grids, solar renewable energy, and power electronics.

• **Programmes Offered:** **B.Tech EEE** (4 Years) & Ph.D. in Renewable Energy / Electric Vehicles / Power Electronics.
• **Labs:** Electric Vehicle Powertrain Lab, Solar Photovoltaic Grid Lab, Power Electronics Simulation Lab.
• **Career Pathways:** Power sector, EV design, renewable energy, and automation industries.
• **Eligibility:** Minimum 60% in 12th PCM.

🌐 **Explore Department:** [srmtrichy.edu.in/departments/eee](https://www.srmtrichy.edu.in/departments/eee) | Helpline: 📞 1800 202 4565`,
    details_ta: `**மின் மற்றும் மின்னணுவியல் பொறியியல் துறை (EEE) — SRM IST திருச்சி:**

எலக்ட்ரிக் வாகனங்கள் (EV), சூரிய ஒளி மின்னாற்றல், ஸ்மார்ட் கிரிட் மற்றும் பவர் எலக்ட்ரானிக்ஸ் துறையில் சிறப்புப் பயிற்சி தரும் துறை.

• **படிப்புகள்:** **B.Tech EEE** (4 ஆண்டுகள்) & Ph.D. முனைவர் ஆராய்ச்சி.
• **ஆய்வகங்கள்:** EV பவர்ட்ரெயின் லேப், சோலார் கிரிட் லேப், பவர் எலக்ட்ரானிக்ஸ் லேப்.
• **வேலைவாய்ப்புகள்:** மின் துறை, EV உற்பத்தி ஆலைகள், ஆட்டோமேஷன் நிறுவனங்கள்.

🌐 **துறை விவரங்கள்:** [srmtrichy.edu.in/departments/eee](https://www.srmtrichy.edu.in/departments/eee) | உதவி எண்: 📞 1800 202 4565`,
    source: "https://www.srmtrichy.edu.in/departments/eee"
  },

  // 9. Biomedical Engineering (BME)
  {
    id: "bme",
    matcher: /\b(bme|biomedical(\s*engineering)?|பயோமெடிக்கல்)\b/i,
    hodMatcher: /\b(hod|h\.o\.d|head|தலைவர்|டீன்)\b/i,
    hod_en: `The Department of Biomedical Engineering operates under the Faculty of Engineering & Technology at SRM IST Trichy (Associate Dean: Dr. Balasundaram R).\n\n🌐 **Source:** [srmtrichy.edu.in/departments/bme](https://www.srmtrichy.edu.in/departments/bme)`,
    hod_ta: `பயோமெடிக்கல் பொறியியல் துறை SRM IST திருச்சி பொறியியல் புலத்தின் கீழ் செயல்படுகிறது (இணை டீன்: முனைவர் பாலசுந்தரம் R).\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/departments/bme](https://www.srmtrichy.edu.in/departments/bme)`,
    details_en: `**Department of Biomedical Engineering (BME) — SRM IST Trichy:**

Combines engineering innovation with healthcare technologies, providing daily bedside clinical training.

• **Degree Offered:** **B.Tech Biomedical Engineering (BME)** (4 Years)
• **Unique Clinical Advantage:** Daily hands-on clinical exposure at the on-campus **750-bed SRM Medical College Teaching Hospital** for MRI, CT Scanner, Dialysis, Ventilators, and ICU monitoring devices.
• **Career Pathways:** Medical device manufacturing (Siemens Healthineers, GE Healthcare, Philips), Hospital Biomedical Engineering, and Clinical Research.
• **Eligibility:** Minimum 60% in 12th PCM or PCB.

🌐 **Explore Department:** [srmtrichy.edu.in/departments/bme](https://www.srmtrichy.edu.in/departments/bme) | Helpline: 📞 1800 202 4565`,
    details_ta: `**பயோமெடிக்கல் பொறியியல் துறை (BME) — SRM IST திருச்சி:**

மருத்துவ உபகரண வடிவமைப்பு, நோயறிதல் கருவிகள் மற்றும் மருத்துவமனை மேலாண்மையை இணைக்கும் அதிநவீன துறை.

• **படிப்பு:** **B.Tech Biomedical Engineering** (4 ஆண்டுகள்)
• **தனித்துவ மருத்துவப் பயிற்சி:** வளாகத்தில் உள்ள **750 படுக்கை SRM மருத்துவக் கல்லூரி மருத்துவமனையில்** MRI, CT ஸ்கேன், டயாலிசிஸ், வென்டிலேட்டர் கருவிகளில் நேரடி செயல்முறைப் பயிற்சி.
• **வேலைவாய்ப்புகள்:** GE Healthcare, Siemens, Philips, முன்னணி மருத்துவமனைகள்.

🌐 **துறை விவரங்கள்:** [srmtrichy.edu.in/departments/bme](https://www.srmtrichy.edu.in/departments/bme) | உதவி எண்: 📞 1800 202 4565`,
    source: "https://www.srmtrichy.edu.in/departments/bme"
  },

  // 10. Management Studies (DoMS - MBA & BBA)
  {
    id: "management",
    matcher: /\b(mba|bba|management\s*studies|doms|மேலாண்மை)\b/i,
    hodMatcher: /\b(hod|h\.o\.d|head|தலைவர்|டீன்)\b/i,
    hod_en: `**Dr. P. Parthiban** heads MBA, **Dr. R. Somasundaram** heads MBA Healthcare & Hospital Management, and **Dr. J. Saradha** heads BBA at SRM IST Trichy.\n\n🌐 **Source:** [srmtrichy.edu.in/institution/management-studies](https://www.srmtrichy.edu.in/institution/management-studies)`,
    hod_ta: `SRM IST திருச்சியில் MBA துறைக்கு **முனைவர் P. பார்த்திபன்**, மருத்துவமனை மேலாண்மைக்கு **முனைவர் R. சோமசுந்தரம்**, மற்றும் BBA துறைக்கு **முனைவர் J. சாரதா** தலைவர்களாக உள்ளனர்.\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/institution/management-studies](https://www.srmtrichy.edu.in/institution/management-studies)`,
    details_en: `**Faculty of Management Studies (DoMS) — SRM IST Trichy:**

DoMS provides corporate management education driven by Harvard Business case studies, simulated stock trading, and corporate executive internships.

• **Programmes Offered:**
  - **MBA (Master of Business Administration - 2 Years)** with 7 Specializations:
    - Finance Management
    - Marketing Management
    - Human Resource Management (HR)
    - Business Analytics
    - Operations Management
    - General Management
    - Healthcare & Hospital Management (Daily administrative residency at 750-bed SRM Hospital)
  - **BBA (Bachelor of Business Administration - 3 Years)**
  - **B.Com (General / Accounting & Finance / Logistics Honours - 3 Years)**
• **Placements:** 100% placement track record in top banks and corporate consulting firms (Deloitte, HDFC, ICICI, EY, Federal Bank).
• **Eligibility:** Undergraduate degree with min 50% + SRM MAT / CAT / TANCET score.

🌐 **Explore Management:** [srmtrichy.edu.in/institution/management-studies](https://www.srmtrichy.edu.in/institution/management-studies) | Helpline: 📞 1800 202 4565`,
    details_ta: `**மேலாண்மைப் புலம் (DoMS - MBA & BBA) — SRM IST திருச்சி:**

கார்ப்பரேட் மேலாண்மைப் பயிற்சிகள், ஹார்வர்ட் கேஸ் ஸ்டடிகள் மற்றும் நேரடி நிறுவனப் பயிற்சிகளுடன் வழங்கப்படும் வணிகப் படிப்பு.

• **படிப்புகள்:**
  - **MBA (2 ஆண்டுகள்)** — 7 சிறப்புப் பிரிவுகள்:
    - நிதி (Finance), மார்க்கெட்டிங், HR, பிசினஸ் அனலிட்டிக்ஸ், ஆபரேஷன்ஸ், மருத்துவமனை மேலாண்மை (750-படுக்கை SRM மருத்துவமனையில் தினசரி பயிற்சி).
  - **BBA (3 ஆண்டுகள்)** & **B.Com (3 ஆண்டுகள்)**.
• **வேலைவாய்ப்புகள்:** Deloitte, HDFC, ICICI, EY, மற்றும் பன்னாட்டு வங்கிகளில் 100% வேலைவாய்ப்பு.

🌐 **துறை விவரங்கள்:** [srmtrichy.edu.in/institution/management-studies](https://www.srmtrichy.edu.in/institution/management-studies) | உதவி எண்: 📞 1800 202 4565`,
    source: "https://www.srmtrichy.edu.in/institution/management-studies"
  },

  // 11. Physiotherapy (College of Physiotherapy)
  {
    id: "physiotherapy",
    matcher: /\b(physiotherapy|bpt|mpt|இயன்முறை\s*சிகிச்சை)\b/i,
    hodMatcher: /\b(hod|h\.o\.d|head|dean|தலைவர்|டீன்)\b/i,
    hod_en: `The College of Physiotherapy is guided by experienced senior clinical professors affiliated with the on-campus 750-bed SRM Medical College Hospital.\n\n🌐 **Source:** [srmtrichy.edu.in/institution/physiotherapy](https://www.srmtrichy.edu.in/institution/physiotherapy)`,
    hod_ta: `SRM இயன்முறை சிகிச்சை கல்லூரி வளாகத்தில் உள்ள 750 படுக்கை SRM மருத்துவக் கல்லூரி பேராசிரியர்களால் வழிநடத்தப்படுகிறது.\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/institution/physiotherapy](https://www.srmtrichy.edu.in/institution/physiotherapy)`,
    details_en: `**SRM College of Physiotherapy — SRM IST Trichy:**

A premier healthcare rehabilitation institution affiliated with the on-campus **750-bed SRM Medical College Hospital & Research Centre**.

• **Degrees Offered:**
  - **Bachelor of Physiotherapy (BPT - 4.5 Years):** 4 years academic study + 6 months compulsory rotatory clinical internship.
  - **Master of Physiotherapy (MPT - 2 Years)** with 7 Specialties:
    - Musculoskeletal Science (Orthopaedics)
    - Neuroscience
    - Sports Science (Sports Medicine & Rehab)
    - Cardio-Pulmonary Science
    - Pediatrics & Neonatal Sciences
    - Obstetrics & Gynecology (OBG)
    - Oncology Science (Cancer Rehabilitation)
• **Clinical Advantage:** Daily bedside patient therapy, electrotherapy labs, and gait analysis suites.
• **Eligibility:** 10+2 with Physics, Chemistry, Biology (PCB) with min 50%.

🌐 **Explore Physiotherapy:** [srmtrichy.edu.in/institution/physiotherapy](https://www.srmtrichy.edu.in/institution/physiotherapy) | Helpline: 📞 1800 202 4565`,
    details_ta: `**SRM இயன்முறை சிகிச்சைக் கல்லூரி (BPT & MPT) — SRM IST திருச்சி:**

வளாகத்தில் உள்ள **750 படுக்கை SRM மருத்துவக் கல்லூரி மருத்துவமனையுடன்** இணைந்து செயல்படும் முதன்மை மருத்துவ மறுவாழ்வு நிறுவனம்.

• **படிப்புகள்:**
  - **BPT (4.5 ஆண்டுகள்):** 4 ஆண்டுகள் படிப்பு + 6 மாதங்கள் மருத்துவமனை இன்டர்ன்ஷிப்.
  - **MPT (2 ஆண்டுகள்) — 7 சிறப்புப் பிரிவுகள்:**
    - தசைக்கூடு (Ortho), நரம்பியல் (Neuro), விளையாட்டு அறிவியல் (Sports), இருதயம், குழந்தைகள் நலம், மகளிர் நலம், புற்றுநோய் அறிவியல்.
• **மருத்துவப் பயிற்சி:** 750 படுக்கை மருத்துவமனையில் தினசரி நேரடி நோயாளி சிகிச்சை பயிற்சி.
• **தகுதி:** 12-ல் இயற்பியல், வேதியியல், உயிரியலில் (PCB) குறைந்தபட்சம் 50% மதிப்பெண்கள்.

🌐 **துறை விவரங்கள்:** [srmtrichy.edu.in/institution/physiotherapy](https://www.srmtrichy.edu.in/institution/physiotherapy) | உதவி எண்: 📞 1800 202 4565`,
    source: "https://www.srmtrichy.edu.in/institution/physiotherapy"
  },

  // 12. Occupational Therapy
  {
    id: "occupational_therapy",
    matcher: /\b(occupational\s*therapy|bot|mot|ஆக்குபேஷனல்\s*தெரபி)\b/i,
    hodMatcher: /\b(hod|h\.o\.d|head|dean|தலைவர்|டீன்)\b/i,
    hod_en: `**Dr. D. Suresh, Ph.D.** is the Dean of the College of Occupational Therapy at SRM IST Trichy.\n\n🌐 **Source:** [srmtrichy.edu.in/institution/occupational-therapy](https://www.srmtrichy.edu.in/institution/occupational-therapy)`,
    hod_ta: `**முனைவர் D. சுரேஷ்** SRM IST திருச்சி ஆக்குபேஷனல் தெரபி கல்லூரியின் டீன் ஆவார்.\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/institution/occupational-therapy](https://www.srmtrichy.edu.in/institution/occupational-therapy)`,
    details_en: `**SRM College of Occupational Therapy — SRM IST Trichy:**

Dean: **Dr. D. Suresh, Ph.D.**
Approved under the National Commission for Allied and Healthcare Professions (NCAHP) Act.

• **Degrees Offered:**
  - **Bachelor of Occupational Therapy (BOT - 5 Years):** 4 Years Academic + 1 Year Clinical Internship.
  - **Master of Occupational Therapy (MOT - 2 Years):** Neurosciences, Paediatrics, Orthopaedics, Hand Therapy, Mental Health.
  - **Ph.D. in Occupational Therapy**
• **11 Specialized Rehabilitation Labs:** Sensory Integration Lab, Pediatric Therapy Suite, Orthotic & Prosthetic Fabrication Lab, Activities of Daily Living (ADL) Suite.
• **Eligibility:** 10+2 Higher Secondary with Physics, Chemistry, Biology (PCB) min 50%.

🌐 **Explore Occupational Therapy:** [srmtrichy.edu.in/institution/occupational-therapy](https://www.srmtrichy.edu.in/institution/occupational-therapy) | Helpline: 📞 1800 202 4565`,
    details_ta: `**ஆக்குபேஷனல் தெரபிக் கல்லூரி (BOT & MOT) — SRM IST திருச்சி:**

டீன்: **முனைவர் D. சுரேஷ்** (NCAHP சட்டத்தின் கீழ் அங்கீகரிக்கப்பட்டது).

• **படிப்புகள்:**
  - **BOT (5 ஆண்டுகள்):** 4 ஆண்டுகள் படிப்பு + 1 ஆண்டு மருத்துவமனை இன்டர்ன்ஷிப்.
  - **MOT (2 ஆண்டுகள்):** நரம்பியல், குழந்தைகள் நலம், எலும்பியல், கை சிகிச்சை, மனநலம்.
  - **Ph.D. முனைவர் ஆராய்ச்சி**.
• **11 சிறப்பு ஆய்வகங்கள்:** உணர்வு ஒருங்கிணைப்பு லேப், குழந்தைகள் மறுவாழ்வு லேப், செயற்கை கை-கால் தயாரிப்பு லேப்.
• **தகுதி:** 12-ல் PCB பாடங்களில் 50% மதிப்பெண்கள்.

🌐 **துறை விவரங்கள்:** [srmtrichy.edu.in/institution/occupational-therapy](https://www.srmtrichy.edu.in/institution/occupational-therapy) | உதவி எண்: 📞 1800 202 4565`,
    source: "https://www.srmtrichy.edu.in/institution/occupational-therapy"
  },

  // 13. Allied Health Sciences
  {
    id: "allied_health",
    matcher: /\b(allied\s*health(\s*sciences)?|அலைடு\s*ஹெல்த்)\b/i,
    hodMatcher: /\b(hod|h\.o\.d|head|dean|தலைவர்|டீன்)\b/i,
    hod_en: `Allied Health Sciences at SRM IST Trichy is clinically integrated with the 750-bed SRM Medical College Teaching Hospital under senior healthcare specialists.\n\n🌐 **Source:** [srmtrichy.edu.in/institution/allied-health-sciences](https://www.srmtrichy.edu.in/institution/allied-health-sciences)`,
    hod_ta: `அலைடு ஹெல்த் சயின்சஸ் புலம் 750 படுக்கை SRM மருத்துவக் கல்லூரி மருத்துவமனை மூத்த மருத்துவர்களால் வழிநடத்தப்படுகிறது.\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/institution/allied-health-sciences](https://www.srmtrichy.edu.in/institution/allied-health-sciences)`,
    details_en: `**Allied Health Sciences — SRM IST Trichy:**

Offers 17 specialized Undergraduate and Postgraduate clinical technology degree programmes affiliated with the on-campus **750-bed SRM Teaching Hospital**:

• **Bachelor (4 Years) & Master (2 Years) Programmes:**
  - Physician Associate
  - Dialysis Therapy Technology
  - Anesthesia & Operation Theatre Technology
  - Medical Laboratory Science
  - Respiratory Technology
  - Emergency Medical Technologist & Advanced Care Paramedic
  - Optometry
  - Nutrition and Dietetics
  - Medical Radiology and Imaging Technology
• **Clinical Exposure:** Full clinical residency in hospital operating rooms, diagnostic imaging labs, and ICUs.
• **Eligibility:** 10+2 with Physics, Chemistry, Biology (PCB).

🌐 **Explore Allied Health:** [srmtrichy.edu.in/institution/allied-health-sciences](https://www.srmtrichy.edu.in/institution/allied-health-sciences) | Helpline: 📞 1800 202 4565`,
    details_ta: `**அலைடு ஹெல்த் சயின்சஸ் (Allied Health Sciences) — SRM IST திருச்சி:**

வளாகத்தில் உள்ள **750 படுக்கை SRM மருத்துவக் கல்லூரி மருத்துவமனையுடன்** இணைந்து 17 சிறப்பு மருத்துவ தொழில்நுட்ப இளங்கலை மற்றும் முதுகலை படிப்புகளை வழங்குகிறது:

• **படிப்புகள் (UG 4 ஆண்டுகள் / PG 2 ஆண்டுகள்):**
  - Physician Associate (மருத்துவ உதவியாளர்)
  - Dialysis Therapy (டயாலிசிஸ் சிகிச்சை)
  - Anesthesia & Operation Theatre Technology (மயக்கவியல் & அறுவை அரங்கு)
  - Medical Laboratory Science (மருத்துவ ஆய்வக அறிவியல்)
  - Respiratory Technology (சுவாச சிகிச்சை)
  - Emergency Medical Technologist (அவசர கால சிகிச்சை)
  - Optometry (கண் பரிசோதனை அறிவியல்)
  - Nutrition and Dietetics (ஊட்டச்சத்து & உணவுமுறை)
  - Medical Radiology & Imaging Technology (ரேடியாலஜி & ஸ்கேன்)
• **தகுதி:** 12-ல் PCB பாடங்களில் தேர்ச்சி.

🌐 **துறை விவரங்கள்:** [srmtrichy.edu.in/institution/allied-health-sciences](https://www.srmtrichy.edu.in/institution/allied-health-sciences) | உதவி எண்: 📞 1800 202 4565`,
    source: "https://www.srmtrichy.edu.in/institution/allied-health-sciences"
  },

  // 14. Institute of Hotel Management
  {
    id: "hotel_management",
    matcher: /\b(hotel\s*management|hospitality|catering|ஹோட்டல்\s*மேனேஜ்மென்ட்)\b/i,
    hodMatcher: /\b(hod|h\.o\.d|head|தலைவர்|டீன்)\b/i,
    hod_en: `The Institute of Hotel Management is staffed by seasoned executive chefs and luxury hospitality leaders at SRM IST Trichy.\n\n🌐 **Source:** [srmtrichy.edu.in/institution/institute-of-hotel-management](https://www.srmtrichy.edu.in/institution/institute-of-hotel-management)`,
    hod_ta: `ஹோட்டல் மேனேஜ்மென்ட் பள்ளி 5-நட்சத்திர ஹோட்டல் அனுபவமிக்க தலைமை செஃப்கள் மற்றும் நிபுணர்களால் வழிநடத்தப்படுகிறது.\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/institution/institute-of-hotel-management](https://www.srmtrichy.edu.in/institution/institute-of-hotel-management)`,
    details_en: `**SRM Institute of Hotel Management (SIHM) — Trichy:**

Premier hospitality school offering international standard culinary and hotel administration training.

• **Programmes Offered:**
  - **B.Sc. Hotel and Hospitality Administration** (3 Years / Optional 4th Year Honours under NEP)
  - **Diploma in Hotel Management and Catering Science** (3 Years)
• **Infrastructure:** Basic & Advanced Training Commercial Kitchens, Quantity Food Kitchen, Confectionery & Bakery Unit, 40-Cover Training Restaurant, Model Suite Room, and Front Office Lab.
• **100% Luxury Placements:** Taj Hotels, Marriott International, The Oberoi Group, ITC Hotels, Hyatt, and luxury cruise liners.
• **Eligibility:** 10+2 in any stream (Science, Commerce, Arts).

🌐 **Explore Hotel Management:** [srmtrichy.edu.in/institution/institute-of-hotel-management](https://www.srmtrichy.edu.in/institution/institute-of-hotel-management) | Helpline: 📞 1800 202 4565`,
    details_ta: `**SRM ஹோட்டல் மேலாண்மை நிறுவனம் (SIHM) — திருச்சி:**

சர்வதேச தரத்திலான சமையற்கலை மற்றும் ஆடம்பர ஹோட்டல் நிர்வாகப் பயிற்சி தரும் நிறுவனம்.

• **படிப்புகள்:**
  - **B.Sc. ஹோட்டல் மற்றும் விருந்தோம்பல் நிர்வாகம்** (3/4 ஆண்டுகள்)
  - **டிப்ளமோ கேட்டரிங் சயின்ஸ்** (3 ஆண்டுகள்)
• **வசதிகள்:** பயிற்சி வணிக சமையலறை, பேக்கரி பிரிவு, 40-இருக்கை பயிற்சி உணவகம், ஃபிரண்ட் ஆபீஸ் லேப்.
• **100% வேலைவாய்ப்பு:** Taj, Marriott, Oberoi, ITC, Hyatt உள்ளிட்ட 5-நட்சத்திர ஆடம்பர ஹோட்டல்களில் வேலைவாய்ப்பு.
• **தகுதி:** 12-ல் எந்தவொரு பிரிவிலும் தேர்ச்சி.

🌐 **துறை விவரங்கள்:** [srmtrichy.edu.in/institution/institute-of-hotel-management](https://www.srmtrichy.edu.in/institution/institute-of-hotel-management) | உதவி எண்: 📞 1800 202 4565`,
    source: "https://www.srmtrichy.edu.in/institution/institute-of-hotel-management"
  }
];

/**
 * Handle Department or HoD query with precision
 */
export function handleDepartmentOrHodQuery(rawQuery, lang = "en") {
  if (!rawQuery) return null;
  const qLower = String(rawQuery).toLowerCase().trim();

  // Check if query is explicitly asking for HoD/Head (supporting English and Tamil)
  const isAskingForHod = /(?:\b(hod|h\.o\.d|head\s*of|who\s*is\s*the\s*head|who\s*heads|who\s*leads|head)\b|தலைவர்|துறை\s*தலைவர்|டீன்|ஹெச்\s*ஓ\s*டி)/i.test(qLower);

  // If the query is specifically asking about fees, hostel, mess, bus, transport, scholarship, admission procedure, or news/events,
  // let specialized handlers answer unless user explicitly asked for department details or HoD
  const isUtilityOrNews = /(?:\b(fees?|hostel|mess|bus|transport|scholarship|admission\s*form|application\s*form|how\s*to\s*apply|events?|news|activities|hackathons?)\b|கட்டணம்|விடுதி|பேருந்து|செய்திகள்|நிகழ்வுகள்)/i.test(qLower) &&
    !(/(?:\b(department|dept|about|details|info|overview|hod|h\.o\.d|head)\b|துறை|தலைவர்)/i.test(qLower));

  if (isUtilityOrNews && !isAskingForHod) {
    return null;
  }

  for (const dept of DEPARTMENTS) {
    if (dept.matcher.test(qLower)) {
      if (isAskingForHod) {
        const ans = lang === "ta" ? dept.hod_ta : dept.hod_en;
        return {
          answer: ans,
          source: dept.source,
          provider: "department-hod-resolver",
          topic: `${dept.id}_hod`,
          lang
        };
      } else {
        const ans = lang === "ta" ? dept.details_ta : dept.details_en;
        return {
          answer: ans,
          source: dept.source,
          provider: "department-details-resolver",
          topic: `${dept.id}_details`,
          lang
        };
      }
    }
  }

  return null;
}

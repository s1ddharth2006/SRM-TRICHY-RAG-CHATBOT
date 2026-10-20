import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateLocalEmbedding } from "../server/rag/vector-db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LEARN_FILE = path.join(__dirname, "..", "server", "data", "learned_questions.json");

const TRAINING_SET = [
  // Fees
  {
    question: "What is the fee structure for B.Tech Computer Science (CSE)?",
    answer: "B.Tech CSE annual tuition fee is **₹2,00,000 to ₹2,50,000 per year**.\n\n🌐 **Source:** [srmtrichy.edu.in/admission](https://www.srmtrichy.edu.in/admission)",
    lang: "en",
    category: "fees",
    source: "https://www.srmtrichy.edu.in/admission"
  },
  {
    question: "B.Tech CSE கட்டணம் எவ்வளவு?",
    answer: "B.Tech CSE ஆண்டு கல்விக் கட்டணம் **₹2,00,000 முதல் ₹2,50,000 வரை** ஆகும்.\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/admission](https://www.srmtrichy.edu.in/admission)",
    lang: "ta",
    category: "fees",
    source: "https://www.srmtrichy.edu.in/admission"
  },
  {
    question: "fee structure",
    answer: "• **B.Tech:** ₹1.5L – ₹2.5L / yr\n• **MBA:** ₹1.75L – ₹2.25L / yr\n• **BCA / BBA:** ₹80k – ₹1.1L / yr\n• **BPT:** ₹1.25L – ₹1.6L / yr\n\n🌐 **Source:** [srmtrichy.edu.in/admission](https://www.srmtrichy.edu.in/admission)",
    lang: "en",
    category: "fees",
    source: "https://www.srmtrichy.edu.in/admission"
  },
  {
    question: "கட்டணம் விவரம்",
    answer: "• **B.Tech:** ₹1.5L முதல் ₹2.5L / ஆண்டு\n• **MBA:** ₹1.75L முதல் ₹2.25L / ஆண்டு\n• **BCA / BBA:** ₹80k முதல் ₹1.1L / ஆண்டு\n• **BPT:** ₹1.25L முதல் ₹1.6L / ஆண்டு\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/admission](https://www.srmtrichy.edu.in/admission)",
    lang: "ta",
    category: "fees",
    source: "https://www.srmtrichy.edu.in/admission"
  },
  {
    question: "What is the fee for MBA at SRM Trichy?",
    answer: "MBA annual tuition fee is **₹1,75,000 to ₹2,25,000 per year** (2-year dual specialization program).\n\n🌐 **Source:** [srmtrichy.edu.in/institution/programmes](https://www.srmtrichy.edu.in/institution/programmes)",
    lang: "en",
    category: "fees",
    source: "https://www.srmtrichy.edu.in/institution/programmes"
  },
  {
    question: "MBA கட்டணம் எவ்வளவு?",
    answer: "MBA ஆண்டு கல்விக் கட்டணம் **₹1,75,000 முதல் ₹2,25,000 வரை** ஆகும் (2 ஆண்டுகள் படிப்பு).\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/institution/programmes](https://www.srmtrichy.edu.in/institution/programmes)",
    lang: "ta",
    category: "fees",
    source: "https://www.srmtrichy.edu.in/institution/programmes"
  },
  {
    question: "What is the fee for BCA and BBA?",
    answer: "• **BCA:** ₹80,000 to ₹1,05,000 / yr\n• **BBA:** ₹85,000 to ₹1,10,000 / yr\n• **B.Com:** ₹75,000 to ₹95,000 / yr\n\n🌐 **Source:** [srmtrichy.edu.in/institution/programmes](https://www.srmtrichy.edu.in/institution/programmes)",
    lang: "en",
    category: "fees",
    source: "https://www.srmtrichy.edu.in/institution/programmes"
  },
  {
    question: "What is the fee and duration for BPT (Physiotherapy)?",
    answer: "BPT is **4.5 years** (including 6-month clinical internship) with annual fee of **₹1,25,000 to ₹1,60,000**.\n\n🌐 **Source:** [srmtrichy.edu.in/institution/programmes](https://www.srmtrichy.edu.in/institution/programmes)",
    lang: "en",
    category: "programmes",
    source: "https://www.srmtrichy.edu.in/institution/programmes"
  },
  {
    question: "BPT பிசியோதெரபி கட்டணம் மற்றும் கால அளவு என்ன?",
    answer: "BPT படிப்பு **4.5 ஆண்டுகள்** (6 மாத மருத்துவமனை பயிற்சி உட்பட). ஆண்டு கட்டணம் **₹1,25,000 முதல் ₹1,60,000 வரை**.\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/institution/programmes](https://www.srmtrichy.edu.in/institution/programmes)",
    lang: "ta",
    category: "programmes",
    source: "https://www.srmtrichy.edu.in/institution/programmes"
  },

  // Eligibility & Maths
  {
    question: "Can I join B.Tech without Mathematics in 12th?",
    answer: "**No.** 12th Maths (PCM) is required for B.Tech. You can choose **BCA, BBA, B.Com, or BPT** without Maths.\n\n🌐 **Source:** [srmtrichy.edu.in/admission](https://www.srmtrichy.edu.in/admission)",
    lang: "en",
    category: "eligibility",
    source: "https://www.srmtrichy.edu.in/admission"
  },
  {
    question: "கணிதம் இல்லாமல் B.Tech படிக்க முடியுமா?",
    answer: "**இல்லை.** B.Tech சேர 12-ல் கணிதம் (PCM) கட்டாயம். கணிதம் இல்லாதவர்கள் **BCA, BBA, B.Com, அல்லது BPT** படிக்கலாம்.\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/admission](https://www.srmtrichy.edu.in/admission)",
    lang: "ta",
    category: "eligibility",
    source: "https://www.srmtrichy.edu.in/admission"
  },
  {
    question: "Can I get admission with 75% or 80% marks in 12th?",
    answer: "**Yes!** Minimum cutoff is 60% in PCM. Scores above 80% also qualify for a **25% merit scholarship**!\n\n🌐 **Source:** [srmtrichy.edu.in/admission](https://www.srmtrichy.edu.in/admission)",
    lang: "en",
    category: "eligibility",
    source: "https://www.srmtrichy.edu.in/admission"
  },
  {
    question: "12-ல் 80% மதிப்பெண் எடுத்தால் B.Tech கிடைக்குமா?",
    answer: "**ஆம்!** குறைந்தபட்ச தகுதி 60% PCM. மேலும் 80%-க்கு மேல் பெற்றால் **25% மெரிட் உதவித்தொகை** உண்டு!\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/admission](https://www.srmtrichy.edu.in/admission)",
    lang: "ta",
    category: "eligibility",
    source: "https://www.srmtrichy.edu.in/admission"
  },
  {
    question: "Is SRMJEEE entrance exam compulsory for SRM Trichy?",
    answer: "**Not compulsory.** Both **SRMJEEE rank** and direct **12th Board PCM marks (min 60%)** are accepted.\n\n🌐 **Source:** [srmtrichy.edu.in/admission](https://www.srmtrichy.edu.in/admission)",
    lang: "en",
    category: "eligibility",
    source: "https://www.srmtrichy.edu.in/admission"
  },
  {
    question: "SRMJEEE நுழைவுத் தேர்வு கட்டாயமா?",
    answer: "**கட்டாயமில்லை.** **SRMJEEE மதிப்பெண்** அல்லது நேரடி **12-ஆம் வகுப்பு PCM மெரிட் (60%+)** மூலமும் சேர்க்கை பெறலாம்.\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/admission](https://www.srmtrichy.edu.in/admission)",
    lang: "ta",
    category: "eligibility",
    source: "https://www.srmtrichy.edu.in/admission"
  },
  {
    question: "Can Diploma students join 2nd year B.Tech directly (Lateral Entry)?",
    answer: "**Yes!** 3-Year Diploma holders with 60%+ marks can join directly into 2nd Year B.Tech.\n\n🌐 **Source:** [srmtrichy.edu.in/admission](https://www.srmtrichy.edu.in/admission)",
    lang: "en",
    category: "eligibility",
    source: "https://www.srmtrichy.edu.in/admission"
  },
  {
    question: "டிப்ளமோ முடித்தவர்கள் நேரடி 2-ஆம் ஆண்டு B.Tech சேர முடியுமா?",
    answer: "**ஆம்!** 60% மதிப்பெண்ணுடன் 3 ஆண்டு பாலிடெக்னிக் டிப்ளமோ முடித்தவர்கள் நேரடி 2-ஆம் ஆண்டில் (Lateral Entry) சேரலாம்.\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/admission](https://www.srmtrichy.edu.in/admission)",
    lang: "ta",
    category: "eligibility",
    source: "https://www.srmtrichy.edu.in/admission"
  },

  // Scholarships
  {
    question: "What scholarships are offered at SRM Trichy?",
    answer: "• **90%+ in 12th:** 50% tuition waiver for 4 years\n• **80%–89%:** 25% tuition waiver\n• **Sports / SRMJEEE Toppers:** Up to 100% full concession\n\n🌐 **Source:** [srmtrichy.edu.in/admission](https://www.srmtrichy.edu.in/admission)",
    lang: "en",
    category: "scholarships",
    source: "https://www.srmtrichy.edu.in/admission"
  },
  {
    question: "உதவித்தொகை சலுகைகள் என்னென்ன?",
    answer: "• **12-ல் 90%+:** 4 ஆண்டுகளுக்கும் 50% கட்டண தள்ளுபடி\n• **80%–89%:** 25% கட்டண தள்ளுபடி\n• **விளையாட்டு பிரிவு:** 100% வரை முழு உதவித்தொகை\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/admission](https://www.srmtrichy.edu.in/admission)",
    lang: "ta",
    category: "scholarships",
    source: "https://www.srmtrichy.edu.in/admission"
  },

  // Placements
  {
    question: "What is the placement record and highest salary package?",
    answer: "**95%+ placed!** Highest package is **₹50 LPA** and average is **₹8.5 LPA** across 600+ companies including Amazon, Microsoft, and Zoho.\n\n🌐 **Source:** [srmtrichy.edu.in/placement](https://www.srmtrichy.edu.in/placement)",
    lang: "en",
    category: "placements",
    source: "https://www.srmtrichy.edu.in/placement"
  },
  {
    question: "வேலைவாய்ப்பு மற்றும் அதிகபட்ச சம்பளம் எவ்வளவு?",
    answer: "**95%+ வேலைவாய்ப்பு!** அதிகபட்ச சம்பளம் **₹50 LPA**, சராசரி **₹8.5 LPA**. Amazon, Zoho, TCS உள்ளிட்ட 600+ நிறுவனங்கள் வருகின்றன.\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/placement](https://www.srmtrichy.edu.in/placement)",
    lang: "ta",
    category: "placements",
    source: "https://www.srmtrichy.edu.in/placement"
  },
  {
    question: "highest package in placements",
    answer: "The highest salary package at SRM Trichy is **₹50 LPA**, with an average package of **₹8.5 LPA**.\n\n🌐 **Source:** [srmtrichy.edu.in/placement](https://www.srmtrichy.edu.in/placement)",
    lang: "en",
    category: "placements",
    source: "https://www.srmtrichy.edu.in/placement"
  },
  {
    question: "அதிகபட்ச சம்பளம்",
    answer: "SRM திருச்சியில் அதிகபட்ச சம்பளப் பேக்கேஜ் **₹50 LPA**, மற்றும் சராசரி சம்பளம் **₹8.5 LPA** ஆகும்.\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/placement](https://www.srmtrichy.edu.in/placement)",
    lang: "ta",
    category: "placements",
    source: "https://www.srmtrichy.edu.in/placement"
  },

  // Hostels & Food
  {
    question: "What are the hostel room types, fees, and food facilities?",
    answer: "Separate Boys & Girls AC/Non-AC hostels (2/3/4 sharing). Annual fee is **₹85,000 to ₹1,35,000**, including South/North Indian mess, Wi-Fi, and 24/7 security.\n\n🌐 **Source:** [srmtrichy.edu.in/campus-life](https://www.srmtrichy.edu.in/campus-life#accommodation)",
    lang: "en",
    category: "hostel",
    source: "https://www.srmtrichy.edu.in/campus-life#accommodation"
  },
  {
    question: "விடுதி வசதி மற்றும் கட்டணம் எப்படி இருக்கும்?",
    answer: "தனித்தனி ஏசி / நான்-ஏசி விடுதிகள் உண்டு (2/3/4 ஷேரிங்). கட்டணம் ஆண்டுக்கு **₹85,000 முதல் ₹1,35,000 வரை** (சுவையான சைவ/அசைவ உணவு, வைஃபை உட்பட).\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/campus-life](https://www.srmtrichy.edu.in/campus-life#accommodation)",
    lang: "ta",
    category: "hostel",
    source: "https://www.srmtrichy.edu.in/campus-life#accommodation"
  },
  {
    question: "hostel fee",
    answer: "Hostel fee is **₹85,000 to ₹1,35,000 per year** (AC & Non-AC, 2/3/4 sharing), including daily meals, electricity, and high-speed Wi-Fi.\n\n🌐 **Source:** [srmtrichy.edu.in/campus-life](https://www.srmtrichy.edu.in/campus-life#accommodation)",
    lang: "en",
    category: "hostel",
    source: "https://www.srmtrichy.edu.in/campus-life#accommodation"
  },
  {
    question: "விடுதி கட்டணம்",
    answer: "விடுதிக் கட்டணம் ஆண்டுக்கு **₹85,000 முதல் ₹1,35,000 வரை** (ஏசி / நான்-ஏசி, உணவு மற்றும் வைஃபை உட்பட).\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/campus-life](https://www.srmtrichy.edu.in/campus-life#accommodation)",
    lang: "ta",
    category: "hostel",
    source: "https://www.srmtrichy.edu.in/campus-life#accommodation"
  },
  {
    question: "What are the hostel curfew timings?",
    answer: "Hostel curfew is **8:30 PM for boys** and **7:00 PM for girls**.\n\n🌐 **Source:** [srmtrichy.edu.in/campus-life](https://www.srmtrichy.edu.in/campus-life)",
    lang: "en",
    category: "hostel",
    source: "https://www.srmtrichy.edu.in/campus-life"
  },
  {
    question: "விடுதி நேரக் கட்டுப்பாடு என்ன?",
    answer: "விடுதி நேரக் கட்டுப்பாடு: **இரவு 8:30 (மாணவர்)** மற்றும் **மாலை 7:00 (மாணவியர்)**.\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/campus-life](https://www.srmtrichy.edu.in/campus-life)",
    lang: "ta",
    category: "hostel",
    source: "https://www.srmtrichy.edu.in/campus-life"
  },

  // Courses & Degrees
  {
    question: "What courses are offered at SRM Trichy?",
    answer: "SRM Trichy offers **B.Tech (CSE, AI & DS, Cyber Security, ECE, Biotech)**, **MBA**, **BPT (Physiotherapy)**, **BCA**, **BBA**, and **B.Com**.\n\n🌐 **Source:** [srmtrichy.edu.in/institution/programmes](https://www.srmtrichy.edu.in/institution/programmes)",
    lang: "en",
    category: "programmes",
    source: "https://www.srmtrichy.edu.in/institution/programmes"
  },
  {
    question: "SRM திருச்சியில் என்னென்ன படிப்புகள் உள்ளன?",
    answer: "SRM திருச்சி **B.Tech (CSE, AI & DS, சைபர் செக்யூரிட்டி, ECE, பயோடெக்)**, **MBA**, **BPT (இயன்முறை மருத்துவம்)**, **BCA**, **BBA**, மற்றும் **B.Com** ஆகிய படிப்புகளை வழங்குகிறது.\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/institution/programmes](https://www.srmtrichy.edu.in/institution/programmes)",
    lang: "ta",
    category: "programmes",
    source: "https://www.srmtrichy.edu.in/institution/programmes"
  },
  {
    question: "Does SRM Trichy have AI and Data Science (AI & DS)?",
    answer: "**Yes!** B.Tech AI & Data Science has **NVIDIA GPU computing labs**, Machine Learning, and Big Data (Fee: ₹2.0L–₹2.5L/yr).\n\n🌐 **Source:** [srmtrichy.edu.in/institution/programmes](https://www.srmtrichy.edu.in/institution/programmes)",
    lang: "en",
    category: "programmes",
    source: "https://www.srmtrichy.edu.in/institution/programmes"
  },
  {
    question: "AI மற்றும் Data Science படிப்பு உள்ளதா?",
    answer: "**ஆம்!** **NVIDIA GPU ஆய்வகங்களுடன்** கூடிய B.Tech AI & Data Science படிப்பு உள்ளது (ஆண்டு கட்டணம் ₹2.0L முதல் ₹2.5L).\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/institution/programmes](https://www.srmtrichy.edu.in/institution/programmes)",
    lang: "ta",
    category: "programmes",
    source: "https://www.srmtrichy.edu.in/institution/programmes"
  },

  // Hospital, Bus, Facilities
  {
    question: "Is there a hospital on campus?",
    answer: "**Yes.** SRM Trichy has a **750-bed Super Speciality Teaching Hospital** on campus with 24/7 casualty and ambulance.\n\n🌐 **Source:** [srmtrichy.edu.in/campus-life](https://www.srmtrichy.edu.in/campus-life)",
    lang: "en",
    category: "facilities",
    source: "https://www.srmtrichy.edu.in/campus-life"
  },
  {
    question: "வளாகத்தில் மருத்துவமனை உள்ளதா?",
    answer: "**ஆம்.** வளாகத்திலேயே 24/7 அவசர சிகிச்சைப் பிரிவு கொண்ட **750 படுக்கை SRM மருத்துவமனை** உள்ளது.\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/campus-life](https://www.srmtrichy.edu.in/campus-life)",
    lang: "ta",
    category: "facilities",
    source: "https://www.srmtrichy.edu.in/campus-life"
  },
  {
    question: "Are college buses available?",
    answer: "**Yes.** 40+ college buses connect Trichy, Thanjavur, Karur, Srirangam, and Perambalur (Fee: ₹25,000–₹40,000/yr).\n\n🌐 **Source:** [srmtrichy.edu.in/campus-life](https://www.srmtrichy.edu.in/campus-life#transport)",
    lang: "en",
    category: "facilities",
    source: "https://www.srmtrichy.edu.in/campus-life#transport"
  },
  {
    question: "பேருந்து வசதி உள்ளதா?",
    answer: "**ஆம்.** திருச்சி, தஞ்சாவூர், கரூர், ஸ்ரீரங்கம், பெரம்பலூர் வழித்தடங்களில் 40+ கல்லூரி பேருந்துகள் இயங்குகின்றன.\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/campus-life](https://www.srmtrichy.edu.in/campus-life#transport)",
    lang: "ta",
    category: "facilities",
    source: "https://www.srmtrichy.edu.in/campus-life#transport"
  },

  // Contact & Location
  {
    question: "What is the contact number and admission helpline?",
    answer: "• **Toll-Free:** 1800 202 4565\n• **Campus Phone:** 0431 - 2258900\n• **Email:** admissions@srmtrichy.edu.in\n• **Address:** SRM Nagar, NH-45, Samayapuram, Trichy - 621105.\n\n🌐 **Source:** [srmtrichy.edu.in/contact](https://www.srmtrichy.edu.in/contact)",
    lang: "en",
    category: "contact",
    source: "https://www.srmtrichy.edu.in/contact"
  },
  {
    question: "தொடர்பு எண் மற்றும் உதவி எண் என்ன?",
    answer: "• **கட்டணமில்லா எண்:** 1800 202 4565\n• **தொலைபேசி:** 0431 - 2258900\n• **மின்னஞ்சல்:** admissions@srmtrichy.edu.in\n• **முகவரி:** SRM நகர், NH-45, சமயபுரம், திருச்சி - 621105.\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/contact](https://www.srmtrichy.edu.in/contact)",
    lang: "ta",
    category: "contact",
    source: "https://www.srmtrichy.edu.in/contact"
  },
  {
    question: "Where is SRM Trichy located?",
    answer: "Located along the **Trichy-Chennai National Highway (NH-45)** near Samayapuram temple, Tiruchirappalli - 621105.\n\n🌐 **Source:** [srmtrichy.edu.in/campus-life](https://www.srmtrichy.edu.in/campus-life)",
    lang: "en",
    category: "contact",
    source: "https://www.srmtrichy.edu.in/campus-life"
  },
  {
    question: "SRM கல்லூரி எங்கு அமைந்துள்ளது?",
    answer: "**திருச்சி - சென்னை தேசிய நெடுஞ்சாலையில் (NH-45)** சமயபுரம் அருகே 50+ ஏக்கரில் அமைந்துள்ளது (SRM நகர், திருச்சி - 621105).\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/campus-life](https://www.srmtrichy.edu.in/campus-life)",
    lang: "ta",
    category: "contact",
    source: "https://www.srmtrichy.edu.in/campus-life"
  },

  // Accreditation & Leadership
  {
    question: "What is the NAAC accreditation of SRM Trichy?",
    answer: "SRM IST is accredited with the highest **NAAC A++ Grade** and is recognized as a **UGC Category-1 Autonomous University**.\n\n🌐 **Source:** [srmtrichy.edu.in/about](https://www.srmtrichy.edu.in/about)",
    lang: "en",
    category: "about",
    source: "https://www.srmtrichy.edu.in/about"
  },
  {
    question: "SRM கல்லூரியின் அங்கீகாரம் என்ன?",
    answer: "SRM திருச்சி **NAAC A++ தரம்** மற்றும் **UGC பிரிவு-1 தன்னாட்சி பல்கலைக்கழக** அங்கீகாரம் பெற்றுள்ளது.\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/about](https://www.srmtrichy.edu.in/about)",
    lang: "ta",
    category: "about",
    source: "https://www.srmtrichy.edu.in/about"
  },
  {
    question: "Who is the Chancellor of SRM?",
    answer: "**Dr. T. R. Paarivendhar** is the Founder Chancellor, and **Dr. C. Muthamizhchelvan** is the Vice Chancellor of SRM IST.\n\n🌐 **Source:** [srmtrichy.edu.in/about](https://www.srmtrichy.edu.in/about)",
    lang: "en",
    category: "about",
    source: "https://www.srmtrichy.edu.in/about"
  },
  {
    question: "SRM நிறுவன வேந்தர் யார்?",
    answer: "SRM-ன் நிறுவனர் மற்றும் வேந்தர் **முனைவர் டி. ஆர். பாரிவேந்தர்** ஆவார். துணைவேந்தர் **முனைவர் சி. முத்தமிழ்செல்வன்** ஆவார்.\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/about](https://www.srmtrichy.edu.in/about)",
    lang: "ta",
    category: "about",
    source: "https://www.srmtrichy.edu.in/about"
  },

  // Application
  {
    question: "How to apply for admission online?",
    answer: "Apply online at **https://admissions.srmtrichy.edu.in/**. Application fee is **₹1,200**.\n\n🌐 **Source:** [admissions.srmtrichy.edu.in](https://admissions.srmtrichy.edu.in/)",
    lang: "en",
    category: "admissions",
    source: "https://admissions.srmtrichy.edu.in/"
  },
  {
    question: "சேர்க்கைக்கு விண்ணப்பிப்பது எப்படி?",
    answer: "**https://admissions.srmtrichy.edu.in/** இணையதளத்தில் ஆன்லைனில் விண்ணப்பிக்கலாம். விண்ணப்பக் கட்டணம் **₹1,200**.\n\n🌐 **ஆதாரம்:** [admissions.srmtrichy.edu.in](https://admissions.srmtrichy.edu.in/)",
    lang: "ta",
    category: "admissions",
    source: "https://admissions.srmtrichy.edu.in/"
  }
];

// Vectorize and save
console.log(`Vectorizing and training ${TRAINING_SET.length} comprehensive Q&A pairs...`);

const learnedList = TRAINING_SET.map((item, idx) => ({
  id: `train_${Date.now()}_${idx}`,
  question: item.question,
  answer: item.answer,
  source: item.source,
  score: 1.0,
  status: "verified_trained",
  provider: "trained-website-knowledge",
  lang: item.lang,
  category: item.category,
  vector: generateLocalEmbedding(item.question),
  askCount: 5,
  lastAskedAt: new Date().toISOString()
}));

fs.writeFileSync(LEARN_FILE, JSON.stringify(learnedList, null, 2), "utf8");
console.log(`Successfully trained and saved ${learnedList.length} learned questions to ${LEARN_FILE} !`);

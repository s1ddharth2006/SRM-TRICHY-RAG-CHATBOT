import fs from "fs";
import path from "path";
import crypto from "crypto";
import { generateLocalEmbedding } from "../server/rag/vector-db.js";

const FAQS_PATH = "./server/data/faqs.json";
const LEARNED_PATH = "./server/data/learned_questions.json";

const existingFaqs = JSON.parse(fs.readFileSync(FAQS_PATH, "utf8"));
const existingLearned = JSON.parse(fs.readFileSync(LEARNED_PATH, "utf8"));

const NEW_TRAINING_PAIRS = [
  // 1. PhD Application Form & Portal
  {
    q_en: "How do I apply online for PhD at SRM Trichy?",
    a_en: "You can apply online for Ph.D. admissions (Full-Time / Part-Time) at the official registration portal: [registration.srmtrichy.edu.in/ph-d-application-form-2027](https://registration.srmtrichy.edu.in/ph-d-application-form-2027). Meritorious full-time scholars receive University Research Fellowships up to ₹31,000/month.\n\n🌐 **Source:** [PhD Registration Portal](https://registration.srmtrichy.edu.in/ph-d-application-form-2027)",
    q_ta: "SRM திருச்சியில் Ph.D. முனைவர் பட்டத்திற்கு ஆன்லைனில் எப்படி விண்ணப்பிப்பது?",
    a_ta: "SRM திருச்சியில் Ph.D. (முழுநேர / பகுதிநேர) சேர்க்கைக்கு அதிகாரப்பூர்வ விண்ணப்ப போர்ட்டல் மூலம் விண்ணப்பிக்கலாம்: [registration.srmtrichy.edu.in/ph-d-application-form-2027](https://registration.srmtrichy.edu.in/ph-d-application-form-2027). தகுதியான முழுநேர ஆராய்ச்சியாளர்களுக்கு மாதம் ₹31,000 வரை ஆராய்ச்சி உதவித்தொகை (URF) வழங்கப்படுகிறது.\n\n🌐 **ஆதாரம்:** [PhD விண்ணப்ப போர்ட்டல்](https://registration.srmtrichy.edu.in/ph-d-application-form-2027)",
    category: "admissions_phd",
    source: "https://registration.srmtrichy.edu.in/ph-d-application-form-2027"
  },

  // 2. International Student Application
  {
    q_en: "Where can international students apply for SRM Trichy?",
    a_en: "International students can apply directly through the dedicated international admissions portal: [registration.srmtrichy.edu.in/srmist-international-application-form-trichy](https://registration.srmtrichy.edu.in/srmist-international-application-form-trichy) or email director.communications@srmist.edu.in.\n\n🌐 **Source:** [International Application Portal](https://registration.srmtrichy.edu.in/srmist-international-application-form-trichy)",
    q_ta: "வெளிநாட்டு மற்றும் சர்வதேச மாணவர்கள் எங்கு விண்ணப்பிக்க வேண்டும்?",
    a_ta: "சர்வதேச மாணவர்கள் SRM IST திருச்சி சர்வதேச சேர்க்கை போர்ட்டல் வழியாக நேரடியாக விண்ணப்பிக்கலாம்: [registration.srmtrichy.edu.in/srmist-international-application-form-trichy](https://registration.srmtrichy.edu.in/srmist-international-application-form-trichy) அல்லது மின்னஞ்சல்: director.communications@srmist.edu.in.\n\n🌐 **ஆதாரம்:** [சர்வதேச சேர்க்கை போர்ட்டல்](https://registration.srmtrichy.edu.in/srmist-international-application-form-trichy)",
    category: "admissions_international",
    source: "https://registration.srmtrichy.edu.in/srmist-international-application-form-trichy"
  },

  // 3. Apple iMac Lab & Xcode
  {
    q_en: "Tell me about the Apple iMac Lab at SRM Trichy",
    a_en: "The **Apple iMac Centre of Excellence** is an enterprise-grade iOS development lab equipped with high-end Apple iMacs, Xcode, and Swift environments for training students in iOS, iPadOS, and macOS app development.\n\n🌐 **Source:** [srmtrichy.edu.in/institution/engineering-and-technology](https://www.srmtrichy.edu.in/institution/engineering-and-technology)",
    q_ta: "SRM திருச்சியில் உள்ள Apple iMac ஆய்வகம் பற்றி கூறுங்கள்",
    a_ta: "SRM திருச்சியில் **Apple iMac ஆப் மேம்பாட்டு மையம் (Centre of Excellence)** உள்ளது. இதில் நவீன Apple iMac கணினிகள், Xcode மற்றும் Swift மூலம் iOS, iPadOS மற்றும் மேக் செயலிகளை உருவாக்கும் சர்வதேச பயிற்சி வழங்கப்படுகிறது.\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/institution/engineering-and-technology](https://www.srmtrichy.edu.in/institution/engineering-and-technology)",
    category: "infrastructure",
    source: "https://www.srmtrichy.edu.in/institution/engineering-and-technology"
  },

  // 4. Fortinet Cyber Lab & Ethical Hacking
  {
    q_en: "What facilities are in the Cyber Security Lab?",
    a_en: "The **Fortinet Cyber Security Industry Lab** features FortiGate Enterprise Next-Gen Firewalls, FortiSIEM threat intelligence analytics, Cisco Networking Academy, and active Capture The Flag (CTF) ethical hacking arenas (HoD: Dr. R. Deebalakshmi).\n\n🌐 **Source:** [srmtrichy.edu.in/departments/cyber-security](https://www.srmtrichy.edu.in/departments/cyber-security)",
    q_ta: "சைபர் செக்யூரிட்டி ஆய்வகத்தில் என்னென்ன வசதிகள் உள்ளன?",
    a_ta: "சைபர் செக்யூரிட்டி துறையில் சர்வதேச **Fortinet ஆய்வகம்** (FortiGate ஃபயர்வால், FortiSIEM பாதுகாப்பு பகுப்பாய்வு), Cisco அகாடமி மற்றும் CTF எத்திக்கல் ஹேக்கிங் பயிற்சி வசதிகள் உள்ளன (துறை தலைவர்: முனைவர் R. தீபலக்ஷ்மி).\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/departments/cyber-security](https://www.srmtrichy.edu.in/departments/cyber-security)",
    category: "departments",
    source: "https://www.srmtrichy.edu.in/departments/cyber-security"
  },

  // 5. Teaching Hospital on Campus
  {
    q_en: "Is there a hospital inside SRM Trichy campus?",
    a_en: "Yes! The campus features the **750-bed SRM Medical College Hospital & Research Centre**, providing 24/7 super-specialty trauma care, ICU, MRI/CT diagnostics, blood bank, and free/subsidized medical consultations for students.\n\n🌐 **Source:** [srmtrichy.edu.in/campus-life](https://www.srmtrichy.edu.in/campus-life)",
    q_ta: "SRM திருச்சி வளாகத்தில் மருத்துவமனை உள்ளதா?",
    a_ta: "ஆம்! வளாகத்திற்குள்ளேயே **750 படுக்கைகள் கொண்ட SRM மருத்துவக் கல்லூரி மருத்துவமனை மற்றும் ஆராய்ச்சி மையம்** செயல்படுகிறது. 24/7 அவசர சிகிச்சை, ICU, MRI, CT ஸ்கேன் மற்றும் மாணவர்களுக்கான மருத்துவ வசதிகள் இங்கு உள்ளன.\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/campus-life](https://www.srmtrichy.edu.in/campus-life)",
    category: "campus_life",
    source: "https://www.srmtrichy.edu.in/campus-life"
  },

  // 6. Bus Transport Routes & Costs
  {
    q_en: "What are the college bus routes and transport fees?",
    a_en: "SRM Trichy operates a **40+ bus fleet** covering Trichy Central, Chathiram, Srirangam, Thanjavur, Karur, Perambalur, Pudukkottai, Ariyalur, and Musiri. Annual bus fees range from **₹25,000 to ₹40,000** based on route distance.\n\n🌐 **Source:** [srmtrichy.edu.in/campus-life#transport](https://www.srmtrichy.edu.in/campus-life)",
    q_ta: "கல்லூரி பேருந்து வழித்தடங்கள் மற்றும் கட்டணம் என்ன?",
    a_ta: "SRM திருச்சி **40+ பேருந்துகளை** இயக்குகிறது. திருச்சி சென்ட்ரல், சத்திரம், ஸ்ரீரங்கம், தஞ்சாவூர், கரூர், பெரம்பலூர், புதுக்கோட்டை ஆகிய வழித்தடங்களை இணைக்கிறது. ஆண்டு கட்டணம் தூரத்தைப் பொறுத்து **₹25,000 முதல் ₹40,000** வரை.\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/campus-life#transport](https://www.srmtrichy.edu.in/campus-life)",
    category: "campus_life",
    source: "https://www.srmtrichy.edu.in/campus-life"
  },

  // 7. Hostel Fees & Room Types
  {
    q_en: "What are the hostel room options and fees?",
    a_en: "Separate Boys & Girls secure hostels offer **2, 3, and 4-sharing in AC and Non-AC** rooms with hygienic South/North Indian mess food (4 meals daily), high-speed Wi-Fi, and 24/7 security. Annual fee: **₹85,000 to ₹1,35,000/year**.\n\n🌐 **Source:** [srmtrichy.edu.in/campus-life#accommodation](https://www.srmtrichy.edu.in/campus-life)",
    q_ta: "விடுதி அறைகள் மற்றும் கட்டண விவரங்கள் என்ன?",
    a_ta: "மாணவர் மற்றும் மாணவியருக்கு தனித்தனி விடுதிகள் உள்ளன. **2, 3, 4 நபர்கள் தங்கும் AC மற்றும் நான்-AC அறைகள்**, 4 வேளை சுகாதாரமான உணவு, வைஃபை மற்றும் 24/7 பாதுகாப்பு வசதியுடன் உண்டு. கட்டணம்: **₹85,000 முதல் ₹1,35,000/ஆண்டு**.\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/campus-life#accommodation](https://www.srmtrichy.edu.in/campus-life)",
    category: "campus_life",
    source: "https://www.srmtrichy.edu.in/campus-life"
  },

  // 8. Lateral Entry Direct 2nd Year
  {
    q_en: "Can diploma holders join B.Tech direct second year lateral entry?",
    a_en: "Yes! Students with a recognized **3-Year Polytechnic Diploma in Engineering** (min 60% aggregate) or B.Sc. with Mathematics are eligible for **Direct 2nd Year B.Tech Lateral Entry**.\n\n🌐 **Source:** [srmtrichy.edu.in/admission](https://www.srmtrichy.edu.in/admission)",
    q_ta: "டிப்ளமோ முடித்தவர்கள் நேரடியாக 2-ஆம் ஆண்டு B.Tech லேட்டரல் என்ட்ரியில் சேர முடியுமா?",
    a_ta: "ஆம்! அங்கீகரிக்கப்பட்ட பாலிடெக்னிக் கல்லூரியில் **3 ஆண்டு பொறியியல் டிப்ளமோ** (குறைந்தபட்சம் 60% மதிப்பெண்) அல்லது கணிதத்துடன் B.Sc. முடித்தவர்கள் நேரடியாக 2-ஆம் ஆண்டு B.Tech லேட்டரல் என்ட்ரியில் சேரலாம்.\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/admission](https://www.srmtrichy.edu.in/admission)",
    category: "admissions",
    source: "https://www.srmtrichy.edu.in/admission"
  },

  // 9. Merit Scholarships
  {
    q_en: "What scholarships are available for 12th marks?",
    a_en: "SRM Trichy offers merit scholarships: **50% tuition fee waiver** for students scoring 90%+ in 12th boards, and **25% tuition fee waiver** for scoring 80% to 89%. Top 100 SRMJEEE rankers receive up to 100% full waiver.\n\n🌐 **Source:** [srmtrichy.edu.in/admission](https://www.srmtrichy.edu.in/admission)",
    q_ta: "12-ஆம் வகுப்பு மதிப்பெண்களுக்கு என்னென்ன உதவித்தொகை சலுகைகள் உள்ளன?",
    a_ta: "12-ல் **90% மற்றும் அதற்கு மேல்** மதிப்பெண் பெற்ற மாணவர்களுக்கு **50% கல்விக் கட்டண தள்ளுபடி**; **80% முதல் 89%** வரை பெற்றவர்களுக்கு **25% கட்டண தள்ளுபடி** மெரிட் உதவித்தொகையாக வழங்கப்படுகிறது.\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/admission](https://www.srmtrichy.edu.in/admission)",
    category: "admissions",
    source: "https://www.srmtrichy.edu.in/admission"
  },

  // 10. Placement Record & Top Recruiters
  {
    q_en: "What is the placement record and highest salary at SRM Trichy?",
    a_en: "SRM Trichy maintains a **95%+ placement record** with a highest salary package of **₹50 LPA** and average package of **₹8.5 LPA** across **600+ top recruiters** including Amazon, Microsoft, Zoho, TCS, and Infosys.\n\n🌐 **Source:** [srmtrichy.edu.in/placement](https://www.srmtrichy.edu.in/placement)",
    q_ta: "SRM திருச்சியில் வேலைவாய்ப்பு மற்றும் அதிகபட்ச சம்பளம் என்ன?",
    a_ta: "SRM திருச்சியில் **95%+ வேலைவாய்ப்பு** பதிவு செய்யப்பட்டுள்ளது. அதிகபட்ச சம்பளம் **₹50 LPA**, சராசரி சம்பளம் **₹8.5 LPA**. Amazon, Microsoft, Zoho, TCS உள்ளிட்ட **600+ முன்னணி நிறுவனங்கள்** வளாகத் தேர்வுக்கு வருகின்றன.\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/placement](https://www.srmtrichy.edu.in/placement)",
    category: "placements",
    source: "https://www.srmtrichy.edu.in/placement"
  },

  // 11. Central Library
  {
    q_en: "What are the facilities in the Central Digital Library?",
    a_en: "The fully air-conditioned **Central Digital Library** holds 50,000+ books, 12,000+ titles, print journals, and online subscriptions to **IEEE Xplore, ScienceDirect, and SpringerLink** with 100+ multimedia terminals.\n\n🌐 **Source:** [srmtrichy.edu.in/library](https://www.srmtrichy.edu.in/library)",
    q_ta: "மத்திய டிஜிட்டல் நூலகத்தில் என்னென்ன வசதிகள் உள்ளன?",
    a_ta: "முழுமையாக குளிரூட்டப்பட்ட **மத்திய நூலகத்தில்** 50,000+ புத்தகங்கள், **IEEE Xplore, ScienceDirect, SpringerLink** ஆகிய சர்வதேச டிஜிட்டல் இதழ்கள் மற்றும் 100+ மல்டிமீடியா கணினி முனையங்கள் உள்ளன.\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/library](https://www.srmtrichy.edu.in/library)",
    category: "infrastructure",
    source: "https://www.srmtrichy.edu.in/library"
  },

  // 12. Contact Numbers & Samayapuram Location
  {
    q_en: "What is the official phone number and address of SRM Trichy?",
    a_en: "Admissions Toll-Free: **1800 202 4565** | Mobile: **+91 98429 16830 / 84899 03631** | Campus: 0431 - 2258900. Address: SRM Nagar, Trichy-Chennai Highway (NH-45), near Samayapuram Toll Plaza, Trichy - 621105.\n\n🌐 **Source:** [srmtrichy.edu.in/contact](https://www.srmtrichy.edu.in/contact)",
    q_ta: "SRM திருச்சியின் அதிகாரப்பூர்வ தொடர்பு எண் மற்றும் முகவரி என்ன?",
    a_ta: "இலவச உதவி எண்: **1800 202 4565** | மொபைல்: **+91 98429 16830 / 84899 03631** | வளாகம்: 0431 - 2258900. முகவரி: SRM நகர், திருச்சி-சென்னை NH-45, சமயபுரம் அருகில், திருச்சி - 621105.\n\n🌐 **ஆதாரம்:** [srmtrichy.edu.in/contact](https://www.srmtrichy.edu.in/contact)",
    category: "contact",
    source: "https://www.srmtrichy.edu.in/contact"
  }
];

async function trainAll() {
  console.log("Training Chatbot with Comprehensive Scraped Website Knowledge...");

  let addedLearnedCount = 0;
  for (const pair of NEW_TRAINING_PAIRS) {
    // English version
    const existingEn = existingLearned.find(l => l.question.toLowerCase() === pair.q_en.toLowerCase());
    if (!existingEn) {
      existingLearned.push({
        id: `learned_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        question: pair.q_en,
        answer: pair.a_en,
        lang: "en",
        category: pair.category,
        source: pair.source,
        provider: "official-website-scrape",
        embedding: generateLocalEmbedding(pair.q_en),
        learnedAt: new Date().toISOString(),
        verified: true
      });
      addedLearnedCount++;
    }

    // Tamil version
    const existingTa = existingLearned.find(l => l.question.toLowerCase() === pair.q_ta.toLowerCase());
    if (!existingTa) {
      existingLearned.push({
        id: `learned_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        question: pair.q_ta,
        answer: pair.a_ta,
        lang: "ta",
        category: pair.category,
        source: pair.source,
        provider: "official-website-scrape",
        embedding: generateLocalEmbedding(pair.q_ta),
        learnedAt: new Date().toISOString(),
        verified: true
      });
      addedLearnedCount++;
    }

    // Also add to FAQs if not present
    const existingFaq = existingFaqs.find(f => f.question_en.toLowerCase() === pair.q_en.toLowerCase());
    if (!existingFaq) {
      existingFaqs.push({
        id: `faq_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        category: pair.category,
        question_en: pair.q_en,
        question_ta: pair.q_ta,
        answer_en: pair.a_en,
        answer_ta: pair.a_ta,
        source: pair.source,
        keywords: [pair.category, "srm", "trichy"]
      });
    }
  }

  fs.writeFileSync(LEARNED_PATH, JSON.stringify(existingLearned, null, 2), "utf8");
  fs.writeFileSync(FAQS_PATH, JSON.stringify(existingFaqs, null, 2), "utf8");

  console.log(`✓ Training Complete!`);
  console.log(`✓ Added ${addedLearnedCount} new verified learned Q&A pairs. Total: ${existingLearned.length}`);
  console.log(`✓ Updated FAQs: ${existingFaqs.length}`);
}

trainAll();

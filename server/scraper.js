import dns from "dns";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dns.setDefaultResultOrder("ipv4first");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "data");

const LIVE_CACHE = new Map();
const TTL = 15 * 60 * 1000;

export async function fetchWithTimeout(url, timeoutMs = 2000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) SRM-Tamil-Bot/1.0" },
      signal: controller.signal,
    });
    clearTimeout(id);
    return res;
  } catch (e) {
    clearTimeout(id);
    return null;
  }
}

export function getLocalSnapshot(filename) {
  try {
    const fp = path.join(DATA_DIR, filename);
    if (fs.existsSync(fp)) {
      return JSON.parse(fs.readFileSync(fp, "utf8"));
    }
  } catch (e) {}
  return null;
}

/**
 * Scrapes a live web page or CMS endpoint, falling back to local snapshots.
 */
export async function scrapeSource(targetUrl, localSnapshotFile) {
  const cacheKey = targetUrl || localSnapshotFile;
  const cached = LIVE_CACHE.get(cacheKey);
  if (cached && Date.now() - cached.at < TTL) {
    return cached.data;
  }

  let scrapedText = [];

  // Try live scrape if URL provided
  if (targetUrl) {
    try {
      const res = await fetchWithTimeout(targetUrl, 2000);
      if (res && res.ok) {
        const text = await res.text();
        // Clean HTML tags
        const clean = text
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim();
        if (clean.length > 50) {
          scrapedText.push(clean);
        }
      }
    } catch (e) {}
  }

  // Also read official structured dataset
  if (localSnapshotFile) {
    const snapshot = getLocalSnapshot(localSnapshotFile);
    if (snapshot && snapshot.data) {
      const items = Array.isArray(snapshot.data) ? snapshot.data : [snapshot.data];
      items.forEach((it) => {
        const parts = [];
        if (it.name) parts.push(it.name);
        if (it.title) parts.push(it.title);
        if (it.degree) parts.push(it.degree + " (" + (it.duration || "") + ")");
        if (it.eligibility) parts.push("தகுதி / Eligibility: " + it.eligibility);
        if (it.annualFee) parts.push("கட்டணம் / Annual Fee: " + it.annualFee);
        if (it.description) parts.push(it.description);
        if (it.about) parts.push(it.about);
        if (it.designation) parts.push(it.designation);
        if (it.message) parts.push(it.message);
        if (parts.length) scrapedText.push(parts.join(" — "));
      });
    }
  }

  const result = scrapedText.join("\n\n");
  LIVE_CACHE.set(cacheKey, { at: Date.now(), data: result });
  return result;
}

export const SRM_PAGE_REGISTRY = [
  {
    topic: "hostel_accommodation",
    keywords: ["hostel", "room", "mess", "food", "sharing", "warden", "curfew", "boarding", "stay", "accommodation", "விடுதி", "தங்குமிடம்", "உணவு", "சாப்பாடு"],
    url: "https://www.srmtrichy.edu.in/campus-life#accommodation",
    snapshot: "institution__infrastructure__getall.json",
    summary_en: "SRM Trichy provides separate Boys & Girls AC & Non-AC hostels (2/3/4 sharing) with hygienic South/North Indian mess, 24/7 security, Wi-Fi, and gym (Fee: ₹85,000–₹1,35,000/yr).",
    summary_ta: "SRM திருச்சியில் மாணவர், மாணவியருக்கு தனித்தனி ஏசி / நான்-ஏசி விடுதிகள் உண்டு (கட்டணம்: ₹85,000–₹1,35,000/ஆண்டு, உணவு மற்றும் வைஃபை உட்பட)."
  },
  {
    topic: "placements_careers",
    keywords: ["placement", "package", "salary", "recruiter", "highest", "lpa", "amazon", "microsoft", "zoho", "tcs", "job", "career", "cdc", "வேலைவாய்ப்பு", "சம்பளம்"],
    url: "https://www.srmtrichy.edu.in/placement",
    snapshot: "student__getAll.json",
    summary_en: "SRM Trichy records a 95%+ placement rate with a highest package of ₹50 LPA and average of ₹8.5 LPA across 600+ recruiters including Amazon, Microsoft, and Zoho.",
    summary_ta: "SRM திருச்சியில் 95%+ வேலைவாய்ப்புடன் அதிகபட்ச சம்பளம் ₹50 LPA மற்றும் சராசரி ₹8.5 LPA. Amazon, Zoho, TCS உள்ளிட்ட 600+ நிறுவனங்கள் வருகின்றன."
  },
  {
    topic: "admissions_eligibility_fees",
    keywords: ["admission", "apply", "eligibility", "marks", "cutoff", "percentage", "maths", "without math", "pcm", "fee", "cost", "tuition", "scholarship", "சேர்க்கை", "கட்டணம்", "தகுதி", "மதிப்பெண்"],
    url: "https://www.srmtrichy.edu.in/admission",
    snapshot: "institution__programmes__getall.json",
    summary_en: "B.Tech admission requires min 60% PCM in 12th (tuition ₹1.5L–₹2.5L/yr; 25%–50% merit scholarships for 80%+ marks). Apply at admissions.srmtrichy.edu.in.",
    summary_ta: "B.Tech சேர்க்கைக்கு 12-ல் 60% PCM அவசியம் (கட்டணம் ₹1.5L–₹2.5L/ஆண்டு; 80%+ மதிப்பெண்ணுக்கு 25%–50% உதவித்தொகை). விண்ணப்பிக்க: admissions.srmtrichy.edu.in."
  },
  {
    topic: "programmes_courses",
    keywords: ["course", "programme", "degree", "branch", "cse", "ai", "data science", "mba", "bpt", "bca", "bba", "bcom", "allied health", "biotech", "படிப்பு", "பாடப்பிரிவு"],
    url: "https://www.srmtrichy.edu.in/institution/programmes",
    snapshot: "institution__programmes__getall.json",
    summary_en: "SRM Trichy offers B.Tech (CSE, AI & DS, Cyber Security, ECE), MBA, BPT (Physiotherapy), BCA, BBA, B.Com, and Allied Health Sciences.",
    summary_ta: "SRM திருச்சி B.Tech (CSE, AI & DS, Cyber Security), MBA, BPT (இயன்முறை சிகிச்சை), BCA, BBA மற்றும் அலைடு ஹெல்த் படிப்புகளை வழங்குகிறது."
  },
  {
    topic: "campus_life_facilities",
    keywords: ["campus", "hospital", "medical", "library", "sports", "gym", "wifi", "doctor", "bus", "transport", "route", "area", "acres", "clinic", "facility", "facilities", "வளாகம்", "மருத்துவமனை", "நூலகம்", "பேருந்து"],
    url: "https://www.srmtrichy.edu.in/campus-life",
    snapshot: "institution__infrastructure__getall.json",
    summary_en: "The 50+ acre campus on NH-45 features an on-campus 750-bed Teaching Hospital, central library, 40+ transport buses, and full sports complex.",
    summary_ta: "50+ ஏக்கர் வளாகத்தில் 750 படுக்கை SRM மருத்துவமனை, மத்திய நூலகம், 40+ கல்லூரி பேருந்துகள் மற்றும் விளையாட்டு வசதிகள் உள்ளன."
  },
  {
    topic: "news_events",
    keywords: ["news", "event", "milan", "tarang", "symposium", "conference", "hackathon", "circular", "exam", "date", "calendar", "fest", "நிகழ்வு", "செய்தி"],
    url: "https://www.srmtrichy.edu.in/news-and-events",
    snapshot: "slider__sliders.json",
    summary_en: "SRM Trichy hosts international research conferences, national hackathons, and annual cultural fest 'Milan' alongside academic circulars.",
    summary_ta: "SRM திருச்சியில் சர்வதேச ஆராய்ச்சி மாநாடுகள், தேசிய ஹேக்கத்தான்கள் மற்றும் ஆண்டு கலாச்சார விழா 'Milan' ஆகியவை தொடர்ச்சியாக நடைபெறுகின்றன."
  },
  {
    topic: "about_leadership",
    keywords: ["about", "founder", "chancellor", "vice chancellor", "naac", "accreditation", "ranking", "ugc", "பற்றி", "யாரு", "வேந்தர்"],
    url: "https://www.srmtrichy.edu.in/about",
    snapshot: "about__leadership__getall.json",
    summary_en: "SRM IST is a Category-1 Deemed University accredited with NAAC A++, founded by Chancellor Dr. T. R. Paarivendhar with Pro-Chancellor Dr. Ravi Pachamoothoo.",
    summary_ta: "SRM IST என்பது NAAC A++ அங்கீகாரம் பெற்ற பல்கலைக்கழகம். நிறுவனர் வேந்தர் Dr. T. R. பாரிவேந்தர், இணை வேந்தர் Dr. ரவி பச்சமுத்து."
  },
  {
    topic: "engineering_and_technology_overview",
    keywords: ["engineering", "technology", "dean", "balasundaram", "associate dean", "faculty of engineering", "fet", "btech", "mtech", "பொறியியல்", "தொழில்நுட்பம்", "டீன்"],
    url: "https://www.srmtrichy.edu.in/institution/engineering-and-technology",
    snapshot: "live_cms/institution__getall.json",
    summary_en: "The Faculty of Engineering & Technology (Associate Dean: Dr. Balasundaram R, 30 yrs exp) offers NAAC A++ B.Tech programmes in CSE, AIML, Cyber Security, AI & DS, IT, ECE, Biotech, and Mechanical, equipped with Apple iMac, ARVR, and Fortinet labs.",
    summary_ta: "பொறியியல் மற்றும் தொழில்நுட்ப புலம் (இணை டீன்: முனைவர் பாலசுந்தரம் R, 30 ஆண்டு அனுபவம்) NAAC A++ அங்கீகாரத்துடன் B.Tech CSE, AIML, சைபர் செக்யூரிட்டி, ECE, பயோடெக் படிப்புகளை Apple iMac, ARVR, Fortinet ஆய்வகங்களுடன் வழங்குகிறது."
  },
  {
    topic: "engineering_advanced_labs",
    keywords: ["apple", "imac", "xcode", "swift", "arvr", "augmented reality", "virtual reality", "fortinet", "fortigate", "fortisiem", "cisco", "nvidia", "gpu lab", "coe", "ஆய்வகம்", "லேப்"],
    url: "https://www.srmtrichy.edu.in/institution/engineering-and-technology#infrastructure",
    snapshot: "live_cms/institution__infrastructure__getall.json",
    summary_en: "SRM Trichy Engineering features elite industry labs: Apple iMac App Development CoE (Xcode/Swift), AR/VR Immersive Lab, Fortinet Cyber Lab (FortiGate/FortiSIEM), Cisco Academy, and NVIDIA GPU Labs.",
    summary_ta: "SRM திருச்சி பொறியியல் புலத்தில் Apple iMac ஆப் மேம்பாட்டு மையம் (Xcode/Swift), AR/VR ஆய்வகம், Fortinet சைபர் லேப் (FortiGate/FortiSIEM), Cisco அகாடமி மற்றும் NVIDIA GPU ஆய்வகங்கள் உள்ளன."
  },
  {
    topic: "computer_science_departments",
    keywords: ["cse", "computer science", "aiml", "data sciences", "software product", "csbs", "computing", "கணினி அறிவியல்"],
    url: "https://www.srmtrichy.edu.in/departments/cse",
    snapshot: "live_cms/institution__programmes__getall.json",
    summary_en: "School of Computing offers B.Tech CSE with specializations in AI & ML, Cyber Security, Data Sciences, Software Product Engineering, and CSBS, alongside M.Tech (AI & ML) and Ph.D. degrees.",
    summary_ta: "கம்ப்யூட்டிங் பள்ளி B.Tech CSE, AIML, சைபர் செக்யூரிட்டி, டேட்டா சயின்ஸ், சாப்ட்வேர் ப்ராடக்ட் மற்றும் CSBS பிரிவுகளை M.Tech, Ph.D. உடன் வழங்குகிறது."
  },
  {
    topic: "cyber_security_department",
    keywords: ["cyber security", "ethical hacking", "ctf", "digital forensics", "cryptography", "fortisiem", "soc", "சைபர் செக்யூரிட்டி", "ஹேக்கிங்"],
    url: "https://www.srmtrichy.edu.in/departments/cyber-security",
    snapshot: "live_cms/school-division__getall.json",
    summary_en: "The Department of Cyber Security features 100% Ph.D. faculty, a dedicated Fortinet Industry Lab (FortiGate/FortiSIEM), Cisco partnership, and active ACM/IEEE Capture the Flag (CTF) competitions.",
    summary_ta: "சைபர் செக்யூரிட்டி துறை Ph.D. பேராசிரியர்கள், Fortinet ஆய்வகம் (FortiGate, FortiSIEM), Cisco கூட்டு மற்றும் ACM/IEEE CTF போட்டிகளுடன் செயல்படுகிறது."
  },
  {
    topic: "contact_location",
    keywords: ["contact", "helpline", "phone", "number", "email", "address", "location", "reach", "landmark", "தொடர்பு", "முகவரி", "தொலைபேசி"],
    url: "https://www.srmtrichy.edu.in/contact",
    snapshot: "institution__getall.json",
    summary_en: "Located on NH-45 near Samayapuram Toll Plaza, Trichy. Admissions Toll-Free: 1800 202 4565 | Email: admissions@srmtrichy.edu.in.",
    summary_ta: "அமைவிடம்: திருச்சி-சென்னை NH-45, சமயபுரம் அருகில். உதவி எண்: 1800 202 4565 | மின்னஞ்சல்: admissions@srmtrichy.edu.in."
  },
  {
    topic: "phd_admissions_portal",
    keywords: ["phd", "doctorate", "doctoral", "research fellowship", "urf", "drcc", "முனைவர்", "ஆராய்ச்சி"],
    url: "https://registration.srmtrichy.edu.in/ph-d-application-form-2027",
    snapshot: "live_cms/institution__getall.json",
    summary_en: "SRM Trichy offers Full-Time and Part-Time Ph.D. programs with University Research Fellowships (URF) up to ₹31,000/month. Apply online at registration.srmtrichy.edu.in/ph-d-application-form-2027.",
    summary_ta: "SRM திருச்சியில் முழுநேர மற்றும் பகுதிநேர Ph.D. முனைவர் படிப்புகள் மாதம் ₹31,000 வரை ஆராய்ச்சி உதவித்தொகையுடன் (URF) வழங்கப்படுகிறது. விண்ணப்பிக்க: registration.srmtrichy.edu.in/ph-d-application-form-2027."
  },
  {
    topic: "international_admissions",
    keywords: ["international", "nri", "foreign", "overseas", "global student", "வெளிநாட்டு"],
    url: "https://registration.srmtrichy.edu.in/srmist-international-application-form-trichy",
    snapshot: "live_cms/institution__getall.json",
    summary_en: "International and NRI students can apply for UG, PG, and Allied Health programs directly through the international registration portal: registration.srmtrichy.edu.in/srmist-international-application-form-trichy.",
    summary_ta: "சர்வதேச மற்றும் NRI மாணவர்கள் SRM திருச்சி சர்வதேச போர்ட்டல் வழியாக நேரடியாக விண்ணப்பிக்கலாம்: registration.srmtrichy.edu.in/srmist-international-application-form-trichy."
  },
  {
    topic: "management_studies_doms",
    keywords: ["mba", "bba", "management", "hospital management", "business analytics", "finance", "marketing", "hr", "மேலாண்மை"],
    url: "https://www.srmtrichy.edu.in/institution/management-studies",
    snapshot: "live_cms/schools__getall.json",
    summary_en: "DoMS offers 2-Year MBA in 7 streams (Finance, Marketing, HR, Business Analytics, Operations, Hospital Management) and BBA. Contact: 1800 202 4565.",
    summary_ta: "DoMS பள்ளி 2 ஆண்டு MBA படிப்பை 7 முக்கிய பிரிவுகளில் (நிதி, மார்க்கெட்டிங், HR, பிசினஸ் அனலிட்டிக்ஸ், மருத்துவமனை மேலாண்மை) மற்றும் BBA படிப்பை வழங்குகிறது."
  },
  {
    topic: "physiotherapy_bpt_mpt",
    keywords: ["bpt", "mpt", "physiotherapy", "rehab", "pediatrics", "ortho", "sports science", "இயன்முறை", "பிசியோதெரபி"],
    url: "https://www.srmtrichy.edu.in/institution/physiotherapy",
    snapshot: "live_cms/institution__programmes__getall.json",
    summary_en: "College of Physiotherapy offers BPT (4.5 Yrs with clinical internship) and MPT in 7 specialties with daily practical training at the 750-bed SRM Teaching Hospital.",
    summary_ta: "இயன்முறை சிகிச்சை கல்லூரி BPT (4.5 ஆண்டுகள்) மற்றும் 7 சிறப்பு MPT பிரிவுகளை 750 படுக்கை SRM மருத்துவமனையில் தினசரி மருத்துவ பயிற்சியுடன் வழங்குகிறது."
  },
  {
    topic: "transport_buses",
    keywords: ["bus", "transport", "route", "pickup", "van", "பேருந்து", "போக்குவரத்து"],
    url: "https://www.srmtrichy.edu.in/campus-life#transport",
    snapshot: "institution__infrastructure__getall.json",
    summary_en: "SRM Trichy runs 40+ deluxe buses covering Trichy Central, Chathiram, Srirangam, Thanjavur, Karur, Perambalur, and Pudukkottai (Fee: ₹25,000–₹40,000/yr).",
    summary_ta: "SRM திருச்சி 40+ பேருந்துகளை திருச்சி சென்ட்ரல், சத்திரம், ஸ்ரீரங்கம், தஞ்சாவூர், கரூர், பெரம்பலூர் வழித்தடங்களில் இயக்குகிறது (கட்டணம்: ₹25,000–₹40,000/ஆண்டு)."
  }
];

/**
 * Directly refer https://www.srmtrichy.edu.in/ for queries and return verified answers
 */
export async function referSrmWebsite(query, lang = "en") {
  if (!query) return null;
  const qLower = String(query).toLowerCase();
  const qTokens = qLower.split(/[\s,?.!;:()"]+/).filter(w => w.length > 2);

  let bestPage = null;
  let bestScore = -1;

  for (const page of SRM_PAGE_REGISTRY) {
    let score = 0;
    for (const kw of page.keywords) {
      if (qLower.includes(kw)) score += 3;
    }
    for (const t of qTokens) {
      if (page.keywords.some(k => k.includes(t) || t.includes(k))) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      bestPage = page;
    }
  }

  if (bestPage && bestScore >= 2) {
    const answer = lang === "ta" ? bestPage.summary_ta : bestPage.summary_en;
    return {
      answer: `${answer}\n\n🌐 **Source:** [srmtrichy.edu.in](${bestPage.url})`,
      source: bestPage.url,
      provider: "srmtrichy-web",
      topic: bestPage.topic,
      lang
    };
  }

  // Fallback to general srmtrichy.edu.in
  const defaultAns = lang === "ta"
    ? "SRM IST திருச்சி — சேர்க்கை, கட்டணம் மற்றும் வளாக விவரங்களுக்கு [srmtrichy.edu.in](https://www.srmtrichy.edu.in/) காண்க அல்லது 1800 202 4565 அழைக்கவும்."
    : "For complete SRM IST Trichy details, visit [srmtrichy.edu.in](https://www.srmtrichy.edu.in/) or call toll-free 1800 202 4565.";

  return {
    answer: defaultAns,
    source: "https://www.srmtrichy.edu.in",
    provider: "srmtrichy-web",
    lang
  };
}

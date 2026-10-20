import { vectorDb } from "./vector-db.js";
import { translateText, looksTamil } from "../translate.js";

/**
 * Cross-lingual Tamil to English keyword dictionary for enhanced PDF vector retrieval
 */
const TAMIL_TO_EN_TERMS = {
  "சேர்க்கை": "admission apply register eligibility criteria",
  "கட்டணம்": "fee tuition cost fees annual structure",
  "படிப்பு": "courses programmes btech engineering mba bpt bca",
  "படிப்புகள்": "programmes courses branches btech",
  "விடுதி": "hostel accommodation room mess dining boys girls",
  "சாப்பாடு": "mess food dining canteen meals kitchen",
  "வேலைவாய்ப்பு": "placement jobs salary package recruiter lpa",
  "சம்பளம்": "salary package lpa highest average",
  "மதிப்பெண்": "marks percentage eligibility 12th pcm",
  "கணிதம்": "mathematics maths pcm without",
  "உதவித்தொகை": "scholarship waiver concession merit sports",
  "வளாகம்": "campus area acres hospital library sports bus transport",
  "மருத்துவமனை": "hospital medical college 750 bed health",
  "பேருந்து": "transport bus fleet routes",
  "நிகழ்வு": "news events symposia workshop conference calendar",
  "செய்தி": "news circulars calendar events announcements",
  "சைபர்": "cyber security ethical hacking digital forensics",
  "செயற்கை நுண்ணறிவு": "artificial intelligence data science ai ds nvidia",
  "பிசியோதெரபி": "physiotherapy bpt hospital clinical",
  "இயன்முறை": "physiotherapy bpt hospital clinical",
  "நூலகம்": "library digital books journals ieee",
  "விளையாட்டு": "sports cricket gym football athletics",
  "வைஃபை": "wifi internet speed fiber",
  "ராகிங்": "anti-ragging safety harassment policy",
  "அங்கீகாரம்": "naac a++ ugc category 1 autonomous accreditation",
  "வேந்தர்": "founder chancellor paarivendhar vice chancellor muthamizhchelvan",
  "நிறுவனர்": "founder chancellor paarivendhar",
  "முகவரி": "location address samayapuram nh45 trichy",
  "உதவி எண்": "helpline phone contact toll free 1800 202 4565",
  "விண்ணப்பிக்க": "apply online portal registration admissions.srmtrichy.edu.in",
  "நேரடி": "lateral entry direct second year diploma",
  "டிப்ளமோ": "diploma lateral entry 2nd year",
  "பாலசுந்தரம்": "dean balasundaram faculty engineering associate",
  "ஆப்பிள்": "apple imac lab xcode swift app development",
  "ஐமேக்": "apple imac lab center excellence",
  "விர்ச்சுவல்": "arvr augmented reality virtual reality immersive",
  "போர்டினெட்": "fortinet cyber security lab fortigate fortisiem",
  "ஹேக்கிங்": "ethical hacking ctf cyber security fortinet",
  "சாப்ட்வேர்": "software product engineering agile fullstack",
  "எம்டெக்": "mtech cse artificial intelligence machine learning",
  "முனைவர்": "phd doctoral research engineering"
};

/**
 * Formulate an expanded bilingual search query for vector similarity matching
 */
function expandQuery(query, lang = "en") {
  let expanded = query;
  if (lang === "ta" || looksTamil(query)) {
    const additions = [];
    for (const [taKey, enEquiv] of Object.entries(TAMIL_TO_EN_TERMS)) {
      if (query.includes(taKey)) {
        additions.push(enEquiv);
      }
    }
    if (additions.length > 0) {
      expanded = `${query} ${additions.join(" ")}`;
    }
  }
  return expanded;
}

/**
 * RAG Orchestrator
 */
export class RagEngine {
  constructor(db = vectorDb) {
    this.db = db;
  }

  /**
   * Search PDF vector database for relevant context
   */
  async retrieve(query, topK = 3, lang = "en") {
    await this.db.init();
    const searchQuery = expandQuery(query, lang);
    const chunks = await this.db.query(searchQuery, topK, 0.12);
    return chunks;
  }

  /**
   * Synthesize RAG answer using retrieved PDF chunks
   */
  async generateAnswer(query, history = [], lang = "en", apiKey = null) {
    const hits = await this.retrieve(query, 3, lang);
    if (!hits || hits.length === 0 || hits[0].score < 0.30) {
      return null; // Let official website referral handle
    }

    const topHit = hits[0];
    const topDoc = topHit.docName;
    const topPage = topHit.page;

    // Build context snippet block from top vector hits
    const contextSnippets = hits.map((h, i) => `[Source ${i + 1}: ${h.docName} | Page ${h.page}]\n${h.text}`).join("\n\n---\n\n");

    // 1. If Gemini API key is available, generate grounded answer using the PDF vector context
    const effectiveKey = apiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (effectiveKey) {
      try {
        const langDirective = lang === "ta"
          ? "Respond STRICTLY in natural, fluent, polite Tamil (தமிழ்) script ONLY. Do not use English sentences in the answer."
          : "Respond in clear, professional, warm English.";

        const prompt = `You are Mozhi AI, the official SRM IST Trichy Assistant.
Answer the student's question based strictly on the verified context retrieved from the official SRM IST Trichy PDF documents below.
${langDirective}

VERIFIED CONTEXT FROM SRM TRICHY PDF DOCUMENTS:
${contextSnippets}

STUDENT QUESTION: "${query}"

CRITICAL INSTRUCTIONS:
- Directly answer the question in an informative, well-elaborated, and clear manner (2-4 clear sentences or structured bullet points, around 70 to 110 words).
- Include helpful specifics such as programs, eligibility, fee figures, and facilities from the verified context.
- End with a brief citation referencing [${topDoc}](/docs/${topDoc}) (Page ${topPage}).`;

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6500);
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${effectiveKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.1, maxOutputTokens: 250 }
          }),
          signal: controller.signal
        });
        clearTimeout(timeout);

        if (res.ok) {
          const data = await res.json();
          let text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text && text.trim().length > 10) {
            text = text.trim();
            if (lang === "ta" && !looksTamil(text)) {
              text = await translateText(text, "ta");
            }

            return {
              answer: text,
              source: `/docs/${topDoc}`,
              docName: topDoc,
              page: topPage,
              citations: hits.map(h => ({ docName: h.docName, page: h.page, score: h.score })),
              provider: "rag-gemini-vector",
              lang
            };
          }
        }
      } catch (err) {
        // Fallback to local RAG synthesis
      }
    }

    // 2. High-speed local RAG synthesizer - Short, Sweet & Precise
    const snippet = extractPreciseSnippet(topHit.text, query);
    let synthesizedAnswer = "";
    if (lang === "ta") {
      synthesizedAnswer = `${snippet}\n\n📄 **ஆதாரம்:** [${topDoc}](/docs/${topDoc}) (பக்கம் ${topPage})`;
      synthesizedAnswer = await translateText(synthesizedAnswer, "ta");
    } else {
      synthesizedAnswer = `${snippet}\n\n📄 **Source:** [${topDoc}](/docs/${topDoc}) (Page ${topPage})`;
    }

    return {
      answer: synthesizedAnswer,
      source: `/docs/${topDoc}`,
      docName: topDoc,
      page: topPage,
      citations: hits.map(h => ({ docName: h.docName, page: h.page, score: h.score })),
      provider: "rag-vector-db",
      lang
    };
  }
}

function extractPreciseSnippet(text, query) {
  if (!text) return "";
  // Strip repetitive university letterheads & disclaimers
  let clean = text
    .replace(/SRM INSTITUTE OF SCIENCE AND TECHNOLOGY[,\s\-—\w]*/gi, " ")
    .replace(/TIRUCHIRAPPALLI[,\s\-—\w]*/gi, " ")
    .replace(/[*#_`]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Split by line break or punctuation
  const sentences = clean
    .split(/(?<=[.!?\n])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 25 && !s.toUpperCase().includes("CAMPUS LIFE HANDBOOK") && !s.toUpperCase().includes("TABLE OF CONTENTS"));

  if (sentences.length === 0) return clean.slice(0, 160) + (clean.length > 160 ? "..." : "");

  const qTokens = (query || "").toLowerCase().split(/\s+/).filter(w => w.length > 2);
  let best = sentences[0];
  let bestScore = -1;

  for (const s of sentences) {
    const sLower = s.toLowerCase();
    let score = 0;
    for (const t of qTokens) {
      if (sLower.includes(t)) score += 2;
    }
    // Prefer sentences with informative words
    if (/\b(fee|marks|eligibility|ragging|hostel|policy|rule|concession|percent|%|lpa)\b/i.test(sLower)) {
      score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = s;
    }
  }

  const idx = sentences.indexOf(best);
  let result = best;
  if (idx !== -1) {
    if (sentences[idx + 1] && (result + " " + sentences[idx + 1]).length <= 420) {
      result += " " + sentences[idx + 1];
    }
    if (sentences[idx + 2] && (result + " " + sentences[idx + 2]).length <= 480) {
      result += " " + sentences[idx + 2];
    }
  }
  if (result.length > 500) {
    result = result.slice(0, 495) + "...";
  }
  return result;
}

export const ragEngine = new RagEngine();

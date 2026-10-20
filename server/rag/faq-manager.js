import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateLocalEmbedding, cosineSimilarity } from "./vector-db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FAQ_FILE = path.join(__dirname, "..", "data", "faqs.json");

const STOP_WORDS = new Set([
  "what", "when", "where", "which", "who", "whom", "whose", "why", "how",
  "is", "are", "was", "were", "be", "been", "being", "have", "has", "had",
  "do", "does", "did", "the", "and", "but", "if", "or", "because", "as",
  "until", "while", "of", "at", "by", "for", "with", "about", "against",
  "between", "into", "through", "during", "before", "after", "above", "below",
  "to", "from", "up", "down", "in", "out", "on", "off", "over", "under",
  "again", "further", "then", "once", "here", "there", "all", "any", "both",
  "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not",
  "only", "own", "same", "so", "than", "too", "very", "can", "will", "just",
  "should", "now", "campus", "college", "srm", "trichy", "university", "ist",
  "please", "tell", "give", "know", "want", "like", "details", "info", "information",
  "என்ன", "எப்படி", "எங்கே", "எப்போது", "யார்", "எவை", "மற்றும்", "இல்லை",
  "உள்ளதா", "உண்டு", "பற்றி", "விவரம்"
]);

export class FaqManager {
  constructor(filePath = FAQ_FILE) {
    this.filePath = filePath;
    this.faqs = [];
    this.faqVectors = []; // Array of { id, text, vector, faqRef, lang }
    this.isInitialized = false;
  }

  async init() {
    if (this.isInitialized) return;
    this.loadFaqs();
    this.buildVectors();
    this.isInitialized = true;
    console.log(`[FaqManager] Loaded & vectorized ${this.faqs.length} trained FAQs.`);
  }

  loadFaqs() {
    if (fs.existsSync(this.filePath)) {
      try {
        const raw = fs.readFileSync(this.filePath, "utf8");
        this.faqs = JSON.parse(raw);
      } catch (err) {
        console.warn("[FaqManager] Error loading faqs.json:", err.message);
        this.faqs = [];
      }
    } else {
      this.faqs = [];
    }
  }

  saveFaqs() {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(this.filePath, JSON.stringify(this.faqs, null, 2), "utf8");
    } catch (err) {
      console.error("[FaqManager] Error saving faqs.json:", err.message);
    }
  }

  buildVectors() {
    this.faqVectors = [];
    for (const faq of this.faqs) {
      // 1. Vectorize English question and keywords
      const enText = `${faq.question_en} ${(faq.keywords || []).join(" ")} ${faq.category || ""}`;
      this.faqVectors.push({
        id: faq.id,
        lang: "en",
        text: enText,
        vector: generateLocalEmbedding(enText),
        faq
      });

      // 2. Vectorize Tamil question and keywords
      if (faq.question_ta) {
        const taText = `${faq.question_ta} ${(faq.keywords || []).join(" ")} ${faq.category || ""}`;
        this.faqVectors.push({
          id: faq.id,
          lang: "ta",
          text: taText,
          vector: generateLocalEmbedding(taText),
          faq
        });
      }
    }
  }

  /**
   * Search trained FAQs for best match
   */
  async matchFaq(query, lang = "en", threshold = 0.52) {
    if (!this.isInitialized) await this.init();
    if (!query || this.faqVectors.length === 0) return null;

    const normalize = (str) => {
      return String(str || "").toLowerCase().trim()
        .replace(/\bb\.?tech\b/g, "btech")
        .replace(/\bm\.?tech\b/g, "mtech")
        .replace(/\bph\.?d\b/g, "phd")
        .replace(/\bm\.?b\.?a\b/g, "mba")
        .replace(/\bm\.?c\.?a\b/g, "mca")
        .replace(/\bb\.?c\.?a\b/g, "bca")
        .replace(/\bb\.?b\.?a\b/g, "bba")
        .replace(/\bb\.?p\.?t\b/g, "bpt")
        .replace(/\bm\.?p\.?t\b/g, "mpt")
        .replace(/\bm\.?b\.?b\.?s\b/g, "mbbs")
        .replace(/\bb\.?com\b/g, "bcom");
    };

    const DEGREES = ["btech", "mba", "mca", "bca", "bba", "bpt", "mpt", "mbbs", "phd", "mtech"];
    const normQuery = normalize(query);
    const queryVec = generateLocalEmbedding(normQuery);
    const queryDegrees = DEGREES.filter(d => normQuery.includes(d));

    // Extract non-stop content keywords
    const contentWords = normQuery.split(/[\s,?.!;:()"]+/).filter(w => w.length >= 2 && !STOP_WORDS.has(w));

    let bestMatch = null;
    let highestScore = 0;

    // Check if query is explicitly asking for HoD/Head
    const isAskingForHod = /\b(hod|h\.o\.d|head|dean|chairperson|incharge|in-charge|who heads|who is the head|who leads|யார்|தலைவர்|டீன்)\b/i.test(normQuery);

    for (const entry of this.faqVectors) {
      // Enforce strict HoD rule: Only show HoD if user explicitly asked for HoD!
      const faqIsHod = (entry.faq.category === "leadership") ||
        /\b(who is the (hod|head of)|who heads|hod of|தலைவர் யார்)\b/i.test(entry.faq.question_en || "") ||
        /\b(is the (professor & )?head of the department|is the head of)\b/i.test(entry.faq.answer_en || "");

      if (faqIsHod && !isAskingForHod) {
        continue;
      }

      const entryNorm = normalize(entry.text);
      const rawCosine = cosineSimilarity(queryVec, entry.vector);
      let score = rawCosine;

      if (faqIsHod && isAskingForHod) {
        score += 0.35;
      }

      // Meaningful content keyword match
      if (contentWords.length > 0) {
        let matches = 0;
        for (const w of contentWords) {
          if (entryNorm.includes(w)) matches++;
        }
        if (matches > 0) {
          const ratio = matches / contentWords.length;
          score += ratio * 0.25;
          if (contentWords.length >= 4 && ratio < 0.25) {
            score -= 0.30; // Low keyword coverage penalty
          }
        } else if (contentWords.length >= 3) {
          score -= 0.30; // No keyword matches on multi-word query
        }
      }

      // Check for degree conflicts
      if (queryDegrees.length > 0) {
        const entryDegrees = DEGREES.filter(d => entryNorm.includes(d));
        if (entryDegrees.length > 0) {
          const matchesDegree = entryDegrees.some(d => queryDegrees.includes(d));
          if (matchesDegree) {
            score += 0.20; // Strong degree alignment boost
          } else {
            score -= 0.40; // Degree conflict penalty (e.g. asking B.Tech but matching MBA)
          }
        }
      }

      // If user queried in same language as vector entry, slight boost
      if (entry.lang === lang) {
        score += 0.04;
      }

      // FAQ must have either strong cosine similarity or meaningful keyword matches
      if (rawCosine < 0.35 && (!contentWords.length || score < 0.60)) {
        continue;
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatch = {
          faq: entry.faq,
          score: Math.min(1.0, Math.round(score * 100) / 100)
        };
      }
    }

    if (bestMatch && bestMatch.score >= threshold) {
      const faq = bestMatch.faq;
      const answer = (lang === "ta" && faq.answer_ta) ? faq.answer_ta : faq.answer_en;
      const question = (lang === "ta" && faq.question_ta) ? faq.question_ta : faq.question_en;
      return {
        id: faq.id,
        question,
        answer,
        category: faq.category,
        source: faq.source || "https://www.srmtrichy.edu.in",
        score: bestMatch.score,
        provider: "trained-faq",
        lang
      };
    }

    return null;
  }

  /**
   * Train/Add a new FAQ
   */
  trainFaq(faqData) {
    const id = faqData.id || `faq_${Date.now()}`;
    const newFaq = {
      id,
      category: faqData.category || "general",
      question_en: faqData.question_en || faqData.question,
      question_ta: faqData.question_ta || "",
      keywords: Array.isArray(faqData.keywords) ? faqData.keywords : (faqData.keywords ? faqData.keywords.split(",") : []),
      answer_en: faqData.answer_en || faqData.answer,
      answer_ta: faqData.answer_ta || "",
      source: faqData.source || "https://www.srmtrichy.edu.in",
      trainedAt: new Date().toISOString()
    };

    const existingIdx = this.faqs.findIndex(f => f.id === id);
    if (existingIdx !== -1) {
      this.faqs[existingIdx] = newFaq;
    } else {
      this.faqs.unshift(newFaq);
    }

    this.saveFaqs();
    this.buildVectors();
    console.log(`[FaqManager] Trained FAQ: "${newFaq.question_en}" (ID: ${id})`);
    return newFaq;
  }

  deleteFaq(id) {
    const prevCount = this.faqs.length;
    this.faqs = this.faqs.filter(f => f.id !== id);
    if (this.faqs.length !== prevCount) {
      this.saveFaqs();
      this.buildVectors();
      return true;
    }
    return false;
  }

  getAllFaqs() {
    return this.faqs;
  }
}

export const faqManager = new FaqManager();

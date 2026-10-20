import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateLocalEmbedding, cosineSimilarity } from "./vector-db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LEARN_FILE = path.join(__dirname, "..", "data", "learned_questions.json");

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

export class LearningEngine {
  constructor(filePath = LEARN_FILE) {
    this.filePath = filePath;
    this.learnedQuestions = [];
    this.isInitialized = false;
  }

  async init() {
    if (this.isInitialized) return;
    this.loadFromDisk();
    this.isInitialized = true;
    console.log(`[LearningEngine] Initialized with ${this.learnedQuestions.length} learned questions.`);
  }

  loadFromDisk() {
    if (fs.existsSync(this.filePath)) {
      try {
        const raw = fs.readFileSync(this.filePath, "utf8");
        const list = JSON.parse(raw);
        if (Array.isArray(list)) {
          this.learnedQuestions = list;
          // Re-generate embeddings if missing in stored JSON
          for (const item of this.learnedQuestions) {
            if (!item.vector || item.vector.length === 0) {
              item.vector = generateLocalEmbedding(item.question);
            }
          }
        }
      } catch (err) {
        console.warn("[LearningEngine] Error reading learned_questions.json:", err.message);
        this.learnedQuestions = [];
      }
    } else {
      this.learnedQuestions = [];
      this.saveToDisk();
    }
  }

  saveToDisk() {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(this.filePath, JSON.stringify(this.learnedQuestions, null, 2), "utf8");
    } catch (err) {
      console.error("[LearningEngine] Error writing learned_questions.json:", err.message);
    }
  }

  /**
   * Search learned questions for matching question
   */
  async findLearnedMatch(query, lang = "en", threshold = 0.54) {
    if (!this.isInitialized) await this.init();
    if (!query || this.learnedQuestions.length === 0) return null;

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

    const contentTokens = normQuery.split(/[\s,?.!;:()"]+/).filter(w => w.length >= 2 && !STOP_WORDS.has(w));

    let bestItem = null;
    let highestScore = 0;

    // Check if query is explicitly asking for HoD/Head
    const isAskingForHod = /\b(hod|h\.o\.d|head|dean|chairperson|incharge|in-charge|who heads|who is the head|who leads|யார்|தலைவர்|டீன்)\b/i.test(normQuery);

    for (const item of this.learnedQuestions) {
      // Enforce strict HoD rule: Only show HoD if user explicitly asked for HoD!
      const itemIsHod = (item.category === "leadership") ||
        /\b(who is the (hod|head of)|who heads|hod of|தலைவர் யார்)\b/i.test(item.question || "") ||
        /\b(is the (professor & )?head of the department|is the head of)\b/i.test(item.answer || "");

      if (itemIsHod && !isAskingForHod) {
        continue;
      }

      if (!item.vector) item.vector = generateLocalEmbedding(item.question);
      const rawCosine = cosineSimilarity(queryVec, item.vector);
      let score = rawCosine;

      if (itemIsHod && isAskingForHod) {
        score += 0.35;
      }

      const itemNorm = normalize(item.question || "");

      // Boost for exact content token overlap
      if (contentTokens.length > 0) {
        let matchCount = 0;
        for (const t of contentTokens) {
          if (itemNorm.includes(t)) matchCount++;
        }
        if (matchCount > 0) {
          score += (matchCount / contentTokens.length) * 0.25;
        }
      }

      // Check for degree conflicts
      if (queryDegrees.length > 0) {
        const itemDegrees = DEGREES.filter(d => itemNorm.includes(d));
        if (itemDegrees.length > 0) {
          const matchesDegree = itemDegrees.some(d => queryDegrees.includes(d));
          if (matchesDegree) {
            score += 0.20;
          } else {
            score -= 0.40;
          }
        }
      }

      if (item.lang === lang) score += 0.04;

      if (rawCosine < 0.32 && (!contentTokens.length || score < 0.60)) {
        continue;
      }

      if (score > highestScore) {
        highestScore = score;
        bestItem = item;
      }
    }

    if (bestItem && highestScore >= threshold) {
      // Increment usage count and update timestamp
      bestItem.askCount = (bestItem.askCount || 1) + 1;
      bestItem.lastAskedAt = new Date().toISOString();
      this.saveToDisk();

      return {
        id: bestItem.id,
        question: bestItem.question,
        answer: bestItem.answer,
        source: bestItem.source || "https://www.srmtrichy.edu.in",
        score: Math.min(1.0, Math.round(highestScore * 100) / 100),
        status: bestItem.status,
        provider: "learned-memory",
        lang: bestItem.lang || lang
      };
    }

    return null;
  }

  /**
   * Automatically learn a new question and its synthesized answer
   */
  async learn(question, answer, lang = "en", meta = {}) {
    if (!this.isInitialized) await this.init();
    if (!question || !answer || question.length < 5 || answer.length < 20) return null;

    const cleanQ = String(question).trim();
    const queryVec = generateLocalEmbedding(cleanQ);

    // Check if closely similar question is already known
    for (const item of this.learnedQuestions) {
      if (!item.vector) item.vector = generateLocalEmbedding(item.question);
      const sim = cosineSimilarity(queryVec, item.vector);
      if (sim > 0.85) {
        item.askCount = (item.askCount || 1) + 1;
        item.lastAskedAt = new Date().toISOString();
        if (meta.updateAnswer) item.answer = answer;
        this.saveToDisk();
        return item;
      }
    }

    // Create new learned entry
    const newItem = {
      id: `learn_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      question: cleanQ,
      answer: String(answer).replace(/^(📄|🎓|💡|⭐)[^\n]*\n\n/, "").trim(),
      lang,
      category: meta.category || "user_inquiry",
      source: meta.source || "https://www.srmtrichy.edu.in",
      provider: meta.provider || "auto-synthesized",
      status: meta.status || "auto_learned",
      askCount: 1,
      learnedAt: new Date().toISOString(),
      lastAskedAt: new Date().toISOString(),
      vector: queryVec
    };

    this.learnedQuestions.unshift(newItem);
    this.saveToDisk();
    console.log(`[LearningEngine] Learned new question (${lang}): "${cleanQ.slice(0, 60)}..."`);
    return newItem;
  }

  /**
   * Explicitly teach the model a question & answer pair
   */
  async teach(question, answer, lang = "en", category = "general") {
    return await this.learn(question, answer, lang, {
      category,
      provider: "human-taught",
      status: "verified",
      updateAnswer: true
    });
  }

  deleteLearned(id) {
    const prev = this.learnedQuestions.length;
    this.learnedQuestions = this.learnedQuestions.filter(q => q.id !== id);
    if (this.learnedQuestions.length !== prev) {
      this.saveToDisk();
      return true;
    }
    return false;
  }

  verifyLearned(id) {
    const item = this.learnedQuestions.find(q => q.id === id);
    if (item) {
      item.status = "verified";
      this.saveToDisk();
      return item;
    }
    return null;
  }

  getAllLearned() {
    return this.learnedQuestions.map(q => ({
      id: q.id,
      question: q.question,
      answer: q.answer,
      lang: q.lang,
      category: q.category,
      status: q.status,
      askCount: q.askCount || 1,
      learnedAt: q.learnedAt,
      lastAskedAt: q.lastAskedAt,
      source: q.source
    }));
  }
}

export const learningEngine = new LearningEngine();

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { parsePdf } from "./pdf-parser.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, "..", "..");
const DOCS_DIR = path.join(__dirname, "..", "data", "docs");
const DB_FILE = path.join(__dirname, "..", "data", "vector_db.json");

const VECTOR_DIM = 384; // Standard high-dimensional semantic vector space

/**
 * Hash a string to a deterministic integer index in [0, VECTOR_DIM - 1]
 */
function hashToken(str, seed = 0) {
  let hash = 2166136261 ^ seed;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash) % VECTOR_DIM;
}

/**
 * Tokenize and normalize text into words and subword character n-grams
 */
function extractFeatures(text) {
  const clean = String(text || "").toLowerCase().replace(/[^\w\s\u0B80-\u0BFF]/g, " ");
  const words = clean.split(/\s+/).filter(w => w.length > 1);
  const termCounts = new Map();

  for (const word of words) {
    termCounts.set(word, (termCounts.get(word) || 0) + 1.5);

    // Add character 3-grams and 4-grams for morphological/subword matching (critical for Tamil & English inflections)
    if (word.length >= 4) {
      for (let i = 0; i <= word.length - 3; i++) {
        const tri = word.slice(i, i + 3);
        termCounts.set(tri, (termCounts.get(tri) || 0) + 0.6);
      }
    }
  }

  return termCounts;
}

/**
 * Built-in High-Dimensional Semantic Vectorizer (Unit-Normalized L2)
 */
export function generateLocalEmbedding(text) {
  const vector = new Float32Array(VECTOR_DIM);
  const features = extractFeatures(text);

  let norm = 0;
  for (const [term, freq] of features.entries()) {
    const idx1 = hashToken(term, 0);
    const idx2 = hashToken(term, 31);
    const weight = Math.log(1 + freq);

    vector[idx1] += weight;
    vector[idx2] += weight * 0.5;
  }

  // Calculate L2 norm
  for (let i = 0; i < VECTOR_DIM; i++) {
    norm += vector[i] * vector[i];
  }
  norm = Math.sqrt(norm);

  // Normalize to unit length
  if (norm > 0) {
    for (let i = 0; i < VECTOR_DIM; i++) {
      vector[i] /= norm;
    }
  }

  return Array.from(vector);
}

/**
 * Generate Gemini Dense Embedding via text-embedding-004 if API key is provided
 */
async function generateGeminiEmbedding(text, apiKey) {
  if (!apiKey) return null;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "models/text-embedding-004",
        content: { parts: [{ text: text.slice(0, 2048) }] }
      }),
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const values = data?.embedding?.values;
      if (Array.isArray(values) && values.length > 0) {
        // Normalize
        let norm = 0;
        for (const v of values) norm += v * v;
        norm = Math.sqrt(norm);
        return norm > 0 ? values.map(v => v / norm) : values;
      }
    }
  } catch (err) {
    // Fallback to local embedding
  }
  return null;
}

/**
 * Cosine Similarity between two unit-normalized vectors
 */
export function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dot = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
  }
  return dot;
}

/**
 * Persistent In-Memory Vector Database
 */
export class VectorDatabase {
  constructor(dbPath = DB_FILE, docsDir = DOCS_DIR) {
    this.dbPath = dbPath;
    this.docsDir = docsDir;
    this.documents = new Map(); // filename -> { fileHash, totalPages, chunksCount, mtime }
    this.chunks = []; // Array of chunk objects with embeddings
    this.isInitialized = false;
  }

  /**
   * Load vector database from disk or build fresh
   */
  async init() {
    if (this.isInitialized) return;

    if (!fs.existsSync(this.docsDir)) {
      fs.mkdirSync(this.docsDir, { recursive: true });
    }

    let loadedFromDisk = false;
    if (fs.existsSync(this.dbPath)) {
      try {
        const raw = JSON.parse(fs.readFileSync(this.dbPath, "utf8"));
        if (Array.isArray(raw.chunks) && raw.documents) {
          this.chunks = raw.chunks;
          this.documents = new Map(Object.entries(raw.documents));
          console.log(`[VectorDB] Loaded ${this.chunks.length} vectors across ${this.documents.size} documents from disk.`);
          loadedFromDisk = true;
        }
      } catch (err) {
        console.warn("[VectorDB] Could not parse disk cache, rebuilding:", err.message);
      }
    }

    // Synchronize docs directory (detect new, modified, or deleted PDFs)
    await this.syncDocs();
    this.isInitialized = true;
  }

  /**
   * Check docs directory and index any new or modified PDFs
   */
  async syncDocs() {
    if (!fs.existsSync(this.docsDir)) return;

    const files = fs.readdirSync(this.docsDir).filter(f => f.toLowerCase().endsWith(".pdf"));
    const activeDocNames = new Set(files);
    let changed = false;

    // 1. Remove deleted documents
    for (const docName of this.documents.keys()) {
      if (!activeDocNames.has(docName)) {
        console.log(`[VectorDB] Removing obsolete document: ${docName}`);
        this.chunks = this.chunks.filter(c => c.docName !== docName);
        this.documents.delete(docName);
        changed = true;
      }
    }

    // 2. Check each PDF file
    for (const file of files) {
      const fullPath = path.join(this.docsDir, file);
      const stat = fs.statSync(fullPath);
      const cached = this.documents.get(file);

      if (!cached || cached.mtime !== stat.mtimeMs) {
        console.log(`[VectorDB] Indexing PDF: ${file}...`);
        try {
          await this.indexPdfFile(fullPath);
          changed = true;
        } catch (err) {
          console.error(`[VectorDB] Failed to index ${file}:`, err.message);
        }
      }
    }

    if (changed) {
      this.saveToDisk();
    }
  }

  /**
   * Parse a PDF and insert its vector chunks into the database
   */
  async indexPdfFile(filePath, customName = null) {
    const filename = customName || path.basename(filePath);
    const parsed = await parsePdf(filePath, { filename });
    const stat = fs.existsSync(filePath) ? fs.statSync(filePath) : { mtimeMs: Date.now() };

    // Remove existing chunks for this doc if re-indexing
    this.chunks = this.chunks.filter(c => c.docName !== filename);

    // Compute embeddings for each chunk
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    for (const chunk of parsed.chunks) {
      let vector = null;
      if (apiKey) {
        vector = await generateGeminiEmbedding(chunk.text, apiKey);
      }
      if (!vector) {
        vector = generateLocalEmbedding(chunk.text);
      }

      this.chunks.push({
        ...chunk,
        embedding: vector,
        embeddingType: vector.length === 768 ? "gemini-dense" : "semantic-l2"
      });
    }

    this.documents.set(filename, {
      filename,
      totalPages: parsed.totalPages,
      chunksCount: parsed.chunks.length,
      mtime: stat.mtimeMs,
      indexedAt: new Date().toISOString()
    });

    console.log(`[VectorDB] Indexed ${parsed.chunks.length} chunks from ${filename}`);
  }

  /**
   * Save database to disk
   */
  saveToDisk() {
    try {
      const dir = path.dirname(this.dbPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      const data = {
        updatedAt: new Date().toISOString(),
        documents: Object.fromEntries(this.documents.entries()),
        chunks: this.chunks
      };
      fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2), "utf8");
      console.log(`[VectorDB] Persisted ${this.chunks.length} vector embeddings to ${this.dbPath}`);
    } catch (err) {
      console.error("[VectorDB] Error saving to disk:", err.message);
    }
  }

  /**
   * Query the Vector Database using Cosine Similarity Search
   */
  async query(queryString, topK = 4, minScore = 0.12) {
    if (!this.isInitialized) await this.init();
    if (!queryString || this.chunks.length === 0) return [];

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    let queryVec = null;
    if (apiKey) {
      queryVec = await generateGeminiEmbedding(queryString, apiKey);
    }
    if (!queryVec) {
      queryVec = generateLocalEmbedding(queryString);
    }

    const scored = [];
    for (const chunk of this.chunks) {
      let score = 0;
      if (chunk.embedding && chunk.embedding.length === queryVec.length) {
        score = cosineSimilarity(queryVec, chunk.embedding);
      } else {
        // Fallback local comparison if dimension mismatch
        const fallbackVec = generateLocalEmbedding(chunk.text);
        const queryLocal = generateLocalEmbedding(queryString);
        score = cosineSimilarity(queryLocal, fallbackVec);
      }

      // Keyword boost for exact domain tokens (excluding stopwords)
      const STOP_TOKENS = new Set(["what", "when", "where", "which", "who", "why", "how", "are", "the", "and", "for", "with", "from", "this", "that", "campus", "college", "srm", "trichy", "tell", "about", "can", "you", "give"]);
      const lowerQuery = queryString.toLowerCase();
      const lowerText = chunk.text.toLowerCase();
      const queryTokens = lowerQuery.split(/[\s,?.!;:()"]+/).filter(t => t.length > 2 && !STOP_TOKENS.has(t));
      let matchCount = 0;
      for (const tok of queryTokens) {
        if (lowerText.includes(tok)) matchCount++;
      }
      if (queryTokens.length > 0 && matchCount > 0) {
        score += (matchCount / queryTokens.length) * 0.15;
      }

      if (score >= minScore) {
        scored.push({
          id: chunk.id,
          docName: chunk.docName,
          page: chunk.page,
          totalPages: chunk.totalPages,
          chunkIndex: chunk.chunkIndex,
          text: chunk.text,
          score: Math.min(1.0, Math.round(score * 100) / 100)
        });
      }
    }

    // Sort descending by similarity score
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK);
  }

  /**
   * Get database statistics
   */
  getStats() {
    return {
      totalDocuments: this.documents.size,
      totalChunks: this.chunks.length,
      vectorDimension: VECTOR_DIM,
      documents: Array.from(this.documents.values()),
      docsDir: this.docsDir
    };
  }
}

// Export singleton instance
export const vectorDb = new VectorDatabase();

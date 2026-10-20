import fs from "fs";
import path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { PDFParse } = require("pdf-parse");

/**
 * Split text into semantic chunks with sliding overlap
 */
export function chunkText(text, maxChars = 450, overlap = 80) {
  if (!text || typeof text !== "string") return [];
  const clean = text.replace(/\r\n/g, "\n").replace(/[ \t]+/g, " ").trim();
  if (clean.length <= maxChars) {
    return [clean];
  }

  // Split into paragraphs or logical blocks
  const paragraphs = clean.split(/\n+/).map(p => p.trim()).filter(Boolean);
  const chunks = [];
  let current = "";

  for (const para of paragraphs) {
    if ((current + "\n" + para).length <= maxChars) {
      current = current ? current + "\n" + para : para;
    } else {
      if (current) {
        chunks.push(current);
        // keep overlap from end of current chunk
        const words = current.split(" ");
        const overlapWords = words.slice(-Math.min(words.length, 12)).join(" ");
        current = overlapWords ? overlapWords + "\n" + para : para;
      } else {
        // Para itself is longer than maxChars, split by sentences or slice
        let start = 0;
        while (start < para.length) {
          const end = Math.min(start + maxChars, para.length);
          chunks.push(para.slice(start, end).trim());
          if (end >= para.length) break;
          start += (maxChars - overlap);
        }
        current = "";
      }
    }
  }

  if (current && current.trim().length > 20) {
    chunks.push(current.trim());
  }

  return chunks.filter(c => c.length > 25);
}

/**
 * Parse a PDF buffer or file path into structured chunks
 */
export async function parsePdf(source, options = {}) {
  let buffer;
  let filename = "document.pdf";

  if (typeof source === "string") {
    if (!fs.existsSync(source)) {
      throw new Error(`PDF file not found: ${source}`);
    }
    filename = path.basename(source);
    buffer = fs.readFileSync(source);
  } else if (Buffer.isBuffer(source)) {
    buffer = source;
    if (options.filename) filename = options.filename;
  } else {
    throw new Error("Invalid PDF source. Must be a file path or Buffer.");
  }

  const parser = new PDFParse({ data: buffer });
  await parser.load();
  const parsed = await parser.getText();
  await parser.destroy();

  const totalPages = parsed.total || (parsed.pages ? parsed.pages.length : 1);
  const allChunks = [];
  let globalChunkIndex = 0;

  if (Array.isArray(parsed.pages) && parsed.pages.length > 0) {
    for (const page of parsed.pages) {
      const pageNum = page.num || 1;
      const pageText = (page.text || "").trim();
      if (!pageText) continue;

      const pageChunks = chunkText(pageText, options.maxChars || 450, options.overlap || 80);
      for (let i = 0; i < pageChunks.length; i++) {
        const text = pageChunks[i];
        allChunks.push({
          id: `${filename}_p${pageNum}_c${i + 1}`,
          docName: filename,
          page: pageNum,
          totalPages: totalPages,
          chunkIndex: ++globalChunkIndex,
          text: text,
          charCount: text.length
        });
      }
    }
  } else if (parsed.text) {
    const rawChunks = chunkText(parsed.text, options.maxChars || 450, options.overlap || 80);
    for (let i = 0; i < rawChunks.length; i++) {
      const text = rawChunks[i];
      allChunks.push({
        id: `${filename}_p1_c${i + 1}`,
        docName: filename,
        page: 1,
        totalPages: 1,
        chunkIndex: ++globalChunkIndex,
        text: text,
        charCount: text.length
      });
    }
  }

  return {
    filename,
    totalPages,
    totalChunks: allChunks.length,
    chunks: allChunks
  };
}

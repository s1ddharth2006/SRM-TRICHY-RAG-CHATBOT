import { vectorDb } from "../server/rag/vector-db.js";

async function run() {
  console.log("Starting Vector Database Reindexing...");
  await vectorDb.init();
  await vectorDb.syncDocs();
  const stats = vectorDb.getStats();
  console.log("\n================ VECTOR DB STATS ================");
  console.log(`Total Documents: ${stats.totalDocuments}`);
  console.log(`Total Chunks: ${stats.totalChunks}`);
  console.log("Documents indexed:");
  stats.documents.forEach(d => console.log(`• ${d.filename} (${d.chunksCount} chunks, ${d.totalPages} pages)`));
  console.log("=================================================");
}

run();

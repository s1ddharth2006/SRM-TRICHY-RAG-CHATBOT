import { handleChat } from "../server/chat.js";
import { vectorDb } from "../server/rag/vector-db.js";
import { faqManager } from "../server/rag/faq-manager.js";
import { learningEngine } from "../server/rag/learning-engine.js";

async function test() {
  await vectorDb.init();
  await faqManager.init();
  await learningEngine.init();

  console.log("=== TESTING 'cse' ===");
  const r1 = await handleChat("cse", [], "en");
  console.log("Provider:", r1.provider);
  console.log("Source:", r1.source);
  console.log("Answer:\n", r1.answer);

  console.log("\n=== TESTING 'cse' in Tamil ===");
  const r2 = await handleChat("cse", [], "ta");
  console.log("Provider:", r2.provider);
  console.log("Source:", r2.source);
  console.log("Answer:\n", r2.answer);

  console.log("\n=== TESTING 'who is the hod of cse' ===");
  const r3 = await handleChat("who is the hod of cse", [], "en");
  console.log("Provider:", r3.provider);
  console.log("Answer:\n", r3.answer);
}

test();

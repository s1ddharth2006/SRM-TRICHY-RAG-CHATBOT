import { learningEngine } from "../server/rag/learning-engine.js";
import { faqManager } from "../server/rag/faq-manager.js";
import { NEWS_OVERVIEW, SPECIFIC_EVENTS, DEPARTMENT_EVENTS } from "../server/news-handler.js";

async function trainNews() {
  await learningEngine.init();
  await faqManager.init();

  console.log("=== Training News & Events Knowledge into Learning Engine & FAQ Manager ===\n");

  // 1. General News & Events FAQs
  faqManager.trainFaq({
    id: "general_news_and_events",
    category: "news_events",
    patterns: [
      /(what\s*are\s*the\s*)?(latest\s*)?news(\s*and\s*events)?/i,
      /upcoming\s*events/i,
      /campus\s*activities/i,
      /செய்திகள்.*நிகழ்வுகள்|சமீபத்திய\s*நிகழ்வு/i
    ],
    en: NEWS_OVERVIEW.en,
    ta: NEWS_OVERVIEW.ta,
    source: "https://www.srmtrichy.edu.in/news-and-events"
  });

  // 2. Specific Events
  for (const ev of SPECIFIC_EVENTS) {
    faqManager.trainFaq({
      id: `faq_${ev.id}`,
      category: "news_events",
      patterns: [ev.matcher],
      en: ev.en,
      ta: ev.ta,
      source: "https://www.srmtrichy.edu.in/news-and-events"
    });

    // Also teach into learned questions for continuous neural recall
    await learningEngine.teach(
      `Tell me about ${ev.id.replace(/_/g, " ")} at SRM Trichy`,
      ev.en,
      "en",
      "news_events"
    );
    await learningEngine.teach(
      `SRM திருச்சி ${ev.id.replace(/_/g, " ")} நிகழ்வு பற்றி சொல்`,
      ev.ta,
      "ta",
      "news_events"
    );
  }

  // 3. Department-specific Events
  for (const dept of DEPARTMENT_EVENTS) {
    faqManager.trainFaq({
      id: `faq_${dept.id}`,
      category: "news_events",
      patterns: [dept.matcher, /events?|activities/i],
      en: dept.en,
      ta: dept.ta,
      source: "https://www.srmtrichy.edu.in/news-and-events"
    });

    await learningEngine.teach(
      `What events are conducted in ${dept.id.replace(/_/g, " ")} at SRM Trichy?`,
      dept.en,
      "en",
      "news_events"
    );
    await learningEngine.teach(
      `SRM திருச்சி ${dept.id.replace(/_/g, " ")} துறை நிகழ்வுகள் என்னென்ன?`,
      dept.ta,
      "ta",
      "news_events"
    );
  }

  console.log(`Successfully trained:`);
  console.log(`- ${faqManager.faqs.length} total FAQs in FaqManager`);
  console.log(`- ${learningEngine.learnedQuestions.length} total learned questions in LearningEngine`);
}

trainNews().catch(console.error);

# SRM-TRICHY-RAG-CHATBOT
### Official Bilingual (English & Tamil) AI Chatbot & RAG System for SRM IST Trichy

A production-grade, bilingual Retrieval-Augmented Generation (RAG) AI assistant and universal embeddable chatbot widget for **SRM Institute of Science and Technology (SRM IST), Tiruchirappalli Campus** ([srmtrichy.edu.in](https://www.srmtrichy.edu.in/)).

---

## 🚀 Key System Features

1. **End-to-End Bilingual RAG Pipeline (English & Tamil)**
   - **Vector Database**: 171 high-dimensional vector embeddings across 20 official university PDF documents in `server/data/docs/`.
   - **Full Website Scraping**: 37 routes scraped and indexed into `server/data/scraped_pages/` with catalog manifest.
   - **Continuous Active Learning**: Auto-learns user interactions into `server/data/learned_questions.json` (154+ verified learned questions).
   - **Curated FAQ Knowledge Base**: 92+ vectorized official FAQs in `server/data/faqs.json`.

2. **Dedicated Department & HoD Resolver** (`server/department-handler.js`)
   - Comprehensive bilingual profiles for **all 14 departments and schools** (CSE, AI & DS, Cyber Security, IT, ECE, Mechanical, Biotech, EEE, BME, Management/DoMS, Physiotherapy, OT, Allied Health, Hotel Management).
   - **Strict HoD Intent Isolation**: Typing `"cse"`, `"ece"`, or `"mechanical"` returns comprehensive department details (programmes, industry labs, placements, eligibility, official URLs). Head of Department (HoD) names are **only** shown when explicitly requested (e.g., *"who is the hod of cse"*).

3. **News, Events & Conferences Engine** (`server/news-handler.js`)
   - Scraped and cataloged **167 official university events** from live CMS endpoints into `server/data/news_and_events_catalog.json`.
   - Answers specific queries on flagship events: **TENSOR'26**, **Project Fiesta 2026**, **Oracle Centre of Excellence Inauguration**, **ICIDDM 2K25**, **Sustainable Hydrogen Energy FDP**, **8 Patents Published by EEE Students**, **SPICE SURGE**, **REVIVE '24**, **DIACON2K26**, **PERFUSE 2K26**, **Milan Cultural Fest**, and more.

4. **Universal Embeddable Widget (`public/embed.js`)**
   - Standalone, zero-dependency, self-contained AI widget for integration onto **any website** via a single `<script>` tag.
   - Built-in Tamil voice synthesis (TTS), speech-to-text voice input (STT), bilingual switcher (`தமிழ் ⇄ English`), suggested questions, and sound effects.

5. **Interactive Embed Guide & Sandbox (`public/integration_guide.html`)**
   - Live testing playground with color theme switchers, positioning toggles, and copy-paste code snippets for React, Next.js, WordPress, and Vanilla HTML.

---

## 🛠️ Quick Start

### 1. Installation
```bash
git clone https://github.com/s1ddharth2006/SRM-TRICHY-RAG-CHATBOT.git
cd SRM-TRICHY-RAG-CHATBOT
npm install
```

### 2. Configure Environment (Optional)
```bash
cp .env.example .env
```
*(Runs fully offline with local vector RAG, local neural models, and scraped knowledge; optional Gemini API key can be set in `.env`)*

### 3. Run Server
```bash
node server/index.js
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🌐 Embedding on Any Website

Simply paste this single line before the closing `</body>` tag of your website:

```html
<script src="https://your-domain.com/embed.js" data-api="https://your-domain.com" data-lang="en" defer></script>
```

### Configuration Attributes
| Attribute | Values | Default | Description |
| :--- | :--- | :--- | :--- |
| `data-api` | URL string | Origin | Backend server URL serving `/api/chat` |
| `data-lang` | `"en"` \| `"ta"` | `"ta"` | Initial language (English or Tamil) |
| `data-theme` | `"gold"` \| `"navy"` \| `"slate"` | `"gold"` | Widget color palette |
| `data-position` | `"right"` \| `"left"` | `"right"` | Floating button position |
| `data-auto-open`| Milliseconds | `0` | Auto-open chat popup after delay |

---

## 📡 API Reference

### 1. Chat Completion Endpoint
`POST /api/chat`

**Request:**
```json
{
  "message": "What is the highest placement package at SRM Trichy?",
  "lang": "en",
  "history": []
}
```

**Response:**
```json
{
  "answer": "95%+ placed! Highest package is ₹50 LPA and average is ₹8.5 LPA across 600+ companies including Amazon, Microsoft, and Zoho.",
  "source": "https://www.srmtrichy.edu.in/placement",
  "provider": "learned-memory",
  "lang": "en"
}
```

### 2. Vector DB Document Search
`POST /api/rag/search`
```json
{ "query": "Apple iMac Centre of Excellence" }
```

### 3. Upload & Index New PDF
`POST /api/rag/upload`
```json
{
  "filename": "Brochure_2027.pdf",
  "base64": "JVBERi0xLjQK..."
}
```

### 4. Train New FAQ
`POST /api/faqs/train`
```json
{
  "question": "What is the eligibility for MCA?",
  "answer": "Undergraduate degree in Computer Science/IT/BCA with mathematics at 10+2 or degree level.",
  "category": "admissions",
  "lang": "en"
}
```

---

## 📂 Repository Structure

```
├── mirror/               # Full mirror of SRM Trichy website & assets
├── public/               # Static assets & standalone embed widget
│   ├── embed.js          # Universal single-line embeddable chatbot widget
│   ├── integration_guide.html # Interactive visual embedding sandbox & guide
│   ├── srm-chatbot-embed.js # Alternative namespaced embed script
│   └── srm-tamil-dict.js # Bilingual terminology dictionary
├── server/
│   ├── index.js          # Main HTTP server & API router
│   ├── chat.js           # Multi-tiered agentic response pipeline
│   ├── department-handler.js # Dedicated 14-department & HoD resolver
│   ├── news-handler.js   # 167-event News & Conferences resolver
│   ├── scraper.js        # Official website live scraping engine
│   ├── translate.js      # High-performance Tamil translation with disk cache
│   ├── data/
│   │   ├── docs/         # 20 Official University PDFs
│   │   ├── scraped_pages/# 37 full-page website crawls
│   │   ├── vector_db.json# 171 indexed vector embeddings
│   │   ├── faqs.json     # 92 curated official FAQs
│   │   ├── learned_questions.json # 154 auto-learned Q&As
│   │   └── news_and_events_catalog.json # 167 structured events
│   └── rag/
│       ├── vector-db.js  # TF-IDF + BM25 Vector Database engine
│       ├── rag-engine.js # RAG retrieval & Gemini integration
│       ├── faq-manager.js# FAQ vectorization & matching engine
│       └── learning-engine.js # Autonomous continuous learning brain
├── scratch/              # Automated test suites & scraping utilities
├── .gitignore
├── package.json
└── README.md
```

---

## 🧪 Testing & Validation

Run the automated test suites:

```bash
# Test Department vs HoD resolution
node scratch/test_departments_and_hods_all.js

# Test News and Events resolution (18 tests)
node scratch/test_news_and_events_suite.js

# Full system regression suite (13 tests)
node scratch/test_trained_chatbot_suite.js

# Live HTTP network endpoint suite
node scratch/test_live_http_api.js
```

---

## 📜 License
Developed for SRM Institute of Science and Technology, Tiruchirappalli Campus.

/**
 * SRM IST Trichy - Universal Embeddable AI Chatbot Widget (Embed.js)
 * Standalone, zero-dependency, self-contained AI assistant for any website.
 *
 * Usage:
 * <script src="https://your-domain.com/embed.js" data-api="https://your-domain.com" data-lang="ta" defer></script>
 */
(function () {
  if (window.__SRM_CHATBOT_EMBEDDED__) return;
  window.__SRM_CHATBOT_EMBEDDED__ = true;

  // 1. Resolve Script & Backend Configuration
  const currentScript =
    document.currentScript ||
    Array.from(document.querySelectorAll("script")).find(
      (s) => s.src && (s.src.includes("embed.js") || s.src.includes("srm-chatbot-embed.js"))
    );

  const scriptUrl = currentScript && currentScript.src ? new URL(currentScript.src) : window.location;
  const SCRIPT_ORIGIN = scriptUrl.origin;

  const CONFIG = {
    apiBase: (currentScript?.dataset.api || window.SRM_CHAT_API_URL || SCRIPT_ORIGIN || "").replace(/\/+$/, ""),
    lang: currentScript?.dataset.lang || window.SRM_CHAT_LANG || "ta",
    theme: currentScript?.dataset.theme || "gold",
    position: currentScript?.dataset.position || "right",
    title: currentScript?.dataset.title || "SRM IST Trichy AI",
    autoOpenDelay: parseInt(currentScript?.dataset.autoOpen || "0", 10),
    sound: currentScript?.dataset.sound !== "false"
  };

  let currentLang = CONFIG.lang;
  let isOpen = false;
  let conversationHistory = [];
  let isThinking = false;
  let speechSynth = window.speechSynthesis;

  // 2. Inject Scoped Stylesheet
  const css = `
    #srm-embed-container {
      --srm-navy: #0b1e36;
      --srm-navy-dark: #071322;
      --srm-navy-light: #153256;
      --srm-gold: #c49a45;
      --srm-gold-light: #dfb256;
      --srm-gold-glow: rgba(196, 154, 69, 0.35);
      --srm-text: #f8fafc;
      --srm-text-muted: #94a3b8;
      --srm-card: #0f2238;
      --srm-border: rgba(196, 154, 69, 0.22);
      --srm-success: #10b981;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans Tamil", sans-serif;
      font-size: 14px;
      line-height: 1.5;
      z-index: 9999999;
      position: fixed;
      bottom: 24px;
      ${CONFIG.position === "left" ? "left: 24px;" : "right: 24px;"}
      pointer-events: none;
    }

    #srm-embed-container * {
      box-sizing: border-box;
      pointer-events: auto;
    }

    /* Floating Launcher Button */
    .srm-launcher-btn {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: linear-gradient(135deg, #0b1e36 0%, #163860 100%);
      border: 2px solid var(--srm-gold);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4), 0 0 16px var(--srm-gold-glow);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      outline: none;
    }

    .srm-launcher-btn:hover {
      transform: scale(1.08) translateY(-2px);
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.5), 0 0 24px rgba(196, 154, 69, 0.6);
      border-color: var(--srm-gold-light);
    }

    .srm-launcher-icon {
      width: 32px;
      height: 32px;
      fill: var(--srm-gold);
      transition: transform 0.3s ease;
    }

    .srm-launcher-btn.is-active .srm-launcher-icon {
      transform: rotate(90deg);
    }

    .srm-launcher-badge {
      position: absolute;
      top: -2px;
      right: -2px;
      background: #ef4444;
      color: #fff;
      font-size: 11px;
      font-weight: 700;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid var(--srm-navy);
      box-shadow: 0 2px 6px rgba(0,0,0,0.4);
      animation: srmPulse 2s infinite;
    }

    @keyframes srmPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.15); }
    }

    .srm-launcher-label {
      position: absolute;
      ${CONFIG.position === "left" ? "left: 74px;" : "right: 74px;"}
      background: var(--srm-navy);
      color: var(--srm-gold);
      border: 1px solid var(--srm-border);
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
      box-shadow: 0 4px 14px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      gap: 6px;
      opacity: 0.95;
      transition: opacity 0.2s ease;
    }

    /* Main Chat Window */
    .srm-chat-box {
      width: 380px;
      height: 580px;
      max-height: calc(100vh - 120px);
      max-width: calc(100vw - 32px);
      background: var(--srm-navy-dark);
      border: 1px solid var(--srm-border);
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(196, 154, 69, 0.15);
      position: absolute;
      bottom: 80px;
      ${CONFIG.position === "left" ? "left: 0;" : "right: 0;"}
      display: flex;
      flex-direction: column;
      overflow: hidden;
      opacity: 0;
      visibility: hidden;
      transform: translateY(20px) scale(0.96);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .srm-chat-box.is-open {
      opacity: 1;
      visibility: visible;
      transform: translateY(0) scale(1);
    }

    /* Header */
    .srm-chat-header {
      background: linear-gradient(135deg, var(--srm-navy) 0%, var(--srm-navy-light) 100%);
      border-bottom: 1px solid var(--srm-border);
      padding: 14px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: var(--srm-text);
    }

    .srm-header-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .srm-header-avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: var(--srm-navy-dark);
      border: 1.5px solid var(--srm-gold);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--srm-gold);
      font-weight: 800;
      font-size: 14px;
    }

    .srm-header-titles h3 {
      margin: 0;
      font-size: 15px;
      font-weight: 700;
      color: #ffffff;
      line-height: 1.2;
    }

    .srm-header-titles p {
      margin: 2px 0 0;
      font-size: 11px;
      color: var(--srm-gold);
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .srm-status-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--srm-success);
      box-shadow: 0 0 6px var(--srm-success);
    }

    .srm-header-actions {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .srm-lang-toggle-btn {
      background: rgba(196, 154, 69, 0.15);
      border: 1px solid var(--srm-gold);
      color: var(--srm-gold);
      border-radius: 12px;
      padding: 4px 8px;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .srm-lang-toggle-btn:hover {
      background: var(--srm-gold);
      color: var(--srm-navy-dark);
    }

    .srm-btn-icon {
      background: transparent;
      border: none;
      color: var(--srm-text-muted);
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      transition: color 0.2s ease;
    }

    .srm-btn-icon:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.1);
    }

    /* Message Area */
    .srm-chat-messages {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: radial-gradient(circle at 50% 10%, rgba(21, 50, 86, 0.4) 0%, transparent 60%);
    }

    .srm-chat-messages::-webkit-scrollbar {
      width: 5px;
    }
    .srm-chat-messages::-webkit-scrollbar-thumb {
      background: rgba(196, 154, 69, 0.3);
      border-radius: 10px;
    }

    .srm-msg {
      max-width: 86%;
      padding: 10px 14px;
      border-radius: 16px;
      word-wrap: break-word;
      font-size: 13.5px;
      line-height: 1.45;
      animation: srmFadeIn 0.25s ease;
    }

    @keyframes srmFadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .srm-msg.user {
      align-self: flex-end;
      background: linear-gradient(135deg, var(--srm-gold) 0%, #b38838 100%);
      color: #0b1e36;
      font-weight: 500;
      border-bottom-right-radius: 4px;
    }

    .srm-msg.bot {
      align-self: flex-start;
      background: var(--srm-card);
      border: 1px solid var(--srm-border);
      color: var(--srm-text);
      border-bottom-left-radius: 4px;
    }

    .srm-msg.bot a {
      color: var(--srm-gold);
      text-decoration: underline;
      font-weight: 600;
    }

    .srm-msg.bot a:hover {
      color: var(--srm-gold-light);
    }

    .srm-msg.bot ul, .srm-msg.bot ol {
      margin: 6px 0 6px 18px;
      padding: 0;
    }

    .srm-source-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      margin-top: 8px;
      padding: 3px 8px;
      background: rgba(196, 154, 69, 0.12);
      border: 1px solid rgba(196, 154, 69, 0.3);
      border-radius: 8px;
      font-size: 11px;
      color: var(--srm-gold);
      text-decoration: none !important;
    }

    .srm-source-badge:hover {
      background: rgba(196, 154, 69, 0.22);
    }

    /* Suggestion Chips */
    .srm-chips-container {
      display: flex;
      gap: 6px;
      overflow-x: auto;
      padding: 8px 14px;
      background: rgba(7, 19, 34, 0.85);
      border-top: 1px solid var(--srm-border);
      scrollbar-width: none;
    }

    .srm-chips-container::-webkit-scrollbar {
      display: none;
    }

    .srm-chip {
      background: var(--srm-card);
      color: var(--srm-gold);
      border: 1px solid var(--srm-border);
      padding: 5px 11px;
      border-radius: 20px;
      font-size: 11.5px;
      font-weight: 600;
      white-space: nowrap;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .srm-chip:hover {
      background: var(--srm-gold);
      color: var(--srm-navy-dark);
      border-color: var(--srm-gold);
      transform: translateY(-1px);
    }

    /* Input Area */
    .srm-chat-input-area {
      padding: 10px 14px;
      background: var(--srm-navy);
      border-top: 1px solid var(--srm-border);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .srm-input-field {
      flex: 1;
      background: var(--srm-navy-dark);
      border: 1px solid var(--srm-border);
      color: #ffffff;
      padding: 9px 12px;
      border-radius: 22px;
      font-size: 13px;
      outline: none;
      transition: border-color 0.2s ease;
    }

    .srm-input-field:focus {
      border-color: var(--srm-gold);
      box-shadow: 0 0 10px var(--srm-gold-glow);
    }

    .srm-input-field::placeholder {
      color: #64748b;
    }

    .srm-send-btn {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--srm-gold) 0%, #b38838 100%);
      border: none;
      color: var(--srm-navy-dark);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s ease, opacity 0.2s ease;
    }

    .srm-send-btn:hover {
      transform: scale(1.08);
    }

    .srm-send-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Typing Dots Animation */
    .srm-typing {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 8px 12px;
    }

    .srm-typing-dot {
      width: 6px;
      height: 6px;
      background: var(--srm-gold);
      border-radius: 50%;
      animation: srmTyping 1.4s infinite;
    }

    .srm-typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .srm-typing-dot:nth-child(3) { animation-delay: 0.4s; }

    @keyframes srmTyping {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
      30% { transform: translateY(-5px); opacity: 1; }
    }

    /* Mobile Responsive Full-screen */
    @media (max-width: 600px) {
      .srm-chat-box {
        position: fixed;
        top: 0;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        width: 100vw;
        height: 100vh;
        max-width: 100vw;
        max-height: 100vh;
        border-radius: 0;
        border: none;
      }
    }
  `;

  const styleEl = document.createElement("style");
  styleEl.id = "srm-embed-styles";
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // 3. Create Container
  const container = document.createElement("div");
  container.id = "srm-embed-container";
  container.innerHTML = `
    <!-- Launcher Button -->
    <div class="srm-launcher-label">
      <span>💬 SRM IST Trichy AI</span>
    </div>
    <button class="srm-launcher-btn" id="srm-launcher" aria-label="Open SRM AI Chatbot">
      <div class="srm-launcher-badge" id="srm-badge">1</div>
      <svg class="srm-launcher-icon" viewBox="0 0 24 24">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
      </svg>
    </button>

    <!-- Chat Box -->
    <div class="srm-chat-box" id="srm-chat-window">
      <!-- Header -->
      <div class="srm-chat-header">
        <div class="srm-header-info">
          <div class="srm-header-avatar">SRM</div>
          <div class="srm-header-titles">
            <h3 id="srm-title">${CONFIG.title}</h3>
            <p><span class="srm-status-dot"></span> <span id="srm-status-text">Online • Official AI</span></p>
          </div>
        </div>
        <div class="srm-header-actions">
          <button class="srm-lang-toggle-btn" id="srm-lang-toggle" title="Toggle Language">தமிழ் ⇄ EN</button>
          <button class="srm-btn-icon" id="srm-close-btn" title="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        </div>
      </div>

      <!-- Messages Body -->
      <div class="srm-chat-messages" id="srm-messages"></div>

      <!-- Quick Suggestion Chips -->
      <div class="srm-chips-container" id="srm-chips"></div>

      <!-- Input Bar -->
      <form class="srm-chat-input-area" id="srm-form">
        <input type="text" class="srm-input-field" id="srm-input" placeholder="Ask about Admissions, Fees, Courses..." autocomplete="off">
        <button type="submit" class="srm-send-btn" id="srm-send" aria-label="Send Message">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </form>
    </div>
  `;
  document.body.appendChild(container);

  // 4. Element References
  const launcher = document.getElementById("srm-launcher");
  const chatWindow = document.getElementById("srm-chat-window");
  const closeBtn = document.getElementById("srm-close-btn");
  const langToggle = document.getElementById("srm-lang-toggle");
  const badge = document.getElementById("srm-badge");
  const messagesContainer = document.getElementById("srm-messages");
  const chipsContainer = document.getElementById("srm-chips");
  const form = document.getElementById("srm-form");
  const input = document.getElementById("srm-input");
  const statusText = document.getElementById("srm-status-text");

  // 5. Suggestion Chips Definitions
  const CHIPS_DATA = {
    ta: [
      "B.Tech படிப்புகள்",
      "சேர்க்கை தகுதி & கட்டணம்",
      "வேலைவாய்ப்பு (₹50 LPA)",
      "விடுதி வசதிகள் & உணவு",
      "Ph.D. விண்ணப்பம்",
      "உதவி எண் 1800 202 4565"
    ],
    en: [
      "B.Tech Programs",
      "Admission & Fees",
      "Placements (₹50 LPA)",
      "Hostels & Mess",
      "PhD Online Application",
      "Toll-Free Helpline"
    ]
  };

  function renderChips() {
    chipsContainer.innerHTML = "";
    const list = CHIPS_DATA[currentLang] || CHIPS_DATA.en;
    list.forEach((chipText) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "srm-chip";
      chip.textContent = chipText;
      chip.onclick = () => {
        input.value = chipText;
        handleSendMessage();
      };
      chipsContainer.appendChild(chip);
    });
  }

  // 6. Formatting & Markdown Parsing
  function formatMarkdown(text) {
    if (!text) return "";
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    // Italics
    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
    // Links [title](url)
    html = html.replace(/\[(.*?)\]\((https?:\/\/[^\s)]+|\/docs\/[^\s)]+)\)/g, (match, title, url) => {
      const fullUrl = url.startsWith("/docs/") && CONFIG.apiBase ? CONFIG.apiBase + url : url;
      return `<a href="${fullUrl}" target="_blank" rel="noopener noreferrer">${title}</a>`;
    });
    // Bullet points
    html = html.replace(/(?:^|\n)[•-]\s*(.*?)(?=\n|$)/g, "<li>$1</li>");
    if (html.includes("<li>")) {
      html = html.replace(/(<li>.*?<\/li>)+/gs, "<ul>$&</ul>");
    }
    // Newlines
    html = html.replace(/\n\n/g, "<br><br>").replace(/\n/g, "<br>");
    return html;
  }

  // 7. Message Appending
  function appendMessage(sender, text, sourceUrl) {
    const msg = document.createElement("div");
    msg.className = `srm-msg ${sender}`;

    let contentHtml = formatMarkdown(text);
    if (sourceUrl && sender === "bot") {
      const isDoc = sourceUrl.includes("/docs/");
      const sourceLabel = isDoc ? `📄 PDF Source` : `🌐 Web Source`;
      const fullSourceUrl = sourceUrl.startsWith("/docs/") && CONFIG.apiBase ? CONFIG.apiBase + sourceUrl : sourceUrl;
      contentHtml += `<br><a class="srm-source-badge" href="${fullSourceUrl}" target="_blank" rel="noopener noreferrer">${sourceLabel}</a>`;
    }

    msg.innerHTML = contentHtml;
    messagesContainer.appendChild(msg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function showTypingIndicator() {
    const typing = document.createElement("div");
    typing.className = "srm-msg bot srm-typing";
    typing.id = "srm-typing-indicator";
    typing.innerHTML = `
      <div class="srm-typing-dot"></div>
      <div class="srm-typing-dot"></div>
      <div class="srm-typing-dot"></div>
    `;
    messagesContainer.appendChild(typing);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function removeTypingIndicator() {
    const el = document.getElementById("srm-typing-indicator");
    if (el) el.remove();
  }

  // 8. API Communication
  async function queryChatbot(queryText) {
    const endpoint = `${CONFIG.apiBase}/api/chat`;
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: queryText,
          history: conversationHistory.slice(-8),
          lang: currentLang
        })
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data;
    } catch (err) {
      console.warn("[SRM Chatbot Embed Error]:", err.message);
      // Fallback
      if (currentLang === "ta") {
        return {
          answer: "SRM IST திருச்சி சேர்க்கை, கட்டணம், B.Tech மற்றும் விடுதி விவரங்களை அறிய admissions@srmtrichy.edu.in அல்லது 1800 202 4565 அழைக்கவும்.",
          source: "https://www.srmtrichy.edu.in"
        };
      }
      return {
        answer: "Welcome to SRM IST Trichy. For immediate assistance with admissions, fees, and programs, call toll-free 1800 202 4565 or email admissions@srmtrichy.edu.in.",
        source: "https://www.srmtrichy.edu.in"
      };
    }
  }

  // 9. Send Handler
  async function handleSendMessage() {
    const text = input.value.trim();
    if (!text || isThinking) return;

    input.value = "";
    appendMessage("user", text);
    conversationHistory.push({ role: "user", text });

    isThinking = true;
    showTypingIndicator();

    const result = await queryChatbot(text);

    removeTypingIndicator();
    isThinking = false;

    if (result && result.answer) {
      appendMessage("bot", result.answer, result.source);
      conversationHistory.push({ role: "assistant", text: result.answer });
    }
  }

  // 10. Initial Welcome Message
  function sendWelcome() {
    messagesContainer.innerHTML = "";
    conversationHistory = [];
    if (currentLang === "ta") {
      appendMessage(
        "bot",
        "வணக்கம்! 👋 நான் **SRM IST திருச்சி AI உதவியாளர்**.\n\nசேர்க்கை, B.Tech & PG படிப்புகள், கல்விக் கட்டணம், **₹50 LPA வேலைவாய்ப்பு**, விடுதி மற்றும் Ph.D. சேர்க்கை குறித்து நீங்கள் என்னிடம் கேட்கலாம்."
      );
    } else {
      appendMessage(
        "bot",
        "Hello! 👋 Welcome to **SRM IST Trichy**.\n\nI am your official AI admission & campus assistant. Ask me about B.Tech courses, fees, **₹50 LPA placements**, hostels, scholarships, or Ph.D. admissions!"
      );
    }
    renderChips();
  }

  // 11. Event Listeners
  launcher.addEventListener("click", () => {
    isOpen = !isOpen;
    if (isOpen) {
      chatWindow.classList.add("is-open");
      launcher.classList.add("is-active");
      badge.style.display = "none";
      if (messagesContainer.children.length === 0) {
        sendWelcome();
      }
      setTimeout(() => input.focus(), 300);
    } else {
      chatWindow.classList.remove("is-open");
      launcher.classList.remove("is-active");
    }
  });

  closeBtn.addEventListener("click", () => {
    isOpen = false;
    chatWindow.classList.remove("is-open");
    launcher.classList.remove("is-active");
  });

  langToggle.addEventListener("click", () => {
    currentLang = currentLang === "ta" ? "en" : "ta";
    langToggle.textContent = currentLang === "ta" ? "தமிழ் ⇄ EN" : "EN ⇄ தமிழ்";
    input.placeholder = currentLang === "ta" ? "சேர்க்கை, கட்டணம், படிப்புகள் பற்றி கேட்கவும்..." : "Ask about Admissions, Fees, Courses...";
    sendWelcome();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    handleSendMessage();
  });

  // Auto-open option
  if (CONFIG.autoOpenDelay > 0) {
    setTimeout(() => {
      if (!isOpen) launcher.click();
    }, CONFIG.autoOpenDelay);
  }

  // Initial chips
  renderChips();
  console.log(`[SRM IST Trichy AI Chatbot] Embed Initialized. Backend: ${CONFIG.apiBase || "Local"}`);
})();

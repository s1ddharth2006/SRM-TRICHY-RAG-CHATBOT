(function () {
  // Determine backend API host for seamless embedding on external websites
  const CURRENT_SCRIPT = document.currentScript || Array.from(document.querySelectorAll("script")).find(s => s.src && s.src.includes("srm-tamil-widget.js"));
  const SCRIPT_ORIGIN = CURRENT_SCRIPT && CURRENT_SCRIPT.src ? new URL(CURRENT_SCRIPT.src).origin : "";
  const API_BASE = (window.SRM_CHAT_API_URL || SCRIPT_ORIGIN || "").replace(/\/+$/, "");

  // Auto-inject widget stylesheet if not already present on host page
  if (!document.querySelector('link[href*="srm-tamil-widget.css"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = (API_BASE ? API_BASE : "") + "/srm-tamil-widget.css";
    document.head.appendChild(link);
  }

  // Merge comprehensive dictionary if present
  const DICT = Object.assign({
    Home: "முகப்பு",
    About: "எங்களைப் பற்றி",
    "About Us": "எங்களைப் பற்றி",
    Academics: "கல்வி",
    "Academic Programs": "கல்வித் திட்டங்கள்",
    "Academic Calendar": "கல்வி நாட்காட்டி",
    Placement: "வேலைவாய்ப்பு",
    Placements: "வேலைவாய்ப்புகள்",
    "Placement Home": "வேலைவாய்ப்பு முகப்பு",
    Campus: "வளாகம்",
    "Campus Life": "வளாக வாழ்க்கை",
    Research: "ஆராய்ச்சி",
    "Research Home": "ஆராய்ச்சி முகப்பு",
    "Sponsored Research": "நிதியுதவி ஆராய்ச்சி",
    "International Affairs": "சர்வதேச அலுவல்கள்",
    "International Relations": "சர்வதேச உறவுகள்",
    Students: "மாணவர்கள்",
    "News & Events": "செய்திகள் & நிகழ்வுகள்",
    Contact: "தொடர்பு",
    "Contact Us": "எங்களைத் தொடர்பு கொள்ளவும்",
    "Admissions 2026": "சேர்க்கை 2026",
    Admission: "சேர்க்கை",
    Admissions: "சேர்க்கை",
    "Fee Payment": "கட்டணம் செலுத்துதல்",
    "Fee Payment →": "கட்டணம் செலுத்துதல் →",
    Overview: "மேலோட்டம்",
    "Vision & Mission": "தொலைநோக்கு & நோக்கம்",
    "Our Vision": "எங்கள் தொலைநோக்கு",
    "Our Mission": "எங்கள் நோக்கம்",
    Leadership: "தலைமை",
    "Apex Leadership": "உயர் தலைமை",
    "Administrative Heads": "நிர்வாகத் தலைவர்கள்",
    "Academics Head": "கல்வித் தலைவர்கள்",
    Policy: "கொள்கை",
    NAAC: "NAAC அங்கீகாரம்",
    Infrastructure: "உள்கட்டமைப்பு",
    Departments: "துறைகள்",
    "Career Development Centre": "தொழில் வளர்ச்சி மையம் (CDC)",
    "Career Development Centre (CDC-CET)": "தொழில் வளர்ச்சி மையம் (CDC-CET)",
    "CDC Programs": "CDC பயிற்சித் திட்டங்கள்",
    Hostels: "விடுதிகள்",
    Hostel: "விடுதி",
    "Boys' Hostel": "மாணவர் விடுதி",
    "Girls' Hostel": "மாணவியர் விடுதி",
    Library: "நூலகம்",
    "Central Library": "மத்திய நூலகம்",
    Sports: "விளையாட்டு",
    "Sports & Athletics": "விளையாட்டு & தடகளம்",
    NCC: "தேசிய மாணவர் படை (NCC)",
    NSS: "நாட்டு நலப்பணித் திட்டம் (NSS)",
    Transport: "போக்குவரத்து",
    Examcell: "தேர்வுப் பிரிவு",
    "Exam Cell": "தேர்வுப் பிரிவு",
    Announcements: "அறிவிப்புகள்",
    "For Admission →": "சேர்க்கைக்கு →",
    "Learn More": "மேலும் அறிக",
    "Download Brochure": "விளக்க ஏடு பதிவிறக்குக",
    "Apply Now": "இப்போதே விண்ணப்பிக்கவும்",
    "View Placements": "வேலைவாய்ப்புகளைக் காண்க",
    "Explore Campus": "வளாகத்தை ஆராயுங்கள்",
    "Explore Programs": "பாடத்திட்டங்களை ஆராயுங்கள்",
    "Send Message": "செய்தி அனுப்பு",
    "Enter First Name": "முதல் பெயரை உள்ளிடவும்",
    "Enter Last Name": "கடைசி பெயரை உள்ளிடவும்",
    "Enter Email": "மின்னஞ்சலை உள்ளிடவும்",
    "Enter Phone": "தொலைபேசி எண்ணை உள்ளிடவும்",
    "Enter Message": "செய்தியை உள்ளிடவும்",
    "First Name *": "முதல் பெயர் *",
    "Last Name": "கடைசி பெயர்",
    "Email *": "மின்னஞ்சல் *",
    "Phone *": "தொலைபேசி எண் *",
    Message: "செய்தி",
    "Chat with us on WhatsApp": "WhatsApp-இல் எங்களுடன் பேசுங்கள்",
    Governance: "ஆளுமை",
    Careers: "வேலை வாய்ப்புகள்",
    "Careers at SRM": "SRM-இல் வேலை வாய்ப்புகள்",
    "SCROLL TO EXPLORE": "ஆராய கீழே உருட்டவும்",
    "Scroll to Explore": "ஆராய கீழே உருட்டவும்",
    "ABOUT SRM TRICHY": "SRM திருச்சி பற்றி",
    "About SRM Trichy": "SRM திருச்சி பற்றி",
    "World Class Education": "உலகத் தரம் வாய்ந்த கல்வி",
    "Now in Trichy": "இப்போது திருச்சியில்",
    "What Defines": "எது தனித்துவமாக்குகிறது",
    "Rankings & Accreditations": "தரவரிசை & அங்கீகாரங்கள்",
    "Purpose-Driven Excellence": "நோக்கமுடைய சிறப்பு",
    "Leadership & Vision": "தலைமை & தொலைநோக்கு",
    "Programs Designed for Tomorrow's Leaders": "நாளைத் தலைவர்களுக்கான பாடத்திட்டங்கள்",
    "Life Beyond the Classroom": "வகுப்பறைக்கு அப்பால் வாழ்க்கை",
    "Hear It From Our Students": "எங்கள் மாணவர்களிடமிருந்து கேளுங்கள்",
    "We'd Love to Hear From You": "உங்களிடமிருந்து கேட்க விரும்புகிறோம்",
    "OUR RECOGNITION": "எங்கள் அங்கீகாரம்",
    "OUR VISION & MISSION": "எங்கள் தொலைநோக்கு & நோக்கம்",
    "OUR MANAGEMENT": "எங்கள் நிர்வாகம்",
    "ACADEMIC PROGRAMS": "கல்வித் திட்டங்கள்",
    "CAMPUS LIFE": "வளாக வாழ்க்கை",
    "STUDENT STORIES": "மாணவர் கதைகள்",
    "GET IN TOUCH": "தொடர்பு கொள்ளுங்கள்",
    "Get In Touch": "தொடர்பு கொள்ளுங்கள்",
    "Faculty of Engineering and Technology": "பொறியியல் மற்றும் தொழில்நுட்ப பீடம்",
    "Faculty of Management": "மேலாண்மை பீடம்",
    "Institute of Hotel Management": "ஹோட்டல் மேலாண்மை நிறுவனம்",
    "College of Physiotherapy": "இயன்முறை சிகிச்சை கல்லூரி",
    "College of Occupational Therapy": "தொழில் சிகிச்சை கல்லூரி",
    "Allied Health Sciences": "தொடர்புடைய சுகாதார அறிவியல் கல்லூரி",
    "Science & Humanities": "அறிவியல் & மானுடவியல் பள்ளி",
    "School of Computing": "கணினி அறிவியல் பள்ளி",
    "School of Electrical and Electronics Engineering": "மின் மற்றும் மின்னணு பொறியியல் பள்ளி",
    "School of Mechanical Engineering": "இயந்திரப் பொறியியல் பள்ளி",
    "School of Biosciences and Technology": "உயிரியல் அறிவியல் மற்றும் தொழில்நுட்பப் பள்ளி",
    "Department of Computer Science": "கணினி அறிவியல் துறை",
    "Department of Commerce": "வணிகவியல் துறை",
    "Industry-Integrated Curriculum": "தொழில் ஒருங்கிணைந்த பாடத்திட்டம்",
    "Download Our Prospectus.": "எங்கள் விளக்க ஏட்டைப் பதிவிறக்கவும்.",
    "Start Your Journey.": "உங்கள் பயணத்தைத் தொடங்குங்கள்.",
    Address: "முகவரி",
    Phone: "தொலைபேசி",
    Email: "மின்னஞ்சல்",
    "Office Hours": "அலுவலக நேரம்",
    "Quick Links": "விரைவு இணைப்புகள்",
    "INNOVATION DRIVES SUCCESS": "புத்தாக்கம் வெற்றியை இயக்குகிறது",
    "WELLNESS MEETS LEARNING": "நல்வாழ்வு கற்றலைச் சந்திக்கிறது",
    "FUTURE STARTS HERE": "எதிர்காலம் இங்கே தொடங்குகிறது",
    "Career Growth": "தொழில் வளர்ச்சி",
    "Balanced Living": "சமநிலை வாழ்க்கை",
    "Endless Opportunities": "முடிவற்ற வாய்ப்புகள்",
    "SRM IST Trichy": "SRM IST திருச்சி",
    "SRM IST TRICHY": "SRM IST திருச்சி",
    Loading: "ஏற்றுகிறது...",
    "Loading...": "ஏற்றுகிறது...",
    "Mandatory Disclosure": "கட்டாய வெளியிடுதல்",
    Communication: "தொடர்பாடல்"
  }, window.SRM_TAMIL_DICT || {});

  const SKIP = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "IFRAME", "CODE", "PRE", "TEXTAREA"]);
  const originalTextMap = new WeakMap();
  const translatedNodes = new WeakSet();

  let tamilOn = localStorage.getItem("srm_tamil_lang") === "ta";
  let queue = [];
  let timer = null;

  function hasTamil(s) {
    return /[\u0B80-\u0BFF]/.test(s);
  }

  function isTranslatable(s) {
    const t = s.replace(/\s+/g, " ").trim();
    if (!t || t.length < 2) return false;
    if (hasTamil(t)) return false;
    if (/^[\d\s.,:+\-/%₹$()#@&]+$/.test(t)) return false;
    if (/^https?:|^[\w.+-]+@[\w.-]+$/.test(t)) return false;
    if (/^[A-Z]{2,6}$/.test(t) && t.length <= 6) return false;
    return /[A-Za-z]/.test(t);
  }

  function translateNode(node) {
    if (!node || node.nodeType !== 3) return;
    const raw = node.nodeValue;
    if (!originalTextMap.has(node)) {
      originalTextMap.set(node, raw);
    }

    if (!tamilOn) {
      const orig = originalTextMap.get(node);
      if (orig !== undefined && node.nodeValue !== orig) {
        node.nodeValue = orig;
      }
      return;
    }

    if (!isTranslatable(raw)) return;
    const text = raw.replace(/\s+/g, " ").trim();

    // 1. Direct dictionary match
    if (DICT[text]) {
      node.nodeValue = raw.replace(text, DICT[text]);
      translatedNodes.add(node);
      return;
    }

    // 2. Multi-word phrase or compound word replacement
    let replaced = raw;
    let found = false;
    for (const [en, ta] of Object.entries(DICT)) {
      if (en.length >= 3 && replaced.includes(en)) {
        replaced = replaced.split(en).join(ta);
        found = true;
      }
    }
    if (found) {
      node.nodeValue = replaced;
      translatedNodes.add(node);
      return;
    }

    // 3. Fallback queue for backend translate API
    queue.push({ node, text });
    schedule();
  }

  function translateAttributes(el) {
    if (!el || !el.getAttribute) return;
    ["placeholder", "title", "aria-label"].forEach((attr) => {
      const val = el.getAttribute(attr);
      if (!val) return;
      const key = "orig_" + attr;
      if (!el.hasAttribute(key)) el.setAttribute(key, val);

      if (!tamilOn) {
        el.setAttribute(attr, el.getAttribute(key));
        return;
      }
      if (DICT[val]) {
        el.setAttribute(attr, DICT[val]);
      }
    });
  }

  function walk(root) {
    if (!root) return;
    const it = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        const p = n.parentElement;
        if (!p || SKIP.has(p.tagName)) return NodeFilter.FILTER_REJECT;
        if (p.closest("#srm-niaa-root") || p.closest(".niaa-chat-widget") || p.closest(".srm-ta-toggle") || p.closest(".niaa-indicator")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    let n;
    while ((n = it.nextNode())) translateNode(n);

    const selector = "input[placeholder], textarea[placeholder], button[title], [aria-label]";
    const els = root.querySelectorAll ? root.querySelectorAll(selector) : [];
    els.forEach((el) => {
      if (!el.closest("#srm-niaa-root") && !el.closest(".niaa-chat-widget") && !el.closest(".srm-ta-toggle") && !el.closest(".niaa-indicator")) translateAttributes(el);
    });
  }

  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(flush, 300);
  }

  async function flush() {
    if (!queue.length || !tamilOn) return;
    const batch = queue.splice(0, 30);
    const unique = [];
    const map = new Map();
    batch.forEach((item) => {
      if (!map.has(item.text)) {
        map.set(item.text, []);
        unique.push(item.text);
      }
      map.get(item.text).push(item.node);
    });

    try {
      const res = await fetch(`${API_BASE}/api/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texts: unique }),
      });
      if (res.ok) {
        const data = await res.json();
        (data.translations || []).forEach((ta, i) => {
          const en = unique[i];
          if (!ta || ta === en) return;
          DICT[en] = ta;
          (map.get(en) || []).forEach((node) => {
            if (!node || !node.nodeValue) return;
            node.nodeValue = node.nodeValue.replace(en, ta);
            translatedNodes.add(node);
          });
        });
      }
    } catch (e) {}
    if (queue.length) schedule();
  }

  function mountChat() {
    if (document.getElementById("srm-niaa-root")) return;
    const root = document.createElement("div");
    root.id = "srm-niaa-root";
    root.innerHTML = `
      <!-- External Website Multi-Language Toggle (Bottom-Left) -->
      <button class="srm-ta-toggle" id="srm-ta-lang" type="button" title="Website Language: English ⇄ தமிழ்">
        ${tamilOn ? "🌐 மொழி: தமிழ் ⇄ English" : "🌐 Language: English ⇄ தமிழ்"}
      </button>

      <!-- WhatsApp Admissions Chat Widget (Bottom-Right) -->
      <div class="niaa-chat-widget" id="niaaChatWidget">
        <!-- Floating Indicator Bubble -->
        <div class="niaa-indicator" id="niaaIndicator" style="display: none;">
          <div class="niaa-indicator-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0c4da2" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <div class="niaa-indicator-text" id="niaaIndicatorText">
            <strong>SRM Admissions Desk</strong>: Need guidance on SRM Trichy admissions? Chat now!
          </div>
          <button type="button" class="niaa-indicator-close" id="niaaIndicatorClose" title="Dismiss">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Floating Chat Trigger Button -->
        <button class="niaa-chat-button" id="niaaChatButton" type="button" title="Chat with SRM Admissions Desk">
          <!-- Clean Chat Icon -->
          <svg class="niaa-btn-icon-chat" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <svg class="niaa-btn-icon-close" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          <span class="notification-badge" id="niaaBadge">1</span>
        </button>

        <!-- SRM Admissions Chat Window Panel -->
        <div class="niaa-chat-window" id="niaaChatWindow">
          <!-- SRM Header (Navy #0c4da2 & Gold #e4b316) -->
          <div class="niaa-chat-header">
            <div class="wa-header-left">
              <div class="wa-avatar-wrapper">
                <div class="niaa-chat-avatar">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0c4da2" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                </div>
                <span class="wa-avatar-online-dot"></span>
              </div>
              <div class="niaa-chat-info">
                <div class="niaa-chat-title-row">
                  <h3>SRM Admissions Desk</h3>
                  <!-- Official Verified SRM Gold Badge -->
                  <svg class="wa-verified-badge" width="15" height="15" viewBox="0 0 18 18" fill="none" title="Verified Admission Desk">
                    <circle cx="9" cy="9" r="8.5" fill="#e4b316"/>
                    <path d="M5.5 9.2L7.8 11.5L12.5 6.5" stroke="#0c4da2" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <p id="niaaStatusText">online</p>
              </div>
            </div>
            <div class="niaa-header-actions">
              <!-- Direct Admission Phone Call -->
              <a href="tel:18002024565" class="wa-header-btn" title="Call Admissions Desk: 1800 202 4565">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </a>
              <!-- Restart / Clear Chat -->
              <button class="wa-header-btn" id="niaaChatRestart" type="button" title="Clear chat / Restart">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="1 4 1 10 7 10"></polyline>
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                </svg>
              </button>
              <!-- Close Window -->
              <button class="wa-header-btn" id="niaaChatClose" type="button" title="Close">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>

          <!-- WhatsApp Language Sub-Bar -->
          <div class="niaa-lang-subbar">
            <span class="niaa-lang-label">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              Language:
            </span>
            <div class="niaa-lang-bar" id="niaaLangBar">
              <button type="button" class="niaa-lang-btn active" data-lang="en">English</button>
              <button type="button" class="niaa-lang-btn" data-lang="ta">தமிழ்</button>
            </div>
            <!-- FAQ & Active Learning Drawer Button -->
            <button type="button" class="niaa-train-btn" id="niaaTrainBtn" title="Frequently Asked Questions & Teach AI">
              💡 FAQs & Teach
            </button>
          </div>

          <!-- Slide-down Training & FAQs Drawer -->
          <div class="niaa-training-drawer" id="niaaTrainingDrawer" style="display: none;">
            <div class="niaa-drawer-tabs">
              <button type="button" class="niaa-tab-btn active" data-tab="faqs">📚 Top FAQs (<span id="faqCount">12</span>)</button>
              <button type="button" class="niaa-tab-btn" data-tab="teach">🎓 Teach AI</button>
              <button type="button" class="niaa-tab-btn" data-tab="learned">💡 Learned Memory (<span id="learnCount">0</span>)</button>
              <button type="button" class="niaa-drawer-close" id="niaaDrawerClose" title="Close Panel">✕</button>
            </div>
            <div class="niaa-drawer-body">
              <!-- FAQs Tab Pane -->
              <div class="niaa-tab-pane active" id="paneFaqs">
                <div class="niaa-faq-search-box">
                  <input type="text" id="faqSearchInput" placeholder="🔍 Search trained questions..." />
                </div>
                <div class="niaa-faq-list" id="niaaFaqList">Loading FAQs...</div>
              </div>
              <!-- Teach AI Tab Pane -->
              <div class="niaa-tab-pane" id="paneTeach">
                <form id="niaaTeachForm" class="niaa-teach-form">
                  <label>Question / கேள்வி:</label>
                  <input type="text" id="teachQuestion" placeholder="e.g. Can I pay fees in installments?" required />
                  <label>Verified Answer / விடை:</label>
                  <textarea id="teachAnswer" rows="3" placeholder="Enter the official answer the AI should learn..." required></textarea>
                  <div class="niaa-teach-row">
                    <select id="teachCategory">
                      <option value="admissions">Admissions / சேர்க்கை</option>
                      <option value="fees">Fees & Scholarships / கட்டணம்</option>
                      <option value="hostel">Hostels & Food / விடுதி</option>
                      <option value="placements">Placements / வேலைவாய்ப்பு</option>
                      <option value="facilities">Campus & Facilities / வளாகம்</option>
                      <option value="general">General / பொது</option>
                    </select>
                    <button type="submit" class="niaa-teach-submit-btn">🎓 Teach AI Now</button>
                  </div>
                  <div id="teachStatus" class="niaa-teach-status"></div>
                </form>
              </div>
              <!-- Learned Memory Tab Pane -->
              <div class="niaa-tab-pane" id="paneLearned">
                <div class="niaa-learned-intro">
                  Questions automatically learned by the AI from user interactions:
                </div>
                <div class="niaa-learned-list" id="niaaLearnedList">Loading learned memory...</div>
              </div>
            </div>
          </div>

          <!-- WhatsApp Messages Canvas -->
          <div class="niaa-chat-messages" id="niaaChatMessages">
            <!-- End-to-End Encryption Notice Banner -->
            <div class="wa-encryption-banner">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <span>Messages are end-to-end encrypted. Official SRM IST Trichy Admission Desk.</span>
            </div>
            <!-- Today date divider -->
            <div class="wa-date-divider">
              <span>TODAY</span>
            </div>
          </div>

          <!-- WhatsApp Typing Indicator -->
          <div class="niaa-typing" id="niaaTyping">
            <div class="niaa-typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          <!-- WhatsApp Quick Replies Container -->
          <div class="niaa-quick-replies" id="niaaQuickReplies"></div>

          <!-- Chat Input Form -->
          <form class="niaa-chat-input-container" id="niaaChatForm">
            <input 
              type="text" 
              class="niaa-chat-input" 
              id="niaaChatInput" 
              placeholder="Type a message..." 
              autocomplete="off" 
            />
            <button type="submit" class="niaa-chat-send" id="niaaChatSend" title="Send">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#ffffff">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
              </svg>
            </button>
          </form>

          <!-- Footer -->
          <div class="niaa-powered-by">
            <span>Official Admissions Desk · SRM Institute of Science and Technology</span>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(root);

    // Elements
    const chatBtn = document.getElementById("niaaChatButton");
    const chatWindow = document.getElementById("niaaChatWindow");
    const closeBtn = document.getElementById("niaaChatClose");
    const restartBtn = document.getElementById("niaaChatRestart");
    const messagesContainer = document.getElementById("niaaChatMessages");
    const typingIndicator = document.getElementById("niaaTyping");
    const quickRepliesContainer = document.getElementById("niaaQuickReplies");
    const chatForm = document.getElementById("niaaChatForm");
    const chatInput = document.getElementById("niaaChatInput");
    const badge = document.getElementById("niaaBadge");
    const statusText = document.getElementById("niaaStatusText");
    const langBar = document.getElementById("niaaLangBar");
    const siteLangBtn = document.getElementById("srm-ta-lang");
    const indicator = document.getElementById("niaaIndicator");
    const indicatorClose = document.getElementById("niaaIndicatorClose");
    const indicatorText = document.getElementById("niaaIndicatorText");

    // State
    let isChatOpen = false;
    let currentLang = localStorage.getItem("niaa_chat_lang") || "en";
    let conversationHistory = [];

    // Lead Capture State (1st Email -> 2nd Phone -> 3rd Name)
    let leadData = null;
    try {
      leadData = JSON.parse(localStorage.getItem("niaa_lead_data") || "null");
    } catch (e) {
      leadData = null;
    }

    let leadStage = (leadData && leadData.email && leadData.phone && leadData.name) ? "DONE" : "EMAIL";

    // React Native Input Value Setter & Form Auto-fill Engine
    function setReactInputValue(input, value) {
      if (!input || !value) return;
      try {
        const prototype = Object.getPrototypeOf(input);
        const descriptor = Object.getOwnPropertyDescriptor(prototype, "value");
        if (descriptor && descriptor.set) {
          descriptor.set.call(input, value);
        } else {
          input.value = value;
        }
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
        input.classList.add("mozhi-autofilled");
        setTimeout(() => input.classList.remove("mozhi-autofilled"), 4000);
      } catch (err) {
        input.value = value;
      }
    }

    // Auto-fill all on-page registration and enquiry forms
    function autofillPageForms(lead) {
      if (!lead) return false;
      let filledAny = false;

      // 1. Name
      if (lead.name) {
        const parts = lead.name.trim().split(/\s+/);
        const firstName = parts[0] || "";
        const lastName = parts.slice(1).join(" ") || "";

        const fnInputs = document.querySelectorAll('input[name="firstName"], input[name="fname"], input[placeholder*="First Name" i], input[name="name"]');
        fnInputs.forEach(el => { setReactInputValue(el, firstName); filledAny = true; });

        const lnInputs = document.querySelectorAll('input[name="lastName"], input[name="lname"], input[placeholder*="Last Name" i]');
        lnInputs.forEach(el => { if (lastName) { setReactInputValue(el, lastName); filledAny = true; } });
      }

      // 2. Email
      if (lead.email) {
        const emailInputs = document.querySelectorAll('input[name="email"], input[type="email"], input[placeholder*="Email" i]');
        emailInputs.forEach(el => { setReactInputValue(el, lead.email); filledAny = true; });
      }

      // 3. Phone
      if (lead.phone) {
        const phoneInputs = document.querySelectorAll('input[name="phone"], input[type="tel"], input[placeholder*="Phone" i], input[placeholder*="Mobile" i]');
        phoneInputs.forEach(el => { setReactInputValue(el, lead.phone); filledAny = true; });
      }

      return filledAny;
    }

    // Multi-Language Strings & Knowledge Base
    const I18N = {
      en: {
        indicator: "<strong>SRM Admissions Desk</strong>: Need guidance on SRM Trichy admissions? Chat now!",
        status: "online",
        placeholder: "Type a message...",
        welcome: `👋 **Welcome to SRM IST Trichy!**\n\nI'm **Mozhi AI**, your official virtual admission counselor.\n\nTo assist you with official admissions, eligibility, and brochure downloads, please provide your **Email ID**:`,
        step1_email: `📧 **Step 1 of 3: Email Address**\nPlease enter your **Email ID** to begin:`,
        step2_phone: `📱 **Step 2 of 3: Mobile Number**\nThank you! Please share your **Mobile Number** (10 digits):`,
        step3_name: `👤 **Step 3 of 3: Candidate Name**\nGreat! What is your **Full Name**?`,
        regSuccess: (name) => `🎉 Thank you, **${name}**! Your admission inquiry has been registered with SRM IST Trichy.\n\n✅ **We have pre-filled your registration form on the page!**\n\nHow can I help you today? Choose a topic below or ask any question:`,
        invalidEmail: `⚠️ Please enter a valid email address (e.g. student@gmail.com):`,
        invalidPhone: `⚠️ Please enter a valid 10-digit mobile number:`,
        skipLabel: "Skip to Questions ➔",
        langSwitched: "Language switched to **English**.",
        topics: ["Admissions 2026", "Engineering & Courses", "Fee Structure & Scholarships", "Placements (₹50 LPA)", "Hostels & Accommodation", "News & Events", "Campus Life", "Contact Counselors"],
        knowledge: {
          admissions: {
            title: "Admissions 2026",
            source: "https://www.srmtrichy.edu.in/admission",
            response: `🎓 **SRM IST Trichy Admissions Open for 2026-27!**\n\n**Admission Pathways:**\n• **SRMJEEE 2026:** National entrance exam for B.Tech programs.\n• **Direct Board Merit:** Based on 12th Board PCM marks (minimum 60% aggregate).\n\n**How to Apply:**\n1. Visit the [Official SRM Trichy Admission Portal](https://www.srmtrichy.edu.in/admission)\n2. Register and fill the application at [Apply Now Portal](https://admissions.srmtrichy.edu.in/)\n3. Upload 10th & 12th marksheets\n4. Pay application fee (₹1,200) online\n5. Save application number for counseling\n\n**Admission Helpline:**\n📞 Toll-Free: **1800 202 4565** | 📧 **admissions@srmtrichy.edu.in**\n📍 [Campus Location & Contact Details](https://www.srmtrichy.edu.in/contact)`,
            quickReplies: ["Engineering & Courses", "Fee Structure & Scholarships", "Contact Counselors"]
          },
          courses: {
            title: "Engineering & Courses",
            source: "https://www.srmtrichy.edu.in/institution/programmes",
            response: `📚 **Academic Programs at SRM IST Trichy:**\n\n**Engineering (B.Tech - 4 Years):**\n• Computer Science & Engineering (CSE)\n• Artificial Intelligence & Data Science (AI & DS)\n• Cyber Security\n• Biotechnology\n• Information Technology (IT)\n• Electronics & Communication (ECE)\n• Mechanical & Civil Engineering\n\n**Management:**\n• MBA (Dual Specialization - 2 Years)\n• BBA (Bachelor of Business Administration - 3 Years)\n\n**Science & Humanities:**\n• BCA (Cloud Computing & DevOps / Data Science)\n• B.Com (General / Information Systems), M.Com\n• B.Sc & M.Sc programs\n\n**Health Sciences:**\n• BPT (Bachelor of Physiotherapy - 4.5 Years)\n• BOT (Bachelor of Occupational Therapy)\n• Allied Health Sciences (750-bed Teaching Hospital)\n\n🔗 [Explore All Academic Programmes](https://www.srmtrichy.edu.in/institution/programmes)`,
            quickReplies: ["Admissions 2026", "Fee Structure & Scholarships", "Placements (₹50 LPA)"]
          },
          fees: {
            title: "Fee Structure & Scholarships",
            source: "https://www.srmtrichy.edu.in/admission",
            response: `💰 **Tuition & Hostel Fee Structure (2026-27):**\n\n**B.Tech Programs:**\n• Tuition Fee: ₹1,75,000 – ₹2,50,000 / year (based on branch)\n• Application Fee: ₹1,200\n\n**Management & Other Programs:**\n• MBA: ₹1,75,000 – ₹2,25,000 / year\n• BBA / BCA / B.Com: ₹70,000 – ₹1,10,000 / year\n• BPT (Physiotherapy): ₹1,10,000 – ₹1,60,000 / year\n\n**Hostel & Mess Charges:**\n• AC / Non-AC 2, 3, 4 Sharing: ₹85,000 – ₹1,35,000 / year\n• Nutritious South & North Indian Multi-Cuisine Mess included\n\n**Scholarships Available:**\n🌟 **Merit Scholarship (90%+ in 12th):** 50% tuition fee waiver\n🌟 **Merit Scholarship (80%+ in 12th):** 25% tuition fee waiver\n🌟 **SRMJEEE Top Rankers:** Up to 100% waiver\n🌟 **Sports Quota:** Up to 100% fee waiver for state/national achievers\n\n🔗 [Official Fee Policy & Online Payment](https://www.srmtrichy.edu.in/admission)`,
            quickReplies: ["Admissions 2026", "Hostels & Accommodation", "Contact Counselors"]
          },
          placements: {
            title: "Placements (₹50 LPA)",
            source: "https://www.srmtrichy.edu.in/placement",
            response: `💼 **Placement Highlights at SRM IST Trichy:**\n\n**Placement Records:**\n• **Highest Package:** **₹50 LPA**\n• **Average Package:** **₹8.5 LPA**\n• **Placement Rate:** **95%+** eligible students placed\n• **Recruiters:** 600+ top companies visit annually\n\n**Top Multinational Recruiters:**\n• Amazon, Microsoft, Google, Zoho\n• TCS, Infosys, Wipro, Cognizant, Accenture\n• Renault Nissan, Bosch, L&T, Deloitte, Barclays\n\n**Career Development Centre (CDC):**\n✓ Coding, Full-Stack & DSA training from 1st year\n✓ Soft Skills & Communication Bootcamps\n✓ Mock Corporate Interviews & Live Hackathons\n\n🔗 [View Official Placement Report](https://www.srmtrichy.edu.in/placement)`,
            quickReplies: ["Engineering & Courses", "Admissions 2026", "Contact Counselors"]
          },
          hostel: {
            title: "Hostels & Accommodation",
            source: "https://www.srmtrichy.edu.in/campus-life#accommodation",
            response: `🏠 **SRM IST Trichy — Hostels & Accommodation Facilities:**\n\n• **Dedicated Blocks:** Separate secure, CCTV-monitored residential buildings for Boys and Girls on campus.\n• **Room Configurations:** Modern AC and Non-AC rooms with 2, 3, and 4 sharing options.\n• **Annual Cost:** **₹85,000 – ₹1,35,000 / year** (inclusive of boarding, food, Wi-Fi, electricity & gym).\n• **Multi-Cuisine Dining:** Automated, hygienic mess providing nutritious South Indian & North Indian vegetarian & non-vegetarian menus.\n• **Amenities:** 24/7 power backup, RO drinking water, Wi-Fi, medical care at on-campus 750-bed SRM Hospital.\n\n🔗 [Explore Hostels & Accommodation](https://www.srmtrichy.edu.in/campus-life#accommodation)`,
            quickReplies: ["Fee Structure & Scholarships", "Campus Life", "Contact Counselors"]
          },
          news: {
            title: "News & Events",
            source: "https://www.srmtrichy.edu.in/news-and-events",
            response: `📢 **SRM IST Trichy — News, Events & Circulars:**\n\n• **Conferences & Workshops:** IEEE international symposia, AI & robotics hackathons, and national research workshops.\n• **Cultural & Tech Festivities:** Annual cultural gala 'Milan / Tarang', national technical festival 'Technozion', and sports tournaments.\n• **Official Updates:** Academic calendars, exam schedules, and corporate placement drive circulars.\n\n🔗 [Explore News & Events Portal](https://www.srmtrichy.edu.in/news-and-events) | [Academic Calendar](https://www.srmtrichy.edu.in/academic_calendar)`,
            quickReplies: ["Admissions 2026", "Hostels & Accommodation", "Campus Life"]
          },
          campus: {
            title: "Campus Life",
            source: "https://www.srmtrichy.edu.in/campus-life",
            response: `🏫 **Campus Facilities & Student Life:**\n\n**Campus Infrastructure:**\n• 50+ Acres lush green eco-friendly Wi-Fi campus\n• 50+ advanced high-tech engineering & AI computing labs\n• Central Library with 50,000+ volumes & digital journals\n• 750-bed SRM Super Speciality Medical College Hospital on campus\n\n**Sports & Recreation:**\n• Football, cricket grounds, basketball, badminton & gymnasium\n• 1,500-capacity air-conditioned auditorium\n\n**Location:**\n📍 Trichy-Chennai NH-45 Highway, near Samayapuram Toll Plaza, Trichy - 621105\n\n🔗 [Explore Campus Life](https://www.srmtrichy.edu.in/campus-life) | [Hostels & Rooms](https://www.srmtrichy.edu.in/campus-life#accommodation)`,
            quickReplies: ["Hostels & Accommodation", "Engineering & Courses", "Contact Counselors"]
          },
          contact: {
            title: "Contact Counselors",
            source: "https://www.srmtrichy.edu.in/contact",
            response: `📞 **SRM IST Trichy Admission Helpdesk:**\n\n**Address:**\nSRM Institute of Science and Technology\nSRM Nagar, Trichy-Chennai Highway (NH-45)\nNear Samayapuram, Tiruchirappalli - 621 105, Tamil Nadu\n\n**Helpline Numbers:**\n📞 Toll-Free: **1800 202 4565**\n📞 Direct Admissions: **0431 - 2258900 / 2258901**\n\n**Official Email:**\n📧 **admissions@srmtrichy.edu.in**\n📧 **info@srmtrichy.edu.in**\n\n**Working Hours:**\nMonday – Saturday: 9:00 AM – 5:00 PM\n\n🔗 [Online Contact Form & Directions](https://www.srmtrichy.edu.in/contact) | [Apply Online](https://admissions.srmtrichy.edu.in/)`,
            quickReplies: ["Admissions 2026", "Fee Structure & Scholarships", "Engineering & Courses"]
          }
        }
      },
      ta: {
        indicator: "<strong>SRM சேர்க்கை மையம்</strong>: SRM திருச்சி சேர்க்கை விவரங்களை அறிய இங்கே பேசவும்!",
        status: "online",
        placeholder: "செய்தியை தட்டச்சு செய்யவும்...",
        welcome: `👋 **SRM IST திருச்சிக்கு நல்வரவு!**\n\nநான் **மொழி AI (Mozhi AI)**, உங்கள் அதிகாரப்பூர்வ சேர்க்கை ஆலோசகர்.\n\nSRM திருச்சி சேர்க்கை வழிகாட்டுதல், தகுதிகள் மற்றும் விளக்க ஏடு பெற, முதலில் உங்கள் **மின்னஞ்சல் முகவரியை (Email ID)** உள்ளிடவும்:`,
        step1_email: `📧 **படி 1/3: மின்னஞ்சல் முகவரி**\nதொடங்க உங்கள் **மின்னஞ்சலை (Email)** உள்ளிடவும்:`,
        step2_phone: `📱 **படி 2/3: கைபேசி எண்**\nநன்றி! இப்போது உங்கள் **கைபேசி எண் (10 இலக்கங்கள்)** பகிரவும்:`,
        step3_name: `👤 **படி 3/3: மாணவர் பெயர்**\nஅருமை! உங்கள் **முழுப் பெயரை (Full Name)** உள்ளிடவும்:`,
        regSuccess: (name) => `🎉 நன்றி, **${name}**! உங்கள் சேர்க்கை விருப்பம் SRM IST திருச்சியில் பதிவு செய்யப்பட்டது.\n\n✅ **இணையதளத்தில் உள்ள பதிவுப் படிவத்தில் உங்கள் விவரங்கள் நிரப்பப்பட்டுள்ளன!**\n\nஇன்று நான் உங்களுக்கு எவ்வாறு உதவலாம்? கீழே உள்ள தலைப்பைத் தேர்ந்தெடுக்கவும் அல்லது உங்கள் கேள்வியைத் தட்டச்சு செய்யவும்:`,
        invalidEmail: `⚠️ தயவுசெய்து சரியான மின்னஞ்சலை உள்ளிடவும் (எ.கா: student@gmail.com):`,
        invalidPhone: `⚠️ தயவுசெய்து சரியான 10 இலக்க கைபேசி எண்ணை உள்ளிடவும்:`,
        skipLabel: "நேரடியாக கேள்விகள் கேட்க ➔",
        langSwitched: "மொழி **தமிழாக** மாற்றப்பட்டது.",
        topics: ["சேர்க்கை 2026", "பொறியியல் & படிப்புகள்", "கல்விக் கட்டணம் & சலுகை", "வேலைவாய்ப்பு (₹50 LPA)", "விடுதி வசதிகள் (Hostels)", "செய்திகள் & நிகழ்வுகள்", "வளாக வாழ்க்கை", "சேர்க்கை உதவி மையம்"],
        knowledge: {
          admissions: {
            title: "சேர்க்கை 2026",
            source: "https://www.srmtrichy.edu.in/admission",
            response: `🎓 **SRM IST திருச்சி சேர்க்கை 2026-27 துவங்கப்பட்டது!**\n\n**சேர்க்கை வழிகள்:**\n• **SRMJEEE 2026:** B.Tech பொறியியல் படிப்புகளுக்கான அகில இந்திய நுழைவுத் தேர்வு.\n• **12-ஆம் வகுப்பு மெரிட் சேர்க்கை:** இயற்பியல், வேதியியல், கணிதத்தில் (PCM) குறைந்தபட்சம் 60% மதிப்பெண்கள்.\n\n**விண்ணப்பிக்கும் முறை:**\n1. அதிகாரப்பூர்வ சேர்க்கைப் பக்கம்: [SRM திருச்சி சேர்க்கை](https://www.srmtrichy.edu.in/admission)\n2. ஆன்லைனில் விண்ணப்பிக்க: [இப்போதே விண்ணப்பிக்கவும்](https://admissions.srmtrichy.edu.in/)\n3. கல்விச் சான்றிதழ்களைப் பதிவேற்றி விண்ணப்பக் கட்டணம் (₹1,200) செலுத்தவும்.\n\n**சேர்க்கை உதவி மையம்:**\n📞 இலவச அழைப்பு: **1800 202 4565** | 📧 **admissions@srmtrichy.edu.in**\n📍 [முகவரி மற்றும் வரைபடம்](https://www.srmtrichy.edu.in/contact)`,
            quickReplies: ["பொறியியல் & படிப்புகள்", "கல்விக் கட்டணம் & சலுகை", "சேர்க்கை உதவி மையம்"]
          },
          courses: {
            title: "பொறியியல் & படிப்புகள்",
            source: "https://www.srmtrichy.edu.in/institution/programmes",
            response: `📚 **SRM IST திருச்சியில் வழங்கப்படும் பாடப்பிரிவுகள்:**\n\n**பொறியியல் (B.Tech - 4 ஆண்டுகள்):**\n• கம்ப்யூட்டர் சயின்ஸ் & என்ஜினீயரிங் (CSE)\n• AI & Data Science (செயற்கை நுண்ணறிவு & தரவு அறிவியல்)\n• சைபர் செக்யூரிட்டி (Cyber Security)\n• பயோடெக்னாலஜி (Biotechnology)\n• தகவல் தொழில்நுட்பம் (IT), ECE, மெக்கானிக்கல் & சிவில்\n\n**மேலாண்மைப் படிப்புகள்:**\n• MBA (2 ஆண்டுகள் - மனிதவளம், நிதி, சந்தைப்படுத்தல்)\n• BBA (வணிக நிர்வாகவியல்)\n\n**கலை & அறிவியல்:**\n• BCA (கிளவுட் கம்ப்யூட்டிங், டேட்டா சயின்ஸ்)\n• B.Com (பொது & தகவல் அமைப்புகள்), M.Com\n• B.Sc & M.Sc படிப்புகள்\n\n**மருத்துவம் & சுகாதார அறிவியல்:**\n• BPT (இயன்முறை சிகிச்சை - 4.5 ஆண்டுகள்)\n• BOT (தொழில்முறை சிகிச்சை)\n• 750 படுக்கைகள் கொண்ட SRM மருத்துவமனையில் நேரடி பயிற்சி!\n\n🔗 [அனைத்துப் பாடப்பிரிவுகளையும் காண்க](https://www.srmtrichy.edu.in/institution/programmes)`,
            quickReplies: ["சேர்க்கை 2026", "கல்விக் கட்டணம் & சலுகை", "வேலைவாய்ப்பு (₹50 LPA)"]
          },
          fees: {
            title: "கல்விக் கட்டணம் & சலுகை",
            source: "https://www.srmtrichy.edu.in/admission",
            response: `💰 **கல்விக் கட்டணம் மற்றும் உதவித்தொகை விவரம்:**\n\n**B.Tech படிப்புகள்:**\n• ஆண்டுக் கட்டணம்: ₹1,75,000 – ₹2,50,000 (பாடப்பிரிவைப் பொறுத்து)\n\n**MBA & கலை அறிவியல்:**\n• MBA: ₹1,75,000 – ₹2,25,000 / ஆண்டு\n• BBA / BCA / B.Com: ₹70,000 – ₹1,10,000 / ஆண்டு\n• BPT (இயன்முறை சிகிச்சை): ₹1,10,000 – ₹1,60,000 / ஆண்டு\n\n**மெரிட் உதவித்தொகை சலுகைகள்:**\n🌟 12-ஆம் வகுப்பில் 90%+ மதிப்பெண்: **50% கல்விக் கட்டணத் தள்ளுபடி**\n🌟 12-ஆம் வகுப்பில் 80%+ மதிப்பெண்: **25% கல்விக் கட்டணத் தள்ளுபடி**\n🌟 விளையாட்டு சாதனையாளர்கள் (Sports Quota): 100% வரை கட்டண விலக்கு\n\n🔗 [கட்டணக் கொள்கை & விவரங்கள்](https://www.srmtrichy.edu.in/admission)`,
            quickReplies: ["சேர்க்கை 2026", "விடுதி வசதிகள் (Hostels)", "சேர்க்கை உதவி மையம்"]
          },
          placements: {
            title: "வேலைவாய்ப்பு (₹50 LPA)",
            source: "https://www.srmtrichy.edu.in/placement",
            response: `💼 **SRM IST திருச்சி வேலைவாய்ப்பு சாதனைகள்:**\n\n**வேலைவாய்ப்பு புள்ளிவிவரங்கள்:**\n• **அதிகபட்ச சம்பளம்:** **₹50 LPA**\n• **சராசரி சம்பளம்:** **₹8.5 LPA**\n• **வேலைவாய்ப்பு விகிதம்:** **95%+** மாணவர்கள் தேர்ச்சி\n• **நிறுவனங்கள்:** 600+ முன்னணி சர்வதேச நிறுவனங்கள்\n\n**முக்கிய நிறுவனங்கள்:**\n• Amazon, Microsoft, Google, Zoho\n• TCS, Infosys, Wipro, Cognizant, Accenture\n• Renault Nissan, Bosch, L&T, Deloitte, Barclays\n\n**CDC தொழில் வளர்ச்சி மையம்:**\n✓ முதல் ஆண்டிலிருந்தே கோடிங் & மென்பொருள் பயிற்சி\n✓ திறன் மேம்பாடு மற்றும் நேர்காணல் பயிற்சிகள்\n\n🔗 [அதிகாரப்பூர்வ வேலைவாய்ப்பு அறிக்கை](https://www.srmtrichy.edu.in/placement)`,
            quickReplies: ["பொறியியல் & படிப்புகள்", "சேர்க்கை 2026", "சேர்க்கை உதவி மையம்"]
          },
          hostel: {
            title: "விடுதி வசதிகள் (Hostels)",
            source: "https://www.srmtrichy.edu.in/campus-life#accommodation",
            response: `🏠 **SRM IST திருச்சி விடுதி & தங்குமிட வசதிகள்:**\n\n• **தனித்தனி விடுதிகள்:** மாணவர் மற்றும் மாணவியருக்கு 24/7 சிசிடிவி மற்றும் பாதுகாவலர் கண்காணிப்புடன் கூடிய பாதுகாப்பான வளாக விடுதிகள்.\n• **அறை தேர்வுகள்:** ஏசி (AC) மற்றும் நான்-ஏசி (Non-AC) 2, 3 மற்றும் 4 நபர்கள் தங்கும் வசதியான அறைகள்.\n• **கட்டணம்:** ஆண்டுக்கு சுமார் ₹85,000 முதல் ₹1,35,000 வரை (சுவையான மெஸ் உணவு, வைஃபை, உடற்பயிற்சிக் கூடம் உட்பட).\n• **உணவு முறை:** தானியங்கி சமையலறையில் சுகாதாரமாக சமைக்கப்படும் தென்னிந்திய & வடஇந்திய சைவ, அசைவ உணவுகள்.\n• **வசதிகள்:** 24 மணி நேர மின்சாரம், RO குடிநீர், வளாகத்திலேயே 750 படுக்கைகள் கொண்ட SRM சூப்பர் ஸ்பெஷாலிட்டி மருத்துவமனை.\n\n🔗 [விடுதி & தங்குமிட விவரங்கள் (Hostels)](https://www.srmtrichy.edu.in/campus-life#accommodation)`,
            quickReplies: ["கல்விக் கட்டணம் & சலுகை", "வளாக வாழ்க்கை", "சேர்க்கை உதவி மையம்"]
          },
          news: {
            title: "செய்திகள் & நிகழ்வுகள்",
            source: "https://www.srmtrichy.edu.in/news-and-events",
            response: `📢 **SRM IST திருச்சி — செய்திகள் மற்றும் நிகழ்வுகள் (News & Events):**\n\n• **மாநாடுகள் & பயிலரங்குகள்:** சர்வதேச ஆராய்ச்சி மாநாடுகள், தேசிய அளவிலான ஹேக்கத்தான்கள், IEEE கருத்தரங்குகள்.\n• **கலாச்சார விழாக்கள்:** பிரம்மாண்டமான 'Milan / Tarang' கலாச்சார விழா மற்றும் 'Technozion' தேசிய தொழில்நுட்ப கருத்தரங்கு.\n• **அறிவிப்புகள்:** தேர்வு அட்டவணைகள், கல்வி நாட்காட்டி மற்றும் வேலைவாய்ப்பு முகாம் தகவல்கள்.\n\n🔗 [அனைத்து செய்திகள் மற்றும் நிகழ்வுகள் (News & Events)](https://www.srmtrichy.edu.in/news-and-events) | [கல்வி நாள்காட்டி](https://www.srmtrichy.edu.in/academic_calendar)`,
            quickReplies: ["சேர்க்கை 2026", "விடுதி வசதிகள் (Hostels)", "சேர்க்கை உதவி மையம்"]
          },
          campus: {
            title: "வளாக வாழ்க்கை",
            source: "https://www.srmtrichy.edu.in/campus-life",
            response: `🏫 **வளாக வசதிகள் மற்றும் மாணவர் வாழ்க்கை:**\n\n• **வளாகம்:** 50+ ஏக்கர் பசுமை சூழல், முழுமையான வைஃபை (Wi-Fi) வசதி.\n• **ஆய்வகங்கள்:** 50+ அதிநவீன பொறியியல் மற்றும் AI கம்ப்யூட்டர் லேப்கள்.\n• **நூலகம்:** 50,000+ புத்தகங்கள் மற்றும் டிஜிட்டல் இதழ்கள் கொண்ட மத்திய நூலகம்.\n• **மருத்துவமனை:** வளாகத்திலேயே 750 படுக்கைகள் கொண்ட SRM சூப்பர் ஸ்பெஷாலிட்டி மருத்துவமனை.\n• **விளையாட்டு:** கிரிக்கெட், கால்பந்து, கூடைப்பந்து மைதானங்கள் மற்றும் உடற்பயிற்சிக் கூடம்.\n\n📍 **அமைவிடம்:** திருச்சி-சென்னை தேசிய நெடுஞ்சாலை (NH-45), சமயபுரம் சுங்கச்சாவடி அருகில், திருச்சி - 621105.\n\n🔗 [வளாக வாழ்க்கை](https://www.srmtrichy.edu.in/campus-life) | [விடுதிகள்](https://www.srmtrichy.edu.in/campus-life#accommodation)`,
            quickReplies: ["விடுதி வசதிகள் (Hostels)", "பொறியியல் & படிப்புகள்", "சேர்க்கை உதவி மையம்"]
          },
          contact: {
            title: "சேர்க்கை உதவி மையம்",
            source: "https://www.srmtrichy.edu.in/contact",
            response: `📞 **SRM IST திருச்சி தொடர்பு விவரங்கள்:**\n\n**முகவரி:**\nSRM இன்ஸ்டிடியூட் ஆஃப் சயின்ஸ் அண்ட் டெக்னாலஜி\nSRM நகர், திருச்சி-சென்னை நெடுஞ்சாலை (NH-45)\nசமயபுரம் அருகில், திருச்சிராப்பள்ளி - 621 105, தமிழ்நாடு.\n\n**உதவி எண்கள்:**\n📞 இலவச அழைப்பு: **1800 202 4565**\n📞 நேரடி எண்கள்: **0431 - 2258900 / 2258901**\n\n**மின்னஞ்சல்:**\n📧 **admissions@srmtrichy.edu.in**\n📧 **info@srmtrichy.edu.in**\n\n**வேலை நேரம்:**\nதிங்கள் முதல் சனி வரை: காலை 9:00 - மாலை 5:00 வரை\n\n🔗 [தொடர்பு மையம் & வரைபடம்](https://www.srmtrichy.edu.in/contact) | [ஆன்லைனில் விண்ணப்பிக்க](https://admissions.srmtrichy.edu.in/)`,
            quickReplies: ["சேர்க்கை 2026", "கல்விக் கட்டணம் & சலுகை", "பொறியியல் & படிப்புகள்"]
          }
        }
      }
    };


    function formatMessage(text) {
      return String(text || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
        .replace(/•/g, "&bull;")
        .replace(/\n/g, "<br>");
    }

    // Scroll chat to bottom
    function scrollToBottom() {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Add Bot Message (WhatsApp Incoming Bubble)
    function addBotMessage(text, src = null, animated = false, provider = null) {
      const msgDiv = document.createElement("div");
      msgDiv.className = "niaa-message bot";

      const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      msgDiv.innerHTML = `
        <div class="niaa-message-content">
          <div class="wa-sender-label">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/>
            </svg>
            SRM Admissions · Mozhi AI
          </div>
          <div class="wa-badge-slot"></div><div class="wa-bubble-body"></div>
          <div class="wa-message-meta">
            <span class="niaa-message-time">${time}</span>
          </div>
        </div>
      `;

      const bodyEl = msgDiv.querySelector(".wa-bubble-body");
      const badgeSlot = msgDiv.querySelector(".wa-badge-slot");
      if (provider === "trained-faq" || (text && text.includes("Trained Knowledge Base Answer"))) {
        badgeSlot.innerHTML = '<span class="wa-badge-trained">🎓 Trained FAQ</span>';
      } else if (provider === "learned-memory" || (text && (text.includes("Learned Response") || text.includes("Verified Learned Answer")))) {
        badgeSlot.innerHTML = '<span class="wa-badge-learned">💡 Learned Memory</span>';
      } else if (src && src.includes("/docs/")) {
        badgeSlot.innerHTML = '<span class="wa-badge-rag">📄 PDF Document RAG</span>';
      }
      messagesContainer.appendChild(msgDiv);

      function attachSource() {
        if (src && !src.includes("pollinations")) {
          const s = document.createElement("div");
          s.style.marginTop = "6px";
          s.style.fontSize = "11.5px";
          s.style.color = "#0284c7";
          let label = "Official Information";
          if (src.includes("accommodation")) label = "🏠 Hostels & Accommodation";
          else if (src.includes("news-and-events")) label = "📢 News & Events Portal";
          else if (src.includes("placement")) label = "💼 Placements & Packages";
          else if (src.includes("programmes")) label = "📚 Academic Programmes";
          else if (src.includes("admission") || src.includes("admissions.")) label = "🎓 Admissions Portal";
          else if (src.includes("campus-life")) label = "🏫 Campus Life";
          else if (src.includes("contact")) label = "📞 Contact & Helpline";
          s.innerHTML = `<strong>Official Link:</strong> <a href="${src}" target="_blank" rel="noopener noreferrer">${label} (${src})</a>`;
          bodyEl.appendChild(s);
        }
        scrollToBottom();
      }

      if (!animated) {
        bodyEl.innerHTML = formatMessage(text);
        attachSource();
      } else {
        const raw = String(text || "");
        let idx = 0;
        const step = raw.length > 300 ? 4 : 2;
        const timer = setInterval(() => {
          idx += step;
          if (idx >= raw.length) {
            idx = raw.length;
            clearInterval(timer);
            bodyEl.innerHTML = formatMessage(raw);
            attachSource();
          } else {
            bodyEl.innerHTML = formatMessage(raw.slice(0, idx)) + '<span style="color:#0c4da2;font-weight:bold;">▍</span>';
          }
          scrollToBottom();
        }, 16);
      }

      conversationHistory.push({ role: "bot", content: text });
      return msgDiv;
    }

    // Add User Message (WhatsApp Outgoing Bubble with Blue Double Ticks)
    function addUserMessage(text) {
      const msgDiv = document.createElement("div");
      msgDiv.className = "niaa-message user";
      const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      msgDiv.innerHTML = `
        <div class="niaa-message-content">
          <div class="wa-bubble-body">${formatMessage(text)}</div>
          <div class="wa-message-meta">
            <span class="niaa-message-time">${time}</span>
            <span class="wa-ticks" title="Read">
              <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
                <path d="M11.05 0.5L4.47 7.08L1.44 4.05L0.5 5L4.47 8.97L12 1.44L11.05 0.5Z" fill="#53bdeb"/>
                <path d="M15.05 0.5L8.47 7.08L7.4 6.01L6.46 6.95L8.47 8.97L16 1.44L15.05 0.5Z" fill="#53bdeb"/>
              </svg>
            </span>
          </div>
        </div>
      `;
      messagesContainer.appendChild(msgDiv);
      scrollToBottom();
      conversationHistory.push({ role: "user", content: text });
      return msgDiv;
    }

    // Show Typing Indicator (WhatsApp Style)
    function showTyping() {
      typingIndicator.classList.add("active");
      if (statusText) {
        statusText.textContent = "typing...";
        statusText.classList.add("typing");
      }
      scrollToBottom();
    }

    function hideTyping() {
      typingIndicator.classList.remove("active");
      if (statusText) {
        const cur = I18N[currentLang] || I18N.en;
        statusText.textContent = cur.status || "online";
        statusText.classList.remove("typing");
      }
    }

    // Render Quick Replies
    function showQuickReplies(replies = []) {
      quickRepliesContainer.innerHTML = "";
      if (!replies || replies.length === 0) return;

      replies.forEach((r) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "niaa-quick-reply";
        btn.textContent = r;
        btn.onclick = () => handleQuickReply(r);
        quickRepliesContainer.appendChild(btn);
      });
      scrollToBottom();
    }

    // Show standard topic quick replies for current language
    function showStandardTopics() {
      const cur = I18N[currentLang] || I18N.en;
      showQuickReplies(cur.topics);
    }

    // Save lead to local storage and send to server API
    async function persistLead(data) {
      try {
        localStorage.setItem("niaa_lead_data", JSON.stringify(data));
        autofillPageForms(data);
        fetch(`${API_BASE}/api/lead`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }).catch(() => {});
      } catch (e) {}
    }

    // Handle Quick Reply Click
    function handleQuickReply(replyText) {
      const detected = detectUserLanguage(replyText);
      if (detected && detected !== currentLang) {
        setLanguage(detected, false);
      }
      addUserMessage(replyText);
      quickRepliesContainer.innerHTML = "";

      const cur = I18N[currentLang] || I18N.en;

      // Check if user clicked "Skip to Questions"
      if (replyText === cur.skipLabel || replyText.includes("Skip") || replyText.includes("நேரடியாக") || replyText.includes("सीधे") || replyText.includes("నేరుగా")) {
        leadStage = "DONE";
        showTyping();
        setTimeout(() => {
          hideTyping();
          addBotMessage(cur.regSuccess("Candidate"));
          showStandardTopics();
        }, 500);
        return;
      }

      // Check matching knowledge base topic
      processBotResponse(replyText);
    }

    // Language Detection Utility (Tamil & English only)
    function detectUserLanguage(text) {
      if (!text) return null;
      if (/[\u0B80-\u0BFF]/.test(text)) return "ta";
      const low = text.toLowerCase();
      if (/\b(vanakkam|kedaikuma|illama|evvalavu|kattanam|serkkai|padikalam|viduthi|saapadu|iruka|iruku|theriyuma|sollunga|ungalukku|epadi|enaku|nanri)\b/i.test(low)) return "ta";
      return "en";
    }

    // Match Query against Local Knowledge Base (Instant) or Server API
    function findLocalKnowledge(query, lang = currentLang) {
      const cur = I18N[lang] || I18N.en;
      const q = query.toLowerCase();

      // 1. Hostel & Accommodation (Must be checked BEFORE campus)
      if (/hostel|room|mess|accommodation|stay|விடுதி|தங்குமிடம்|உணவு|சாப்பாடு/i.test(q)) {
        return cur.knowledge.hostel || cur.knowledge.campus;
      }

      // 2. News, Events, Symposia, Happenings (Including user typos like "evating ents")
      if (/news|event|evating\s*ents|happening|circular|workshop|symposium|fest|செய்தி|செய்திகள்|நிகழ்வு|நிகழ்வுகள்|நிகழ்ச்சி|விழா|கருத்தரங்கு|சுற்றறிக்கை/i.test(q)) {
        return cur.knowledge.news;
      }

      // 3. Admissions / Applications
      if (/admiss|apply|form|join|seat|cutoff|சேர்க்கை|விண்ணப்ப|பதிவு/i.test(q)) {
        return cur.knowledge.admissions;
      }

      // 4. Courses & Engineering
      if (/course|program|branch|degree|btech|mba|bba|bpt|படிப்பு|துறை|பாடத்திட்டம்|பாடப்பிரிவு/i.test(q)) {
        return cur.knowledge.courses;
      }

      // 5. Fees & Scholarships
      if (/fee|fees|cost|scholarship|concession|கட்டணம்|செலவு|உதவித்தொகை|சலுகை/i.test(q)) {
        return cur.knowledge.fees;
      }

      // 6. Placements
      if (/placement|job|package|salary|lpa|recruit|வேலை|சம்பளம்/i.test(q)) {
        return cur.knowledge.placements;
      }

      // 7. General Campus (without hostel)
      if (/campus|facility|infrastructure|hospital|sports|bus|transport|வளாக|மருத்துவமனை|பேருந்து/i.test(q)) {
        return cur.knowledge.campus;
      }

      // 8. Contact & Helpline
      if (/contact|phone|number|email|call|help|reach|தொடர்பு|எண்|முகவரி/i.test(q)) {
        return cur.knowledge.contact;
      }

      return null;
    }

    // Process Bot Response (Direct to AI backend with Gemini key + offline fallback)
    async function processBotResponse(query, forceLocal = false) {
      // Auto-detect user typing language
      const detected = detectUserLanguage(query);
      if (detected && detected !== currentLang) {
        setLanguage(detected, false);
      }

      showTyping();

      if (forceLocal) {
        const local = findLocalKnowledge(query, currentLang);
        if (local) {
          setTimeout(() => {
            hideTyping();
            addBotMessage(local.response, local.source || "https://www.srmtrichy.edu.in", true);
            if (local.quickReplies) {
              showQuickReplies(local.quickReplies);
            } else {
              showStandardTopics();
            }
          }, 350);
          return;
        }
      }

      // Live query via backend API (/api/chat)
      try {
        const res = await fetch(`${API_BASE}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: query,
            history: conversationHistory.slice(-6),
            lang: currentLang,
          }),
        });

        if (!res.ok) throw new Error("HTTP " + res.status);
        const data = await res.json();
        
        // If backend detected or used a specific language, sync UI
        if (data.lang && data.lang !== currentLang) {
          setLanguage(data.lang, false);
        }

        hideTyping();
        addBotMessage(data.answer || "Official information is currently being updated.", data.source || "https://www.srmtrichy.edu.in", true, data.provider);
        showStandardTopics();
      } catch (err) {
        // Graceful offline fallback to local knowledge in the active language
        hideTyping();
        const activeLang = detectUserLanguage(query) || currentLang || "en";
        const local = findLocalKnowledge(query, activeLang);
        if (local) {
          addBotMessage(local.response, local.source || "https://www.srmtrichy.edu.in", true);
          if (local.quickReplies) {
            showQuickReplies(local.quickReplies);
          } else {
            showStandardTopics();
          }
        } else {
          const offlineMsgs = {
            en: "We are connecting with SRM admission desk. Please call toll-free **1800 202 4565** or email **admissions@srmtrichy.edu.in**.",
            ta: "SRM சேர்க்கை மையத்தைத் தொடர்பு கொள்ள இலவச உதவி எண் **1800 202 4565** அல்லது மின்னஞ்சல் **admissions@srmtrichy.edu.in**-ஐப் பயன்படுத்தவும்.",
            hi: "SRM प्रवेश सहायता केंद्र से संपर्क करने हेतु टोल-फ्री नंबर **1800 202 4565** या ईमेल **admissions@srmtrichy.edu.in** पर संपर्क करें।",
            te: "SRM అడ్మిషన్ల కేంద్రాన్ని సంప్రదించడానికి టోల్-ఫ్రీ నంబర్ **1800 202 4565** లేదా ఈమెయిల్ **admissions@srmtrichy.edu.in** ని ఉపయోగించండి."
          };
          addBotMessage(offlineMsgs[activeLang] || offlineMsgs.en);
          showStandardTopics();
        }
      }
    }

    // Toggle Chat Window
    function toggleChat(forceOpen = null) {
      isChatOpen = forceOpen !== null ? forceOpen : !isChatOpen;

      if (isChatOpen) {
        chatWindow.classList.add("active");
        chatBtn.classList.add("active");
        if (badge) badge.style.display = "none";
        if (indicator) indicator.style.display = "none";

        // First time initialization
        if (conversationHistory.length === 0) {
          const cur = I18N[currentLang] || I18N.en;

          setTimeout(() => {
            showTyping();
            setTimeout(() => {
              hideTyping();

              if (leadStage === "DONE" && leadData && leadData.name) {
                const welcomeBackMsgs = {
                  en: `👋 **Welcome back, ${leadData.name}!**\n\nI'm **Mozhi AI**, your admission assistant. How can I assist you with SRM IST Trichy today?`,
                  ta: `👋 **மீண்டும் நல்வரவு, ${leadData.name}!**\n\nநான் **மொழி AI**, உங்கள் சேர்க்கை ஆலோசகர். SRM IST திருச்சி குறித்து இன்று உங்களுக்கு எவ்வாறு உதவலாம்?`,
                  hi: `👋 **पुनः स्वागत है, ${leadData.name}!**\n\nमैं **मोझी एआई**, आपका प्रवेश सहायक हूँ। आज मैं आपकी क्या सहायता कर सकता हूँ?`,
                  te: `👋 **మళ్లీ స్వాగతం, ${leadData.name}!**\n\nనేను **మొళి ఏఐ**, మీ అడ్మిషన్ సహాయకుడిని. ఈరోజు మీకు ఎలా సహాయపడగలను?`
                };
                addBotMessage(welcomeBackMsgs[currentLang] || welcomeBackMsgs.en);
                autofillPageForms(leadData);
                showStandardTopics();
              } else {
                // Step 1: Prompt for Email (1st)
                leadStage = "EMAIL";
                addBotMessage(cur.welcome);
                showQuickReplies([cur.skipLabel]);
              }
            }, 700);
          }, 250);
        }
        setTimeout(() => chatInput.focus(), 300);
      } else {
        chatWindow.classList.remove("active");
        chatBtn.classList.remove("active");
      }
    }

    // Restart Conversation (Ramapuram Feature)
    function restartChat() {
      conversationHistory = [];
      messagesContainer.innerHTML = "";
      quickRepliesContainer.innerHTML = "";
      leadStage = "EMAIL";
      const cur = I18N[currentLang] || I18N.en;
      showTyping();
      setTimeout(() => {
        hideTyping();
        addBotMessage(cur.welcome);
        showQuickReplies([cur.skipLabel]);
      }, 500);
    }

    // Switch Language Function (with optional notification)
    function setLanguage(langCode, notify = true) {
      if (!I18N[langCode]) return;
      currentLang = langCode;
      localStorage.setItem("niaa_chat_lang", langCode);

      // Update UI active buttons
      const buttons = langBar.querySelectorAll(".niaa-lang-btn");
      buttons.forEach((b) => {
        if (b.dataset.lang === langCode) {
          b.classList.add("active");
        } else {
          b.classList.remove("active");
        }
      });

      const cur = I18N[currentLang];
      statusText.textContent = cur.status;
      chatInput.placeholder = cur.placeholder;
      if (indicatorText) indicatorText.innerHTML = cur.indicator;

      // Post language change notification in chat only if explicitly triggered
      if (notify && conversationHistory.length > 0) {
        addBotMessage(cur.langSwitched);
        if (leadStage === "DONE") {
          showStandardTopics();
        } else if (leadStage === "EMAIL") {
          showQuickReplies([cur.skipLabel]);
        } else if (leadStage === "PHONE") {
          showQuickReplies([cur.skipLabel]);
        }
      }
    }

    // Language button listeners
    langBar.addEventListener("click", (e) => {
      const btn = e.target.closest(".niaa-lang-btn");
      if (btn && btn.dataset.lang) {
        setLanguage(btn.dataset.lang);
      }
    });

    // Chat Trigger, Restart and Close Listeners
    chatBtn.addEventListener("click", () => toggleChat());
    closeBtn.addEventListener("click", () => toggleChat(false));
    restartBtn.addEventListener("click", () => restartChat());

    // Indicator Bubble Listeners
    if (indicator) {
      indicator.addEventListener("click", (e) => {
        if (e.target.closest(".niaa-indicator-close")) return;
        toggleChat(true);
      });
    }
    if (indicatorClose) {
      indicatorClose.addEventListener("click", (e) => {
        e.stopPropagation();
        indicator.style.display = "none";
      });
    }

    // Form Submission / Input Handler
    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text) return;

      const detected = detectUserLanguage(text);
      if (detected && detected !== currentLang) {
        setLanguage(detected, false);
      }

      addUserMessage(text);
      chatInput.value = "";
      quickRepliesContainer.innerHTML = "";

      const cur = I18N[currentLang] || I18N.en;

      // Lead Capture Flow: 1st Email -> 2nd Phone -> 3rd Name
      if (leadStage === "EMAIL") {
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
        if (isEmail) {
          leadData = { email: text, phone: "", name: "", lang: currentLang };
          persistLead(leadData);
          leadStage = "PHONE";
          showTyping();
          setTimeout(() => {
            hideTyping();
            addBotMessage(cur.step2_phone);
            showQuickReplies([cur.skipLabel]);
          }, 600);
        } else {
          if (text.toLowerCase().includes("skip") || text.includes("➔")) {
            leadStage = "DONE";
            showTyping();
            setTimeout(() => {
              hideTyping();
              addBotMessage(cur.regSuccess("Candidate"));
              showStandardTopics();
            }, 500);
          } else {
            showTyping();
            setTimeout(() => {
              hideTyping();
              addBotMessage(cur.invalidEmail);
              showQuickReplies([cur.skipLabel]);
            }, 500);
          }
        }
        return;
      }

      if (leadStage === "PHONE") {
        const digits = text.replace(/\D/g, "");
        if (digits.length >= 10) {
          if (!leadData) leadData = {};
          leadData.phone = text;
          persistLead(leadData);
          leadStage = "NAME";
          showTyping();
          setTimeout(() => {
            hideTyping();
            addBotMessage(cur.step3_name);
            showQuickReplies([cur.skipLabel]);
          }, 600);
        } else {
          if (text.toLowerCase().includes("skip") || text.includes("➔")) {
            leadStage = "DONE";
            showTyping();
            setTimeout(() => {
              hideTyping();
              addBotMessage(cur.regSuccess("Candidate"));
              showStandardTopics();
            }, 500);
          } else {
            showTyping();
            setTimeout(() => {
              hideTyping();
              addBotMessage(cur.invalidPhone);
              showQuickReplies([cur.skipLabel]);
            }, 500);
          }
        }
        return;
      }

      if (leadStage === "NAME") {
        if (!leadData) leadData = {};
        leadData.name = text;
        leadStage = "DONE";
        persistLead(leadData);
        showTyping();
        setTimeout(() => {
          hideTyping();
          // Autofill form on the page
          autofillPageForms(leadData);

          const formPrompt = `\n\n<a href="#contact" class="mozhi-autofill-action-btn" onclick="const f = document.querySelector('input[name=firstName], .form-row'); if (f) { f.scrollIntoView({ behavior: 'smooth', block: 'center' }); } return false;">📝 View Pre-Filled Form on Website ➔</a>`;
          addBotMessage(cur.regSuccess(leadData.name) + formPrompt);
          showStandardTopics();
        }, 600);
        return;
      }

      // Normal Query Processing
      processBotResponse(text);
    });

    // Update bottom-left button UI
    function updateSiteLangBtnUI() {
      siteLangBtn.innerHTML = tamilOn 
        ? "🌐 மொழி: தமிழ் ⇄ English" 
        : "🌐 Language: English ⇄ தமிழ்";
      siteLangBtn.title = tamilOn 
        ? "மொழி: தமிழ் (ஆங்கிலத்திற்கு மாற்ற கிளிக் செய்யவும்)" 
        : "Language: English (Click to translate website to Tamil)";
    }

    // Website Translation Button Toggle (Bottom-Left)
    siteLangBtn.onclick = () => {
      tamilOn = !tamilOn;
      localStorage.setItem("srm_tamil_lang", tamilOn ? "ta" : "en");
      updateSiteLangBtnUI();
      walk(document.body);
    };
    updateSiteLangBtnUI();

    // Auto-pulse notification badge and show Ramapuram indicator bubble after 2.5s
    setTimeout(() => {
      if (badge && !isChatOpen) {
        badge.style.display = "flex";
      }
      if (indicator && !isChatOpen) {
        indicator.style.display = "flex";
      }
    }, 2500);

    // Set initial language from storage
    setLanguage(currentLang);

    // Initial Autofill on page load if lead exists
    if (leadData && (leadData.email || leadData.phone || leadData.name)) {
      setTimeout(() => autofillPageForms(leadData), 800);
    }
  }

  function boot() {
    mountChat();
    if (tamilOn) {
      walk(document.body);
    }

    // Observer: only run if tamilOn is enabled, and strictly ignore chat widget
    const obs = new MutationObserver((muts) => {
      if (!tamilOn) return;
      muts.forEach((m) => {
        m.addedNodes.forEach((n) => {
          if (n.nodeType === 1 && !n.closest("#srm-niaa-root") && !n.closest(".niaa-chat-widget")) walk(n);
          if (n.nodeType === 3 && n.parentElement && !n.parentElement.closest("#srm-niaa-root") && !n.parentElement.closest(".niaa-chat-widget")) translateNode(n);
        });
      });
    });
    obs.observe(document.body, { childList: true, subtree: true });

    // Handle SPA navigation: autofill forms on new pages
    ["click", "popstate"].forEach((ev) =>
      window.addEventListener(ev, () =>
        setTimeout(() => {
          if (tamilOn) walk(document.body);
          try {
            const saved = JSON.parse(localStorage.getItem("niaa_lead_data") || "null");
            if (saved) {
              const fn = document.querySelector('input[name="firstName"], input[placeholder*="First Name" i]');
              if (fn) {
                // Native input setter
                const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
                if (saved.name) {
                  const parts = saved.name.trim().split(/\s+/);
                  if (nativeSetter) nativeSetter.call(fn, parts[0] || "");
                  fn.dispatchEvent(new Event("input", { bubbles: true }));
                }
                const em = document.querySelector('input[name="email"], input[type="email"]');
                if (em && saved.email) {
                  if (nativeSetter) nativeSetter.call(em, saved.email);
                  em.dispatchEvent(new Event("input", { bubbles: true }));
                }
                const ph = document.querySelector('input[name="phone"], input[type="tel"]');
                if (ph && saved.phone) {
                  if (nativeSetter) nativeSetter.call(ph, saved.phone);
                  ph.dispatchEvent(new Event("input", { bubbles: true }));
                }
              }
            }
          } catch (e) {}
        }, 300)
      )
    );

    // Global image fallback
    document.addEventListener("error", (e) => {
      if (e.target && e.target.tagName === "IMG") {
        const img = e.target;
        if (!img.dataset.fallbackApplied) {
          img.dataset.fallbackApplied = "true";
          img.src = "/assets/logo-CWv4se2n.png";
          img.style.objectFit = "contain";
        }
      }
    }, true);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => setTimeout(boot, 400));
  } else {
    setTimeout(boot, 400);
  }

    // =========================================================================
    // FAQs & Active Learning Controller
    // =========================================================================
    const trainBtn = chatWindow.querySelector("#niaaTrainBtn");
    const drawer = chatWindow.querySelector("#niaaTrainingDrawer");
    const drawerClose = chatWindow.querySelector("#niaaDrawerClose");
    const drawerTabs = chatWindow.querySelectorAll(".niaa-tab-btn");
    const faqListEl = chatWindow.querySelector("#niaaFaqList");
    const faqCountEl = chatWindow.querySelector("#faqCount");
    const faqSearchInput = chatWindow.querySelector("#faqSearchInput");
    const teachForm = chatWindow.querySelector("#niaaTeachForm");
    const teachStatus = chatWindow.querySelector("#teachStatus");
    const learnedListEl = chatWindow.querySelector("#niaaLearnedList");
    const learnCountEl = chatWindow.querySelector("#learnCount");

    let allFaqs = [];
    let allLearned = [];

    async function loadFaqs() {
      try {
        const res = await fetch(`${API_BASE}/api/faqs`);
        if (!res.ok) return;
        const data = await res.json();
        allFaqs = data.faqs || [];
        if (faqCountEl) faqCountEl.textContent = allFaqs.length;
        renderFaqList(allFaqs);
      } catch (e) {}
    }

    function renderFaqList(list) {
      if (!faqListEl) return;
      if (list.length === 0) {
        faqListEl.innerHTML = '<div style="font-size:11px;color:#94a3b8;padding:8px 0;">No matching FAQs found.</div>';
        return;
      }
      faqListEl.innerHTML = list.map((f) => {
        const q = (currentLang === "ta" && f.question_ta) ? f.question_ta : f.question_en;
        const a = (currentLang === "ta" && f.answer_ta) ? f.answer_ta : f.answer_en;
        return `
          <div class="niaa-faq-card" data-q="${escapeAttr(q)}">
            <div class="niaa-faq-card-title">
              <span>${escapeHtml(q)}</span>
              <span class="niaa-faq-card-badge">${f.category || "FAQ"}</span>
            </div>
            <div class="niaa-faq-card-preview">${escapeHtml(a)}</div>
          </div>
        `;
      }).join("");

      faqListEl.querySelectorAll(".niaa-faq-card").forEach((card) => {
        card.addEventListener("click", () => {
          const qText = card.dataset.q;
          if (qText) {
            drawer.style.display = "none";
            chatInput.value = qText;
            chatForm.dispatchEvent(new Event("submit", { cancelable: true }));
          }
        });
      });
    }

    async function loadLearned() {
      try {
        const res = await fetch(`${API_BASE}/api/learn/questions`);
        if (!res.ok) return;
        const data = await res.json();
        allLearned = data.learned || [];
        if (learnCountEl) learnCountEl.textContent = allLearned.length;
        renderLearnedList(allLearned);
      } catch (e) {}
    }

    function renderLearnedList(list) {
      if (!learnedListEl) return;
      if (list.length === 0) {
        learnedListEl.innerHTML = '<div style="font-size:11px;color:#94a3b8;padding:8px 0;">No questions learned yet. When you or users ask questions, the AI automatically learns them here!</div>';
        return;
      }
      learnedListEl.innerHTML = list.map((q) => {
        const statusBadge = q.status === "verified" ? "⭐ Verified" : "💡 Auto-Learned";
        return `
          <div class="niaa-learned-card">
            <div class="niaa-learned-card-q">${escapeHtml(q.question)}</div>
            <div class="niaa-faq-card-preview" style="margin-bottom:4px;">${escapeHtml(q.answer)}</div>
            <div class="niaa-learned-card-meta">
              <span>${statusBadge}</span>
              <span>🔥 Asked ${q.askCount || 1} time(s)</span>
              <span>🌐 ${(q.lang || "en").toUpperCase()}</span>
            </div>
          </div>
        `;
      }).join("");
    }

    function escapeHtml(str) {
      return String(str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    function escapeAttr(str) {
      return String(str || "").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    }

    if (trainBtn && drawer) {
      trainBtn.addEventListener("click", () => {
        const isHidden = drawer.style.display === "none";
        drawer.style.display = isHidden ? "flex" : "none";
        if (isHidden) {
          loadFaqs();
          loadLearned();
        }
      });
    }

    if (drawerClose && drawer) {
      drawerClose.addEventListener("click", () => {
        drawer.style.display = "none";
      });
    }

    drawerTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        drawerTabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        const target = tab.dataset.tab;
        chatWindow.querySelectorAll(".niaa-tab-pane").forEach((pane) => {
          pane.classList.remove("active");
        });
        if (target === "faqs") {
          chatWindow.querySelector("#paneFaqs")?.classList.add("active");
          loadFaqs();
        } else if (target === "teach") {
          chatWindow.querySelector("#paneTeach")?.classList.add("active");
        } else if (target === "learned") {
          chatWindow.querySelector("#paneLearned")?.classList.add("active");
          loadLearned();
        }
      });
    });

    if (faqSearchInput) {
      faqSearchInput.addEventListener("input", (e) => {
        const val = e.target.value.toLowerCase().trim();
        if (!val) {
          renderFaqList(allFaqs);
          return;
        }
        const filtered = allFaqs.filter((f) => {
          const q = ((f.question_en || "") + " " + (f.question_ta || "") + " " + (f.keywords || []).join(" ")).toLowerCase();
          return q.includes(val);
        });
        renderFaqList(filtered);
      });
    }

    if (teachForm) {
      teachForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const qVal = chatWindow.querySelector("#teachQuestion").value.trim();
        const aVal = chatWindow.querySelector("#teachAnswer").value.trim();
        const catVal = chatWindow.querySelector("#teachCategory").value;
        if (!qVal || !aVal) return;

        teachStatus.className = "niaa-teach-status";
        teachStatus.style.display = "block";
        teachStatus.textContent = "Saving to AI knowledge base...";

        try {
          const res = await fetch(`${API_BASE}/api/learn/teach`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              question: qVal,
              answer: aVal,
              category: catVal,
              lang: currentLang
            })
          });
          if (res.ok) {
            teachStatus.className = "niaa-teach-status success";
            teachStatus.textContent = "🎉 Successfully taught! The AI has learned this question and can answer it immediately.";
            chatWindow.querySelector("#teachQuestion").value = "";
            chatWindow.querySelector("#teachAnswer").value = "";
            loadLearned();
            loadFaqs();
            setTimeout(() => {
              teachStatus.style.display = "none";
            }, 4000);
          } else {
            throw new Error("Server error");
          }
        } catch (err) {
          teachStatus.className = "niaa-teach-status error";
          teachStatus.textContent = "⚠️ Failed to save. Please try again.";
        }
      });
    }

    // Preload counts quietly
    loadFaqs();
    loadLearned();

})();
